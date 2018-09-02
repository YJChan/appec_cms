var bcrypt = require('bcrypt');
var validator = require('validator');
var sanitizer = require('sanitizer');
//cannot be change!!
const salts = 8;

const security = {
  encrypt(pwd){
    return bcrypt.hashSync(pwd, salts);
  },
  decrypt(pwd, hash){
    return bcrypt.compareSync(pwd, hash);
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
          var val = obj[key].val? obj[key].val : '';

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

  }

}

var checkThis = (type, val) => {
  var checkObj = {
    errmsg: '',
    val: '',
    status: false
  };

  switch (type.toUpperCase()) {
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
    default:
      var str = this.cleanUpStr(val);
      checkObj.status = true,
      checkObj.val = str;
  }
  return checkObj;
}

module.exports = security;