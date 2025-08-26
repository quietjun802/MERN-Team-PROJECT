import React, { useState, useEffect } from 'react';
import './Item.css';

const Item = ({ bucket, onDelete, onUpdateChecked, onUpdateBucket }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(bucket.text);

  // ✅ 안전한 기본값(불리언 강제)
  const checked = !!bucket.checked;
  const id = bucket.id ?? bucket._id;

  const toYmd = (d) => new Date(d).toISOString().slice(0, 10); // yyyy-mm-dd
  const pickDate = (t) => t?.date ?? t?.createdAt ?? new Date();
  const [dateStr, setDateStr] = useState(toYmd(pickDate(bucket)));

  useEffect(() => {
    if (!editing) {
      setText(bucket.text);
      setDateStr(toYmd(pickDate(bucket)));
    }
  }, [bucket, editing]);

  const startEdit = () => {
    setText(bucket.text);
    setDateStr(toYmd(pickDate(bucket)));
    setEditing(true);
  };

  const cancelEdit = () => {
    setText(bucket.text);
    setEditing(false);
  };

  const saveEdit = async () => {
    const next = text.trim();
    const prevYmd = toYmd(pickDate(bucket));
    if (!next || (next === bucket.text && prevYmd === dateStr)) {
      return setEditing(false);
    }
    const nextDateISO = new Date(`${dateStr}T00:00:00`).toISOString();
    await onUpdateBucket({ id, text: next, date: nextDateISO }); // ✅ id 포함
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className={`BucketItem ${checked ? 'isCompleted' : ''}`}>
      {/* ✅ 라벨/스팬 제거: 클릭 충돌 원인 제거 */}
      <input
        type="checkbox"
        checked={checked}

        onChange={(e) => {
          const next = e.target.checked;
          console.log('toggle', id, next);   // 🔎 이벤트 들어오는지 확인
          onUpdateChecked(id, next);         // ✅ (id, next) 형태로 호출
        }}
      />


      {editing ? (
        <div className="edit-wrap">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="수정할 내용을 입력하세요"
          />
          <div className="date">
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>
          <div className="btn-wrap">
            <button className="updateBtn" onClick={saveEdit}>저장하기</button>
            <button className="deleteBtn" onClick={cancelEdit}>취소</button>
          </div>
        </div>
      ) : (
        <div className="content-wrap">
          <div className="content">{bucket.text}</div>
          <div className="date">
            {new Date(pickDate(bucket)).toLocaleDateString('ko-KR')}
          </div>
          <div className="btn-wrap">
            <button className="updateBtn" onClick={startEdit}>수정</button>
            <button
              className="deleteBtn"
              onClick={() => onDelete(id)}     // ✅ id 전달
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
