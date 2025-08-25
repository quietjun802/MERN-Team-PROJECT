import React, { useState, useMemo } from 'react';
import './List.css';
import Item from './Item';

const List = ({ buckets, onDelete, onUpdateChecked, onUpdateBucket }) => {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return buckets;
    return buckets.filter((t) => (t.text ?? '').toLowerCase().includes(kw));
  }, [buckets, q]);

  return (
    <div className="Bucketlist">
      <h4>Bucket List 🌱</h4>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <div className="buckets-wrapper">
        {filtered.map((bucket) => (
          <Item
            key={bucket._id}                              // ✅ 고유키 사용
            bucket={bucket}
            onDelete={() => onDelete(bucket._id)}         // ✅ id 바인딩
            onUpdateChecked={(next) => onUpdateChecked(bucket._id, next)}
            onUpdateBucket={(next) => onUpdateBucket(bucket._id, next)}
          />
        ))}
      </div>
    </div>
  );
};

export default List;
