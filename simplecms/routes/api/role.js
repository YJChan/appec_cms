const {Admin} = require('../../models/sqlite/sqliteModel');
const {Right} = require('../../models/sqlite/sqliteModel');
const {Role} = require('../../models/sqlite/sqliteModel');
const {User} = require('../../models/sqlite/sqliteModel');
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
var path = require('path');
const fs = require('fs');
var _ = require('lodash');

router.use(bodyParser.json());

//get all role
router.get('/all', isAuthenticated, (req, res, next) => {
  var action = "read";
  var response = new resp();

  if (res.auth_token != null) {    
    var role = res.auth_token.role.role;
    var validPermit = security.permit(action, role.acl);
    if (validPermit) {
      Role.findAll().then(roles => {  
        res.status(200).send(response.initResp(roles));
      });
    } else {      
      next(response.unAuthResp());
    }
  }else{    
    res.status(401).send(response.unAuthResp());
  }
});

//create new role
router.post('/', isAuthenticated, (req, res, next) => {
  var action = "write";
  var response = new resp();
  
  if (res.auth_token != null) {
    var role = res.auth_token.role.role;
    var validPermit = security.permit(action, role.acl);
    if (validPermit) {
      mRole = {
        RoleID: utils.guid(),
        Rolename: {
          val: req.body.role_name,
          type: 'string',
          check: true
        },
        active: {
          val: req.body.active,
          type: 'integer',
          check: true
        }             
      };
      // mRight = {
      //   RightID: utils.guid(),
      //   module : {
      //     val: req.body.module,
      //     type: 'string',
      //     check: true
      //   },
      //   section : {
      //     val: req.body.section,
      //     type: 'string',
      //     check: true
      //   },
      //   acl: {
      //     val: req.body.acl,
      //     type: 'integer',
      //     check: true
      //   }
      // };

      security.validate(mRole, (err, mRoleValidated) => {
        if(err) next(err);        

        if(mRoleValidated !== null){
          Role.create(mRoleValidated).then(role => {            
            //update role.json to enable future role assignment            
            RoleJSON(role, "new");

            var response = new resp();

            res.status(200).send(response.initResp(role));
          }).catch((e) => {
            var response = new resp();

            res.status(400).send(response.initResp(null, e));
          });
        }
      });
    } 
  }else{
    var response = new resp();
    res.status(401).send(response.unAuthResp());
  } 
});

//update role
router.patch('/:roleid', isAuthenticated, (req, res, next) => {
  var action = "write";
  var roleId = req.params.roleid;
  var response = new resp();

  if (!security.isUUID(roleId)) {
    res.status(400).send(response.initResp(null, {
      msg: 'Invalid Role ID',
      status: true,
      code: 400
    }));
  } else {
    var role = res.auth_token.role.role;
    var validPermit = security.permit(action, role.acl);
    if (validPermit) {
      var mRole = {
        RoleID: roleId
      };

      var mRoleUpdate = {};
      for (var key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          if (key.toUpperCase() === 'ROLE_NAME' || key.toUpperCase() === 'ROLENAME') {
            mRoleUpdate['Rolename'] = {
              val: req.body[key],
              check: true,
              type: 'string'
            };
          } else if (key.toUpperCase() === 'ACTIVE') {
            mRoleUpdate['active'] = {
              val: req.body[key],
              check: true,
              type: 'integer'
            };
          }
        }
      }

      security.validate(mRoleUpdate, (err, mRoleUpdated) => {
        if (err) next(err);

        if(Role !== null){
          Role.findOne({
            where: mRole
          }).then(role => {
            return db.transaction(function (t) {
              return role.update(mRoleUpdate, {
                  transaction: t
                })
                .then(mRoleUpdated => {
                  t.commit();
                  RoleJSON(mRoleUpdated, "update");

                  var response = new resp();
                  response.initResp(mRoleUpdated.get({
                    plain: true
                  }));
                  res.status(200).send(response);
              });
            });
          });
        }
      });
    } else {
      var response = new resp();
      next(response.unAuthResp());
    }
  }
});

//delete role
router.delete('/', isAuthenticated, (req, res, next) => {
  var action = "delete";
  var response = new resp();

  if (!security.isUUID(req.body.role_id)) {
    next(new Error("Invalid Role ID"));
  } else {
    var role = res.auth_token.role.role;
    var validPermit = security.permit(action, role.acl);
    if (validPermit) {
      var roleId = req.body.role_id;
      var mRole = {
        RoleID: roleId
      };
      Admin.findAndCountAll({
        where: mRole
      }).then(result => {
        if(result.count > 0){
          next(response.initResp(null, {
            msg: 'Role is currently being used by ' + result.count + ' administrator, unable to delete!',
            status: true,
            code: 400
          }));
        }else{
          User.findAndCountAll({
            where: mRole
          }).then(result => {
            if(result.count > 0){
              next(response.initResp(null, {
                msg: 'Role is currently being used by ' + result.count + ' user, unable to delete!',
                status: true,
                code: 400
              }));
            }else{
              Role.destroy({
                where: mRole
              }).then(delRole => {                
                if(delRole){
                  RoleJSON(mRole, "delete");
                                   
                  res.status(200).send(
                    response.initResp("Successfully deleted role!", null, {
                    msg: 'successfully deleted role',
                    code: 200,
                    status: true
                  }));                  
                }
              }).then(() => {

              }).catch(err => {
                t.rollback();
                var response = new resp();
                console.log(err);
                res.status(400).send(response.initResp(null, {
                  msg: 'Unable to delete role!',
                  status: true,
                  code: 400
                }));
              });
            }
          });
        }
      });
    } else{
      next(response.unAuthResp());
    }
  }  
});

function isAuthenticated(req, res, next) {
  var token = req.get('Authorization') !== null || req.get('Authorization') !== undefined ? req.get('Authorization') : '';
  if(token.includes("Bearer")){
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
  }else{
    var response = new resp();
    res.status(401).send(response.unAuthResp());
  }
}

function RoleJSON(role, action){
  if(action === "new"){
    let rawdata = fs.readFileSync(path.join(__dirname, '../../config/roles.json'));
    let roleJSON = JSON.parse(rawdata);
    roleJSON[role.Rolename] = role.RoleID;
    rawdata = JSON.stringify(roleJSON);
    fs.writeFileSync(path.join(__dirname, '../../config/roles.json'), rawdata);
  }
  if(action === "update"){
    let rawdata = fs.readFileSync(path.join(__dirname, '../../config/roles.json'));
    let roleJSON = JSON.parse(rawdata);
    for(var key in roleJSON) {
      if(roleJSON[key] === role.RoleID){
        delete roleJSON[key];
      }
    }
    roleJSON[role.Rolename] = role.RoleID;
    rawdata = JSON.stringify(roleJSON);
    fs.writeFileSync(path.join(__dirname, '../../config/roles.json'), rawdata);
  }
  if(action === "delete"){
    let rawdata = fs.readFileSync(path.join(__dirname, '../../config/roles.json'));
    let roleJSON = JSON.parse(rawdata);    
    for (var key in roleJSON) {
      if (roleJSON[key] === role.RoleID) {
        delete roleJSON[key];
      }
    }    
    rawdata = JSON.stringify(roleJSON);
    fs.writeFileSync(path.join(__dirname, '../../config/roles.json'), rawdata);
  }
}

module.exports = router;