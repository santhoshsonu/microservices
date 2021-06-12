const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event-controller');

/* GET home page. */
router.post('/events', (req, res, next) => {
  const { type, data } = req.body;
  try {
    eventController.eventHanlder(type, data);
  } catch (err) {
    return next(err);
  }
  res.json({});
});

module.exports = router;
