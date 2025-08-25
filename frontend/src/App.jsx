import { useState, useEffect } from 'react';
// import axios from "axios"    // ❌ 안 씀
import './App.css';
import Header from './components/Header';
import Input from './components/Input';
import List from './components/List';
import { api, ensureGuestAuth } from './lib/api';

function App() {
  const [buckets, setBuckets] = useState([]);
  const API = '/api/buckets';

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        await ensureGuestAuth();
        const res = await api.get(API);
        const data = Array.isArray(res.data) ? res.data : (res.data?.buckets ?? []);
        setBuckets(data);
      } catch (error) {
        console.log('가져오기 실패', error);
      }
    };
    fetchBuckets();
  }, []); // ✅ 상수라 deps 불필요

  const onCreate = async (bucketText) => {
    const text = bucketText?.trim();
    if (!text) return;
    try {
      const res = await api.post(API, { text });
      const created = res.data?.bucket ?? res.data;
      if (Array.isArray(res.data?.buckets)) {
        setBuckets(res.data.buckets);
      } else {
        setBuckets((prev) => [created, ...prev]);
      }
    } catch (error) {
      console.log('추가 실패', error);
    }
  };

  const onDelete = async (id) => {
    try {
      if (!confirm('정말 삭제할까요?')) return;
      const { data } = await api.delete(`${API}/${id}`);
      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets);                 // ✅ 오타 수정 + 바로 교체
        return;
      }
      const deletedId = data?.deleted ?? data?.deletedId ?? data?.bucket?._id ?? data?._id ?? id;
      setBuckets((prev) => prev.filter((t) => t._id !== deletedId)); // ✅ 불변 갱신
    } catch (error) {
      console.error('삭제 실패', error);
    }
  };

  const onUpdateChecked = async (id, next) => {
    try {
      const { data } = await api.patch(`${API}/${id}/check`, {
        checked: next,                             // ✅ 백엔드와 통일
      });
      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets);
      } else {
        const updated = data?.bucket ?? data;
        setBuckets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      }
    } catch (error) {
      console.error('체크 상태 업데이트 실패', error);
    }
  };

  const onUpdateText = async (id, next) => {
    const value = next?.trim();
    if (!value) return;
    try {
      const { data } = await api.patch(`${API}/${id}/text`, {  // ✅ axios → api
        text: value,
      });
      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets);
      } else {
        const updated = data?.bucket ?? data;
        setBuckets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      }
    } catch (error) {
      console.error('텍스트 수정 실패', error);
    }
  };

  const onUpdate = async (id, next) => {
    try {
      const current = Array.isArray(buckets) ? buckets.find((t) => t._id == id) : null;
      if (!current) throw new Error('해당 ID의 bucket이 없습니다.');
      const { data } = await api.put(`${API}/${id}`, next);
      const updated = data?.updated ?? data?.bucket ?? data;
      setBuckets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (error) {
      console.error('bucket update 실패', error);
    }
  };

  const onUpdateBucket = async (id, next) => {
    try {
      await onUpdate(id, next);
    } catch (error) {
      console.error('Bucket update 실패', error);
    }
  };

  return (
    <div className="App">
      <Header />
      <Input onCreate={onCreate} />
      <List
        buckets={Array.isArray(buckets) ? buckets : []}
        onUpdateChecked={onUpdateChecked}
        onUpdateBucket={onUpdateBucket}
        onDelete={onDelete}
      />
    </div>
  );
}

export default App;
