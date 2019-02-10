var express = require('express');
var router = express.Router();
const config = require('../../config/config.json');
const PostController = require('../../controllers/post.controller');

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('respond with a resource');
});

router.get('/:post', PostController.webGetPost);

router.get('/all/:pagenum', PostController.webGetAllPosts);

router.get('/all', PostController.webGetAllPosts);

module.exports = router;
