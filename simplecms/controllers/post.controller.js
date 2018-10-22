//Application Model
const PostModel = require('../models/post.model');

//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');

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

