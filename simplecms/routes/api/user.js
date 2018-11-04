const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const security = require('../../utils/security');
var resp = require('../../utils/resp');
const UserController = require('../../controllers/user.controller');
router.use(bodyParser.json());

let isAuthenticated = function (req, res, next) {
	let response = new resp();
	let token = req.get('Authorization') !== null || req.get('Authorization') !== undefined ? req.get('Authorization') : '';
	if (token.includes('Bearer')) {
		token = token.replace('Bearer ', '');

		res.auth_token = null;
		if (token !== '') {
			security.verifyToken(token, (err, validToken) => {
				if (err) {
					var response = new resp();
					res.status(401).send(response.initResp(null, {
						msg: err.message,
						status: true,
						code: 401,
						reason: err.stack
					}));
				}

				res.auth_token = validToken;
				next();
			});
		} else {
			res.status(401).send(response.unAuthResp());
		}
	} else {
		res.status(401).send(response.unAuthResp());
	}
};

router.get('/me/:authorid', isAuthenticated, UserController.getUser);

module.exports = router;