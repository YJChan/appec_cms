//Application Model
const UserModel = require('../models/user.model');
//helper
const security = require('../utils/security');
var resp = require('../utils/resp');
const supp = require('../utils/supp');

exports.getUser = async (req, res, next) => {
	let response = new resp();
	let oUserM = new UserModel();	
	let authorId = req.params.authorid;
	let oAuthor = null;
	let oAuthorFound = null;
	let userType = '';

	try {
		if (authorId !== undefined && authorId !== null) {
			oAuthorFound = await oUserM.getAuthorCount(authorId);
			if (oAuthorFound.user > 0) {
				userType = 'USER';
			} else if (oAuthorFound.admin > 0) {
				userType = 'ADMIN';
			}
			oAuthor = await oUserM.getMe(authorId, userType);
			res.status(200).send(response.initResp(oAuthor));
		} else {
			res.status(400).send(response.initResp(null, {message: 'Missing Author ID!', code: 400, status: true}));
		}
	} catch (err) {
		return next(err);
	}
};