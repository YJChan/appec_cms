'use strict';
//Sequelize Model
const {Setting} = require('./sqlite/sqliteModel');
const {db} = require('./db');

const config = require('../config/config.json');
const utils = require('../utils/utils');
const Op = db.Op;
const env = config['environment'];
const oSettingDefault ={
	SettingID: 'SET-' + utils.guid(),
	SiteName: config[env].app_name,
	SiteLogo: '',
	SiteCover: '',
	masterEmail: '',
	memberShip: 0,
	dateFormat: 'UTC',
	mailServer: '',
	mailLoginName: '',
	mailLoginPassword: '',
	termService: '',
	numberOfPost: 5,
	showDateInPost: 1,
	active: 1,
	maintenance: 0,
	theme: ''	
};

class SettingModel {
	constructor() {
		
	}

	/**
   * @param  {Object} oSetting
   */
	getBlogSetting(whereCond = {}){
		return new Promise((resolve, reject) => {
			Setting.findOne({
				where: whereCond
			}).then(oSettings => {
				resolve(oSettings);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
   * @param  {Object} oSetting
   */
	setBlogSetting(oSetting){
		return new Promise((resolve, reject) => {			
			Setting.create(oSetting)
				.then(oSettingSaved => {
					resolve(oSettingSaved);
				}).catch(err => {
					reject(err);
				});
		});
	}
	
	resetBlogSetting(){
		return new Promise((resolve, reject) => {			
			Setting.create(oSettingDefault)
				.then(oSettingSaved => {
					resolve(oSettingSaved);
				}).catch(err => {
					reject(err);
				});
		});
	}

}

module.exports = SettingModel;