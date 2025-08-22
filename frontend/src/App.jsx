import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import Header from './components/Header'
import Input from './components/Input'
import List from './components/List'
function App() {

  const [buckets, setBuckets] = useState([])
  const API = 'api/buckets'

  useEffect(() => {
    const fetchBuckets = async () => {
      try {

        await ensureGuestAuth()
        const res = await api.get(API)
        const data = Array.isArray(res.data) ?
          res.data : res.data?.buckets ?? []

        setBuckets(data)
        console.log(data)

      } catch (error) {
        console.log("가져오기 실패", error)
      }
    }
    fetchBuckets()
  }, [API])


  const onCreate = async (bucketText) => {
    if (!bucketText.trim()) return

    try {

      const res = await api.post(API, { text: bucketText.trim() })

      const created = res.data?.bucket ?? res.data

      if (Array.isArray(res.data?.buckets)) {
        setBuckets(res.data.buckets)
      } else {
        setBuckets(prev => [created, ...prev])
      }

    } catch (error) {
      console.log("추가 실패", error)
    }
  }
  const onDelete = async (id) => {
    try {
      if (!confirm("정말 삭제할까요?")) return

      const { data } = await api.delete(`${API}/${id}`)

      if (Array.isArray(data?.buckets)) {
        setbuckets(data.buckets)
        return
      }

      const deletedId = data?.deletedId ?? data?.bucket?._id ?? data?._id ?? id
      setBuckets((prev) => prev.filter((t) => t._id !== deletedId))
    } catch (error) {
      console.error("삭제 실패", error)
    }
  }
  const onUpdateChecked = async (id, next) => {

    try {

      const { data } = await api.patch(`${API}/${id}/check`, {
        isCompleted: next
      })

      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets)
      } else {
        const updated = data?.bucket ?? data;
        setBuckets(
          prev => prev.map(t => (t._id === updated._id ? updated : t))
        )
      }
    } catch (error) {
      console.error("체크 상태 업데이트 실패", error)
    }

  }
  const onUpdateText = async (id, next) => {
    const value = next?.trim()

    if (!value) return


    try {

      const { data } = await axios.patch(`${API}/${id}/text`, {
        text: value
      })

      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets)
      } else {
        const updated = data?.bucket ?? data;
        setBuckets(
          prev => prev.map(t => (t._id === updated._id ? updated : t))
        )
      }
    } catch (error) {
      console.error("체크 상태 업데이트 실패", error)
    }

  }
  const onUpdate = async (id, next) => {
    try {
      const current = Array.isArray(buckets) ? buckets.find(t => t._id == id) : null
      if (!current) throw new Error("해당 ID의 bucket이 없습니다.")

      const { data } = await api.put(`${API}/${id}`, next)

      const updated = data?.updated ?? data?.bucket ?? data;
      setBuckets(
        prev => prev.map(t => (t._id === updated._id ? updated : t))
      )

    } catch (error) {
      console.error("bucket update 실패", error)
    }
  }

  const onUpdateBucket = async (id, next) => {
    try {
      await onUpdate(id, next)

    } catch (error) {
      console.error("Bucket update 실패", error)

    }
  }

  return (
    <div className='App'>
      <Header />
      <Input onCreate={onCreate} />
      <List
        buckets={Array.isArray(buckets) ? buckets : []}
        onUpdateChecked={onUpdateChecked}
        onUpdateBucket={onUpdateBucket}
        onDelete={onDelete} />
    </div>
  )
}

export default App
