var utils = {
  extract: function(obj, key, def = ''){
    if(obj[key] !== undefined && obj[key] !== null){
      return obj[key];
    }else{
      return def;
    }
  }
}

module.exports = utils;