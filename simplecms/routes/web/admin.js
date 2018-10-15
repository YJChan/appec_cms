var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
const {Session} = require('../../models/sqlite/sqliteModel');
const config = require('../../config/config.json');
var resp = require('../../utils/resp');

router.use(cookieParser());

/* GET home page. */
router.get('/', isAuthenticated, function (req, res, next) {
  res.clearCookie('auth_token');
  res.clearCookie('ssid');
  res.render('app/admin-login', {
    title: config.development.app_name
  });
});

router.get('/admin', isAuthenticated, function (req, res, next) {
  res.render('app/admin', {
    title: config.development.app_name
  });
});

router.get('/login', function (req, res, next) {
  res.clearCookie('auth_token');
  res.clearCookie('ssid');
  res.render('app/admin-login', {
    title: config.development.app_name
  });
});

function isAuthenticated(req, res, next) {
  var sessiongCookie = req.cookies.ssid;
  var admin_panel_path = config[config.environment].adminpanel;
  if (sessiongCookie !== undefined && sessiongCookie !== null) {
    Session.findOne({
      where: {SessionID: sessiongCookie}
    }).then(session => {
      if(session != null){
        var now = new Date();
        if(now > session.expired){
          console.log('session expired');
          res.redirect('/' + admin_panel_path + '/login');
        }else{
          next();
        }
      }else{
        res.redirect('/' + admin_panel_path + '/login');
      }
    }).catch(e => {
      console.log(e);
      res.redirect('/' + admin_panel_path + '/login');
    });
  }else{
    console.log('session expired');
    res.redirect('/' + admin_panel_path + '/login');
  }
}

module.exports = router;
