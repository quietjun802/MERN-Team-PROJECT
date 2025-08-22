import React, { useState } from 'react'
import './Input.css'

function Input({ onAdd }) {
    const [text, setText] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) return
        onAdd(text)      
        setText("")      
    }

    return (
        <form onSubmit={handleSubmit} className="input-wrapper">
            <input
                type="text"
                value={text}
                placeholder="버킷리스트 입력..."
                onChange={(e) => setText(e.target.value)}
            />
            <button type="submit">추가</button>
        </form>
    )
}

export default Input