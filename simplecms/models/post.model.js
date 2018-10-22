//Sequelize Model
const {Admin} = require('./sqlite/sqliteModel');
const {Right} = require('./sqlite/sqliteModel');
const {Role} = require('./sqlite/sqliteModel');
const {Session} = require('./sqlite/sqliteModel');
const {Post} = require('./sqlite/sqliteModel');

const utils = require('../utils/utils');
const {db} = require('./db');
const rQry = require('./sqlite/rawSQL');
const Op = db.Op;

class PostModel{
	constructor() {

	}
	/**
	 * @param  {} oPost
	 */
	createPost(oPost){
		return new Promise((resolve, reject) => {
			Post.create(oPost)
				.then(oPostCreated => {
					resolve(oPostCreated.get({
						plain: true
					}));
				})
				.catch(err =>{
					reject(err);
				});
		});
	}

	
	/**
	 * @param  {} oPost
	 */
	getPost(oPost){
		return new Promise((resolve, reject) => {
			Post.findOne({
				where: oPost
			}).then(oPostGet => {
				resolve(oPostGet);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * @param  {} oPost
	 * @param  {} PostId
	 */
	updatePost(oPost, PostId){
		return new Promise((resolve, reject) => {
			Post.findOne({
				where: {
					PostID: PostId
				}
			}).then(oPostToSave => {
				oPostToSave.update(oPost)
					.then(oPostSaved => {
						resolve(oPostSaved);
					})
					.catch(err => {
						reject(err);
					});
			}).catch(err => {
				reject(err);
			});
		});
	}

	increasePostView(PostId){
		let numOfViews = 0;
		return new Promise((resolve, reject) => {
			Post.findOne({
				where: {
					PostId: PostId
				},
				attributes: ['views', 'PostID']
			}).then(oPostIncreaseView => {
				numOfViews = oPostIncreaseView.views;
				numOfViews += 1;
				oPostIncreaseView.update({
					views: numOfViews
				}).then(oPostSaved => {
					resolve(oPostSaved);
				}).catch(err => {
					reject(err);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Check on what parameter has been passed from front end
	 * @param  {Object} req
	 * @param  {Object} oPostReq
	 */
	determineWhatToUpdate(req, oPostReq) {
		let param = '';
		let isExist = false;
		for (var key in oPostReq) {
			if (req.body.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {
					oPostReq[key].exclude = false;
					oPostReq[key].check = true;
				} else {
					oPostReq[key].exclude = true;
					oPostReq[key].check = false;
				}
			} else {
				oPostReq[key].exclude = true;
				oPostReq[key].check = false;
			}
		}
		return oPostReq;
	}

	
	/**
	 * To check the value that exist in param
	 * @param  {} paramName
	 */
	IsParamExist(paramName) {
		let isExist = false;

		switch(paramName) {
		case 'CONTENT':
			isExist = true;
			break;
		case 'ACTIVE':
			isExist = true;
			break;
		case 'PUBLISHDATE':
			isExist = true;
			break;
		case 'VISIBILITY':
			isExist = true;
			break;
		case 'ALLOWCOMMENT':
			isExist = true;
			break;
		case 'METATAG':
			isExist = true;
			break;
		case 'CREATEDBY':
			isExist = true;
			break;
		case 'USERID':
			isExist = true;
			break;
		case 'ADMINID':
			isExist = true;
			break;
		default:
			isExist = false;
		}
		return isExist;
	}


	postParam(withId = true) {
		return {
			PostID: withId ? `POST-${utils.guid()}`: {val: '', type: 'nullable', check: false, exclude: true},
			content: {				
				val: '',
				type: 'empty',
				check: true,
				exclude: false
			},
			active: {
				val: 0,
				type: 'integer',
				check: true,
				exclude: false
			},
			publishDate: {
				val: new Date().toLocaleString(),
				type: 'date',
				check: true,
				exclude: false
			},
			visibility: {
				val: 0,
				type: 'integer',
				check: true,
				exclude: false
			},			
			allowComment: {
				val: 1,
				type: 'integer',
				check: true,
				exclude: false
			},
			metaTag: {
				val: '',
				type: 'empty',
				check: true,
				exclude: false
			},
			createdBy: {
				val: '',
				type: 'NULLABLE',
				check: true,
				exclude: false
			},
			UserID: {
				val: '',
				type: 'uuid',
				check: true,
				exclude: false
			},
			AdminID: {
				val: '',
				type: 'uuid',
				check: true,
				exclude: false
			}
		};
	}
}

module.exports = PostModel;