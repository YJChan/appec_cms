//Application Model
const TagModel = require('../models/tag.model');
//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');

/**
 * Create new Post
 */
exports.createTag = (req, res, next) => {
	let response = new resp();
	let oTagM = new TagModel();
	let oTagReq = oTagM.tagParam();

	try {
		supp.prepareBodyReq(req, oTagReq)
			.then(oTagValidated => oTagM.createTag(oTagValidated))
			.then(oTagRec => {				
				res.status(200).send(response.initResp(oTagRec));
			})
			.catch(error => {				
				res.status(400).send(response.initResp(null, error));
			});
	} catch (err) {
		return next(err);
	}
};

exports.updateTag = (req, res, next) => {
	let response = new resp();
	let oTagM = new TagModel();
	let oTagReq = oTagM.tagParam(false);
	let tagId = req.params.tagid;

	try {
		oTagReq = oTagM.determineWhatToUpdate(req, oTagReq);
		supp.prepareBodyReq(req, oTagReq)
			.then(oTagValidated => oTagM.updateTag(oTagValidated, tagId))
			.then(oTagRec => {				
				res.status(200).send(response.initResp(oTagRec));
			})
			.catch(err => {				
				res.status(400).send(response.initResp(null, err));
			});
	} catch (err) {
		return next(err);
	}
};

exports.deleteTag = (req, res, next) => {
	let action = 'delete';
	let postACL = {};
	let valid_permit = false;
	let response = new resp();
	let oTagM = new TagModel();
	let tagId = req.params.tagid;

	try {
		if (res.auth_token !== null) {
			postACL = res.auth_token.role.post;
			valid_permit = security.permit(action, postACL.acl);
			if (valid_permit) {
				oTagM.deleteTag(tagId)
					.then(oTagRec => {
						res.status(200).send(response.initResp(oTagRec));
					})
					.catch(err => {
						res.status(400).send(response.initResp(null, err));
					});
			} else {
				res.status(401).send(response.unAuthResp());
			}
		} else {
			res.status(401).send(response.unAuthResp());
		}
	} catch (err) {
		return next(err);
	}
};

exports.getTags = (req, res, next) => {
	let response = new resp();
	let oTagM = new TagModel();
	let oTagReq = oTagM.tagParam(false);
	let urlParam = req.params.all;

	try {
		if (urlParam === undefined || urlParam === null) {
			oTagReq = oTagM.determineWhatToSearch(req, oTagReq);
			supp.prepareQryReq(req, oTagReq)
				.then(oCondValidated => oTagM.getTag(oCondValidated))
				.then(oCatRecs => {
					res.status(200).send(response.initResp(oCatRecs));
				})
				.catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
		} else {
			oTagM.getAllTags()
				.then(oTags => {
					res.status(200).send(response.initResp(oTags));
				})
				.catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
		}
	} catch (err) {
		return next(err);
	}
};