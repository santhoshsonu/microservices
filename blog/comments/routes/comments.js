const express = require('express');
const router = express.Router();

const validate = require('../util/validate');
const { check } = require('express-validator');
const commentController = require('../controllers/comment-controller');

/* GET all comments by Post ID. */
router.get('/:id/comments',
  commentController.getCommentsByPostId);

/* Post comment to a Post ID. */
router.post('/:id/comments',
  check('content', 'content should not be empty')
    .notEmpty()
    .withMessage('content should have maximum of 256 characters')
    .isLength({ max: 256 }),
  validate,
  commentController.addCommentToAPost);

module.exports = router;
