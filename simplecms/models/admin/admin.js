const Sequelize = require('sequelize');
const {db}      = require('../db');
const Admin     = db.define('Admin', {
  AdminID: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UUID: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
    get() {
      return this.getDataValue('UUID');
    },
    set(val){
      this.setDataValue('UUID', val.toUpperCase());
    }
  },
  AdminName: {
    type: Sequelize.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('AdminName');
    },
    set(val){
      this.setDataValue('AdminName', val);
    }
  },
  AdminEmail: {
    type: Sequelize.TEXT,
    allowNull: false,
    get(){
      return this.getDataValue('AdminEmail');      
    },
    set(val){
      this.setDataValue('AdminEmail', val);
    }
  },
  AdminPwd : {
    type: Sequelize.TEXT,
    allowNull: false
  },
  level: Sequelize.INTEGER,
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  modifiedAt: Sequelize.DATE
});

module.exports.Admin = Admin;