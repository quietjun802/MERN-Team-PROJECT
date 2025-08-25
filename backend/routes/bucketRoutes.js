
const express = require('express');
const Bucket = require('../models/bucket');
const router = express.Router();

router.get('/', async (_req, res) => {
    try {
        const buckets = await Bucket.find().sort({ createdAt: -1 });
        res.json(buckets);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        const deleted = await Bucket.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Not Found' });
        res.json(deleted);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
