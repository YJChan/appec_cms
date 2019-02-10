const security = require('./security');

const supp = {
  
	/**
   * @param  {Object} req
   * @param  {Object} paramObj
   */
	prepareBodyReq: function(req, paramObj){
		return new Promise((resolve, reject) => {      
			if(paramObj !== null){
				for(var prop in paramObj){
					if(prop in req.body){          
						paramObj[prop].val = req.body[prop];
					}
				}
			}
			security.validate(paramObj, function(err, oParam){
				if(err) {
					reject(err);
				}else{
					resolve(oParam);
				}
			});    
		});
	},
	prepareQryReq: function (req, paramObj) {
		return new Promise((resolve, reject) => {
			if (paramObj !== null) {
				for (var prop in paramObj) {
					if (prop in req.query) {
						paramObj[prop].val = req.query[prop];
					}
				}
			}
			security.validate(paramObj, function (err, oParam) {
				if (err) {
					reject(err);
				} else {
					resolve(oParam);
				}
			});
		});
	},
	prepareFormDataReq: function(req, paramObj){
		return new Promise((resolve, reject) => {      
			if(paramObj !== null){
				for(var prop in paramObj){
					if(prop in req.body){          
						paramObj[prop].val = req.fields[prop];
					}
				}
			}
			security.validate(paramObj, function(err, oParam){
				if(err) {
					reject(err);
				}else{
					resolve(oParam);
				}
			});    
		});
	},
	isValidUUID: function(val){
		return security.isUUID(val);
	},
	isEmptyObj: function (obj) {
		for (var key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				return false;
			}
		}
		return true;
	}
};


module.exports = supp;