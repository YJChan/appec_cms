//Application Model
const PostModel = require('../models/post.model');
//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');
const {convertDeltaToHtml} = require('node-quill-converter');
const config = require('./../config/config.json');

/**
 * Create new Post
 */
exports.createPost = (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let oPostReq = oPostM.postParam();  
  
	if (res.auth_token !== null) {
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if (valid_permit) {
			supp.prepareBodyReq(req, oPostReq)
				.then(oPostValidated => oPostM.createPost(oPostValidated))
				.then(oPostRec => {
					//console.log(oPostRec);
					res.status(200).send(response.initResp(oPostRec));
				})      
				.catch(error => {
					//console.log(error);
					res.status(400).send(response.initResp(null, error));
				});
		}
	} else {    
		return next({
			message: 'Unauthorized access api',
			api: true,
			code: 401
		});    
	}      
};

exports.getPost = (req, res, next) => {
	let action = 'read';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let oPostReq = {
		PostID: {
			val: req.params.postid,
			type: 'uuid',
			check: true,
			exclude: false
		}
	};

	if(res.auth_token !== null){
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if(valid_permit){
			security.validate(oPostReq, function(err, oPost){
				if(err) res.status(400).send(response.initResp(null, {message: err, code: 400, status: true}));
				oPostM.getPost(oPost)
					.then(oPostContent => {
						res.status(200).send(response.initResp(oPostContent));
					})
					.catch(err => {
						res.status(400).send(response.initResp(null, err));
					});				
			});
		}else{
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
	}
};

exports.updatePost = (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let oPostReq = oPostM.postParam(false);		
	let postID = req.params.postid;

	if (res.auth_token !== null) {		
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if (valid_permit) {
			oPostReq = oPostM.determineWhatToUpdate(req, oPostReq);
			supp.prepareBodyReq(req, oPostReq)
				.then(oPostToSave => oPostM.updatePost(oPostToSave, postID))
				.then(oPostRec => {
					res.status(200).send(response.initResp(oPostRec));
				})
				.catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
		}else{
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
	}
	else {
		return next({
			message: 'Unauthorized access api',
			api: true,
			code: 401
		});
	}	
};

exports.increasePostView = (req, res) => {
	let response = new resp();
	let oPostM = new PostModel();	
	let postID = req.params.postid;

	oPostM.increasePostView(postID)
		.then(oPostView => {
			res.status(200).send(response.initResp(oPostView.views));
		}).catch(err => {
			res.status(400).send(response.initResp(err));
		});
};

exports.deletePost = (req, res, next) => {
	let action = 'delete';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();	
	let postID = req.params.postid;

	if (res.auth_token !== null) {
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if (valid_permit) {
			oPostM.deletePost(postID)
				.then(oPostDeleted => {
					res.status(200).send(response.initResp(oPostDeleted));
				})
				.catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
		} else {
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
	}else{
		return next({
			message: 'Unauthorized access api',
			api: true,
			code: 401
		});
	}
};

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
exports.getAllPost = (req, res) => {
	let response = new resp();
	let oPostM = new PostModel();
	oPostM.getAllPost(true)
		.then(oAllPosts => {
			res.status(200).send(response.initResp(oAllPosts));
		}).catch(err => {
			res.status(400).send(response.initResp(null, err));
		});	
};

exports.setPostCategory = (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();	
	let postID = req.params.postid;
	let catID = req.body.CatID;	

	if (res.auth_token !== null) {
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if (valid_permit) {
			if(security.isUUID(postID) && security.isUUID(catID)){
				oPostM.setPostCategory({
					CatID: catID,
					PostID: postID
				}).then(oPostCat => {
					res.status(200).send(response.initResp(oPostCat));
				}).catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
			}else{
				res.status(400).send(response.initResp(null, {
					message: 'Invalid parameter, kindly provide a valid ID',
					code: 400,
					status: true
				}));
			}
		} else {
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
	}
};

exports.delPostCategory = (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let postID = req.params.postid;
	let catID = req.body.CatID;

	if (res.auth_token !== null) {
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if (valid_permit) {
			if (security.isUUID(postID) && security.isUUID(catID)) {
				oPostM.delPostCategory({
					CatID: catID,
					PostID: postID
				}).then(oPostCat => {
					res.status(200).send(response.initResp(oPostCat));
				}).catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
			} else {
				res.status(400).send(response.initResp(null, {
					message: 'Invalid parameter, kindly provide a valid ID',
					code: 400,
					status: true
				}));
			}
		} else {
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
	}
};

exports.setPostTag = (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let postID = req.params.postid;
	let tagID = req.body.TagID;

	if (res.auth_token !== null) {
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if (valid_permit) {
			if (security.isUUID(postID) && security.isUUID(tagID)) {
				oPostM.setPostTag({
					TagID: tagID,
					PostID: postID
				}).then(oPostTag => {
					res.status(200).send(response.initResp(oPostTag));
				}).catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
			} else {
				res.status(400).send(response.initResp(null, {
					message: 'Invalid parameter, kindly provide a valid ID',
					code: 400,
					status: true
				}));
			}
		} else {
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
	}
};

exports.delPostTag = (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let postID = req.params.postid;
	let tagID = req.body.TagID;

	if (res.auth_token !== null) {
		postACL = res.auth_token.role.post;
		valid_permit = security.permit(action, postACL.acl);
		if (valid_permit) {
			if (security.isUUID(postID) && security.isUUID(tagID)) {
				oPostM.delPostTag({
					TagID: tagID,
					PostID: postID
				}).then(oPostTag => {
					res.status(200).send(response.initResp(oPostTag));
				}).catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
			} else {
				res.status(400).send(response.initResp(null, {
					message: 'Invalid parameter, kindly provide a valid ID',
					code: 400,
					status: true
				}));
			}
		} else {
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
	}
};

exports.paginatePost = async (req, res) => {
	let response = new resp();
	let oPostM = new PostModel();
	let pageNum = req.params.pagenum;
	let result = {
		pages: 0,
		posts : null
	};	

	try{
		result.pages = await oPostM.countPost(1);
		result.posts = await oPostM.paginatePost(pageNum, 1);
			
		res.status(200).send(response.initResp(result));
	}catch(err){
		res.status(400).send(response.initResp(null, err));
	}
};


/**Web Route */
exports.webGetPost = async (req, res, next) => {
	let oPostM = new PostModel();
	let oParam = {
		PostID : '',
		slug: ''
	};		
	let PostID = req.params.post;
	PostID = PostID.replace('POST-', '');

	if(req.params.post.indexOf('POST-') > -1 && supp.isValidUUID(PostID)){		
		oParam.PostID = req.params.post;
	}else{
		oParam.slug = req.params.post;
	}

	let oPostResult = await oPostM.webGetPost(oParam);
	if(oPostResult !== null){
		let jsonContent = JSON.parse(oPostResult.content);
		let html = convertDeltaToHtml(jsonContent);
		oPostResult.content = html;
		res.render('../views/app/web/post/web-post', {
			post: oPostResult,
			blog: {
				brand_title: config[config.environment].app_name,
				brand_tagline: config[config.environment].app_desc,
			}
		});		
	}else{
		res.status(404);
		next();
	}
	
};