import React from 'react'
import './Header.css'

const Header = () => (
    <header className="app-header">
        <h1>BUCKET_LIST</h1>
        <h1>{new Date().toDateString()}</h1>
    </header>
)

export default Header