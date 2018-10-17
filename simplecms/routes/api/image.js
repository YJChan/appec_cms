const express = require('express');
let router = express.Router();
const bodyParser = require('body-parser');
const security = require('../../utils/security');
let resp = require('../../utils/resp');
const ImageController = require('../../controllers/image.controller');
const multer = require('multer');
const upload = multer({dest: `${__dirname}/../../public/images/uploads/`});
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

router.post('/upload-image/', isAuthenticated, upload.single('image'), ImageController.uploadImage);

router.get('/get-image/:imgid', ImageController.getImage);

module.exports = router;