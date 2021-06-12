const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new Schema({
    _id: {
        type: String,
        required: true
    },
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
    },
    updatedAt: {
        type: Date,
        required: true
    },
    comments: [{
        _id: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
            max: 256,
            min: 1
        },
        updatedAt: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('query', querySchema);