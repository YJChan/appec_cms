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
router.post('/', isAuthenticated, (req, res, next) => {
  var action = "write";
  
  if(res.auth_token !== null){
    var role = res.auth_token.right;
    var validPermit = security.permit(action, role.right.acl);
    if (validPermit) {
      var mRight = JSON.parse(req.body.rights);

      security.validateMore(mRight, (err, mRightValidated) => {
        if(err) next(err);
        var response = new resp();

        if(mRightValidated !== null){
          Right.bulkCreate(mRightValidated)
            .then(affectedRows => {
              
              if(affectedRows.length > 0){                              
                response.initResp(affectedRows);
              }else{
                response.initResp(null, {
                  msg: 'No rights is created'
                });
              }
              res.status(200).send(response);
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

router.patch('/:rightid', (req, res, next) => {

});

router.delete('/', (req, res, next) => {

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
