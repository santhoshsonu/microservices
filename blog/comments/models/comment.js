const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        max: 256,
        min: 1
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

commentSchema.index({ postId: 1 });

module.exports = mongoose.model('Comment', commentSchema);