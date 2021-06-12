const Query = require('../models/query');
const HttpError = require('../util/http-error');

const getPostsWithComments = async (req, res, next) => {
    let posts = [];
    try {
        posts = await Query.find().sort({ updatedAt: -1 });
    } catch (err) {
        return next(new HttpError('Internal Server Error', 500));
    }
    res.status(200).json(posts.map(p => {
        const comments = p.comments.map(c => (
            { id: c._id, content: c.content, updatedAt: c.updatedAt, status: c.status }
        )).sort((a, b) => (new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : (new Date(b.updatedAt) > new Date(a.updatedAt)) ? 1 : 0));

        return {
            id: p._id,
            title: p.title,
            content: p.content,
            updatedAt: p.updatedAt,
            comments
        };
    }));
};

module.exports.getPostsWithComments = getPostsWithComments;
