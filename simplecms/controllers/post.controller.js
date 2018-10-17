//Application Model
const PostModel = require('../models/post_es5.model');

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