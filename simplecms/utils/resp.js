module.exports  = resp;

function resp(){
  this.error = {
    message: '',
    code: '000',
    reason: 'Nothing',
    status: 0    
  };
  this.success = {
    status: 1,
    message: '',
    code: '200'
  }
  this.result = '';    
  this.initResp = function(resultObj, err = null, suc= null){
    if(err !== null){
      this.error.message = err.msg;
      this.error.code = err.code;
      this.error.reason = err.stack;
    }else{
      this.success.message = 'request process successfully';
      this.success.status = 1;
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
}