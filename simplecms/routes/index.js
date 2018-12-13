var express = require('express');
var router = express.Router();
const config = require('../config/config.json');
const Index = require('../controllers/index.controller');

/* GET home page. */
router.get('/', Index.webIndexPage);

module.exports = router;
