//Application Model
const PostModel = require('../models/post.model');
const CategoryModel = require('../models/category.model');
//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');
const {convertDeltaToHtml} = require('node-quill-converter');
const config = require('./../config/config.json');


/**Web Route */
exports.webIndexPage = async (req, res) => {
	let oCatM = new CategoryModel();
	let oCategories = null;
	//get categories
	oCategories = oCatM.getCategory({acive: 1});

	//get feature post

	//get recent post

	//get system setting

	res.render('../views/app/web/main/web-index', {
		title: 'Appec Title'
	});
};