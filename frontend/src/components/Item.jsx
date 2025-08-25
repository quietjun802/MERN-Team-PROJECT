import React, { useState, useEffect } from 'react';
import './Item.css';

const Item = ({ bucket, onDelete, onUpdateChecked, onUpdateBucket }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(bucket.text);

  // ✅ 백엔드 필드명과 통일: checked
  const checked = !!bucket.checked;

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

    await onUpdateBucket({
      text: next,
      date: nextDateISO,
    });

    setEditing(false);
  };

  // ✅ e 인자 필수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className={`BucketItem ${checked ? 'isCompleted' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onUpdateChecked(e.target.checked)}   // ✅ readOnly 제거
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
            <button className="updateBtn" onClick={saveEdit}>
              저장하기
            </button>
            <button className="deleteBtn" onClick={cancelEdit}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="content-wrap">
          <div className="content">{bucket.text}</div>
          {/* ✅ date가 없으면 createdAt로 표시 */}
          <div className="date">
            {new Date(pickDate(bucket)).toLocaleDateString('ko-KR')}
          </div>
          <div className="btn-wrap">
            <button className="updateBtn" onClick={startEdit}>
              수정
            </button>
            {/* 부모에서 id 바인딩된 onDelete를 내려줬다고 가정 → 인자 없이 호출 */}
            <button className="deleteBtn" onClick={onDelete}>
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;
