import './App.css'
import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from './components/Header'
import BucketEditor from './components/BucketEditor'
import BucketList from './components/BucketList'
import { api, ensureGuestAuth } from './lib/api';   // <-- 추가

function App() {
  const API = '/api/buckets'; // baseURL에 붙습니다.

  const [buckets, setBuckets] = useState([]);

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        // 1) 게스트 인증(쿠키 발급)
        await ensureGuestAuth();

        const res = await api.get(API);
        const data = Array.isArray(res.data) ? res.data : res.data.buckets ?? [];
        setBuckets(data);
        console.log(data); // (선택) 디버깅
      } catch (error) {
        console.log("가져오기 실패", error);
      }
    };
    fetchBuckets();
  }, []);

  const onCreate = async (bucketText) => {
    if (!bucketText?.trim()) return;

    try {
      const res = await api.post(API, { text: bucketText.trim() });
      const created = res.data?.bucket ?? res.data;

      if (Array.isArray(res.data?.buckets)) {
        setBuckets(res.data.buckets);
      } else {
        setBuckets(prev => [created, ...prev]);
      }
    } catch (error) {
      console.log("추가 실패", error);
    }
  };

  const onUpdateChecked = async (id, next) => {
    try {
      const { data } = await api.patch(`${API}/${id}/check`, { isCompleted: next });

      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets);
      } else {
        const updated = data?.bucket ?? data;
        setBuckets(prev => prev.map(b => (b._id === updated._id ? updated : b)));
      }
    } catch (error) {
      console.error("체크 상태 업데이트 실패", error);
    }
  };

  const updatedText = async (id, next) => {
    const value = next?.trim();
    if (!value) return;

    try {
      const { data } = await api.patch(`${API}/${id}/text`, { text: value });

      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets);
      } else {
        const updated = data?.bucket ?? data;
        setBuckets((prev) => prev.map(b => (b._id === updated._id ? updated : b)));
      }
    } catch (error) {
      console.error("텍스트 업데이트 실패", error);
    }
  };

  const putBucket = async (id, partial) => {
    const current = Array.isArray(buckets) ? buckets.find(b => b._id === id) : null;
    if (!current) throw new Error('해당 ID의 bucket을 찾을 수 없습니다.');

    const payload = { ...current, ...partial };
    const { data } = await api.put(`/api/buckets/${id}`, payload);
    const updated = data?.updated ?? data?.bucket ?? data;

    setBuckets(prev => prev.map(b => (b._id === updated._id ? updated : b)));
    return updated;
  };

  const onUpdateBucket = async (id, partial) => {
    try {
      await putBucket(id, partial); // { text, date } 등
    } catch (e) {
      console.error('텍스트/날짜 업데이트 실패', e);
    }
  };

  const onDelete = async (id) => {
    try {
      const { data } = await api.delete(`${API}/${id}`);

      if (Array.isArray(data?.buckets)) {
        setBuckets(data.buckets);
        return;
      }

      const deletedId = data?.deletedId ?? data?.bucket?._id ?? data?._id ?? id;
      setBuckets((prev) => prev.filter((b) => b._id !== deletedId));
    } catch (error) {
      console.error("삭제 실패", error);
    }
  };

  return (
    <div className='App'>
      <Header />
      <BucketEditor onCreate={onCreate} />
      <BucketList
        buckets={Array.isArray(buckets) ? buckets : []}
        onUpdateChecked={onUpdateChecked}
        onDelete={onDelete}
        onUpdateBucket={onUpdateBucket}
      />
    </div>
  )
}

export default App
