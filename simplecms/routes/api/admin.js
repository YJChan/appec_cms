const {Admin} = require('../../models/sqlite/sqliteModel');
const {Right} = require('../../models/sqlite/sqliteModel');
const {Role} = require('../../models/sqlite/sqliteModel');
const {Session} = require('../../models/sqlite/sqliteModel');
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
const roleIds = require('../../config/roles.json');
var _ = require('lodash');

router.use(bodyParser.json());

//get individual admin record by passing params
/**
 * @param json{
 *  name: string,
 *  email: string,
 *  level: integer,
 *  active: integer,
 *  role: string
 * }
 */
router.get('/', isAuthenticated, (req, res, next) => {
  var action = "read";

  if(res.auth_token != null){
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.admin.acl);
    var mAdmin = {};

    if(validPermit){
      for (var key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          if (key === "id") {
            mAdmin['AdminID'] = {
              val: req.query[key],
              check: true,
              type: 'string'
            };
          } else if (key === "name") {
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
//get /admin/all
//join sample
// Admin.findAll({
//   attributes: ['AdminID', 'AdminName', 'AdminEmail', 'level', 'active', 'isMaster', 'RoleID', 'AdminRole.Rolename'],
//   include: [{
//     model: Role,
//     as: 'AdminRole',
//     where: {
//       RoleID: db.col('Admin.RoleID')
//     }
//   }]
// })
router.get('/all', isAuthenticated, function(req, res, next){
  var action = "read";

  if(res.auth_token != null){
    var role = res.auth_token.role;
    var validPermit = security.permit(action, role.admin.acl);
    if(validPermit){
      Admin.findAll({
        attributes: ['AdminID', 'AdminName', 'AdminEmail', 'level', 'active', 'isMaster', 'RoleID', 'AdminRole.Rolename'],
        include: [{
          model: Role,
          as: 'AdminRole'
        }]      
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
          val: req.body.isMaster === undefined ? 0: req.body.isMaster,
          type: 'integer',
          check: true
        },
        RoleID: {
          val: req.body.role,
          type: 'uuid',
          check: true
        },
        security_phase: {
          val: req.body.security_phase === undefined? '': req.body.security_phase,
          type: 'string',
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
                //admin.RoleID = roleIds.master;

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
          //console.log(admin);
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
router.patch('/:adminid', isAuthenticated, (req, res, next) => {
  var action = "write";  
  var adminid = req.params.adminid;
  var mAdminUpdate = {};
  var role = res.auth_token.role;
  var validPermit = security.permit(action, role.admin.acl);

  if (! validPermit){
    var response = new resp();
    res.status(405).send(response.initResp(null, {
      status: true,
      code: 405,
      message: 'You are not allow to access this application',
      reason: 'Method not allowed'
    }));
  }else{

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
        } else if (key.toUpperCase() === 'ROLE') {
          mAdminUpdate['RoleID'] = {
            val: req.body[key],
            check: true,
            type: 'uuid'
          };
        } else if (key.toUpperCase() === 'SECURITYPHASE' || key.toUpperCase() === 'SECURITY_PHASE') {
          if(req.body[key] !== ''){
            mAdminUpdate['security_phase'] = {
              val: req.body[key],
              check: true,
              type: 'string'
            };
          }
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
  }
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
        attributes: ['AdminID', 'AdminPwd', 'AdminName', 'level', 'AdminEmail', 'RoleID', 'security_phase'],      
      }).then(admin => {
              
        security.decrypt(mAdminValidated.AdminPwd, admin.AdminPwd, (err, validLogin) => {
          if(err) next(err);

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
              
              var security_phase = false;
              if(admin.security_phase != null){
                security_phase = true;
              }

              //create session
              Session.create({
                SessionID: utils.guid(),
                loginUser: admin.AdminID, 
                issueAt: new Date(),                 
                expired: new Date().getTime() + (parseInt(config[config.environment].expire_time.global) * 60 * 60 *1000)
              }).then(session => {
                var jwtoken = security.issueJWT(authObj, rightsObj);;
                //if security phase is on, user required to key in security phase too
                // if(! security_phase){
                //   security.issueJWT(authObj, rightsObj);
                // } 

                var response = new resp();
                response.initResp({
                  token: jwtoken,
                  security_phase: security_phase,
                  ssid: session.SessionID,
                  path: config[config.environment].adminpanel
                });

                res.status(200).send(response);              
              }).catch(e => {
                console.log(e);
                var response = new resp();
                res.status(500).send(response.initResp(null, {
                  message: 'Unable to create session',
                  code: 500,
                  stack: e,
                  status: true
                }));
              });
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

//verify security phase
router.post('/verify-security-phase', isAuthenticated, (req, res, next) => {
  var mAdmin = {    
    AdminID: res.auth_token.id
  };
  var security_phase = req.body.security_phase;
  var response = new resp();

  Admin.findOne({
    where: mAdmin, 
    attributes: ['AdminID', 'security_phase']})
  .then(admin => {
    security.decrypt(security_phase, admin.security_phase, (err, validPhase) => {
      if (err) next(err);

      if (validPhase){
        //return user with authenticate object

      }else{
        res.status(401).send(response.unAuthResp());
      }

    });
  }).catch(e => {
    console.log(e);
    var response = new resp();
    res.status(401).send(resp.initResp(null, {
      message: 'Unable to match security phase',
      code: 401,
      status: true
    }));
  })


});

router.delete('/', isAuthenticated, (req, res, next) => {
  var action = "delete";
  //var admins = req.body.admins;
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
      //console.log(res.auth_token);
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

router.delete('/bulk', isAuthenticated, (req, res, next) => {
  var action = "delete";
  var admins = req.body.admins;
  var arrAdmins = [];
  var response = new resp();  

  for(var n = 0; n < admins.length; n++){
    var admin_id = admins[n];    
    arrAdmins.push(admin_id);
  }
  var idsGoingToDel = {
    AdminID: arrAdmins
  };

  var role = res.auth_token.role;
  var validPermit = security.permit(action, role.admin.acl);
  if (validPermit) {
      //console.log(res.auth_token);
      Admin.destroy({
        where: idsGoingToDel
        }).then(affectedRows => {
        if (affectedRows > 0) {
          console.log('deleted ' +affectedRows + ' admins');
          
          res.status(200).send(response.initResp("Successfully deleted role!", null, {
            msg: 'successfully deleted ' + affectedRows + 'admin',
            code: 200,
            status: true
          }));
        }else{
          res.status(400).send(response.initResp(null, {
            msg: 'Unable to delete admins',
            code: 400,
            status: true
          }));
        }
      });
  } else {
    bSuccess = false;
    return false;
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
        next();
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
