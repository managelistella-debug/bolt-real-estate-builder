'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { Bold, Image as ImageIcon, Italic, List, ListOrdered, Link2, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WysiwygEditorProps {
  value: string;
  onChange: (nextValue: string) => void;
}

export function WysiwygEditor({ value, onChange }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '<p></p>';
    }
  }, [value]);

  const exec = (command: string, commandValue?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current.innerHTML);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string) || '');
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    }).catch(() => '');
    if (!dataUrl) return;

    exec('insertImage', dataUrl);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <Label className="text-white/70">Content Editor</Label>
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-white/15 bg-[#181818] p-2">
        <Button type="button" variant="outline" size="sm" className="border-white/20 bg-white text-black hover:bg-white/90" onClick={() => exec('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" className="border-white/20 bg-white text-black hover:bg-white/90" onClick={() => exec('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" className="border-white/20 bg-white text-black hover:bg-white/90" onClick={() => exec('underline')}>
          <Underline className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" className="border-white/20 bg-white text-black hover:bg-white/90" onClick={() => exec('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" className="border-white/20 bg-white text-black hover:bg-white/90" onClick={() => exec('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-white/20 bg-white text-black hover:bg-white/90"
          onClick={() => {
            const href = prompt('Enter link URL');
            if (!href) return;
            exec('createLink', href);
          }}
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="sm" className="border-white/20 bg-white text-black hover:bg-white/90" onClick={() => imageInputRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[260px] rounded-md border border-white/20 bg-white p-3 text-sm leading-7 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary [&_a]:text-blue-700 [&_h1]:mb-2 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_img]:my-3 [&_img]:max-w-full [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-4"
        onInput={(event) => onChange((event.currentTarget as HTMLDivElement).innerHTML)}
      />
      <p className="text-xs text-muted-foreground">
        This editor saves rich text as HTML.
      </p>
      <div className="hidden">
        <Input value={value} readOnly />
      </div>
    </div>
  );
}
