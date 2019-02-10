//Sequelize Model
const {	Admin } = require('./sqlite/sqliteModel');
const {	Right } = require('./sqlite/sqliteModel');
const {	User } = require('./sqlite/sqliteModel');
const {	Tag } = require('./sqlite/sqliteModel');
const {	Post } = require('./sqlite/sqliteModel');
const {	PostCategory } = require('./sqlite/sqliteModel');
const {	PostTag } = require('./sqlite/sqliteModel');
const {	PostImage } = require('./sqlite/sqliteModel');
const {	Category } = require('./sqlite/sqliteModel');
const {	Image } = require('./sqlite/sqliteModel');
const utils = require('../utils/utils');
const supp = require('../utils/supp');
const {convertDeltaToHtml} = require('node-quill-converter');
const {
	db
} = require('./db');
const rQry = require('./sqlite/rawSQL');
const Op = db.Op;

class PostModel {
	constructor() {

	}
	/**
	 * @param  {} oPost
	 */
	createPost(oPost) {
		return new Promise((resolve, reject) => {
			let arrCat = [];

			if (oPost.categories !== undefined && oPost.categories !== null) {
				if (Array.isArray(oPost.categories)) {
					arrCat = oPost.categories.slice();
					delete oPost.categories;
				}
			}

			Post.create(oPost).then(oPostCreated => {
				let PostID = oPostCreated.PostID;
				let arrCatToSave = [];
				if (arrCat.length > 0) {
					for (var n in arrCat) {
						arrCatToSave.push({
							PostCategoryID: utils.guid().toUpperCase(),
							CatID: arrCat[n].id,
							PostID: PostID
						});
					}
					PostCategory.bulkCreate(arrCatToSave)
						.then(() => {
							Post.findOne({
								where: {
									PostID: PostID
								}
							}).then(oPostResult => {
								resolve(oPostResult);
							});
						});
				}
			}).catch(err => {
				reject(err);
			});
		});
	}


	/**
	 * @param  {} oPost
	 */
	async getPost(oPost) {
		let proGetPost = new Promise((resolve, reject) => {
			Post.findOne({
				where: oPost,
				include: [{
					model: User,
					as: 'UserPost',
					attributes: ['Username', 'email']
				}, {
					model: Admin,
					as: 'AdminPost',
					attributes: ['AdminName', 'AdminEmail', 'avatar']
				}, {
					model: PostCategory,
					as: 'Post_Category',
					attributes: ['PostID', 'CatID']
				}, {
					model: PostImage,
					as: 'Post_Image',
					attributes: ['ImageID']
				}]
			}).then(oPostGet => {
				console.log('got post %o', oPostGet);
				if(oPostGet.Post_Image.length > 0){
					Image.findOne({
						where: {
							ImageID: oPostGet.Post_Image[0].ImageID
						}
					}).then(oImage => {
						//console.log(oImage);
						oPostGet.Post_Image[0].dataValues['url'] = oImage.url;
						//console.log(oPostGet.Post_Image[0]);
						resolve(oPostGet);
					}).catch(err => {
						//console.log(err);
						reject(err);
					});
				}else{
					resolve(oPostGet);
				}
			}).catch(err => {
				reject(err);
			});
		});

		let oPostResult = null;

		try{
			oPostResult = await proGetPost;
			return oPostResult;
		}catch(err){
			return err;
		}
	}

	/**
	 * @param  {} oPost
	 * @param  {} PostId
	 */
	async updatePost(oPost, PostId) {
		let updatePost = null;
		let updatePostCat = null;
		let arrCat = [];

		if (oPost.categories !== undefined && oPost.categories !== null) {
			if (Array.isArray(oPost.categories)) {
				arrCat = oPost.categories.slice();
				delete oPost.categories;
			}
		}

		let oPostToSave = new Promise((resolve, reject) => {
			Post.findOne({
				where: {
					PostID: PostId
				}
			}).then(oPostToSave => {
				oPostToSave.update(oPost)
					.then(oPostSaved => {
						resolve(true);
					});
			}).catch(err => {
				reject(err);
			});
		});

		let oPostCatToSave = new Promise((resolve, reject) => {
			PostCategory.destroy({
				where: {
					PostID: PostId
				}
			}).then(affectedRows => {
				let PostID = PostId;
				let arrCatToSave = [];
				if (arrCat.length > 0) {
					for (var n in arrCat) {
						arrCatToSave.push({
							PostCategoryID: utils.guid().toUpperCase(),
							CatID: arrCat[n].id,
							PostID: PostID
						});
					}
					PostCategory.bulkCreate(arrCatToSave)
						.then(() => {
							Post.findOne({
								where: {
									PostID: PostID
								},
								include: [{
									model: User,
									as: 'UserPost',
									attributes: ['Username', 'email']
								}, {
									model: Admin,
									as: 'AdminPost',
									attributes: ['AdminName', 'AdminEmail']
								}, {
									model: PostCategory,
									as: 'Post_Category',
									attributes: ['PostID', 'CatID']
								}, {
									model: PostImage,
									as: 'Post_Image',
									attributes: ['ImageID']
								}]
							}).then(oPostResult => {
								resolve(oPostResult);
							});
						});
				}else{
					reject({
						code:'NO_CATEGORY',
						msg: 'No category selected'
					});
				}
			}).catch(err => {
				reject(err);
			});
		});

		try {
			updatePost = await oPostToSave;
			if (updatePost === true) {
				updatePostCat = await oPostCatToSave;
				return updatePostCat;
			}
			return updatePost;
		} catch (err) {
			return err;
		}

		// return new Promise((resolve, reject) => {			
		// 	Post.findOne({
		// 		where: {
		// 			PostID: PostId
		// 		}
		// 	}).then(oPostToSave => {
		// 		oPostToSave.update(oPost)
		// 			.then(oPostSaved => {

		// 				//resolve(oPostSaved);
		// 			})
		// 			.catch(err => {
		// 				reject(err);
		// 			});
		// 	}).catch(err => {
		// 		reject(err);
		// 	});
		// });
	}

	/**
	 * @param  {string} PostId
	 */
	increasePostView(PostId) {
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

	async deletePost(PostId) {
		let oPostResult = {
			post: '',
			postTag: '',
			postCat: ''
		};

		let deletePost = new Promise((resolve, reject) => {
			Post.findOne({
				where: {
					PostID: PostId
				}
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

		try {
			let oPostCatDeleted = await deletePostCategory;
			let oPostTagDeleted = await deletePostTag;
			let oPostDeleted = await deletePost;
			oPostResult.postTag = oPostTagDeleted;
			oPostResult.postCat = oPostCatDeleted;
			oPostResult.post = oPostDeleted;

			return oPostResult;
		} catch (e) {
			return e;
		} finally {
			//logging
		}

	}


	/**
	 * @param  {integer} active=0
	 */
	getAllPost(active = 0) {
		return new Promise((resolve, reject) => {
			Post.findAll({
				where: {
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
				}, {
					model: PostCategory,
					as: 'Post_Category',
					attributes: ['PostID', 'CatID']
				}]
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
	 * @param  {integer} pageLimit=10
	 */
	paginatePost(pageNum = 0, active = 0, pageLimit = 10, cat = '') {
		return new Promise((resolve, reject) => {
			//default pagination 10		
			let limit = pageLimit;
			pageNum = pageNum * limit;
			let whereCond = {
				active: active
			};
			let whereCatCond = {};
			if(cat.category !== undefined){
				if(cat.category !== ''){
					whereCatCond['CatID'] = cat.category;
				}
			}

			Post.findAll({
				offset: pageNum,
				limit: limit,
				where: whereCond,
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
				}, {
					model: PostCategory,
					as: 'Post_Category',
					where: whereCatCond,
					attributes: ['PostID', 'CatID']
				}]
			}).then(oPosts => {
				if(! supp.isEmptyObj(oPosts)){
					let pos = 0;
					let jsonContent = null;
					let html = null;
					oPosts.forEach(function(p){
						jsonContent = JSON.parse(p.content);
						html = convertDeltaToHtml(jsonContent);
						oPosts[pos]['htmlcontent'] = html;		
						//to view it on profiler, it has to insert into dataValues object
						oPosts[pos].dataValues['htmlcontent'] = html;						
						pos++;
					});
				}

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
			}).then(oPostCount => {
				resolve(oPostCount);
			}).catch(err => {
				reject(err);
			});
		});

		let postCount = await oPosts;
		return postCount.count;
	}


	/**
	 * @param  {integer} active=1
	 */
	async countPostsWithCategory(active = 1, cat) {
		let oPosts = new Promise((resolve, reject) => {
			let whereCatCond = {};
			if(cat.category !== undefined){
				whereCatCond['CatID'] = cat.category;
			}

			Post.findAndCountAll({
				where: {
					active: active
				},			
				include: [{
					nested: true,
					all: true
				},{
					model: User,
					as: 'UserPost',
					attributes: ['Username', 'email']
				}, {
					model: Admin,
					as: 'AdminPost',
					attributes: ['AdminName', 'AdminEmail']
				}, {
					model: PostCategory,
					as: 'Post_Category',
					where: whereCatCond,
					attributes: ['PostID', 'CatID']
				}]
			}).then(oPostCount => {
				resolve(oPostCount);
			}).catch(err => {
				reject(err);
			});
		});

		let postCount = await oPosts;
		return postCount.count;
	}

	async searchAutoComplete(query) {
		let queryText = query;
		let oQueryResult = null;
		try {
			if (queryText.length >= 2) {
				oQueryResult = await rQry.queryPostKeyWordSQL.bindAndExecute(db, {
					queryText: queryText
				});
			}
			return oQueryResult;
		} catch (err) {
			throw err;
		}
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
			if (oParam.PostID !== '') {
				//whereCond['PostID'] = oParam.PostID;
				whereCond = db.where(db.fn('lower', db.col('PostID')), db.fn('lower', oParam.PostID));
			} else {
				//whereCond['title'] = oParam.slug.replace(/-/g, ' ');
				//compare title in lowercase
				whereCond = db.where(db.fn('lower', db.col('title')), db.fn('lower', oParam.slug.replace(/-/g, ' ')));
			}
			Post.findOne({
				where: {
					whereCond
				},
				include: [{
					model: User,
					as: 'UserPost',
					attributes: ['Username', 'email']
				}, {
					model: Admin,
					as: 'AdminPost',
					attributes: ['AdminName', 'AdminEmail', 'avatar']
				}, {
					model: PostCategory,
					as: 'Post_Category',
					attributes: ['PostID', 'CatID']
				}, {
					model: PostImage,
					as: 'Post_Image',
					attributes: ['ImageID']
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
	setPostCategory(oPostCat) {
		return new Promise((resolve, reject) => {
			PostCategory.create(oPostCat)
				.then(oPostCatSaved => {
					let catId = oPostCatSaved.CatID;
					Category.findOne({
						where: {
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
	delPostCategory(oPostCat) {
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
			PostImage.create(oPostImage)
				.then(oPostImageSaved => {
					let imgId = oPostImageSaved.ImgID;
					Image.findOne({
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
			PostImage.findOne({
				where: oPostImage
			}).then(oPostImageToRemove => {
				oPostImageToRemove.destroy();
				resolve(true);
			}).catch(err => {
				reject(err);
			});
		});
	}

	
	/**
	 * @param  {Object} req
	 * @param  {Object} oPost
	 */
	async getFeaturePost(){
		let proGetFeaturePosts = new Promise((resolve, reject) => {
			Post.findAll({
				where: {
					isFeature: 1
				},
				include: [{
					model: User,
					as: 'UserPost',
					attributes: ['Username', 'email']
				}, {
					model: Admin,
					as: 'AdminPost',
					attributes: ['AdminName', 'AdminEmail', 'avatar']
				}, {
					model: PostCategory,
					as: 'Post_Category',
					attributes: ['PostID', 'CatID']
				}, {
					model: PostImage,
					as: 'Post_Image',
					attributes: ['ImageID']
				}]}).then(oPosts => {
				if(! supp.isEmptyObj(oPosts)){
					let pos = 0;
					oPosts.forEach(function(p){
						let jsonContent = JSON.parse(p.content);
						let html = convertDeltaToHtml(jsonContent);
						oPosts[pos]['htmlcontent'] = html;		
						//to view it on profiler, it has to insert into dataValues object
						oPosts[pos].dataValues['htmlcontent'] = html;						
						pos++;
					});
				}
				resolve(oPosts);
			}).catch(err => {
				reject(err);
			});
		});

		const proGetFeaturePostImages = (imageID) => {
			return new Promise((resolve, reject) => {
				Image.findOne({
					where: {
						ImageID: imageID
					}
				}).then(oImage => {
					resolve(oImage);
				}).catch(err => {
					reject(err);
				});
			});
		};

		try{
			let oFeaturePost = await proGetFeaturePosts;
			let oPostImage = null;
			if(oFeaturePost !== null){
				//console.log('feature post = %o', oFeaturePost);
				for(var n = 0; n < oFeaturePost.length; n++){
					if(oFeaturePost[n].Post_Image.length > 0){
						oPostImage = await proGetFeaturePostImages(oFeaturePost[n].Post_Image[0].ImageID);
					}
					
					if(oPostImage !== null){
						oFeaturePost[n].Post_Image[0]['url'] = oPostImage.url;
						//to view it on profiler, it has to insert into dataValues object
						oFeaturePost[n].Post_Image[0].dataValues['url'] = oPostImage.url;
					}else{
						oFeaturePost[n].Post_Image.push({ImageID: '', url:''});
					}
				}
			}
			//console.log('with image %o', oFeaturePost);
			return oFeaturePost;
		}catch(err){
			throw new Error(err);
		}
	}

	/**	 
	 * @param  {Object} oPost
	 */
	setFeaturePost(oPost){
		return new Promise((resolve, reject) => {
			let postId = oPost.PostID;
			Post.findOne({
				where: {
					PostID : postId
				}, include: [{
					model: PostImage,
					as: 'Post_Image',
					attributes: ['ImageID']
				}]
			}).then(oPostSet => {
				if (oPostSet.Post_Image.length > 0){
					oPostSet.update({isFeature: 1})
						.then(oPostUpdated => {
							resolve(oPostUpdated);
						}).catch(err => {
							reject(err);
						});
				}else{
					reject({
						code: 'FEATURE_NO_IMG',
						msg: 'Feature post has no cover image.'
					});
				}
			}).catch(err => {
				reject(err);
			});
		});
	}
	
	/**	 
	 * @param  {Object} oPost
	 */
	removeFeaturePost(oPost){
		return new Promise((resolve, reject) => {
			let postId = oPost.PostID;
			Post.findOne({where: {
				PostID: postId
			}}).then(oPostRmv => {
				oPostRmv.update({isFeature: 0})
					.then(oPostUpdated => {
						resolve(oPostUpdated);
					}).catch(err => {
						reject(err);
					});
			}).catch(err => {
				reject(err);
			});
		});		
	}
	
	/**
	 * @param  {Date} dteRecent
	 */
	getRecentPost(dteRecent, pageNum = 0, rec = 3){
		return new Promise((resolve, reject) => {
			//console.log('recent date: %s', dteRecent.toDateString());
			let dteTmp = new Date();
			dteTmp.setDate(dteRecent.getDate());	
			dteTmp.setMonth(dteRecent.getMonth() - 1);
			if(dteTmp.getMonth() === 11){
				dteTmp.setFullYear(dteRecent.getFullYear() - 1);
			}else{
				dteTmp.setFullYear(dteRecent.getFullYear());
			}
			//console.log('temp data is %s', dteTmp.toDateString());
			Post.findAll({
				offset: pageNum,
				limit: rec,
				where:{
					publishDate: {[Op.gte]: dteTmp},
					isFeature: 0
				},
				include: [{
					model: User,
					as: 'UserPost',
					attributes: ['Username', 'email']
				}, {
					model: Admin,
					as: 'AdminPost',
					attributes: ['AdminName', 'AdminEmail', 'avatar']
				}, {
					model: PostCategory,
					as: 'Post_Category',
					attributes: ['PostID', 'CatID']
				}, {
					model: PostImage,
					as: 'Post_Image',
					attributes: ['ImageID']
				}]
			}).then(oPostGet => {
				if(oPostGet.length >= 2){
					if(! supp.isEmptyObj(oPostGet)){
						let pos = 0;
						oPostGet.forEach(function(p){
							let jsonContent = JSON.parse(p.content);
							let html = convertDeltaToHtml(jsonContent);
							oPostGet[pos]['htmlcontent'] = html;		
							//to view it on profiler, it has to insert into dataValues object
							oPostGet[pos].dataValues['htmlcontent'] = html;						
							pos++;
						});
					}

					for (var n = 0; n < oPostGet.length; n++){
						if(oPostGet[n].Post_Image.length > 0){
							Image.findOne({
								where: {
									ImageID: oPostGet[n].Post_Image[0].ImageID
								}
							}).then(oImage => {
								oPostGet[n].Post_Image[0]['url'] = oImage.url;
								oPostGet[n].Post_Image[0].dataValues['url'] = oImage.url;
							}).catch(err => {
								reject(err);
							});
						}						
					}	
					resolve(oPostGet);				
				}else{
					Post.findAndCountAll()
						.then(postCount => {
							Post.findAll({
								offset: postCount,
								limit: 3,
								where: {
									active: 1
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
								}, {
									model: PostCategory,
									as: 'Post_Category',
									attributes: ['PostID', 'CatID']
								}]
							}).then(oPosts => {
								if(oPosts.length > 0){
									if(! supp.isEmptyObj(oPostGet)){
										let pos = 0;
										oPostGet.forEach(function(p){
											let jsonContent = JSON.parse(p.content);
											let html = convertDeltaToHtml(jsonContent);
											oPostGet[pos]['htmlcontent'] = html;		
											//to view it on profiler, it has to insert into dataValues object
											oPostGet[pos].dataValues['htmlcontent'] = html;						
											pos++;
										});
									}

									for (var n = 0; n < oPosts.length; n++){
										if(oPosts[n].Post_Image.length > 0){
											Image.findOne({
												where: {
													ImageID: oPosts[n].Post_Image[0].ImageID
												}
											}).then(oImage => {
												//console.log(oImage);
												oPosts[n].Post_Image[0]['url'] = oImage.url;
												oPosts[n].Post_Image[0].dataValues['url'] = oImage.url;
											}).catch(err => {
												reject(err);
											});
										}
										//resolve(oPosts);
									}
									resolve(oPosts);
								}
							}).catch(err => {
								reject(err);
							});
						});
				}
			}).catch(err => {
				reject(err);
			});			
		});
	}

	/*
	getArchiveList(year){
		let oArchiveList = null;

		let proGetArchiveList = new Promise((resolve, reject) => {
			Post.findAndCountAll
		});
	}
	*/
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

		switch (paramName) {
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
		case 'CATEGORIES':
			isExist = true;
			break;
		case 'MODE':
			isExist = true;
			break;
		case 'POSTIMG':
			isExist = true;
			break;
		case 'POSTIMGID':
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
			PostID: withId ? `POST-${GUID.toUpperCase()}` : {
				val: '',
				type: 'nullable',
				check: false,
				exclude: true
			},
			title: {
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
			},
			categories: {
				val: '',
				type: 'ARRAY',
				check: true,
				exclude: false
			},
			mode:{
				val: '',
				type: 'STRING',
				check: true,
				exclude: false
			},
			postImg: {
				val: '',
				type: 'NULLABLE',
				check: true,
				exclude: false
			},
			postImgID: {
				val: '',
				type:'NULLABLE',
				check: true,
				exclude: false
			}
		};
	}
}

module.exports = PostModel;