// const Post = require('../models/post');
// const HttpError = require('../util/http-error');

const events = async (req, res, next) => {
    console.log('Posts Service Event received: ' + JSON.stringify(req.body));
    res.status(200).json({});
};

module.exports.events = events;
