import { useState } from 'react'
import './App.css'
import BucketEditor from './components/BucketEditor'

function App() {
  const [count, setCount] = useState(0)

  return (

      <BucketEditor />
  )
}

export default App
