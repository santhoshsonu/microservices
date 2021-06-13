const express = require('express');
const router = express.Router();
const axios = require('axios');

const config = require('../config/config');
const HttpError = require('../util/http-error');

const events = [];

/* GET home page. */
router.post('/', async (req, res, next) => {
  const event = req.body;

  events.push(event);

  try {
    await axios.post(config.POSTS_SERVICE, event);
    await axios.post(config.COMMENTS_SERVICE, event);
    await axios.post(config.QUERY_SERVICE, event);
    await axios.post(config.MODERATION_SERVICE, event);
  } catch (err) {
    console.log(err);
    events.pop();
    return next(new HttpError('Internal Server error.', 500));
  }

  res.json({ success: true });
});

router.get('/', (req, res, next) => {
  res.status(200).json(events);
});

module.exports = router;
