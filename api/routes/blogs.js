const express = require('express');
const router = express.Router();

const BlogsController = require('../controllers/blogs');

const checkToken = require('../middleware/check-auth');

router.get('/', checkToken, BlogsController.get_all_blogs);

router.post('/', checkToken, BlogsController.create_blog);

router.get('/:blogId', checkToken, BlogsController.get_blog);

router.delete('/:blogId', checkToken, BlogsController.delete_blog);

module.exports = router;