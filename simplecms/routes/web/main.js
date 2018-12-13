var express = require('express');
var router = express.Router();
const config = require('../../config/config.json');
const Main = require('../../controllers/index.controller');

/* GET users listing. */
router.get('/', Main.webMainPage);

module.exports = router;
