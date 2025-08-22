import { useState } from 'react'
import './App.css'
import BucketEditor from './components/BucketEditor'
import Header from './components/Header'
import BucketList from './components/BucketList'
import BucketItem from './components/BucketItem'

function App() {

  return (
    <div className='App'>
    <Header/>
      <BucketEditor />
      <BucketList/>
      </div>
  )
}

export default App
