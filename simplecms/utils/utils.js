const utils = {
  extract(obj, key, def = ''){
    if(obj[key] !== undefined && obj[key] !== null){
      return obj[key];
    }else{
      return def;
    }
  },
  guid(){
    return this.sguid() + this.sguid() + '-' + this.sguid() + '-' + 
      this.sguid() + '-' + this.sguid() + '-' +  this.sguid() + this.sguid() + this.sguid();
  },
  sguid(){    
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }  
}

module.exports = utils;