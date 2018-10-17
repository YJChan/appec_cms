'use strict';
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

	postParam(withId = true) {
		return {
			PostID: withId ? 'POST-' + utils.guid(): {val: '', type: 'nullable', check: false, exclude: true},
			content: {
				name: 'content',
				val: '',
				type: 'empty',
				check: true
			},
			active: {
				val: 0,
				type: 'integer',
				check: true
			},
			publishDate: {
				val: new Date().toLocaleString(),
				type: 'date',
				check: true
			},
			visibility: {
				val: 0,
				type: 'integer',
				check: true
			},
			views: 0,
			allowComment: {
				val: 1,
				type: 'integer',
				check: true
			},
			metaTag: {
				val: '',
				type: 'empty',
				check: true
			},
			createdBy: {
				val: '',
				type: 'NULLABLE',
				check: true
			},
			UserID: {
				val: '',
				type: 'uuid',
				check: true
			}
		};
	}
}

module.exports = PostModel;