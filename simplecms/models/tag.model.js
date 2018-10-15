'use strict';
//Sequelize Model
const {Tag} = require('./sqlite/sqliteModel');
const {db} = require('./db');

const utils = require('../utils/utils');
const Op = db.Op;

class TagModel {
	constructor() {

	}

	/**
   * Create new category for user post
   * @param {Object} oTag
   * @param {Object} oTag.catname - category name
   * @param {Object} oTag.createdBy - creator
   */
	createTag(oTag) {
		return new Promise((resolve, reject) => {
			Tag.create(oTag)
				.then(oTagCreated => {
					resolve(oTagCreated.get({
						plain: true
					}));
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	/**
   * Update Category of User's Post
   * @param {Object} oTag
   * @param {string} oTag.catname - category name
   * @param {string} oTag.createdBy - creator
   * @param {string} tagId 
   */
	updateTag(oTag, tagId){
		return new Promise((resolve, reject) => {
			Tag.findOne({
				where: {TagID: tagId}
			}).then(oTag => {
				oTag.update(oTag).then(oTagSaved => {
					resolve(oTagSaved);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
   * Soft delete the category
   * @param {string} tagId 
   */
	deleteTag(tagId){
		return new Promise((resolve, reject) => {
			Tag.findOne({
				where: {TagID: tagId}
			}).then(oTag => {
				oTag.update({active: 0}).then(oTagDeleted => {
					resolve(oTagDeleted);
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
	getTag(whereCond){
		return new Promise((resolve, reject) => {
			if(whereCond.tagname !== undefined && whereCond.tagname !== null){
				whereCond.tagname = {
					[Op.like]: '%' + whereCond.tagname + '%'
				};
			}
			if (whereCond.createdby !== undefined && whereCond.createdby !== null) {
				whereCond.createdby = {
					[Op.like]: '%' + whereCond.createdby + '%'
				};
			}
			Tag.findAll({
				where: whereCond
			}).then(oTag => {
				resolve(oTag);
			}).catch(err => {
				reject(err);
			});
		});
	}
	/**
   * Get all tags created
   */
	getAllTags(){
		return new Promise((resolve, reject) => {
			Tag.findAll()
				.then(oTags => {
					resolve(oTags);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	/**
   * Check on what parameter has been passed from front end
   * @param  {Object} req
   * @param  {Object} oTagReq
   */
	determineWhatToUpdate(req, oTagReq){
		let param = '';
		let isExist = false;
		for (var key in oTagReq) {
			if (req.body.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if(isExist){
					oTagReq[key].exclude = false;
					oTagReq[key].check = true;
				}else{
					oTagReq[key].exclude = true;
					oTagReq[key].check = false;
				}
			}else{
				oTagReq[key].exclude = true;
				oTagReq[key].check = false;
			}
		}
		return oTagReq;
	}

	/**
   * Check on what condition to search
   * @param {Object} req 
   * @param {Object} oTagReq 
   */
	determineWhatToSearch(req, oTagReq) {
		let param = '';
		let isExist = false;
		for (var key in oTagReq) {
			if (req.query.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {          
					oTagReq[key].exclude = false;
					oTagReq[key].check = true;
				} else {
					oTagReq[key].exclude = true;
					oTagReq[key].check = false;
				}
			} else {
				oTagReq[key].exclude = true;
				oTagReq[key].check = false;
			}
		}
		return oTagReq;
	}

	IsParamExist(paramName) {
		if(paramName === 'TAGNAME'){
			return true;
		}else if(paramName === 'ACTIVE') {
			return true;
		}else if(paramName === 'CREATEDBY'){
			return true;
		}else{
			return false;
		}
	}

	categoryParam(withID = true) {
		return {
			TagID: withID ? 'TAG-' + utils.guid() : {val: '', type: 'nullable', check: false, exclude: true},
			tagname: {        
				val: '',
				type: 'empty',
				check: true,
				exclude: false
			},
			createdBy: {        
				val: '',
				type: 'nullable',
				check: true,
				exclude: false
			},
			active: {
				val: 1,
				type: 'integer',
				check: true,
				exclude: false
			}
		};
	}
}

module.exports = TagModel;