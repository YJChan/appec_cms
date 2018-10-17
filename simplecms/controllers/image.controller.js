//Application Model
const ImageModel = require('../models/image.model');
//helper
const security = require('../utils/security');
const resp = require('../utils/resp');
const supp = require('../utils/supp');
const fs = require('fs');
const path = require('path');
const utils = require('../utils/utils');

/**
 * Create new Post
 * @param {*} req 
 * Object {
 * destination: "/home/yongjia/Documents/node-js-project/appec/appec_cms/simplecms/routes/api/../../public/images/uploads/"
 * encoding: "7bit",
 * fieldname: "image",
 * filename: "9ee7086805f9090300db683c123bba9a",
 * mimetype: "image/jpeg",
 * originalname: "1346315K2-8.jpg",
 * path: "/home/yongjia/Documents/node-js-project/appec/appec_cms/simplecms/routes/api/public/images/uploads/9ee7086805f9090300db683c123bba9a"
 * size: 16263
 * }
 */
exports.uploadImage = (req, res, next) => {
	let response = new resp();
	let oImageM = new ImageModel();	
	let uploadedFile = req.file;

	let oImageReq = {
		ImageID: 'IMG-' + utils.guid(),
		inDb: '',
		fileType: uploadedFile.mimetype,
		fileSize: uploadedFile.size,
		filename: uploadedFile.filename,
		binaryFile: '',
		filePath: '/public/images/uploads'
	};

	oImageM.uploadImage(oImageReq)		
		.then(oImageUploaded => {
			if (oImageReq.ImageID !== undefined) {
				res.status(200).send(response.initResp(oImageUploaded));
			} else {
				res.status(400).send(response.initResp(null, {
					message: 'Unable to create image record',
					code: 400,
					status: true,
				}));
			}
		})		
		.catch(error => {
			res.status(400).send(response.initResp(null, error));
		});
};

exports.getImage = (req, res, next) => {
	let response = new resp();
	let imgId = req.params.imgid;
	let oImageM = new ImageModel();
	let oImageReq = {
		ImageID: imgId
	};

	oImageM.queryImage(oImageReq)
		.then(oImageFound => {
			//console.log(path.resolve(__dirname + '/../' + oImageFound.filePath + '/' + oImageFound.filename));
			res.set('Content-Type', oImageFound.fileType);
			res.status(200).sendFile(path.resolve(__dirname + '/../' + oImageFound.filePath + '/' + oImageFound.filename));
		}).catch(err => {
			res.status(400).send(response.initResp(null, err));
		});
};

exports.updateTag = (req, res, next) => {
	let response = new resp();
	let oTagM = new ImageModel();
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
	let oTagM = new ImageModel();
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
	let oTagM = new ImageModel();
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

