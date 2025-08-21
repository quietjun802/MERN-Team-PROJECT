import React from 'react'
import './Item.css'

function Item({
    todo = { id: undefined, text: '', done: false },
    onToggle = () => { },
    onDelete = () => { },
}) {
    const { id, text, done } = todo

    return (
        <div className={`item ${done ? 'done' : ''}`}>
            <input
                type="checkbox"
                checked={!!done}
                onChange={() => onToggle(id)}
                aria-label="완료 체크"
            />
            <span className="item-text">{text || '내용 없음'}</span>
            <button
                type="button"
                className="item-remove"
                onClick={() => onDelete(id)}
                aria-label="삭제"
            >
                🗑️
            </button>
        </div>
    )
}

export default Item