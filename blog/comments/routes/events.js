const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event-controller');
// const validate = require('../util/validate');

/* Process event. */
router.post('/', eventController.events);


module.exports = router;
