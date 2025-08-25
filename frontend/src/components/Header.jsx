import React from 'react'
import './Header.css'

<<<<<<< HEAD
const Header = () => {
  return (
    <div className='Header'> 
        Bucket List
    </div>
  )
}
=======
const Header = () => (
    <header className="app-header">
        <h1>BUCKET_LIST</h1>
        <h1>{new Date().toDateString()}</h1>
    </header>
)
>>>>>>> choyongjun

export default Header