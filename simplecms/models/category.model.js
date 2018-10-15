'use strict';
//Sequelize Model
const {Category} = require('../models/sqlite/sqliteModel');
const {db} = require('../models/db');

const utils = require('../utils/utils');
const Op = db.Op;

class CategoryModel {
	constructor() {

	}

	/**
   * Create new category for user post
   * @param {Object} oCat 
   * @param {Object} oCat.catname - category name
   * @param {Object} oCat.createdBy - creator
   */
	createCategory(oCat) {
		return new Promise((resolve, reject) => {
			Category.create(oCat)
				.then(oCategoryCreated => {
					resolve(oCategoryCreated.get({
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
   * @param {Object} oCat 
   * @param {string} oCat.catname - category name
   * @param {string} oCat.createdBy - creator
   * @param {string} catId 
   */
	updateCategory(oCat, catId){
		return new Promise((resolve, reject) => {
			Category.findOne({
				where: {CatID: catId}
			}).then(oCategory => {
				oCategory.update(oCat).then(oCategorySaved => {
					resolve(oCategorySaved);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
   * Soft delete the category
   * @param {string} catId 
   */
	deleteCategory(catId){
		return new Promise((resolve, reject) => {
			Category.findOne({
				where: {CatID: catId}
			}).then(oCategory => {
				oCategory.update({active: 0}).then(oCategoryDeleted => {
					resolve(oCategoryDeleted);
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
	getCategory(whereCond){
		return new Promise((resolve, reject) => {
			if(whereCond.catname !== undefined && whereCond.catname !== null){
				whereCond.catname = {
					[Op.like]: '%' + whereCond.catname + '%'
				};
			}
			if (whereCond.createdby !== undefined && whereCond.createdby !== null) {
				whereCond.createdby = {
					[Op.like]: '%' + whereCond.createdby + '%'
				};
			}
			Category.findAll({
				where: whereCond
			}).then(oCategories => {
				resolve(oCategories);
			}).catch(err => {
				reject(err);
			});
		});
	}

	getAllCatories(){
		return new Promise((resolve, reject) => {
			Category.findAll()
				.then(oCategories => {
					resolve(oCategories);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	/**
   * Check on what parameter has been passed from front end
   * @param  {Object} req
   * @param  {Object} oCatReq
   */
	determineWhatToUpdate(req, oCatReq){
		let param = '';
		let isExist = false;
		for (var key in oCatReq) {
			if (req.body.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if(isExist){
					oCatReq[key].exclude = false;
					oCatReq[key].check = true;
				}else{
					oCatReq[key].exclude = true;
					oCatReq[key].check = false;
				}
			}else{
				oCatReq[key].exclude = true;
				oCatReq[key].check = false;
			}
		}
		return oCatReq;
	}

	/**
   * Check on what condition to search
   * @param {Object} req 
   * @param {Object} oCatReq 
   */
	determineWhatToSearch(req, oCatReq){
		let param = '';
		let isExist = false;
		for (var key in oCatReq) {
			if (req.query.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {          
					oCatReq[key].exclude = false;
					oCatReq[key].check = true;
				} else {
					oCatReq[key].exclude = true;
					oCatReq[key].check = false;
				}
			} else {
				oCatReq[key].exclude = true;
				oCatReq[key].check = false;
			}
		}
		return oCatReq;
	}

	IsParamExist(paramName) {
		if(paramName === 'CATNAME'){
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
			CatID: withID ? 'CAT-' + utils.guid() : {val: '', type: 'nullable', check: false, exclude: true},
			catname: {        
				val: '',
				type: 'empty',
				check: true,
				exclude: false
			},
			createdby: {        
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

module.exports = CategoryModel;