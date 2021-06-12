const Comment = require('../models/comment');
const HttpError = require('../util/http-error');

const axios = require('axios');
const config = require('../config/config');

const getCommentsByPostId = async (req, res, next) => {
    const postId = req.params.id;
    let comments;
    try {
        comments = await Comment.find({ postId }).sort({ 'updatedAt': -1 });
    } catch (err) {
        return next(new HttpError('Internal Server Error', 500));
    }
    if (!comments || comments.length === 0)
        return next(new HttpError('No comments available for the post', 404));
    res.status(200).json(comments.map(c => {
        const { _id, content, createdAt, updatedAt, status } = c;
        return { id: _id, postId, content, createdAt, updatedAt, status };
    }));
};

const addCommentToAPost = async (req, res, next) => {
    const postId = req.params.id;
    const { content } = req.body;
    let comment = new Comment({
        postId,
        content
    });
    try {
        comment = await comment.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Internal Server Error', 500));
    }
    const { _id, createdAt, updatedAt, status } = comment;
    const createdComment = {
        id: _id,
        postId,
        content,
        status,
        updatedAt
    }

    try {
        await axios.post(config.EVENT_BUS, { type: 'CREATE_COMMENT', data: createdComment });
    } catch (err) {
        await comment.delete();
        return next(new HttpError('Internal Server Error', 500));
    }
    res.status(201).json({ id: _id, postId, content, createdAt, updatedAt, status });
};

module.exports.getCommentsByPostId = getCommentsByPostId;
module.exports.addCommentToAPost = addCommentToAPost;
