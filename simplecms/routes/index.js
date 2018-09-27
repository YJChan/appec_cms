var express = require('express');
var router = express.Router();
const config = require('../config/config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('app/index', { title: config.development.app_name });
});

module.exports = router;
