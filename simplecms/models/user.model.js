'use strict';
//Sequelize Model
const {User} = require('./sqlite/sqliteModel');
const {Admin} = require('./sqlite/sqliteModel');
const {db} = require('./db');

const utils = require('../utils/utils');
const Op = db.Op;

class UserModel {  
	constructor() {
		this.USERTYPE = 'USER';
		this.ADMINTYPE = 'ADMIN';
	}	

	/**
   * Update Category of User's Post
   * @param {Object} oUser
   * @param {string} oUser.catname - category name
   * @param {string} oUser.createdBy - creator
   * @param {string} UserId 
   */
	updateUser(oUserUpadate, UserId) {
		return new Promise((resolve, reject) => {
			User.findOne({
				where: {
					UserID: UserId
				}
			}).then(oUser => {
				oUser.update(oUserUpadate).then(oUserSaved => {
					resolve(oUserSaved);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
   * Soft delete the category
   * @param {string} UserId 
   */
	deleteUser(UserId) {
		return new Promise((resolve, reject) => {
			User.findOne({
				where: {
					UserID: UserId
				}
			}).then(oUser => {
				oUser.update({
					active: 0
				}).then(oUserDeleted => {
					resolve(oUserDeleted);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}


	async getAuthorCount(authorId){
		let userCount = 0;
		let adminCount = 0;

		let findUser = new Promise((resolve, reject) => {
			let authorIdToFind = authorId;
			User.findAndCountAll({
				where: {
					UserID: authorIdToFind
				}
			}).then(userCount => {
				resolve(userCount.count);
			}).catch(err => {
				reject(err);
			});
		});

		let findAdmin = new Promise((resolve, reject) => {
			let authorIdToFind = authorId;
			Admin.findAndCountAll({
				where: {
					AdminID: authorIdToFind
				}
			}).then(adminCount => {
				resolve(adminCount.count);
			}).catch(err => {
				reject(err);
			});
		});
		userCount = await findUser;
		adminCount = await findAdmin;

		return {user: userCount, admin: adminCount};
	} 

	/**
   * Get alist of categories
   * @param {string} authorId
   */
	async getMe(authorId, userType) {
		let getAuthorInfo = new Promise((resolve, reject) => {      			
			if (userType === this.USERTYPE) {
				User.findOne({
					where: {
						UserID: authorId
					}
				}).then(oUser => {
					resolve(oUser);
				}).catch(err => {
					reject(err);
				});
			}else if(userType === this.ADMINTYPE){
				Admin.findOne({
					where: {
						AdminID: authorId
					},
					attributes:['AdminEmail', 'AdminName', 'AdminID', 'RoleID']
				}).then(oAdmin => {
					resolve(oAdmin);
				}).catch(err => {
					reject(err);
				});
			}
		});		
		let authorInfo = await getAuthorInfo;

		return authorInfo;
	}
  
	/**
   * Check on what parameter has been passed from front end
   * @param  {Object} req
   * @param  {Object} oUserReq
   */
	determineWhatToUpdate(req, oUserReq) {
		let param = '';
		let isExist = false;
		for (var key in oUserReq) {
			if (req.body.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {
					oUserReq[key].exclude = false;
					oUserReq[key].check = true;
				} else {
					oUserReq[key].exclude = true;
					oUserReq[key].check = false;
				}
			} else {
				oUserReq[key].exclude = true;
				oUserReq[key].check = false;
			}
		}
		return oUserReq;
	}

	/**
   * Check on what condition to search
   * @param {Object} req 
   * @param {Object} oUserReq 
   */
	determineWhatToSearch(req, oUserReq) {
		let param = '';
		let isExist = false;
		for (var key in oUserReq) {
			if (req.query.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {
					oUserReq[key].exclude = false;
					oUserReq[key].check = true;
				} else {
					oUserReq[key].exclude = true;
					oUserReq[key].check = false;
				}
			} else {
				oUserReq[key].exclude = true;
				oUserReq[key].check = false;
			}
		}
		return oUserReq;
	}

	IsParamExist(paramName) {
		if (paramName === 'UserNAME') {
			return true;
		} else if (paramName === 'ACTIVE') {
			return true;
		} else if (paramName === 'CREATEDBY') {
			return true;
		} else {
			return false;
		}
	}

	UserParam(withID = true) {
		return {
			UserID: withID ? 'User-' + utils.guid() : {
				val: '',
				type: 'nullable',
				check: false,
				exclude: true
			},
			Username: {
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

module.exports = UserModel;