const {Admin} = require('../../models/sqlite/sqliteModel');
const {Right} = require('../../models/sqlite/sqliteModel');
const {Role} = require('../../models/sqlite/sqliteModel');
const {Session} = require('../../models/sqlite/sqliteModel');
const {Post} = require('../../models/sqlite/sqliteModel');
const {db} = require('../../models/db');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const validator = require('validator');
const utils = require('../../utils/utils');
const security = require('../../utils/security');
var resp = require('../../utils/resp');
const rQry = require('../../models/sqlite/rawSQL');
const config = require('../../config/config.json');
const supp = require('../../utils/supp');
const _ = require('lodash');
const PostController = require('../../controllers/post.controller');
router.use(bodyParser.json());

let fTagParam = function(){
  return {
    TagID: utils.guid(),
    tagname: {
      val: '',
      type: 'empty',
      check: true
    }
  }
};

let fPostImgParam = function(){
  return {
    ImageID: utils.guid(),
    inDb: 1,
    fileType: '',
    fileSize: 0,
    binaryFile: '',
    filePath: ''
  }
};

let fPostCategoryParam = function(){
  return {
    CatID: utils.guid(),
    catname: {
      val: '',
      type: 'empty',
      check: true
    }
  }
};

let isAuthenticated = function(req, res, next) {
  var token = req.get('Authorization') !== null || req.get('Authorization') !== undefined ? req.get('Authorization') : '';
  if (token.includes("Bearer")) {
    token = token.replace("Bearer ", "");

    res.auth_token = null;
    if (token !== '') {
      security.verifyToken(token, (err, validToken) => {
        if (err) {
          var response = new resp();
          res.status(401).send(response.initResp(null, {
            msg: err.message,
            status: true,
            code: 401,
            reason: err.stack
          }));
        }

        res.auth_token = validToken;
        next();
      });
    } else {
      var response = new resp();
      res.status(401).send(response.unAuthResp());
    }
  } else {
    var response = new resp();
    res.status(401).send(response.unAuthResp());
  }
}

router.post('/', isAuthenticated, PostController.createPost);

/** 
 * @param  {string} PostId (p-id)
 * @param  {string} tags (tag)
 * @param  {string} category (cat)
 * @param  {string} publish-date (pdt)
 * @param  {integer} active (a)
 * @param  {integer} visibility (v)
 * @param  {string} UserID (uid)
 * @param  {string} Username (uname)
 */
router.get('/all', (req, res, next) => {  
  let response = new resp();
  
  for(var key in req.query){

  }
  Post.findAll()
  .then(oPosts => {
    res.status(200).send(response.initResp(oPosts));
  });
});

module.exports = router;