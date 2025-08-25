const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Bucket = require('../models/Bucket');

// ObjectId 유효성 검사
const ensureObjectId = (id, res) => {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ message: '유효하지 않은 ID 형식입니다.' });
    return false;
  }
  return true;
};

// 1) 생성
router.post('/', async (req, res) => {
  try {
    const text = req.body?.text?.trim();
    const checked = !!req.body?.checked;
    if (!text) return res.status(400).json({ message: 'text는 필수입니다.' });

    const doc = await Bucket.create({ text, checked });
    // 프런트가 단건/배열 모두 처리하므로 단건 반환 유지
    return res.status(201).json(doc);
  } catch (error) {
    return res
      .status(400)
      .json({ message: '할 일을 저장하지 못했습니다.', detail: error.message });
  }
});

// 2) 목록
router.get('/', async (_req, res) => {
  try {
    const buckets = await Bucket.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json(buckets);
  } catch (error) {
    return res
      .status(500)
      .json({ message: '데이터를 불러오지 못했습니다.', detail: error.message });
  }
});

// 3) 단건 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ensureObjectId(id, res)) return;

    const bucket = await Bucket.findById(id).lean();
    if (!bucket) return res.status(404).json({ message: '해당 ID의 bucket이 없습니다.' });

    return res.status(200).json(bucket);
  } catch (error) {
    return res
      .status(500)
      .json({ message: '데이터를 불러오지 못했습니다.', detail: error.message });
  }
});

// 4) 전체 수정(merge)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ensureObjectId(id, res)) return;

    const updated = await Bucket.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!updated) return res.status(404).json({ message: '해당 ID의 bucket이 없습니다.' });

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(400)
      .json({ message: '데이터를 수정하지 못했습니다.', detail: error.message });
  }
});

// 5) 삭제 (프런트가 data.buckets를 우선 사용 → 목록 함께 반환)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ensureObjectId(id, res)) return;

    const deleted = await Bucket.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: '해당 ID의 bucket이 없습니다.' });

    const buckets = await Bucket.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      message: '삭제 성공',
      deleted: deleted._id,
      buckets
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: '데이터를 삭제하지 못했습니다.', detail: error.message });
  }
});

// 6) 체크 토글 (프런트는 {checked: boolean} 전송)
router.patch('/:id/check', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ensureObjectId(id, res)) return;

    const { checked } = req.body;
    if (typeof checked !== 'boolean') {
      return res.status(400).json({ message: 'checked는 반드시 boolean이어야 합니다.' });
    }

    const updated = await Bucket.findByIdAndUpdate(
      id,
      { checked },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!updated) return res.status(404).json({ message: '해당 ID의 bucket이 없습니다.' });

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(400)
      .json({ message: '체크 상태 수정 실패', detail: error.message });
  }
});

// 7) 텍스트만 수정
router.patch('/:id/text', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ensureObjectId(id, res)) return;

    const text = req.body?.text?.trim();
    if (!text) return res.status(400).json({ message: 'text는 필수입니다.' });

    const updated = await Bucket.findByIdAndUpdate(
      id,
      { text },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!updated) return res.status(404).json({ message: '해당 ID의 bucket이 없습니다.' });

    return res.status(200).json(updated);
  } catch (error) {
    return res
      .status(400)
      .json({ message: '텍스트 수정 실패', detail: error.message });
  }
});

module.exports = router;
