import React, { useState, useMemo } from 'react'
import './BucketList.css'
import BucketItem from './BucketItem'

const BucketList = ({
  buckets = [],            // 기본값으로 빈 배열 설정
  onDelete,
  onUpdateChecked,
  onUpdateBucket
}) => {
  const [q, setQ] = useState('')      // 검색어 상태
  const [isOpen, setIsOpen] = useState(true) // 리스트 펼침 여부

  // 검색어 기반 필터링
  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    if (!kw) return buckets
    return buckets.filter((t) => (t.text ?? "").toLowerCase().includes(kw))
  }, [buckets, q])

  return (
    <div className='bucketList'>
      <h4>Bucket List</h4>

      <input 
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder='검색어를 입력하세요' 
      />

      <div 
        className="toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', margin: '10px 0', fontSize: '20px' }}
      >
        {isOpen ? "⬆️" : "⬇️"}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="buckets-wrapper">
          {filtered.map((bucket, i) => (
            <BucketItem
              key={i}
              bucket={bucket}
              onUpdateChecked={onUpdateChecked}
              onUpdateBucket={onUpdateBucket}
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BucketList
