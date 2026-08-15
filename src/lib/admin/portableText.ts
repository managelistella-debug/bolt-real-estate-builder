import type { JSONContent } from "@tiptap/react";
import { imageUrl } from "@/lib/sanity/image";
import type {
  PortableTextBlock,
  PortableTextContent,
  PortableTextImageBlock,
  PortableTextMarkDef,
  PortableTextSpan,
} from "@/lib/sanity/types";

function genKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Sanity Portable Text -> Tiptap/ProseMirror JSON doc, for loading content into the editor. */
export function portableTextToTiptapDoc(blocks: PortableTextContent): JSONContent {
  const content: JSONContent[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block._type === "image") {
      const ref = (block as PortableTextImageBlock).asset?._ref;
      content.push({
        type: "image",
        attrs: { src: imageUrl(block as PortableTextImageBlock) || "", sanityRef: ref || null },
      });
      i += 1;
      continue;
    }

    const b = block as PortableTextBlock;

    if (b.listItem) {
      const listType = b.listItem === "bullet" ? "bulletList" : "orderedList";
      const items: JSONContent[] = [];
      while (i < blocks.length) {
        const next = blocks[i];
        if (next._type !== "block" || (next as PortableTextBlock).listItem !== b.listItem) break;
        items.push({
          type: "listItem",
          content: [{ type: "paragraph", content: spansToTiptap(next as PortableTextBlock) }],
        });
        i += 1;
      }
      content.push({ type: listType, content: items });
      continue;
    }

    if (b.style === "h2" || b.style === "h3" || b.style === "h4") {
      content.push({
        type: "heading",
        attrs: { level: Number(b.style[1]) },
        content: spansToTiptap(b),
      });
    } else {
      content.push({ type: "paragraph", content: spansToTiptap(b) });
    }
    i += 1;
  }

  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}

function spansToTiptap(block: PortableTextBlock): JSONContent[] {
  if (!block.children || block.children.length === 0) return [];
  return block.children.map((span) => {
    const marks: NonNullable<JSONContent["marks"]> = [];
    (span.marks || []).forEach((m) => {
      if (m === "strong") marks.push({ type: "bold" });
      else if (m === "em") marks.push({ type: "italic" });
      else {
        const def = block.markDefs?.find((d) => d._key === m);
        if (def?._type === "link") marks.push({ type: "link", attrs: { href: def.href } });
      }
    });
    return { type: "text", text: span.text, marks: marks.length ? marks : undefined };
  });
}

/** Tiptap/ProseMirror JSON doc -> Sanity Portable Text, for saving. */
export function tiptapDocToPortableText(doc: JSONContent): PortableTextContent {
  const blocks: PortableTextContent = [];

  for (const node of doc.content || []) {
    if (node.type === "paragraph") {
      const block = textBlock("normal", node.content);
      if (block.children.length > 0) blocks.push(block);
    } else if (node.type === "heading") {
      const level = node.attrs?.level;
      const style = level === 2 ? "h2" : level === 3 ? "h3" : level === 4 ? "h4" : "normal";
      blocks.push(textBlock(style, node.content));
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const listItem = node.type === "bulletList" ? "bullet" : "number";
      for (const li of node.content || []) {
        const paragraph = li.content?.find((n) => n.type === "paragraph");
        blocks.push(textBlock("normal", paragraph?.content, listItem));
      }
    } else if (node.type === "image") {
      const ref = node.attrs?.sanityRef;
      if (ref) {
        blocks.push({
          _type: "image",
          _key: genKey(),
          asset: { _type: "reference", _ref: ref },
        });
      }
    }
  }

  return blocks;
}

function textBlock(
  style: "normal" | "h2" | "h3" | "h4",
  content: JSONContent[] | undefined,
  listItem?: "bullet" | "number"
): PortableTextBlock {
  const markDefs: PortableTextMarkDef[] = [];
  const children: PortableTextSpan[] = (content || [])
    .filter((n) => n.type === "text")
    .map((span) => {
      const marks: string[] = [];
      (span.marks || []).forEach((m) => {
        if (m.type === "bold") marks.push("strong");
        else if (m.type === "italic") marks.push("em");
        else if (m.type === "link") {
          const key = genKey();
          markDefs.push({ _type: "link", _key: key, href: (m.attrs?.href as string) || "" });
          marks.push(key);
        }
      });
      return { _type: "span" as const, _key: genKey(), text: span.text || "", marks };
    });

  return { _type: "block", _key: genKey(), style, listItem, markDefs, children };
}
