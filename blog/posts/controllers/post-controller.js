const Post = require('../models/post');
const HttpError = require('../util/http-error');

const axios = require('axios');
const config = require('../config/config');

const getPosts = async (req, res, next) => {
    let posts;
    try {
        posts = await Post.find().sort({ 'updatedAt': -1 });
    } catch (err) {
        return next(new HttpError('Internal Server Error', 500));
    }
    if (!posts || posts.length === 0) return next(new HttpError('No posts available', 404));
    res.status(200).json(posts.map(p => {
        const { _id, title, content, createdAt, updatedAt } = p;
        return { id: _id, title, content, createdAt, updatedAt };
    }));
};

const addPost = async (req, res, next) => {
    const { title, content } = req.body;
    let post = new Post({
        title, content
    });
    try {
        post = await post.save();
    } catch (err) {
        return next(new HttpError('Internal Server Error', 500));
    }
    const { _id, createdAt, updatedAt } = post;
    const createdPost = { id: _id, title, content, createdAt, updatedAt };
    try {
        await axios.post(config.EVENT_BUS, { type: 'CREATE_POST', data: createdPost });
    } catch (err) {
        await post.delete();
        return next(new HttpError('Internal Server Error', 500));
    }
    res.status(201).json(createdPost);
};

const getPostById = async (req, res, next) => {
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return next(new HttpError('Post not found', 404));
    }
    let post;
    try {
        post = await Post.findById(id);
    } catch (err) {
        console.log(err);
        return next(new HttpError('Internal Server Error', 500));
    }
    if (!post) return next(new HttpError('Post not found', 404));
    const { title, content, createdAt, updatedAt } = post;
    res.status(201).json({ id, title, content, createdAt, updatedAt });
};

module.exports.getPosts = getPosts;
module.exports.addPost = addPost;
module.exports.getPostById = getPostById;
