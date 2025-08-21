const mongoose = require('mongoose');

const bucketSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        done: { type: Boolean, default: false },
    },
    { timestamps: true, collection: 'todos' } 
);

module.exports = mongoose.model('Bucket', bucketSchema);