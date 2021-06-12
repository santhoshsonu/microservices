const Query = require('../models/query');
const HttpError = require('../util/http-error');

const eventHandler = async (req, res, next) => {
    console.log('Query Service Event received: ' + JSON.stringify(req.body));

    const type = req.body.type;

    if (type === 'CREATE_POST') {
        const post = req.body.data;
        let query = new Query({
            _id: post.id,
            title: post.title,
            content: post.content,
            updatedAt: post.updatedAt,
            comments: []
        });
        try {
            query = await query.save();
        } catch (err) {
            console.log(err);
            return next(new HttpError('Internal Server Error', 500));
        }
    } else if (type === 'CREATE_COMMENT') {
        const comment = { ...req.body.data };
        const postId = comment.postId;
        comment._id = comment.id;

        if (!postId)
            return next(new HttpError('Internal Server Error', 500));
        let query;
        try {
            query = await Query.findById(postId);
        } catch (err) {
            console.log(err);
            return next(new HttpError('Internal Server Error', 500));
        }
        if (!query) return next(new HttpError('Internal Server Error', 500));

        try {
            query.comments.push(comment);
            await query.save();
        } catch (err) {
            console.log(err);
            return next(new HttpError('Internal Server Error', 500));
        }
    } else if (type === 'UPDATE_COMMENT') {
        const comment = { ...req.body.data };
        const postId = comment.postId;

        if (!postId)
            return next(new HttpError('Internal Server Error', 500));
        let query;
        try {
            query = await Query.findById(postId);
        } catch (err) {
            console.log(err);
            return next(new HttpError('Internal Server Error', 500));
        }
        if (!query) return next(new HttpError('Post not found', 404));

        try {
            const comments = [...query.comments];
            const commentIndex = comments.findIndex(c => c._id === comment.id);
            console.log(`Comment id: ${comment.id} index: ${commentIndex}`);
            if (commentIndex < 0)
                return next(new HttpError('Internal Server Error', 500));
            comments[commentIndex] = {
                _id: comment.id,
                content: comment.content,
                status: comment.status,
                updatedAt: comment.updatedAt
            };
            query.comments = comments;
            await query.save();
        } catch (err) {
            console.log(err);
            return next(new HttpError('Internal Server Error', 500));
        }
    }
    res.status(200).json({});
};

module.exports.eventHandler = eventHandler;
