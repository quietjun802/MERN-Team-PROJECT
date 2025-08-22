import React, { useState } from 'react'
import "./BucketEditor.css"
const BucketEditor = ({ onCreate }) => {
  const [text, setText] = useState("")

  const onSubmit = (e) => {
    e.preventDefault()

    if (!text.trim()) return

    const confirmed = window.confirm("추가하시겠습니까?")
    if (!confirmed) return
    
    onCreate(text.trim())
    setText("")

  }
  return (
    <form className='BucketEditor' onSubmit={onSubmit}>
      <input
        type="text"
        placeholder='새 버킷리스트...'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type='submit' disabled={!text.trim()}>추가</button>
    </form>
  )
}

export default BucketEditor