import React, { useState, useRef } from 'react'
import JoditEditor from 'jodit-react'

const TextEditor = ({ change }) => {
  const editor = useRef(null)
  const [content, setContent] = useState('')

  return (
    <JoditEditor
      ref={editor}
      value={content}
      onChange={(newContent) => {
        setContent(newContent)
        change(newContent)
      }}
    />
  )
}

export default TextEditor
