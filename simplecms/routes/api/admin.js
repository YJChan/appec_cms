const {Admin} = require('../../models/admin/admin');
const {db} = require('../../models/db');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const validator = require('validator');
const utils = require('../../utils/utils');
const security = require('../../utils/security');
var _ = require('lodash');
router.use(bodyParser.json());


router.get('/', function(req, res, next){
  res.status(200).send({
    message: 'admin index'
  });
});

router.post('/', function (req, res, next) {
  
  var mAdmin = {
    UUID: utils.guid(),
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
      type: 'empty',
      check: true
    },
    level: {
      val: req.body.level,
      type: 'integer',
      check: true
    },
    modifiedAt: new Date() 
  };

  security.validate(mAdmin, function (err, admin) {
    if(err) next(err);
    
    console.log(admin);
    if(admin !== null){
      Admin.create(admin).then(admin => {
        console.log(admin);
        res.status(200).send(admin);
      }).catch((e) => {
        res.status(400).send(e);
      });
    }else{
      var err = new Error("Invalid user input!");
      next(err);
    }
  });
});

module.exports = router;
