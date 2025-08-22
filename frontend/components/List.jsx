import React, { useState, useMemo } from 'react'
import './List.css'
import Item from './Item'

const List = ({ todos = [], onToggle, onDelete }) => {
    const [q, setQ] = useState('')

    const filtered = useMemo(() => {
        const kw = q.trim().toLowerCase()
        if (!kw) return todos
        return todos.filter((t) =>
            (t?.text ?? t?.title ?? '').toLowerCase().includes(kw)
        )
    }, [todos, q])

    return (
        <div className="list">
            <h4>💀 Bucket List 💀</h4>

            <div className="list-wrapper">
                {filtered.map((todo, i) => (
                    <Item
                        key={todo.id ?? todo._id ?? i}
                        todo={{
                            id: todo.id ?? todo._id,            
                            text: todo.text ?? todo.title ?? '', 
                            done: !!(todo.done ?? todo.isCompleted),
                        }}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}

export default List