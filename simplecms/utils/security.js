var bcrypt = require('bcrypt');
var validator = require('validator');
var sanitizer = require('sanitizer');
var jsonwebtoken = require('jsonwebtoken');
var utils = require('./utils');

//cannot be change!!
const salts = 8;
const supersecret = "affe8f6268484a3db76a50476946a21e7f6f18e4d67d";

const security = {
  encrypt(pwd, callback){
    bcrypt.hash(pwd, salts, function (err, hash) {
      if(err) callback(err, null);

      callback(null, hash);
    });
    //bcrypt.hashSync(pwd, salts);
  },
  decrypt(pwd, hash, callback){
    bcrypt.compare(pwd, hash, (err, res) => {
      if(err) callback(err, null);

      if(res === true){        
        callback(null, true);
      }else{
        callback(new Error("Invalid Password!"), null);
      }
    });
  },
  issueJWT(authenticatedObj, rights = null){
    if(authenticatedObj !== null){
      var payload = {
        id: authenticatedObj.id,
        email: authenticatedObj.email,
        name: authenticatedObj.name,
        level: authenticatedObj.level,
        exp: Math.floor(Date.now() / 1000) + (60 * 120),
        iss: 'http://appec.work',
        jwtid: utils.sguid(),
        role: {
          admin: {
            acl: rights.admin.acl === undefined? 0 : rights.admin.acl
          },
          post: {
            acl: rights.post.acl === undefined ? 0 : rights.post.acl
          },
          page: {
            acl: rights.page.acl === undefined ? 0 : rights.page.acl
          },
          role: {
            acl: rights.role.acl === undefined ? 0 : rights.role.acl
          },
          user: {
            acl: rights.user.acl === undefined ? 0 : rights.user.acl
          },
          right: {
            acl: rights.right.acl === undefined? 0 : rights.right.acl
          }
        }
      };
      var encode_token = jsonwebtoken.sign(payload, supersecret);
      return encode_token;
    }
  },
  verifyToken(token, callback){    
    var validity = false;

    try {
      jsonwebtoken.verify(token, supersecret, function (err, decoded) {
        if (err) {
          throw err;
        }

        callback(null, decoded);
      });
    } catch (err) {
      callback(err, null);
    }    
  },
  permit(action, grade){
    // 4 - able to read
    // 6 - able to create and edit
    // 7 - able to create, edit, delete and read    
    if(grade === 4){
      if(action === 'read'){
        return true;
      }
    }else if (grade === 6) {      
      if (action === 'write' || action === 'read') {
        return true;
      }
    }else if (grade === 7){
      if (action === 'write' || action === 'read' || action === 'delete') {
        return true;
      }
    }else{
      return false;
    }
  },
  cleanUpStr(inp, r = true){
    if(isNaN(inp)){
      var input = validator.escape(inp);
      input = sanitizer.normalizeRCData(input);
      input = sanitizer.sanitize(input);      
      input = validator.trim(input);
      input = input.replace("'", "");
      if(r){
        return input;
      }
    }else{
      return inp;
    }
  },
  isInt(inp){
    if(isNaN(inp)){
      return validator.isInt(inp);
    }
    return inp;
  },
  isEmail(inp){    
    if(validator.isEmail(inp)){
      return inp;
    }else{
      return null;
    }
  }, 
  isUUID(inp){
    var val = inp !== null && inp !== undefined? val = inp: '';
    if(validator.isUUID(val)){
      return true;
    }else{
      return false;
    }
  },
  validate(obj, callback){
    var checker = {
      status: false,
      val: '',
      errmsg: ''
    };

    for(var key in obj){
      if(obj.hasOwnProperty(key)){
        if(obj[key].check){          
          var type = obj[key].type? obj[key].type : '';
          var val;
          if(type !== 'integer'){
            val = obj[key].val ? obj[key].val : '';
          }else{
            if(isNaN(obj[key].val)){
              checker.status = false;
              checker.errmsg = "Field suppose to be integer but it is not!";
              break;
            }else{
              val = obj[key].val;
            }
          }

          var checker = checkThis(type, val);
          if(checker.status){
            obj[key] = checker.val;
          }else{
            break;
          }
          
        }
      }else{
        checker.status = false;
        checker.errmsg = "Invalid object key, kindly check on parameter passed in !";        
      }
    }

    if(checker.status){
      callback(null, obj);
    }else{
      callback(new Error(checker.errmsg), null);
    }
  },
  validateMore(arr, callback) {
    var checker = {
      status: false,
      val: '',
      errmsg: ''
    };
    var arrObj = [];

    for(var k in arr){
      var obj = arr[k];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key].check) {
            var type = obj[key].type ? obj[key].type : '';
            var val;
            if (type !== 'integer') {
              val = obj[key].val ? obj[key].val : '';
            } else {
              if (isNaN(obj[key].val)) {
                checker.status = false;
                checker.errmsg = "Field suppose to be integer but it is not!";
                break;
              } else {
                val = obj[key].val;
              }
            }

            var checker = checkThis(type, val);
            if (checker.status) {
              obj[key] = checker.val;
            } else {
              break;
            }

          }
        } else {
          checker.status = false;
          checker.errmsg = "Invalid object key, kindly check on parameter passed in !";
        }        
      }
      if(checker.status){
        arrObj.push(obj);
      }else{
        break;
      }
    }

    if (checker.status) {
      callback(null, arrObj);
    } else {
      callback(new Error(checker.errmsg), null);
    }
  }
}

var checkThis = (type, val) => {
  var checkObj = {
    errmsg: '',
    val: '',
    status: false
  };

  switch (type.toUpperCase()) {
    case 'GENUUID':
      checkObj.val = utils.guid().toUpperCase();
      checkObj.status = true,
      checkObj.err = '';
       
      break;
    case 'EMAIL':
      if (!validator.isEmail(val)) {
        checkObj.errmsg = 'Invalid email entry.';        
        checkObj.status = false;
      } else {
        checkObj.status = true;
        checkObj.val = val;
      }

      break;
    case 'INTEGER':
      if (isNaN(val)) {
        if (!validator.isInt(val)) {
          checkObj.errmsg = "Invalid Number";
          checkObj.status = false;
        }
      } else {
        checkObj.status = true;
        checkObj.val = parseInt(val);
      }

      break;
    case "EMPTY":
      if (validator.isEmpty(val)) {
        checkObj.errmsg = "Empty parameters";        
        checkObj.status = false;
      } else {
        val = security.cleanUpStr(val);
        checkObj.status = true;
        checkObj.val = val;
      }

      break;
    case "STRING":
      if (validator.isEmpty(val)) {
        checkObj.errmsg = "Invalid string value";
        checkObj.status = false;
      } else {
        val = security.cleanUpStr(val);
        checkObj.status = true;
        checkObj.val = val;
      }

      break;
    case "TELNUM":
      if (!validator.isMobilePhone(val)) {
        checkObj.errmsg = "Invalid mobile number";
        checkObj.status = false;        
      } else {
        checkObj.status = true;
        checkObj.val = val;
      }

      break;
    case "JWT":
      if (!validator.isJWT(val)) {
        checkObj.errmsg = "Invalid token type";
        checkObj.status = false;        
      } else {
        checkObj.status = true;
        checkObj.val = val;
      }

      break;
    case "PASSWORD":
      if (!validator.isEmpty(val)) {        
        checkObj.status = true;
        checkObj.val = bcrypt.hashSync(val, salts);
      }else{
        checkObj.errmsg = "Invalid password entry";
        checkObj.status = false;
        
      }
      break;
    default:
      var str = security.cleanUpStr(val);
      checkObj.status = true,
      checkObj.val = str;
  }
  return checkObj;
}

module.exports = security;