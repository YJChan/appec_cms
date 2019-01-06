//Application Model
const PostModel = require('../models/post.model');
const CategoryModel = require('../models/category.model');
const SettingModel = require('../models/setting.model');
//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');
const {convertDeltaToHtml} = require('node-quill-converter');
const config = require('./../config/config.json');

/**Web Route */
exports.webIndexPage = async (req, res, next) => {
	let oCatM = new CategoryModel();
	let oSettingM = new SettingModel();
	let oCategories = null;
	//get categories
	try{
		oCategories = await oCatM.getCategory({active: 1});

		//get feature post

		//get recent post

		//get system setting
		let oSettings = await oSettingM.getBlogSetting();
		console.log(oSettings);
		res.render('../views/app/web/main/web-index', {
			title: 'Appec Title',
			setting: oSettings
		});
	}catch(err){
		next(err);
	}
};