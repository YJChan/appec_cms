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
	let oPostM = new PostModel();
	let oCategories, oFeaPost, oRecentPost, jsonReturn, oSettings = null;

	try{
		oCategories = await oCatM.getCategory({active: 1});
		// console.log('categories passed');

		//get feature post
		oFeaPost = await oPostM.getFeaturePost();
		// console.log('feature passed, %o', oFeaPost);

		//get recent post
		oRecentPost = await oPostM.getRecentPost(new Date(), 0, 3);
		// console.log('recent passed');

		//get system setting
		oSettings = await oSettingM.getBlogSetting({active: 1});
		// console.log('setting passed');

		//oArchivePost = await oPostM.getArchiveList(new Date().getFullYear);

		jsonReturn = {
			blog: {
				title: config[config.environment].app_name,
				brand_title: config[config.environment].app_name,
				brand_tagline: config[config.environment].app_desc,
			},
			setting: oSettings,
			feature_post: oFeaPost,
			recent_post: oRecentPost,
			categories: oCategories,
			//profiler: true
		};
		//console.log('return passed');

		res.render('../views/app/web/main/web-index', {data: jsonReturn});
	}catch(err){
		next(err);
	}
};