//Application Model
const CategoryModel = require('../models/category.model');
//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');

/**
 * Create new Post
 */
exports.createCategory = (req, res, next) => {  
	let response = new resp();  
	let oCatM = new CategoryModel();
	let oCatReq = oCatM.categoryParam();
  
	try{
		supp.prepareBodyReq(req, oCatReq)
			.then(oCatValidated => oCatM.createCategory(oCatValidated))
			.then(oCatRec => {
				//console.log(oCatRec);
				res.status(200).send(response.initResp(oCatRec));
			})
			.catch(error => {
				//console.log(error);
				res.status(400).send(response.initResp(null, error));
			});    
	} catch(err){
		return next(err);
	}
};

exports.updateCategory = (req, res, next) => {
	let response = new resp();
	let oCatM = new CategoryModel();
	let oCatReq = oCatM.categoryParam(false);
	let catId = req.params.catid;

	try{
		oCatReq = oCatM.determineWhatToUpdate(req, oCatReq);
		supp.prepareBodyReq(req, oCatReq)
			.then(oCatValidated => oCatM.updateCategory(oCatValidated, catId))
			.then(oCatRec => {
				//console.log(oCatRec);
				res.status(200).send(response.initResp(oCatRec));
			})
			.catch(err => {
				//console.log(err);
				res.status(400).send(response.initResp(null, err));
			});
	}catch(err){
		return next(err);
	}
};

exports.deleteCategory = (req, res, next) => {
	let action = 'delete';  
	let postACL = {};
	let valid_permit = false;    
	let response = new resp();
	let oCatM = new CategoryModel();  
	let catId = req.params.catid;

	try {
		if(res.auth_token !== null){
			postACL = res.auth_token.role.post;
			valid_permit = security.permit(action, postACL.acl);
			if(valid_permit){
				oCatM.deleteCategory(catId)
					.then(oCatRec => {
						res.status(200).send(response.initResp(oCatRec));
					})
					.catch(err => {
						res.status(400).send(response.initResp(null, err));
					});
			}else{
				res.status(401).send(response.unAuthResp());
			}
		}else{
			res.status(401).send(response.unAuthResp());
		}    
	} catch (err) {
		return next(err);
	}
};

exports.getCategories = (req, res, next) => {
	let response = new resp();
	let oCatM = new CategoryModel();
	let oCatReq = oCatM.categoryParam(false);
	let urlParam = req.params.all;

	try{
		if(urlParam === undefined || urlParam === null){
			oCatReq = oCatM.determineWhatToSearch(req, oCatReq);
			supp.prepareQryReq(req, oCatReq)    
				.then(oCondValidated => oCatM.getCategory(oCondValidated))
				.then(oCatRecs =>{
					res.status(200).send(response.initResp(oCatRecs));
				})
				.catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
		} else {
			oCatM.getAllCatories()
				.then(oCategories => {
					res.status(200).send(response.initResp(oCategories));
				})
				.catch(err => {
					res.status(400).send(response.initResp(null, err));
				});
		}
	}catch(err){
		return next(err);
	}
};