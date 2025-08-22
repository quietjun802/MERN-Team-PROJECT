import { useState } from 'react'
import Header from '../components/Header'
import Input from '../components/Input'
import Item from '../components/Item'
import List from '../components/List'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bucket_list'>
      <Header />
      <Input />
      <Item />
      <List />

    </div>
  )
}

export default App
