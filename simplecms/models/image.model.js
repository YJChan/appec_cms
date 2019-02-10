'use strict';
//Sequelize Model
const {Image} = require('./sqlite/sqliteModel');
const {db} = require('./db');

const utils = require('../utils/utils');
const Op = db.Op;

class ImageModel {
	constructor() {

	}

	/**
   * Create new category for user post
   * @param {Object} oImage
   * @param {Object} oImage.catname - category name
   * @param {Object} oImage.createdBy - creator
   */
	uploadImage(oImage) {
		return new Promise((resolve, reject) => {      
			Image.create(oImage)
				.then(oImageCreated => {
					resolve(oImageCreated.get({
						plain: true
					}));
				})
				.catch(err => {
					reject(err);
				});
		});
	}


	queryImage(oImage){
		return new Promise((resolve, reject) => {
			Image.findOne({
				where: oImage
			}).then(oImageFound => {
				resolve(oImageFound);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
   * Update Category of User's Post
   * @param {Object} oImage
   * @param {string} oImage.catname - category name
   * @param {string} oImage.createdBy - creator
   * @param {string} ImageId 
   */
	updateImage(oImageUpadate, ImageId) {
		return new Promise((resolve, reject) => {
			Image.findOne({
				where: {
					ImageID: ImageId
				}
			}).then(oImage => {
				oImage.update(oImageUpadate).then(oImageSaved => {
					resolve(oImageSaved);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
   * Soft delete the category
   * @param {string} ImageId 
   */
	deleteImage(ImageId) {
		return new Promise((resolve, reject) => {
			Image.findOne({
				where: {
					ImageID: ImageId
				}
			}).then(oImage => {
				oImage.update({
					active: 0
				}).then(oImageDeleted => {
					resolve(oImageDeleted);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
   * Get alist of categories
   * @param {Object} whereCond 
   * @param {string} whereCond.active
   * @param {string} whereCond.catname
   * @param {string} whereCond.creator
   */
	getImage(whereCond) {
		return new Promise((resolve, reject) => {
			if (whereCond.Imagename !== undefined && whereCond.Imagename !== null) {
				whereCond.Imagename = {
					[Op.like]: '%' + whereCond.Imagename + '%'
				};
			}
			if (whereCond.createdby !== undefined && whereCond.createdby !== null) {
				whereCond.createdby = {
					[Op.like]: '%' + whereCond.createdby + '%'
				};
			}
			Image.findAll({
				where: whereCond
			}).then(oImage => {
				resolve(oImage);
			}).catch(err => {
				reject(err);
			});
		});
	}
	/**
   * Get all Images created
   */
	getAllImages() {
		return new Promise((resolve, reject) => {
			Image.findAll()
				.then(oImages => {
					resolve(oImages);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	getImageByImageID(imgID){
		return new Promise((resolve, reject) => {
			Image.findOne({
				where: {ImageID: imgID}
			}).then(oImage => {
				resolve(oImage);
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	/**
   * Check on what parameter has been passed from front end
   * @param  {Object} req
   * @param  {Object} oImageReq
   */
	determineWhatToUpdate(req, oImageReq) {
		let param = '';
		let isExist = false;
		for (var key in oImageReq) {
			if (req.body.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {
					oImageReq[key].exclude = false;
					oImageReq[key].check = true;
				} else {
					oImageReq[key].exclude = true;
					oImageReq[key].check = false;
				}
			} else {
				oImageReq[key].exclude = true;
				oImageReq[key].check = false;
			}
		}
		return oImageReq;
	}

	/**
   * Check on what condition to search
   * @param {Object} req 
   * @param {Object} oImageReq 
   */
	determineWhatToSearch(req, oImageReq) {
		let param = '';
		let isExist = false;
		for (var key in oImageReq) {
			if (req.query.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {
					oImageReq[key].exclude = false;
					oImageReq[key].check = true;
				} else {
					oImageReq[key].exclude = true;
					oImageReq[key].check = false;
				}
			} else {
				oImageReq[key].exclude = true;
				oImageReq[key].check = false;
			}
		}
		return oImageReq;
	}

	IsParamExist(paramName) {
		if (paramName === 'ImageNAME') {
			return true;
		} else if (paramName === 'ACTIVE') {
			return true;
		} else if (paramName === 'CREATEDBY') {
			return true;
		} else {
			return false;
		}
	}

	imageParam(withID = true) {
		return {
			ImageID: withID ? 'IMG-' + utils.guid() : {
				val: '',
				type: 'nullable',
				check: false,
				exclude: true
			},
			inDb: {
				val: '',
				type: 'nullable',
				check: false,
				exclude: true
			},
			fileType: {
				val: '',
				type: 'string',
				check: true,
				exclude: false
			},
			fileSize: {
				val: '',
				type: 'integer',
				check: true,
				exclude: false
			},
			filename: {
				val: '',
				type: 'string',
				check: true,
				exclude: false
			},
			filePath: {
				val: '',
				type: 'string',
				check: true,
				exclude: false
			},
			binaryFile:{
				val: '',
				type: 'string',
				check: false,
				exclude: true
			},
			url: {
				val: '',
				type: 'string',
				check: true,
				exclude: false
			}
		};
	}
}

module.exports = ImageModel;