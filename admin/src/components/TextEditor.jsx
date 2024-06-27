import React, { useState, useEffect, useRef } from 'react'
import JoditEditor from 'jodit-react'

const TextEditor = ({ content, change }) => {
  const editor = useRef(null)
  const [editorContent, setEditorContent] = useState('')

  useEffect(() => {
    setEditorContent(content)
  }, [content])

  const handleChange = (newContent) => {
    setEditorContent(newContent)
    change(newContent)
  }

  return (
    <JoditEditor
      ref={editor}
      value={editorContent}
      onChange={handleChange}
    />
  )
}

export default TextEditor
