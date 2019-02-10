//Application Model
const PostModel = require('../models/post.model');
const CategoryModel = require('../models/category.model');
const ImageModel = require('../models/image.model');
const SettingModel = require('../models/setting.model');

//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');
const utils = require('../utils/utils');
const {convertDeltaToHtml} = require('node-quill-converter');
const config = require('./../config/config.json');

/**
 * Create new Post
 */
exports.createPost = async (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let oPostReq = oPostM.postParam();  
	let oImageM = new ImageModel();
	let oPostValidated = null;
	let oPostResult = null;
	let oPostRec = null;
	let oPostImage = null;
	let fileInBase64 = '';
	let postImgID = 'IMG-' + utils.guid().toUpperCase();
	let fileType = '.jpg';
	let oImageToSave = null;
	let withImage = false;

	try{
		if (res.auth_token !== null) {
			postACL = res.auth_token.role.post;
			valid_permit = security.permit(action, postACL.acl);
			if (valid_permit) {
				oPostValidated = await supp.prepareBodyReq(req, oPostReq);

				if (oPostValidated.postImg !== undefined && oPostValidated.postImg !== null && oPostValidated.postImg !== ''){
					fileInBase64 = oPostValidated.postImg.replace(/^data:image\/jpeg;base64,/, '');
					require('fs').writeFileSync(__dirname + '/../public/images/uploads/' + postImgID + fileType, fileInBase64, {encoding: 'base64'});					
					
					oImageToSave = {
						ImageID: postImgID,
						inDb: '',
						fileType: 'image/jpeg',
						fileSize: 0.0,
						filename: postImgID + fileType,
						binaryFile: '',
						filePath: '/public/images/uploads/',
						url: config[config.environment].base_url + 'api/image/get-image/' + postImgID
					};
					oPostImage = await oImageM.uploadImage(oImageToSave);
					withImage = true;
				}

				oPostRec = await oPostM.createPost(oPostValidated);
				
				if(withImage){
					oPostImage = await oPostM.setPostImage({
						PostImageID : 'PIMG-' + utils.guid().toUpperCase(),
						PostID : oPostRec.PostID,
						ImageID : postImgID
					});
				}

				oPostResult = await oPostM.getPost({PostID: oPostRec.PostID});

				res.status(200).send(response.initResp(oPostResult));

				/*supp.prepareBodyReq(req, oPostReq)
					.then(oPostValidated => oPostM.createPost(oPostValidated))
					.then(oPostRec => {
						res.status(200).send(response.initResp(oPostRec));
					}).catch(error => {					
						res.status(400).send(response.initResp(null, error));
					});
					*/
			}
		} else {    
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});    
		} 
	}catch(err){
		res.status(400).send(response.initResp(null, err));
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

exports.updatePost = async (req, res, next) => {
	let action = 'write';
	let response = new resp();
	let postACL = {};
	let valid_permit = false;
	let oPostM = new PostModel();
	let oImageM = new ImageModel();
	let oPostReq = oPostM.postParam(false);		
	let postID = req.params.postid;
	let oPostToSave, oPostRec, oPostImage, oImageToSave, oPostResult = null;
	let delExistPostImage = false;
	let postImgID = 'IMG-' + utils.guid().toUpperCase();
	let fileInBase64 = '';
	let fileType = '.jpg';

	try{
		if (res.auth_token !== null) {		
			postACL = res.auth_token.role.post;
			valid_permit = security.permit(action, postACL.acl);
			if (valid_permit) {
				oPostReq = oPostM.determineWhatToUpdate(req, oPostReq);
				oPostToSave = await supp.prepareBodyReq(req, oPostReq);
				console.log('post obj %o', oPostToSave.postImg);
				if (oPostToSave.postImg !== undefined && oPostToSave.postImg !== ''){
					if(oPostToSave.postImgID !== ''){
						postImgID = oPostToSave.postImgID;
					}

					//overwrite new file
					fileInBase64 = oPostToSave.postImg.replace(/^data:image\/jpeg;base64,/, '');
					require('fs').writeFileSync(__dirname + '/../public/images/uploads/' + postImgID + fileType, fileInBase64, {encoding: 'base64'});					
					
					oImageToSave = {
						ImageID: postImgID,
						inDb: '',
						fileType: 'image/jpeg',
						fileSize: 0.0,
						filename: postImgID + fileType,
						binaryFile: '',
						filePath: '/public/images/uploads/',
						url: config[config.environment].base_url + 'api/image/get-image/' + postImgID
					};

					if(oPostToSave.postImgID !== ''){
						//oImageToSave.ImageID = oPostToSave.postImgID;
						//oImageToSave.ImageID = oPostToSave.postImgID + fileType;
						//oImageToSave.ImageID = config[config.environment].base_url + 'api/image/get-image/' + oPostToSave.postImgID;
						oPostImage = await oImageM.updateImage(oImageToSave, oPostToSave.postImgID);
					}else{
						oPostImage = await oImageM.uploadImage(oImageToSave);
					}
				}
				oPostRec = await oPostM.updatePost(oPostToSave, postID);
				if(oPostRec.hasOwnProperty('code')){
					throw oPostRec;
				}

				if (oPostToSave.postImg !== undefined && oPostToSave.postImg !== ''){
					
					if(oPostToSave.postImgID !== ''){
						delExistPostImage = await oPostM.delPostImage({
							ImageID: postImgID, 
							PostID: oPostRec.PostID
						});					
					}
					
					oPostImage = await oPostM.setPostImage({
						PostImageID : 'PIMG-' + utils.guid().toUpperCase(),
						PostID : oPostRec.PostID,
						ImageID : postImgID
					});
				}
				
				console.log('post id %s', oPostRec.PostID);
				oPostResult = await oPostM.getPost({PostID: oPostRec.PostID});

				res.status(200).send(response.initResp(oPostResult));

				/*
				supp.prepareBodyReq(req, oPostReq)
					.then(oPostToSave => oPostM.updatePost(oPostToSave, postID))
					.then(oPostRec => {
						res.status(200).send(response.initResp(oPostRec));
					})
					.catch(err => {
						res.status(400).send(response.initResp(null, err));
					});
				*/
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
	}catch(err){
		res.status(400).send(response.initResp(null, err));
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

exports.searchAutoComplete = async(req, res) => {
	let response = new resp();
	let oPostM = new PostModel();
	let query = req.body.queryText;
	let searchResult = null;
	
	try{
		if(query !== undefined && query !== null){
			searchResult = await oPostM.searchAutoComplete(query);
			if(searchResult !== null){
				res.status(200).send(response.initResp({
					queryResult: searchResult
				}));
			}else{
				res.status(404).send(response.initResp({
					queryResult: {}
				}));
			}
		}else{
			res.status(200).send(response.initResp({				
				queryResult: {}
			}));
		}
	}catch(err){
		res.status(500).send(response.initResp(null, err));
	}
};

exports.getFeaturePost = async(req, res) => {
	let oPostM = new PostModel();
	let oFeaturePost = null;
	let response = new resp();

	try{
		oFeaturePost = await oPostM.getFeaturePost();
		res.status(200).send(response.initResp(oFeaturePost));
	}catch(err){
		res.status(500).send(response.initResp(null, err));
	}
};

exports.setFeaturePost = async(req, res, next) => {
	let action = 'write';
	let oPostM = new PostModel();
	let oFeaturePost = null;
	let response = new resp();
	let postACL = {};	
	let postID = req.params.postid;
	let valid_permit = false;

	try{
		if (res.auth_token !== null) {
			postACL = res.auth_token.role.post;
			valid_permit = security.permit(action, postACL.acl);
			if (valid_permit) {
				oFeaturePost = await oPostM.setFeaturePost({ PostID: postID });
				res.status(200).send(response.initResp(oFeaturePost));
			}else {
				return next({
					message: 'Unauthorized access api',
					api: true,
					code: 401
				});
			}
		} else {
			return next({
				message: 'Unauthorized access api',
				api: true,
				code: 401
			});
		}
		//}
	}catch(err){
		if(err.code !== undefined){
			if(err.code === 'FEATURE_NO_IMG'){
				res.status(200).send(response.initResp(null, err));
			}
		}else{
			res.status(400).send(response.initResp(null, err));
		}
	}
};

exports.rmvFeaturePost = async(req, res, next) => {
	let action = 'delete';
	let oPostM = new PostModel();
	let oFeaturePost = null;
	let response = new resp();
	let postACL = {};	
	let postID = req.params.postid;
	let valid_permit = false;

	try{
		if (res.auth_token !== null) {
			postACL = res.auth_token.role.post;
			valid_permit = security.permit(action, postACL.acl);
			if (valid_permit) {
				oFeaturePost = await oPostM.removeFeaturePost({ PostID: postID });
				res.status(200).send(response.initResp(oFeaturePost));
			} else {				
				return next({
					message: 'Unauthorized access api',
					api: true,
					code: 401
				});
			}
		}
	}catch(err){
		res.status(500).send(response.initResp(null, err));
	}
};

/**Web Route */
exports.webGetPost = async (req, res, next) => {
	let oPostM = new PostModel();
	let oCat = new CategoryModel();
	let jsonReturn = null;
	let oPostView = null;
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
	let oCategories = await oCat.getAllCatories();
	if(oPostResult !== null){
		if(oPostResult.PostID !== undefined){
			oPostView	= await oPostM.increasePostView(oPostResult.PostID);
		}
	}

	jsonReturn = {
		baseUrl: config[config.environment].base_url,
		post: oPostResult,
		category: oCategories,
		blog: {
			title: config[config.environment].app_name,
			brand_title: config[config.environment].app_name,
			brand_tagline: config[config.environment].app_desc,
		},
		//profiler: true
	};

	if(oPostResult !== null){
		let jsonContent = JSON.parse(oPostResult.content);
		let html = convertDeltaToHtml(jsonContent);
		oPostResult.content = html;		
		res.render('../views/app/web/post/web-post', {data: jsonReturn});		
	}else{
		res.status(404);
		next();
	}
};

/**Web Route */
exports.webGetAllPosts = async (req, res, next) => {	
	let oSettingM = new SettingModel();
	let oPostM = new PostModel();
	let oRecentPost, jsonReturn, oSettings = null;
	let pageNum = req.params.pagenum;
	let pageCount = 1;
	let postPerPage = 2;
	let category = req.query.category !== undefined? req.query.category: '';

	try{
		if(req.params.pagenum === undefined){
			pageNum = 1;
		}
		pageNum = pageNum - 1;

		if(category !== ''){
			console.log('cat here');
			pageCount = await oPostM.countPostsWithCategory(1, {category: category});
			pageCount = pageCount / postPerPage;
			pageCount = Math.round(pageCount);
		}else{
			pageCount = await oPostM.countPost(1);
			pageCount = pageCount / postPerPage;
			pageCount = Math.round(pageCount);			
		}
		console.log('category: %s', category);
		
		//get recent post
		oRecentPost = await oPostM.paginatePost(pageNum, 1, postPerPage, {category: category});

		//get system setting
		oSettings = await oSettingM.getBlogSetting({active: 1});

		jsonReturn = {
			blog: {
				title: config[config.environment].app_name,
				brand_title: config[config.environment].app_name,
				brand_tagline: config[config.environment].app_desc,
			},
			setting: oSettings,
			recent_post: oRecentPost,
			page_num: pageNum + 1,
			page_count: pageCount,
			category: category
			//profiler: true
		};		

		res.render('../views/app/web/post/web-posts', {data: jsonReturn});
	}catch(err){
		next(err);
	}
};