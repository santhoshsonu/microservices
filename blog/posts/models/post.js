const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        min: 4,
        max: 255
    },
    content: {
        type: String,
        required: true,
        min: 4,
        max: 1024
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);