import React from 'react'
import './TodoList.css'
import TodoItem from './TodoItem'

const TodoList = ({ todos = [], updatedChecked, updatedText, onDelete }) => {
  return (
    <div className="TodoList">
      <h4>Todo List 🌱</h4>
      <div className="todos_wrapper">
        {todos.length === 0 ? (
          <p className="empty">할 일이 비어있어요. 추가해보세요!</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo._id || todo.id}
              todo={todo}
              updatedChecked={updatedChecked}
              updatedText={updatedText}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TodoList