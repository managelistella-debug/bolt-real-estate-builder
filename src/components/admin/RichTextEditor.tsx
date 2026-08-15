"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadImage } from "@/lib/admin/adminFetch";
import { imageUrl } from "@/lib/sanity/image";
import { portableTextToTiptapDoc, tiptapDocToPortableText } from "@/lib/admin/portableText";
import type { PortableTextContent } from "@/lib/sanity/types";

const SanityImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      sanityRef: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-sanity-ref"),
        renderHTML: (attributes: Record<string, unknown>) => ({
          "data-sanity-ref": attributes.sanityRef,
        }),
      },
    };
  },
});

interface RichTextEditorProps {
  value: PortableTextContent;
  onChange: (blocks: PortableTextContent) => void;
}

function ToolbarButton({
  onClick,
  active,
  children,
  label,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`px-2.5 py-1.5 text-[13px] border border-white/15 ${
        active ? "bg-[#daaf3a]/20 text-[#daaf3a] border-[#daaf3a]/40" : "text-white/70 hover:text-white hover:border-white/30"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadedInitial = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      SanityImage.configure({ inline: false }),
      Placeholder.configure({ placeholder: "Start writing the article..." }),
    ],
    content: portableTextToTiptapDoc(value || []),
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(tiptapDocToPortableText(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: "blog-content-aspen prose-invert min-h-[300px] outline-none px-4 py-3 text-white/90 text-[15px] leading-[26px]",
      },
    },
  });

  // Reload editor content if `value` changes from outside (e.g. after async fetch of an existing post).
  useEffect(() => {
    if (!editor || loadedInitial.current) return;
    if (value && value.length > 0) {
      editor.commands.setContent(portableTextToTiptapDoc(value));
      loadedInitial.current = true;
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      const image = await uploadImage(file);
      const src = imageUrl(image, 1200) || "";
      editor
        .chain()
        .focus()
        .setImage({ src, alt: "", sanityRef: image.asset._ref } as never)
        .run();
    } catch {
      // upload failure — silently no-op, matches lightweight editor scope
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  if (!editor) return null;

  return (
    <div className="border border-white/15">
      <div className="flex flex-wrap gap-1.5 p-2 border-b border-white/15 bg-white/[0.02]">
        <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => fileInputRef.current?.click()}>
          Image
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
