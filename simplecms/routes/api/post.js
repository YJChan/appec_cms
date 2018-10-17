const {Admin} = require('../../models/sqlite/sqliteModel');
const {Right} = require('../../models/sqlite/sqliteModel');
const {Role} = require('../../models/sqlite/sqliteModel');
const {Session} = require('../../models/sqlite/sqliteModel');
const {Post} = require('../../models/sqlite/sqliteModel');
const {db} = require('../../models/db');
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
router.use(bodyParser.json());

let fTagParam = () => ({
	TagID: utils.guid(),

	tagname: {
		val: '',
		type: 'empty',
		check: true
	}
});

let fPostImgParam = () => ({
	ImageID: utils.guid(),
	inDb: 1,
	fileType: '',
	fileSize: 0,
	binaryFile: '',
	filePath: ''
});

let fPostCategoryParam = () => ({
	CatID: utils.guid(),

	catname: {
		val: '',
		type: 'empty',
		check: true
	}
});

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

router.post('/', isAuthenticated, PostController.createPost);

/** 
 * @param  {string} PostId (p-id)
 * @param  {string} tags (tag)
 * @param  {string} category (cat)
 * @param  {string} publish-date (pdt)
 * @param  {integer} active (a)
 * @param  {integer} visibility (v)
 * @param  {string} UserID (uid)
 * @param  {string} Username (uname)
 */
router.get('/all', (req, res, next) => {  
	let response = new resp();
  
	Post.findAll()
		.then(oPosts => {
			res.status(200).send(response.initResp(oPosts));
		});
});

module.exports = router;