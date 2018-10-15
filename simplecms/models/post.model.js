"use strict";
//Sequelize Model
const {Admin} = require('../models/sqlite/sqliteModel');
const {Right} = require('../models/sqlite/sqliteModel');
const {Role} = require('../models/sqlite/sqliteModel');
const {Session} = require('../models/sqlite/sqliteModel');
const {Post} = require('../models/sqlite/sqliteModel');

const utils = require('../utils/utils');
const {db} = require('../models/db');
const rQry = require('../models/sqlite/rawSQL');

class PostModel{
  constructor() {

  }

  createPost(oPost){
    return new Promise((resolve, reject) => {
      Post.create(oPost)
      .then(oPostCreated => {
        resolve(oPostCreated.get({
            plain: true
          }))
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