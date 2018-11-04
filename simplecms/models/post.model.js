//Sequelize Model
const {Admin} = require('./sqlite/sqliteModel');
const {Right} = require('./sqlite/sqliteModel');
const {User} = require('./sqlite/sqliteModel');
const {Tag} = require('./sqlite/sqliteModel');
const {Post} = require('./sqlite/sqliteModel');
const {PostCategory} =require('./sqlite/sqliteModel');
const {PostTag} = require('./sqlite/sqliteModel');
const {PostImage} = require('./sqlite/sqliteModel');
const {Category} = require('./sqlite/sqliteModel');
const {Image} = require('./sqlite/sqliteModel');
const utils = require('../utils/utils');
const {db} = require('./db');
const rQry = require('./sqlite/rawSQL');
const Op = db.Op;

class PostModel{
	constructor() {

	}
	/**
	 * @param  {} oPost
	 */
	createPost(oPost){
		return new Promise((resolve, reject) => {						
			Post.create(oPost).then(oPostCreated => {				
				resolve(oPostCreated.get({
					plain: true
				}));
			}).catch(err =>{
				reject(err);
			});
		});
	}

	
	/**
	 * @param  {} oPost
	 */
	getPost(oPost){
		return new Promise((resolve, reject) => {
			Post.findOne({
				where: oPost,
				include: [{
					model: User,
					as: 'UserPost',					
					attributes: ['Username', 'email']
				},{
					model: Admin,
					as: 'AdminPost',					
					attributes: ['AdminName', 'AdminEmail']
				}]			
			}).then(oPostGet => {
				resolve(oPostGet);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * @param  {} oPost
	 * @param  {} PostId
	 */
	updatePost(oPost, PostId){
		return new Promise((resolve, reject) => {
			Post.findOne({
				where: {
					PostID: PostId
				}
			}).then(oPostToSave => {
				oPostToSave.update(oPost)
					.then(oPostSaved => {
						resolve(oPostSaved);
					})
					.catch(err => {
						reject(err);
					});
			}).catch(err => {
				reject(err);
			});
		});
	}
	/**
	 * @param  {string} PostId
	 */
	increasePostView(PostId){
		let numOfViews = 0;
		return new Promise((resolve, reject) => {
			Post.findOne({
				where: {
					PostId: PostId
				},
				attributes: ['views', 'PostID']
			}).then(oPostIncreaseView => {
				numOfViews = oPostIncreaseView.views;
				numOfViews += 1;
				oPostIncreaseView.update({
					views: numOfViews
				}).then(oPostSaved => {
					resolve(oPostSaved);
				}).catch(err => {
					reject(err);
				});
			}).catch(err => {
				reject(err);
			});
		});
	}

	async deletePost(PostId){
		let oPostResult = {
			post: '',
			postTag: '',
			postCat: ''
		};

		let deletePost = new Promise((resolve, reject) => {
			Post.findOne({
				where: {PostID: PostId}
			}).then(oPost => {
				oPost.destroy();
				resolve(oPost);
			}).catch(err => {
				reject(err);
			});
		});
		
		let deletePostCategory = new Promise((resolve, reject) => {
			PostCategory.findOne({
				where: {
					PostID: PostId
				}
			}).then(oPostCat => {
				oPostCat.destroy();
				resolve(oPostCat);
			}).catch(err => {
				reject(err);
			});
		});

		let deletePostTag = new Promise((resolve, reject) => {
			PostTag.findOne({
				where: {
					PostID: PostId
				}
			}).then(oPostTag => {
				oPostTag.destroy();
				resolve(oPostTag);
			}).catch(err => {
				reject(err);
			});
		});

		try{			
			let oPostCatDeleted = await deletePostCategory;
			let oPostTagDeleted = await deletePostTag;
			let oPostDeleted = await deletePost;
			oPostResult.postTag = oPostTagDeleted;
			oPostResult.postCat = oPostCatDeleted;			
			oPostResult.post = oPostDeleted;

			return oPostResult;
		}catch(e){
			return e;
		}finally{
			//logging
		}

	}

	
	/**
	 * @param  {integer} active=0
	 */
	getAllPost(active = 0){
		return new Promise((resolve, reject) => {
			Post.findAll({
				where: {
					active: active
				}
			}).then(oPosts => {
				resolve(oPosts);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * @param  {integer} pageNum=0
	 * @param  {integer} active=0
	 */
	paginatePost(pageNum = 0, active = 0){
		return new Promise((resolve, reject) => {
			pageNum = pageNum * 5;
			
			Post.findAll({				
				offset: pageNum, 
				limit: 5, 
				where:{
					active: active
				},
				order: [
					['createdAt', 'desc']
				],				
				include: [{
					model: User,
					as: 'UserPost',
					attributes: ['Username', 'email']
				}, {
					model: Admin,
					as: 'AdminPost',
					attributes: ['AdminName', 'AdminEmail']
				}]				
			}).then(oPosts => {
				resolve(oPosts);
			}).catch(err => {
				reject(err);
			});
		});
	}
		
	/**
	 * @param  {integer} active=1
	 */
	async countPost(active = 1) {
		let oPosts = new Promise((resolve, reject) => {
			Post.findAndCountAll({
				where: {
					active: active
				}
			}).then(oPostPaginated => {
				resolve(oPostPaginated);
			}).catch(err => {
				reject(err);
			});
		});
		
		let postCount = await oPosts;		
		return postCount.count;
	}

	/**
	 * Get post render in web by PostID and slug (title)
	 * @param  {object} oParam
	 * @param  {UUID} oParam.PostID
	 * @param  {string} oParam.slug
	 */
	webGetPost(oParam) {
		return new Promise((resolve, reject) => {
			let whereCond = {};
			if(oParam.PostID !== ''){
				whereCond['PostID'] = oParam.PostID;
			}else{
				whereCond['title'] = oParam.slug.replace(/-/g, ' ');
			}
			
			Post.findOne({
				where: whereCond,
				include: [{
					model: User,
					as: 'UserPost',
					attributes: ['Username', 'email']
				}, {
					model: Admin,
					as: 'AdminPost',
					attributes: ['AdminName', 'AdminEmail']
				}]
			}).then(oPost => {
				resolve(oPost);
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * @param  {Object} oPostCat
	 * @param  {string} oPostCat.CatID
	 * @param  {string} oPostCat.PostID
	 */
	setPostCategory(oPostCat){
		return new Promise((resolve, reject) => {
			PostCategory.create(oPostCat)
				.then(oPostCatSaved => {
					let catId = oPostCatSaved.CatID;
					Category.findOne({
						where:{
							CatID: catId
						}
					}).then(oCategory => {
						resolve(oCategory);
					}).catch(err => {
						reject(err);
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	
	/**
	 * @param  {Object} oPostCat
	 * @param  {string} oPostCat.CatID
	 * @param  {string} oPostCat.PostID
	 */
	delPostCategory(oPostCat){
		return new Promise((resolve, reject) => {
			PostCategory.findOne({
				where: oPostCat
			}).then(oPostCatToRemove => {
				oPostCatToRemove.destroy();
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * @param  {Object} oPostTag
	 * @param  {string} oPostCat.TagID
	 * @param  {string} oPostCat.PostID
	 */
	setPostTag(oPostTag) {
		return new Promise((resolve, reject) => {
			PostTag.create(oPostTag)
				.then(oPostTagSaved => {
					let tagId = oPostTagSaved.TagID;
					Tag.findOne({
						where: {
							TagID: tagId
						}
					}).then(oTag => {
						resolve(oTag);
					}).catch(err => {
						reject(err);
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	/**
	 * @param  {Object} oPostTag
	 * @param  {string} oPostTag.TagID
	 * @param  {string} oPostTag.PostID
	 */
	delPostTag(oPostTag) {
		return new Promise((resolve, reject) => {
			PostTag.findOne({
				where: oPostTag
			}).then(oPostTagToRemove => {
				oPostTagToRemove.destroy();
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	/**
	 * @param  {Object} oPostImage
	 * @param  {string} oPostCat.ImageID
	 * @param  {string} oPostCat.PostID
	 */
	setPostImage(oPostImage) {
		return new Promise((resolve, reject) => {
			PostTag.create(oPostImage)
				.then(oPostImageSaved => {
					let imgId = oPostImageSaved.ImgID;
					Tag.findOne({
						where: {
							ImageID: imgId
						}
					}).then(oImg => {
						resolve(oImg);
					}).catch(err => {
						reject(err);
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	/**
	 * @param  {Object} oPostImage
	 * @param  {string} oPostImage.ImageID
	 * @param  {string} oPostImage.PostID
	 */
	delPostImage(oPostImage) {
		return new Promise((resolve, reject) => {
			PostTag.findOne({
				where: oPostImage
			}).then(oPostImageToRemove => {
				oPostImageToRemove.destroy();
			}).catch(err => {
				reject(err);
			});
		});
	}

	/**
	 * Check on what parameter has been passed from front end
	 * @param  {Object} req
	 * @param  {Object} oPostReq
	 */
	determineWhatToUpdate(req, oPostReq) {
		let param = '';
		let isExist = false;
		for (var key in oPostReq) {
			if (req.body.hasOwnProperty(key)) {
				param = key.toUpperCase();
				isExist = this.IsParamExist(param);
				if (isExist) {
					oPostReq[key].exclude = false;
					oPostReq[key].check = true;
				} else {
					oPostReq[key].exclude = true;
					oPostReq[key].check = false;
				}
			} else {
				oPostReq[key].exclude = true;
				oPostReq[key].check = false;
			}
		}
		return oPostReq;
	}

	
	/**
	 * To check the value that exist in param
	 * @param  {string} paramName
	 */
	IsParamExist(paramName) {
		let isExist = false;

		switch(paramName) {
		case 'TITLE':
			isExist = true;
			break;
		case 'CONTENT':
			isExist = true;
			break;
		case 'ACTIVE':
			isExist = true;
			break;
		case 'PUBLISHDATE':
			isExist = true;
			break;
		case 'VISIBILITY':
			isExist = true;
			break;
		case 'ALLOWCOMMENT':
			isExist = true;
			break;
		case 'METATAG':
			isExist = true;
			break;
		case 'CREATEDBY':
			isExist = true;
			break;		
		case 'AUTHORID':
			isExist = true;
			break;
		default:
			isExist = false;
		}
		return isExist;
	}


	postParam(withId = true) {
		let GUID = utils.guid();
		return {
			PostID: withId ? `POST-${GUID.toUpperCase()}`: {val: '', type: 'nullable', check: false, exclude: true},
			title:{
				val: '',
				type: 'string',
				check: true,
				exclude: false
			},
			content: {				
				val: '',
				type: 'JSON',
				check: true,
				exclude: false
			},
			active: {
				val: 0,
				type: 'integer',
				check: true,
				exclude: false
			},
			publishDate: {
				val: new Date().toLocaleString(),
				type: 'date',
				check: true,
				exclude: false
			},
			visibility: {
				val: 0,
				type: 'integer',
				check: true,
				exclude: false
			},			
			allowComment: {
				val: 1,
				type: 'integer',
				check: true,
				exclude: false
			},
			metaTag: {
				val: '',
				type: 'NULLABLE',
				check: true,
				exclude: false
			},
			createdBy: {
				val: '',
				type: 'NULLABLE',
				check: true,
				exclude: false
			},			
			AuthorID: {
				val: '',
				type: 'NULLABLE',
				check: true,
				exclude: false
			}
		};
	}
}

module.exports = PostModel;