import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { useCallback } from 'react'

const MenuBar = ({ editor }) => {
    if (!editor) {
        return null
    }

    const addImage = useCallback(() => {
        const url = window.prompt('URL')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const addYoutube = useCallback(() => {
        const url = window.prompt('Enter YouTube URL')
        if (url) {
            editor.commands.setYoutubeVideo({ src: url })
        }
    }, [editor])

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    return (
        <div className="tiptap-toolbar">
            {/* Basics */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
            >
                Underline
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                Strike
            </button>

            <span className="divider">|</span>

            {/* Lists */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
                Bullet List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
            >
                Ordered List
            </button>

            <span className="divider">|</span>

            {/* Alignment */}
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>Left</button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>Center</button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>Right</button>

            <span className="divider">|</span>

            {/* Media */}
            <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>Link</button>
            <button onClick={addImage}>Image</button>
            <button onClick={addYoutube}>YouTube</button>

            <span className="divider">|</span>

            {/* Colors */}
            <label className="color-picker-label">
                Text:
                <input
                    type="color"
                    onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                />
            </label>

            {/* Headings */}
            <select
                onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'p') editor.chain().focus().setParagraph().run();
                    else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run();
                }}
                value={
                    editor.isActive('heading', { level: 1 }) ? '1' :
                        editor.isActive('heading', { level: 2 }) ? '2' :
                            editor.isActive('heading', { level: 3 }) ? '3' : 'p'
                }
            >
                <option value="p">Paragraph</option>
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
            </select>

        </div>
    )
}

export default function TiptapEditor({ content, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Youtube.configure({ controls: false }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor-content', // Class for styling
            },
        },
    })

    // Sync content if it changes externally (e.g. initial load)
    // Note: Tiptap handles content sync carefully to avoid cursor jumps.
    // We usually only set content if the editor is empty or on first mount if we want full controlled mode.
    // For now, reliance on `content` prop for initial state is standard.

    return (
        <div className="tiptap-container">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />

            <style>{`
        .tiptap-container {
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #fff;
            display: flex;
            flex-direction: column;
        }
        .tiptap-toolbar {
            padding: 10px;
            border-bottom: 1px solid #eee;
            background: #f8f8f8;
            border-radius: 8px 8px 0 0;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            align-items: center;
        }
        .tiptap-toolbar button {
            padding: 5px 10px;
            border: 1px solid transparent;
            background: transparent;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
            color: #333;
        }
        .tiptap-toolbar button:hover {
            background: #e0e0e0;
        }
        .tiptap-toolbar button.is-active {
            background: #000;
            color: #fff;
        }
        .tiptap-toolbar .divider {
            color: #ccc;
            margin: 0 5px;
        }
        .tiptap-editor-content {
            padding: 20px;
            min-height: 200px;
            outline: none;
            overflow-y: auto;
        }
        /* Fix list styles inside editor */
        .tiptap-editor-content ul { list-style-type: disc; padding-left: 1.5em; }
        .tiptap-editor-content ol { list-style-type: decimal; padding-left: 1.5em; }
        .tiptap-editor-content a { color: #0096fd; text-decoration: underline; }
        .tiptap-editor-content img { max-width: 100%; height: auto; }
        .color-picker-label { font-size: 12px; display: flex; align-items: center; gap: 5px; }
      `}</style>
        </div>
    )
}
