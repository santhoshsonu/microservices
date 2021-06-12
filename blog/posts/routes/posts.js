const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const postController = require('../controllers/post-controller');
const validate = require('../util/validate');

/* GET all Posts. */
router.get('/', postController.getPosts);

/* Create Post */
router.post('/',
  check('title', 'Title must be between 4 and 256 characters')
    .isLength({ min: 4, max: 256 }),
  check('content', 'Content must have a maximum of 1024 characters')
    .isLength({ min: 4, max: 1024 }),
  validate,
  postController.addPost);

/* GET a Post by Id. */
router.get('/:id', postController.getPostById);

module.exports = router;
