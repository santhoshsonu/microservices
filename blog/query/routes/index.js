const express = require('express');
const router = express.Router();

const queryController = require('../controllers/query-controller');

/* GET Posts with comments. */
router.get('/posts', queryController.getPostsWithComments);

module.exports = router;
