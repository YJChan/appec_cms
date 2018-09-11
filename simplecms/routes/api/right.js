const {Admin} = require('../../models/sqlite/sqliteModel');
const {Right} = require('../../models/sqlite/sqliteModel');
const {Role} = require('../../models/sqlite/sqliteModel');
const {db} = require('../../models/db');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const validator = require('validator');
const utils = require('../../utils/utils');
const security = require('../../utils/security');
var resp = require('../../utils/resp');
const rQry = require('../../models/sqlite/rawSQL');
const roleIds = require('../../config/roles.json');
var _ = require('lodash');

router.use(bodyParser.json());

router.get('/:roleid', isAuthenticated, (req, res, next) => {
  var action = "read";
  var response = new resp();

  if(res.auth_token !== null){
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.right.acl);
    if(validPermit){
      var roleId = req.params.roleid;

      var mRight = {
        RoleID: roleId
      };

      Right.findAll({
        where: mRight
      }).then(rights => {
        res.status(200).send(response.initResp(rights));
      }).catch((e) => {
        res.status(400).send(response.initResp(null, {
          msg: 'There is no rights assigned to this roles',
          status: true,
          code: 400
        }));
      });
    }
  }else{
    res.status(400).send(response.unAuthResp());
  }
});

//POST create new rights, 
//params @JSON.stringify array of objects
router.patch('/:rightid', isAuthenticated, (req, res, next) => {
  var action = "write";
  if(! security.isUUID(req.params.rightid)){
    var response = new resp();
    res.status(400).send(response.initResp(null, {
      msg: 'Invalid ID pass in!',
      code: 400,
      status: true
    }));
  }

  if(res.auth_token !== null){
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.right.acl);
    if (validPermit) {
      //var mRight = JSON.parse(req.body.rights);
      var mRight = {
        RightID: req.params.rightid
      };

      var mRightUpdate = {};
      for(var key in req.body){
        if(req.body.hasOwnProperty(key)){
          if(key.toUpperCase() === "MODULE"){
            mRightUpdate['module'] = {
              val: req.body.module,
                type: 'string',
                check: true
            }
          }else if(key.toUpperCase() === "SECTION"){
            mRightUpdate['section'] = {
              val: req.body.section,
              type: 'string',
              check: true 
            }
          }else if(key.toUpperCase() === "ACL"){
            mRightUpdate['acl'] = {
              val: req.body.acl,
              type: 'integer',
              check: true
            }
          }
        }
      }

      security.validate(mRightUpdate, (err, mRightValidated) => {
        if(err) next(err);
        var response = new resp();

        if(mRightValidated !== null){
          Right.findOne({
            where: mRight
          }).then(right => {
              right.update(mRightValidated).then(mRightUpdated =>{
                response.initResp(mRightUpdated);
                res.status(200).send(response);
              }).catch((e) => {
                response.initResp(null, e);
                res.status(400).send(response);
              });                                          
          });
        }else{
          res.status(400).send(null, {
            msg: 'Sequelize cannot create right object!',
            code: 400,
            status: true
          });
        }
      });
    } 
  }else{
    var response = new resp();
    res.status(400).send(response.unAuthResp());
  }
});

router.post('/', isAuthenticated, (req, res, next) => {
  var action = "write";

  if (res.auth_token !== null) {
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.right.acl);
    if (validPermit) {
      var mRight = JSON.parse(req.body.rights);

      security.validateMore(mRight, (err, mRightValidated) => {
        if (err) next(err);
        var response = new resp();

        if (mRightValidated !== null) {
          Right.bulkCreate(mRightValidated)
            .then(affectedRows => {

              if (affectedRows.length > 0) {
                response.initResp(affectedRows);
              } else {
                response.initResp(null, {
                  msg: 'No rights is created'
                });
              }
              res.status(200).send(response);
            });
        } else {
          res.status(400).send(null, {
            msg: 'Sequelize cannot create right object!',
            code: 400,
            status: true
          });
        }
      });
    }
  } else {
    var response = new resp();
    res.status(400).send(response.unAuthResp());
  }
});

router.delete('/', isAuthenticated, (req, res, next) => {
  var action = "delete";
  var response = new resp();

  if(res.auth_token !== null){
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.right.acl);
    if(validPermit){
      if(security.isUUID(req.body.right_id)){
        var mRight = {
          RightID: req.body.right_id
        };

        Right.findOne({
          where: mRight
        }).then(right => {
          if(right !== null){
            right.destroy();
          }
          res.status(200).send(response.initResp("Successfully deleted this right!",
            null, {
              msg: 'successfully deleted admin',
              code: 200,
              status: true
            }));
        });
      }
    }else{
      res.status(401).send(response.unAuthResp());
    }
  }else{
    res.status(401).send(response.unAuthResp());
  }
});

function isAuthenticated(req, res, next) {
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
        return next();
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

module.exports = router;
