var mongoose    = require('mongoose');
const Sequelize = require('sequelize');
var sequelize   = null;
var mongoConn   = null;
var config      = require('../config/config.json');
var utils       = require('../utils/utils');
var environment = config.environment;
var database    = config.database;
var dbname      = utils.extract(config[environment].database[database], 'dbname');
var host        = utils.extract(config[environment].database[database], 'host');
var port        = utils.extract(config[environment].database[database], 'dbport');
var dbuser      = utils.extract(config[environment].database[database], 'dbuser', null);
var pwd         = utils.extract(config[environment].database[database], 'dbuserpwd', null);
var dbopts      = utils.extract(config[environment].database[database], 'options');
var mongodbOrSQL = 2;

switch (database){
  case 'mongodb':
    var connectionString = 'mongodb://' + dbuser + ':' + pwd + '@' + host + port + '/' + dbname;
    mongoose.connect(connectionString, dbopts);

    mongoConn = mongoose.connection;
    mongoConn.on('error', console.error.bind(console, 'connection error:'));
    mongoConn.once('open', function () {
      console.log("Mongodb Connected! at " + new Date());
    });
    mongodbOrSQL = 1;        
  case 'sqlite':  
    sequelize = new Sequelize(database, dbuser, pwd, {
      host: 'localhost',
      dialect: 'sqlite',
      operatorsAliases: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle : 10000
      },
      storage: './models/appec_cms.db'
    });  
    mongodbOrSQL = 2;    
  default:
    console.error('no database connection.');
}

const db = mongodbOrSQL == 1 ? mongoConn : sequelize;
module.exports.db = db;
