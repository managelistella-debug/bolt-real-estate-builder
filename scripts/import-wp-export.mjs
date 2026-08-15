// Imports wp-export/data/{listings_clean,posts_clean}.json into Sanity.
// Run with: node --env-file=.env.local scripts/import-wp-export.mjs
// Add --dry-run to only print the inconsistency report without writing anything.

import { createClient } from "@sanity/client";
import * as cheerio from "cheerio";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const EXPORT_DIR = path.join(ROOT, "wp-export");

const DRY_RUN = process.argv.includes("--dry-run");

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_WRITE_TOKEN;

if (!DRY_RUN && (!PROJECT_ID || !TOKEN)) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN. Run with --env-file=.env.local");
  process.exit(1);
}

const client = DRY_RUN
  ? null
  : createClient({
      projectId: PROJECT_ID,
      dataset: DATASET,
      apiVersion: "2025-02-19",
      token: TOKEN,
      useCdn: false,
    });

function readJson(relPath) {
  return JSON.parse(readFileSync(path.join(EXPORT_DIR, relPath), "utf8"));
}

function slugify(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseMoney(raw) {
  const n = parseFloat(String(raw || "").replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function parseNum(raw) {
  const n = parseFloat(String(raw || "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

const SQFT_PER_ACRE = 43560;

function genKey() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------------------------------------------------------------------------
// Inconsistency report
// ---------------------------------------------------------------------------

function reportListingIssues(listings) {
  const issues = [];
  for (const l of listings) {
    const missing = [];
    if (!l.address) missing.push("address");
    if (!l.price) missing.push("price");
    if (!l.gallery_local_paths || l.gallery_local_paths.length === 0) missing.push("gallery images");
    if (!l.property_type || l.property_type.length === 0) missing.push("property_type");
    if (!l.listing_status) missing.push("listing_status");
    if (missing.length > 0) issues.push(`  - [${l.slug}] missing: ${missing.join(", ")}`);
  }
  return issues;
}

function reportPostIssues(posts) {
  const issues = [];
  for (const p of posts) {
    const missing = [];
    if (!p.title) missing.push("title");
    if (!p.content_html) missing.push("content_html");
    if (!p.featured_image_local_path) missing.push("featured image (will fall back to first image in folder, if any)");
    if (!p.categories || p.categories.length === 0) missing.push("categories");
    if (missing.length > 0) issues.push(`  - [${p.slug}] ${missing.join(", ")}`);
  }
  return issues;
}

// ---------------------------------------------------------------------------
// HTML -> Portable Text
// ---------------------------------------------------------------------------

function parseInlineRuns($, node, marks, markDefs) {
  const runs = [];
  $(node)
    .contents()
    .each((_, child) => {
      if (child.type === "text") {
        const text = child.data.replace(/\s+/g, " ");
        if (text) runs.push({ text, marks: [...marks] });
        return;
      }
      if (child.type !== "tag") return;
      const tag = child.tagName?.toLowerCase();
      if (tag === "br") {
        runs.push({ text: " ", marks: [...marks] });
        return;
      }
      if (tag === "strong" || tag === "b") {
        runs.push(...parseInlineRuns($, child, [...marks, "strong"], markDefs));
        return;
      }
      if (tag === "em" || tag === "i") {
        runs.push(...parseInlineRuns($, child, [...marks, "em"], markDefs));
        return;
      }
      if (tag === "a") {
        const href = $(child).attr("href") || "";
        const key = genKey();
        markDefs.push({ _type: "link", _key: key, href });
        runs.push(...parseInlineRuns($, child, [...marks, key], markDefs));
        return;
      }
      // Unknown inline tag (span, etc.) — recurse and keep current marks.
      runs.push(...parseInlineRuns($, child, marks, markDefs));
    });
  return runs;
}

function textBlock($, el, style, listItem) {
  const markDefs = [];
  const runs = parseInlineRuns($, el, [], markDefs);
  const children = runs
    .filter((r) => r.text.trim().length > 0 || runs.length === 1)
    .map((r) => ({ _type: "span", _key: genKey(), text: r.text, marks: r.marks }));
  if (children.length === 0) return null;
  return { _type: "block", _key: genKey(), style, listItem, markDefs, children };
}

/**
 * Converts WP `content_html` into Portable Text blocks. Uploads any inline
 * <img> encountered (relative to the post's local image folder isn't
 * possible for inline WP-hosted URLs, so those are skipped — only the
 * featured image and files already downloaded to `local_image_folder`
 * are used, matching what actually exists in the export).
 */
function htmlToPortableText($, root) {
  const blocks = [];
  $(root)
    .children()
    .each((_, el) => {
      const tag = el.tagName?.toLowerCase();
      if (tag === "p") {
        const block = textBlock($, el, "normal");
        if (block) blocks.push(block);
        return;
      }
      if (tag === "h1" || tag === "h2") {
        const block = textBlock($, el, "h2");
        if (block) blocks.push(block);
        return;
      }
      if (tag === "h3") {
        const block = textBlock($, el, "h3");
        if (block) blocks.push(block);
        return;
      }
      if (tag === "h4" || tag === "h5" || tag === "h6") {
        const block = textBlock($, el, "h4");
        if (block) blocks.push(block);
        return;
      }
      if (tag === "ul" || tag === "ol") {
        const listItem = tag === "ul" ? "bullet" : "number";
        $(el)
          .children("li")
          .each((_, li) => {
            const block = textBlock($, li, "normal", listItem);
            if (block) blocks.push(block);
          });
        return;
      }
      if (tag === "blockquote") {
        const block = textBlock($, el, "normal");
        if (block) blocks.push(block);
        return;
      }
      if (tag === "figure") {
        // Inline WP images reference the live WP media URL, which isn't part
        // of the downloaded export — skip embedding these (the featured
        // image is still uploaded separately below).
        return;
      }
      if (tag === "img") {
        return;
      }
      // Fallback: anything else (div wrappers, etc.) — recurse one level so
      // nested paragraphs aren't silently dropped.
      const nested = htmlToPortableText($, el);
      blocks.push(...nested);
    });
  return blocks;
}

// ---------------------------------------------------------------------------
// Image upload
// ---------------------------------------------------------------------------

const assetCache = new Map();

async function uploadLocalImage(relPath) {
  if (!relPath) return undefined;
  if (assetCache.has(relPath)) return assetCache.get(relPath);

  const absPath = path.join(EXPORT_DIR, relPath);
  if (!existsSync(absPath)) {
    console.warn(`  ! missing file, skipping: ${relPath}`);
    return undefined;
  }
  const buffer = readFileSync(absPath);
  const asset = await client.assets.upload("image", buffer, { filename: path.basename(absPath) });
  const ref = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  assetCache.set(relPath, ref);
  return ref;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const listings = readJson("data/listings_clean.json");
  const posts = readJson("data/posts_clean.json");

  console.log(`Loaded ${listings.length} listings, ${posts.length} posts.\n`);

  const listingIssues = reportListingIssues(listings);
  const postIssues = reportPostIssues(posts);
  console.log("=== Data inconsistency report ===");
  console.log(`Listings (${listingIssues.length} with notes):`);
  console.log(listingIssues.length ? listingIssues.join("\n") : "  (none)");
  console.log(`\nPosts (${postIssues.length} with notes):`);
  console.log(postIssues.length ? postIssues.join("\n") : "  (none)");
  console.log("");

  if (DRY_RUN) {
    console.log("Dry run — no data written. Re-run without --dry-run to import.");
    return;
  }

  // --- Blog categories -----------------------------------------------------
  const REQUIRED_CATEGORIES = ["Buying", "Selling", "Acreages", "Recreational Properties"];
  const categoryNames = new Set(REQUIRED_CATEGORIES);
  posts.forEach((p) => (p.categories || []).forEach((c) => categoryNames.add(c)));

  console.log(`\nEnsuring ${categoryNames.size} blog categories exist...`);
  const categoryIdByName = new Map();
  for (const name of categoryNames) {
    const slug = slugify(name);
    const existingId = await client.fetch(`*[_type == "blogCategory" && name == $name][0]._id`, { name });
    if (existingId) {
      categoryIdByName.set(name, existingId);
      continue;
    }
    const created = await client.create({ _type: "blogCategory", name, slug: { _type: "slug", current: slug } });
    categoryIdByName.set(name, created._id);
    console.log(`  + created category "${name}"`);
  }

  // --- Listings --------------------------------------------------------------
  console.log(`\nImporting ${listings.length} listings...`);
  let sortOrder = 0;
  for (const l of listings) {
    const existingId = await client.fetch(`*[_type == "listing" && slug.current == $slug][0]._id`, { slug: l.slug });
    if (existingId) {
      console.log(`  - [${l.slug}] already exists, skipping`);
      sortOrder += 1;
      continue;
    }

    console.log(`  - [${l.slug}] uploading ${l.gallery_local_paths?.length || 0} images...`);
    const galleryRefs = [];
    for (const relPath of l.gallery_local_paths || []) {
      const ref = await uploadLocalImage(relPath);
      if (ref) galleryRefs.push({ ...ref, _key: genKey() });
    }

    const lotSizeValue = parseNum(l.lot_size);
    const lotSizeUnit = (l.lot_size_type || "").toLowerCase() === "acres" ? "acres" : "sqft";
    const lotSizeSqft = lotSizeValue === undefined ? undefined : lotSizeUnit === "acres" ? lotSizeValue * SQFT_PER_ACRE : lotSizeValue;

    const doc = {
      _type: "listing",
      address: l.address || l.title || "",
      city: l.city || "",
      neighborhood: l.neighborhood || "",
      slug: { _type: "slug", current: l.slug },
      status: l.listing_status === "Sold" ? "Sold" : "Active",
      price: parseMoney(l.price),
      bedrooms: parseNum(l.bed),
      bathrooms: l.bath || "",
      livingAreaSqft: parseNum(l.size_sqft),
      lotSizeSqft,
      lotSizeDisplayUnit: lotSizeUnit,
      propertyType: Array.isArray(l.property_type) ? l.property_type : [],
      yearBuilt: parseNum(l.year_built),
      propertyTaxes: parseMoney(l.property_taxes),
      mlsNumber: l.listing_id || "",
      description: l.description || "",
      mainImage: galleryRefs[0],
      gallery: galleryRefs,
      featured: false,
      sortOrder: sortOrder++,
      published: true,
    };

    await client.create(doc);
    console.log(`    done`);
  }

  // --- Blog posts --------------------------------------------------------------
  console.log(`\nImporting ${posts.length} blog posts...`);
  for (const p of posts) {
    const existingId = await client.fetch(`*[_type == "blogPost" && slug.current == $slug][0]._id`, { slug: p.slug });
    if (existingId) {
      console.log(`  - [${p.slug}] already exists, skipping`);
      continue;
    }

    const featuredImagePath = p.featured_image_local_path || (p.local_image_folder ? `${p.local_image_folder}01.jpg` : null);
    console.log(`  - [${p.slug}] uploading featured image...`);
    let featuredImage = await uploadLocalImage(featuredImagePath);
    if (!featuredImage && p.local_image_folder) {
      // try .jpeg if .jpg didn't exist
      featuredImage = await uploadLocalImage(`${p.local_image_folder}01.jpeg`);
    }

    const $ = cheerio.load(`<div id="root">${p.content_html || ""}</div>`);
    const content = htmlToPortableText($, $("#root")[0]);

    const categoryName = (p.categories || [])[0];
    const categoryId = categoryName ? categoryIdByName.get(categoryName) : undefined;

    const doc = {
      _type: "blogPost",
      title: p.title || "",
      slug: { _type: "slug", current: p.slug },
      category: categoryId ? { _type: "reference", _ref: categoryId } : undefined,
      publishedDate: (p.date_published || "").slice(0, 10),
      authorName: "Aspen Muraski",
      featuredImage,
      excerpt: p.excerpt || "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      content,
      published: true,
    };

    await client.create(doc);
    console.log(`    done (${content.length} blocks)`);
  }

  console.log("\nImport complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
