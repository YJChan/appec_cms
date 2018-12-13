const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const validator = require('validator');
const utils = require('../../utils/utils');
const security = require('../../utils/security');
const resp = require('../../utils/resp');
const rQry = require('../../models/sqlite/rawSQL');
const config = require('../../config/config.json');
const supp = require('../../utils/supp');
const _ = require('lodash');
const PostController = require('../../controllers/post.controller');

let isAuthenticated = (req, res, next) => {
	const response = new resp();
	let token = req.get('Authorization') !== null || req.get('Authorization') !== undefined ? req.get('Authorization') : '';
	if (token.includes('Bearer')) {
		token = token.replace('Bearer ', '');

		res.auth_token = null;
		if (token !== '') {
			security.verifyToken(token, (err, validToken) => {
				if (err) {
					const response = new resp();
					res.status(401).send(response.initResp(null, {
						msg: err.message,
						status: true,
						code: 401,
						reason: err.stack
					}));
				}

				res.auth_token = validToken;
				next();
			});
		} else {			
			res.status(401).send(response.unAuthResp());
		}
	} else {		
		res.status(401).send(response.unAuthResp());
	}
};

router.post('/post-create', isAuthenticated, PostController.createPost);

router.get('/post-get/:postid', isAuthenticated, PostController.getPost);

router.patch('/post-update/:postid', isAuthenticated, PostController.updatePost);

router.get('/post-view/:postid', PostController.increasePostView);

router.delete('/post-del/:postid', isAuthenticated, PostController.deletePost);

router.post('/post-search', PostController.searchAutoComplete);

router.get('/all', PostController.getAllPost);

router.get('/paginate/:pagenum', PostController.paginatePost);

router.post('/post-category', isAuthenticated, PostController.setPostCategory);

router.delete('/post-category', isAuthenticated, PostController.delPostCategory);

router.post('/post-tag', isAuthenticated, PostController.setPostTag);

router.delete('/post-tag', isAuthenticated, PostController.delPostTag);

router.post('/feature-post/:postid', isAuthenticated, PostController.setFeaturePost);

router.get('/feature-post', PostController.getFeaturePost);

router.delete('/feature-post/:postid', isAuthenticated, PostController.rmvFeaturePost);

module.exports = router;