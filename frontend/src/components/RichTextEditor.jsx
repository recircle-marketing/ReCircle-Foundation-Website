import React, { useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote, Minus,
  Link as LinkIcon, Image as ImageIcon, Youtube as YoutubeIcon,
  Undo, Redo, Table as TableIcon, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { api } from '../lib/api';

const ToolbarBtn = ({ active, onClick, title, children, testId }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    data-testid={testId}
    className={`p-2 rounded hover:bg-gray-100 transition-colors ${
      active ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-700'
    }`}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-gray-300" />;

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing your blog...' }) => {
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: 'text-brand-blue underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-lg my-4 max-w-full h-auto' } }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Youtube.configure({ width: 640, height: 360, HTMLAttributes: { class: 'my-4 rounded-lg' } }),
      Table.configure({ resizable: true, HTMLAttributes: { class: 'border-collapse my-4 w-full' } }),
      TableRow,
      TableCell.configure({ HTMLAttributes: { class: 'border border-gray-300 p-2' } }),
      TableHeader.configure({ HTMLAttributes: { class: 'border border-gray-300 p-2 bg-gray-50 font-semibold' } }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync if external value changes (e.g., loading existing blog)
  React.useEffect(() => {
    if (!editor) return;
    if (value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const handleSetLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleEmbedYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('YouTube URL');
    if (!url) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const url = res.data.url;
      const fullUrl = url.startsWith('http') ? url : `${process.env.REACT_APP_BACKEND_URL}${url}`;
      editor.chain().focus().setImage({ src: fullUrl }).run();
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Image upload failed. Please try again.');
    } finally {
      e.target.value = '';
    }
  };

  const handleImageByUrl = () => {
    if (!editor) return;
    const url = window.prompt('Image URL');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const insertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-gray-300 bg-white" data-testid="rich-text-editor">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white px-2 py-2 rounded-t-lg">
        <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} testId="editor-h1">
          <Heading1 size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} testId="editor-h2">
          <Heading2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} testId="editor-h3">
          <Heading3 size={16} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Bold" active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()} testId="editor-bold">
          <Bold size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()} testId="editor-italic">
          <Italic size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Underline" active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()} testId="editor-underline">
          <UnderlineIcon size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()} testId="editor-strike">
          <Strikethrough size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Inline code" active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()} testId="editor-code">
          <Code size={16} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Bullet list" active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()} testId="editor-ul">
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Ordered list" active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} testId="editor-ol">
          <ListOrdered size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Quote" active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()} testId="editor-quote">
          <Quote size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Code block" active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} testId="editor-codeblock">
          <Code size={16} className="-rotate-90" />
        </ToolbarBtn>
        <ToolbarBtn title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()} testId="editor-hr">
          <Minus size={16} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Align left" active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()} testId="editor-align-left">
          <AlignLeft size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Align center" active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()} testId="editor-align-center">
          <AlignCenter size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Align right" active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()} testId="editor-align-right">
          <AlignRight size={16} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Insert link" active={editor.isActive('link')} onClick={handleSetLink} testId="editor-link">
          <LinkIcon size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Upload image" onClick={handleImageUploadClick} testId="editor-image-upload">
          <ImageIcon size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Insert image by URL" onClick={handleImageByUrl} testId="editor-image-url">
          <ImageIcon size={16} className="opacity-60" />
        </ToolbarBtn>
        <ToolbarBtn title="Embed YouTube" onClick={handleEmbedYoutube} testId="editor-youtube">
          <YoutubeIcon size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Insert table" onClick={insertTable} testId="editor-table">
          <TableIcon size={16} />
        </ToolbarBtn>
        <Divider />
        <ToolbarBtn title="Undo" onClick={() => editor.chain().focus().undo().run()} testId="editor-undo">
          <Undo size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" onClick={() => editor.chain().focus().redo().run()} testId="editor-redo">
          <Redo size={16} />
        </ToolbarBtn>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
          data-testid="editor-image-file-input"
        />
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-lg max-w-none px-6 py-6 min-h-[400px] focus:outline-none"
        data-testid="rich-text-editor-content"
      />
    </div>
  );
};

export default RichTextEditor;
