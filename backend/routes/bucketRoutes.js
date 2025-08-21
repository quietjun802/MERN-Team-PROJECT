const express = require('express');
const mongoose = require('mongoose');
const Bucket = require('../models/Bucket');
const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const buckets = await Bucket.find().sort({ createdAt: -1 });
        res.json(buckets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: '유효하지 않은 ID 형식입니다.' });
    }

    const bucket = await Bucket.findById(id);
    if (!bucket) {
      return res.status(404).json({ message: '해당 ID의 bucket 없습니다.' });
    }

    return res.status(200).json({ message: '1개 불러오기 성공', bucket });
  } catch (error) {
    return res.status(500).json({ message: '데이터를 불러오지 못했습니다.', error: error.message });
  }
});


router.post('/', async (req, res) => {
    try {
        const { title, done } = req.body;
        if (!title) return res.status(400).json({ message: 'title 필수' });
        const saved = await Bucket.create({ title, done });
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, done } = req.body;
        const updated = await Bucket.findByIdAndUpdate(
            req.params.id,
            { ...(title !== undefined && { title }), ...(done !== undefined && { done }) },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Not Found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: '유효하지 않은 ID 형식입니다.' });
    }

    const deleted = await Bucket.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: '해당 ID의 bucket이 없습니다.' });
    }

    const remaining = await Bucket.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: '1개 삭제하기 성공',
      deleted: deleted._id,
      buckets: remaining
    });
  } catch (error) {
    return res.status(500).json({ message: '데이터를 삭제하지 못했습니다.', error: error.message });
  }
});

module.exports = router;