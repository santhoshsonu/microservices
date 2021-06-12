const axios = require('axios');

const config = require('../config/config');
const Comment = require('../models/comment');
const HttpError = require('../util/http-error');

const eventHandler = async (type, data) => {
    if (type === 'MODERATE_COMMENT') {
        console.log(`Comment Service processing event: ${type}  data: ${JSON.stringify(data)}`);
        let comment;
        try {
            comment = await Comment.findById(data.id);
        } catch (err) {
            return next(new HttpError('Internal Server Error', 500));
        }
        if (!comment) throw new HttpError('Comment unavailable', 404);

        const { status, content } = comment;
        comment.status = data.status;
        comment.content = data.content;

        try {
            await comment.save();
            try {
                const updatedComment = {
                    id: comment._id,
                    postId: comment.postId,
                    status: comment.status,
                    content: comment.content,
                    updatedAt: comment.updatedAt
                };
                await axios.post(config.EVENT_BUS, { type: 'UPDATE_COMMENT', data: updatedComment });
            } catch (err) {
                comment.status = status;
                comment.content = content;
                await comment.save();
                throw new HttpError('Internal Server Error', 500);
            }
        } catch (err) {
            throw new HttpError('Internal Server Error', 500);
        }
    }
};

const events = async (req, res, next) => {
    const { type, data } = req.body;
    try {
        await eventHandler(type, data);
    } catch (err) {
        console.log(err);
        return next(err)
    };
    res.status(200).json({});
};

module.exports.events = events;
