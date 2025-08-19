import React from 'react'
import "./Header.css"
const Header = () => {
  return (
    <header>
        <h3>익명 버킷리스트</h3>
        <h1>{new Date().toDateString()}</h1>
    </header>
  )
}

export default Header