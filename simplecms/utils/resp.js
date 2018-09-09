function resp(){
  this.error = {
    message: '',
    code: '000',
    reason: 'Nothing',
    status: false
  };
  this.success = {
    status: true,
    message: '',
    code: '200'
  }
  this.result = '';    
  this.initResp = function(resultObj, err = null, suc= null){
    if(err !== null){
      this.error.message = err.msg;
      this.error.code = err.code;
      this.error.reason = err.stack;
      this.error.status = err.status;
    }else{
      this.success.message = 'Request successfully processed';
      this.success.status = true;
      this.success.code = 200;
    }
    if(suc !== null){
      this.success.status = suc.status;
      this.success.code = suc.code;
      this.success.message = suc.msg;
    }
    this.result = resultObj;

    return this;
  };
  this.unAuthResp = function(){
    this.error.message = "Unauthorized Access!";
    this.error.code = 401;
    this.error.reason = 'Permission denied on actions!';
    this.error.status = true;
    this.success.status = false;
    this.success.message = '';
    this.success.code = 000;
    this.result = null;
    
    return this;
  }
}

module.exports  = resp;
