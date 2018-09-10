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

router.get('/', isAuthenticated, (req, res, next) => {
  var action = "read";

  if(res.auth_token != null){
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.admin.acl);
    var mAdmin = {};

    if(validPermit){
      for (var key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          if (key === "name") {
            mAdmin['AdminName'] = {
              val: req.query[key],
              check: true,
              type: 'string'
            };
          } else if (key === 'email') {
            mAdmin['AdminEmail'] = {
              val: req.query[key],
              check: true,
              type: 'string'
            };
          } else if (key === 'level') {
            mAdmin['level'] = {
              val: req.query[key],
              check: true,
              type: 'integer'
            };
          } else if (key === 'active') {
            mAdmin['active'] = {
              val: req.query[key],
              check: true,
              type: 'integer'
            };
          } else if (key === 'role') {
            mAdmin['RoleName'] = {
              val: req.query[key],
              check : true,
              type: 'string'
            }
          }
        }      
      }
      
      security.validate(mAdmin, (err, mAdminValidated) => {
        if(err){
          var response = new resp();
          res.status(401).send(response.initResp(null, {
            msg: err.errmsg,
            code: 400,
            status: true
          }));
        }
        var query = rQry.getAdminsSQL.bindParam(mAdminValidated);
        
        db.query(query, {
          type: db.QueryTypes.SELECT
        }).then(admins => {          
          var response = new resp();
          res.status(200).send(response.initResp(admins));
        });

      });
    }else{
      var response = new resp();
      res.status(401).send(response.unAuthResp());
    }
  }else{
    var response = new resp();
    res.status(401).send(response.unAuthResp());
  }  
});


//GET all admin
router.get('/all', isAuthenticated, function(req, res, next){
  var action = "read";

  if(res.auth_token != null){
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.admin.acl);
    if(validPermit){
      Admin.findAll({
        attributes: ['AdminID', 'AdminName', 'AdminEmail', 'level', 'active', 'isMaster']
      }).then(admins => {
        var response = new resp();
        response.initResp(admins);
        res.status(200).send(response);
      });
    }else{
      var response = new resp();
      response.unAuthResp();
      res.status(401).send(response);
    }
  }else{
    var response = new resp();
    response.unAuthResp();
    res.status(401).send(response);
  }
});


//POST - create new admin
router.post('/', isAuthenticated, function (req, res, next) {
  var action = "write";

  if (res.auth_token != null) {
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.admin.acl);
    if (validPermit) {
      var mAdmin = {
        AdminID: utils.guid(),
        AdminName : {
          val: req.body.admin_name,
          type: 'empty',
          check: true
        },
        AdminEmail: {
          val: req.body.admin_email,
          type: 'email',
          check: true
        },
        AdminPwd : {
          val: req.body.admin_pwd,
          type: 'password',
          check: true
        },
        level: {
          val: req.body.level,
          type: 'integer',
          check: true
        },
        isMaster: {
          val: req.body.isMaster,
          type: 'integer',
          check: true
        }
      };

      security.validate(mAdmin, function (err, admin) {
        if(err) next(err);
        
        if(admin.isMaster === 1){
          Admin.findAndCountAll({
            where: {
              isMaster: 1
            }
          }).then(result => {
            if(result.count > 0){
              var response = new resp();

              response.initResp(null, {
                msg: 'Master is already exist, do not create more than one master',
                code: 999,
                stack: 'DUP_MASTER'
              });

              res.status(401).send(response);
            }else{
              if (admin !== null) {
                //master role id
                admin.RoleID = roleIds.master;

                Admin.create(admin).then(admin => {            
                  var response = new resp();

                  response.initResp(admin.get({
                    plain: true
                  }));

                  res.status(200).send(response);

                }).catch((e) => {
                  res.status(400).send(e);
                });

              } else {
                var err = new Error("Invalid user input!");
                next(err);
              }
            }
          });      
        }else{
          console.log(admin);
          if (admin !== null) {
            Admin.create(admin).then(admin => {
              var response = new resp();
              response.initResp(admin.get({
                plain: true
              }));

              res.status(200).send(response);
            }).catch((e) => {
              res.status(400).send(e);
            });
          } else {
            var err = new Error("Invalid user input!");
            next(err);
          }
        }    
      });
    }else{
      var response = new resp();
      res.status(401).send(response.unAuthResp());
    }
  }else{
    var response = new resp();
    res.status(401).send(response.unAuthResp());
  }
});


//UPDATE admin details
router.patch('/:adminid', (req, res, next) => {
  var adminid = req.params.adminid;
  var mAdminUpdate = {};

  if(! validator.isUUID(adminid)){
    var err = new Error("Invalid admin id!");
    next(err);
  }

  var mAdmin = {    
    AdminID: adminid 
  };
  
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      if (key.toUpperCase() === 'ADMINNAME' || key.toUpperCase() === 'ADMIN_NAME') {
        mAdminUpdate['AdminName'] = {
          val: req.body[key],
          check: true,
          type: 'string'
        };
      } else if (key.toUpperCase() === 'ADMINEMAIL' || key.toUpperCase() === 'ADMIN_EMAIL') {
        mAdminUpdate['AdminEmail'] = {
          val: req.body[key],
          check: true,
          type: 'email'
        };
      } else if (key.toUpperCase() === 'LEVEL') {
        mAdminUpdate['level'] = {
          val: req.body[key],
          check: true,
          type: 'integer'
        };
      } else if (key.toUpperCase() === 'ACTIVE') {
        mAdminUpdate['active'] = {
          val: req.body[key],
          check: true,
          type: 'integer'
        };
      } else if (key.toUpperCase() === 'ISMASTER') {
        mAdminUpdate['isMaster'] = {
          val: req.body[key],
          check: true,
          type: 'integer'
        };
      }
    }
  }

  security.validate(mAdminUpdate, (err, mAdminValidated) => {
    if(err) next(err);

    if(Admin !== null){
      Admin.findOne({
        where: mAdmin
      }).
      then(admin => {
        return db.transaction(function( t) {
          return admin.update(mAdminUpdate, {transaction: t})
            .then(mAdminUpdated => {     
              var response = new resp();
              response.initResp(mAdminUpdated.get({
                plain: true
              }));
              res.status(200).send(response);
            });
        }).then(result => {
          console.log('transaction committed');
        }).catch(err =>{
          t.rollback();
          var response = new resp();   
          console.log(err);
          res.status(400).send(response.initResp(null, {
           msg: 'Unable to update Admin information!',
           status: true,
           code: 400 
          }));          
        });         
      });
    }else{
      var error = new Error("Admin object does not exist!");
      next(error);
    }
  });
});

//login to admin panel
router.post('/login', (req, res, next) => {
  var mAdmin = {
    AdminEmail: {
      val: req.body.admin_email,
      check: true,
      type: 'email'
    },
    AdminPwd: {
      val: req.body.admin_pwd,
      check: true,
      type: 'empty'
    }
  };

  security.validate(mAdmin, (err, mAdminValidated) => {
    if(err) next(err);

    if (Admin != null) {
      Admin.findOne({
        where: {
          AdminEmail: mAdminValidated.AdminEmail          
        },
        attributes: ['AdminID', 'AdminPwd', 'AdminName', 'level', 'AdminEmail', 'RoleID'],        
      // db.query(
      //   "SELECT * FROM Admins A LEFT JOIN Rights R ON R.RoleID = A.RoleID ", 
      //   {type: db.QueryTypes.SELECT}
      }).then(admin => {
        console.log(admin);        
        security.decrypt(mAdminValidated.AdminPwd, admin.AdminPwd, (err, validLogin) => {
          if(validLogin !== null){
            Right.findAll({
              where: {
                RoleID: admin.RoleID
              }
            }).then(rights => {
              var rightsObj = {};
              for(var k in rights){
                rightsObj[rights[k].module.module] = rights[k].module;
              }
              
              var authObj = {
                id: admin.AdminID,
                name: admin.AdminName,
                email: admin.AdminEmail,
                level: admin.level
              };

              var jwtoken = security.issueJWT(authObj, rightsObj);
              var response = new resp();
              response.initResp({
                token: jwtoken
              });

              res.status(200).send(response);
            
            });

          }else{
            next(new Error("Unknown Password "));
          }
        });

      });
    } else {
      var error = new Error("Admin object does not exist!");
      next(error);
    }
  });
});

router.delete('/', isAuthenticated, (req, res, next) => {
  var action = "delete";

  if (! security.isUUID(req.body.admin_id)){
    next(new Error("Invalid Admin ID"));
  }else{
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.admin.acl);
    if(validPermit){
      var adminId = req.body.admin_id;
      mAdmin = {
        AdminID: adminId, 
        isMaster: 0      
      };
      console.log(res.auth_token);
      Admin.findOne({
        where: mAdmin
      }).then(admin => {
        if(admin !== null){
          // return db.transaction(function(t) {
          //   return admin.destroy({transaction: t})
          //     .then(result => {
          //       var response = new resp();
          //       response.initResp("Successfully deleted role!", null, {
          //         msg: 'successfully deleted admin',
          //         code: 200,
          //         status: true
          //       });

          //       res.status(200).send(response);
          //     }).catch((e) => {
          //       t.rollback();

          //       var response = new resp();
          //       console.log(err);
          //       res.status(400).send(response.initResp(null, {
          //         msg: 'Unable to delete admin!',
          //         status: true,
          //         code: 400
          //       }));
          //     });
          // });          
          admin.destroy();

          var response = new resp();                    
          res.status(200).send(response.initResp("Successfully deleted role!", null, {
            msg: 'successfully deleted admin',
            code: 200,
            status: true
          }));
        }
      });
    }else{
      next(new Error("Permission denied!"));
    }
  } 

});

function isAuthenticated(req, res, next) {
  var token = req.get('Authorization') !== null || req.get('Authorization') !== undefined? req.get('Authorization'): '';
  if (token.includes("Bearer")) {
    token = token.replace("Bearer ", "");

    res.auth_token = null;
    if (token !== '') {
      security.verifyToken(token, (err, validToken) => {
        if(err){
          var response = new resp();
          res.status(401).send(response.initResp(null, {
            msg: err.message,
            status : true,
            code: 401,
            reason: err.stack
          }));
          
        }
        res.auth_token = validToken;
        return next();
      });
    }else{
      var response = new resp();
      res.status(401).send(response.unAuthResp());
    }
  }else{
    var response = new resp();
    res.status(401).send(response.unAuthResp());
  }
}

module.exports = router;
