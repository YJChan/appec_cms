const Sequelize = require('sequelize');
const config = require('../../config/config.json');
const {db} = require('../db');

const Admin = db.define('Admin', {
	AdminID: {
		type: Sequelize.TEXT,
		primaryKey: true,
		allowNull: false,
		unique: true,
		get() {
			return this.getDataValue('AdminID');
		},
		set(val) {
			this.setDataValue('AdminID', val.toUpperCase());
		}
	},
	AdminName: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
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
		unique: true,
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
	active: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	isMaster: {
		type: Sequelize.INTEGER,
		allowNull: true    
	},
	security_phase: {
		type: Sequelize.TEXT,
		allowNull: true
	},
	avatar: {
		type: Sequelize.TEXT,
		allowNull: true
	}
});

const Role = db.define('Role', {
	RoleID: {
		type: Sequelize.TEXT,
		primaryKey: true,
		allowNull: false,
		unique: true,
		get() {
			return this.getDataValue('RoleID');
		},
		set(val) {
			this.setDataValue('RoleID', val.toUpperCase());
		}
	},
	Rolename: {
		type: Sequelize.TEXT,
		allowNull: false,
		get() {
			return this.getDataValue('Rolename');
		},
		set(val) {
			this.setDataValue('Rolename', val);
		}
	},
	active: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
		get() {
			return this.getDataValue('active');
		},
		set(val) {
			this.setDataValue('active', val);
		}
	}
});

const Right = db.define('Right', {
	RightID: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
		primaryKey: true,
		get(){
			return this.getDataValue('RightID');
		},
		set(val){
			this.setDataValue('RightID', val);
		}
	},
	module: {
		type: Sequelize.TEXT,
		allowNull: false,    
		get(){
			return {
				module: this.getDataValue('module'),        
				acl: this.getDataValue('acl')
			};
		},
		set(val){
			this.setDataValue('module', val);
		}
	},
	section: {
		type: Sequelize.TEXT,
		allowNull: true,

	},
	acl: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 4
	},
	RoleID: {
		type: Sequelize.TEXT
	}
});

const SpecialField = db.define('SpecialField', {
	SpecialID: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
		primaryKey: true,
		get() {
			return this.getDataValue('SpecialID');
		},
		set(val) {
			this.setDataValue('SpecialID', val);
		}    
	},
	name: {
		type: Sequelize.TEXT,
		allowNull: true
	},
	requiredAuth: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	} 
});

const User = db.define('User', {
	UserID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('UserID');
		},
		set(val) {
			this.setDataValue('UserID', val.toUpperCase());
		}
	},
	Username: {
		type: Sequelize.TEXT,
		allowNull: false,
		unique: true,
		get() {
			return this.getDataValue('Username');
		},
		set(val) {
			this.setDataValue('Username', val);
		}
	},
	email: {
		type: Sequelize.TEXT,    
		unique: true,
		get() {
			return this.getDataValue('email');
		},
		set(val) {
			this.setDataValue('email', val);
		}
	},
	password: {
		type: Sequelize.TEXT    
	},
	location: {
		type: Sequelize.TEXT,
		allowNull: true,
		get() {
			return this.getDataValue('location');
		},
		set(val){
			this.setDataValue('location', val);
		}
	},
	bio: {
		type: Sequelize.TEXT,
		allowNull: true,
		get() {
			return this.getDataValue('bio');
		},
		set(val) {
			this.setDataValue('bio', val);
		}
	},
	socialLink: {
		type: Sequelize.TEXT,
		allowNull: true,
		get() {
			return this.getDataValue('socialLink');
		},
		set(val) {
			this.setDataValue('socialLink', val);
		}
	},
	authenticator: {
		type: Sequelize.INTEGER,
		allowNull: true,
		get(){
			if (this.getDataValue('authenticator') === 1){
				return 'Google';
			}
			if (this.getDataValue('authenticator') === 2) {
				return 'Facebook';
			}
			if (this.getDataValue('authenticator') === 3) {
				return 'Twitter';
			}
			if (this.getDataValue('authenticator') === 4) {
				return 'Github';
			}
			if (this.getDataValue('authenticator') === 0) {
				return 'None';
			}
		},
		set(val) {
			this.setDataValue('authenticator', val);
		}
	}
});

const Post = db.define('Post', {
	PostID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('PostID');
		},
		set(val) {
			this.setDataValue('PostID', val.toUpperCase());
		}
	},
	title:{
		type: Sequelize.TEXT,
		allowNull: true
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false,        
		get() {
			return this.getDataValue('content');
		},
		set(val) {
			this.setDataValue('content', val);
		}
	},
	active: {
		type: Sequelize.INTEGER,    
		defaultValue: 0
	},
	publishDate: {
		type: Sequelize.DATE    
	},
	visibility: {
		type: Sequelize.INTEGER,    
		defaultValue: 0
	},
	views: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	allowComment: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	metaTag: {
		type: Sequelize.TEXT,
		allowNull: true
	},
	mode: {
		type: Sequelize.TEXT,
		allowNull: true,
		defaultValue: 'DRAFT'
	},
	createdBy: {
		type: Sequelize.TEXT    
	},
	AuthorID: {
		type: Sequelize.TEXT,
		allowNull: true
	}
});

const Image = db.define('Image', {
	ImageID : {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('ImageID');
		},
		set(val) {
			this.setDataValue('ImageID', val.toUpperCase());
		}
	},
	inDb: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
	},
	filename: {
		type: Sequelize.TEXT
	},
	fileType: {
		type: Sequelize.TEXT    
	},
	fileSize: {
		type: Sequelize.DOUBLE
	},
	binaryFile: {
		type: Sequelize.TEXT,
		allowNull: true,
		defaultValue: ''
	},
	filePath: {
		type: Sequelize.TEXT,
		allowNull: true,
		defaultValue: ''
	},
	url: {
		type: Sequelize.TEXT,
		allowNull: true
	}
});

const Tag = db.define('Tag', {
	TagID : {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('TagID');
		},
		set(val) {
			this.setDataValue('TagID', val.toUpperCase());
		}
	},
	tagname: {
		type: Sequelize.TEXT,        
		unique: true,
		get() {
			return this.getDataValue('tagname');
		},
		set(val) {
			this.setDataValue('tagname', val);
		}
	},
	createdBy: {
		type: Sequelize.TEXT    
	},
	active: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	}
});

const Category = db.define('Category', {
	CatID : {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('CatID');
		},
		set(val) {
			this.setDataValue('CatID', val.toUpperCase());
		}
	},
	catname: {
		type: Sequelize.TEXT,    
		unique: true,
		get() {
			return this.getDataValue('catname');
		},
		set(val) {
			this.setDataValue('catname', val);
		}
	},
	active: {
		type: Sequelize.INTEGER,
		defaultValue: 1    
	},
	createdBy: {
		type: Sequelize.TEXT
	}
});

const Page = db.define('Page', {
	PageID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('PageID');
		},
		set(val) {
			this.setDataValue('PageID', val.toUpperCase());
		}
	},
	pageName: {
		type: Sequelize.TEXT,
		allowNull: false,    
		unique: true,
		get() {
			return this.getDataValue('pageName');
		},
		set(val) {
			this.setDataValue('pageName', val);
		}
	},
	routePath: {
		type: Sequelize.TEXT,
		allowNull: true,
		unique: true,
		get() {
			return this.getDataValue('routePath');
		},
		set(val) {
			this.setDataValue('routePath', val);
		}
	},
	metaTag: {
		type: Sequelize.TEXT,
		allowNull: true
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: true
	},
	active: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	publishDate: {
		type: Sequelize.DATE,
		allowNull: true
	},
	views:{
		type: Sequelize.INTEGER,    
		defaultValue: 1
	},    
	createdBy: {
		type: Sequelize.TEXT
	}
});

const Setting = db.define('Setting', {
	SettingID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('SettingID');
		},
		set(val) {
			this.setDataValue('SettingID', val.toUpperCase());
		}
	},
	SiteName: {
		type: Sequelize.TEXT,
		defaultValue: 'Minimal',
		get() {
			return this.getDataValue('SiteName');
		},
		set(val) {
			this.setDataValue('SiteName', val);
		}
	},
	SiteLogo: {
		type: Sequelize.TEXT,
		allowNull: true,    
		get() {
			return this.getDataValue('SiteLogo');
		},
		set(val) {
			this.setDataValue('SiteLogo', val);
		}
	},
	SiteCover: {
		type: Sequelize.TEXT,
		allowNull: true,
		get() {
			return this.getDataValue('SiteCover');
		},
		set(val) {
			this.setDataValue('SiteCover', val);
		}
	},
	SiteURL: {
		type: Sequelize.TEXT,
		allowNull: true,
		get() {
			return this.getDataValue('SiteURL');
		},
		set(val) {
			this.setDataValue('SiteURL', val);
		}
	},
	masterEmail: {    
		type: Sequelize.TEXT,
		allowNull: true,
		get() {
			return this.getDataValue('masterEmail');
		},
		set(val) {
			this.setDataValue('masterEmail', val);
		}    
	},
	memberShip: {
		type: Sequelize.INTEGER,
		defaultValue: 0    
	},
	dateFormat:{
		type: Sequelize.TEXT,
		defaultValue: 'UTC'
	},
	mailServer: {
		type: Sequelize.TEXT
	},
	mailLoginName: {
		type: Sequelize.TEXT
	},
	mailLoginPassword: {
		type: Sequelize.TEXT
	},
	termService: {
		type: Sequelize.TEXT
	},
	numberOfPost: {
		type: Sequelize.INTEGER
	},
	showDateInPost: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
	},
	active: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	},
	maintenance: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	theme: {
		type: Sequelize.TEXT    
	}
});

const Theme = db.define('Theme', {
	ThemeID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('ThemeID');
		},
		set(val) {
			this.setDataValue('ThemeID', val.toUpperCase());
		}
	},
	path: {
		type: Sequelize.TEXT,        
		unique: true,
		get() {
			return this.getDataValue('path');
		},
		set(val) {
			this.setDataValue('path', val);
		}
	},
	createdBy: {
		type: Sequelize.TEXT    
	}
});

const Session = db.define('Session',{
	SessionID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true,
		get() {
			return this.getDataValue('SessionID');
		},
		set(val) {
			this.setDataValue('SessionID', val.toUpperCase());
		}
	},
	loginUser: {
		type: Sequelize.TEXT
	},
	issueAt:{
		type: Sequelize.DATE,
		defaultValue: new Date()    
	},
	expired: {
		type: Sequelize.DATE    
	}  
});

const PostCategory = db.define('PostCategory', {
	PostCategoryID : {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true
	},
	PostID: {
		type: Sequelize.TEXT,
		allowNull: false		
	},
	CatID: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

const PostTag = db.define('PostTag', {
	PostTagID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true
	},
	PostID: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	TagID: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});

const PostImage = db.define('PostImage', {
	PostImageID: {
		type: Sequelize.TEXT,
		allowNull: false,
		primaryKey: true,
		unique: true
	},
	PostID: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	ImageID: {
		type: Sequelize.TEXT,
		allowNull: false
	}
});


Role.hasMany(Admin, {
	foreignKey: 'RoleID',
	as:'AdminRole'
});

Admin.belongsTo(Role, {
	foreignKey: 'RoleID',
	constraints: false,
	as: 'AdminRole'
});

Role.hasMany(User, {
	foreignKey: 'RoleID',
	as: 'UserRole'
});

User.belongsTo(Role, {
	foreignKey: 'RoleID',
	constraints: false,
	as: 'Role'
});

Role.hasMany(Right, {
	foreignKey: 'RoleID',
	as: 'RoleRight'
});

Right.belongsTo(Role, {
	foreignKey: 'RoleID',
	as: 'RoleRight'
});

// Right.hasMany(SpecialField, {
//   foreignKey: 'RightID',
//   as: 'SpecialRight'
// });
// Admin.hasMany(Post, {
// 	foreignKey: 'AdminID',
// 	as: 'AdminPost'
// });

// Post.belongsTo(Admin, {
// 	foreignKey: 'AdminID',
// 	constraints: false,
// 	as: 'AdminPost'
// });

// User.hasMany(Post, {
// 	foreignKey: 'UserID',
// 	as: 'UserPost'
// });

// Post.belongsTo(User, {
// 	foreignKey: 'UserID',
// 	constraints: false,
// 	as:'UserPost'
// });

Admin.hasMany(Post, {
	foreignKey: 'AuthorID',
	as:'AdminPost'
});

Post.belongsTo(Admin, {
	foreignKey: 'AuthorID',
	constraints: true,
	as: 'AdminPost'
});

User.hasMany(Post, {
	foreignKey: 'AuthorID',
	as: 'UserPost'
});

Post.belongsTo(User, {
	foreignKey: 'AuthorID',
	constraints: true,
	as:'UserPost'
});

Post.hasMany(PostCategory, {
	foreignKey: 'PostID',
	constraints: true,
	as: 'Post_Category'
});

PostCategory.belongsTo(Post, {
	foreignKey: 'PostID',
	constraints: true,
	as: 'Post_Category'
});

Post.hasMany(PostTag, {
	foreignKey: 'PostID',
	constraints: true,
	as: 'Post_Tag'
});

PostTag.belongsTo(Post, {
	foreignKey: 'PostID',
	constraints: true,
	as: 'Post_Tag'
});


// Post.belongsToMany(Category, {
// 	as: 'PostCategory',
// 	through: 'Post_Category',
// 	foreignKey: 'PostID',
// 	otherKey: 'CatID'
// });

// Image.belongsToMany(Post, {
// 	as: 'PostImage',
// 	through: 'Post_Image',
// 	foreignKey: 'PostID',
// 	otherKey: 'ImageID'
// });

// Image.belongsToMany(Page, {
// 	as: 'PageImage',
// 	through: 'Page_Image',
// 	foreignKey: 'PageID',
// 	otherKey: 'ImageID'
// });

// Tag.belongsToMany(Post, {
// 	as: 'PostTag',
// 	through: 'Post_Tag',
// 	foreignKey: 'PostID',
// 	otherKey: 'TagID'
// });

if(config.environment === 'development' &&  config.dbChange){
	//db.sync({alter: true});
	//Post.sync({alter:true});
	// Post.sync({
	// 	alter: true
	// });
	// PostCategory.sync({
	// 	alter: true
	// });
	// PostTag.sync({
	// 	alter: true
	// });	
}

module.exports = {
	Admin, 
	Role, 
	Post, 
	Category, 
	Image, 
	Page, 
	Tag, 
	Right, 
	Setting, 
	SpecialField, 
	Theme, 
	User,
	Session,
	PostCategory,
	PostImage,
	PostTag
};