const base_url = 'http://localhost:3000/';

var readCookie = function (name) {
	var nameEQ = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) {      
			return c.substring(nameEQ.length, c.length);
		}
	}
	return null;
};

var unAuthRedirect = function(){
	var path = window.location.pathname;
	path = path.split('/');
	path = path[1];
	window.location.replace(base_url + path + '/login');
};

const http = axios.create({
	baseURL: base_url,
	timeout: 1000000,
	headers: {
		'Authorization': 'Bearer ' + readCookie('auth_token')
	},
	maxContentLength: 20000
});

const loadingInterceptor = http.interceptors.request.use(function (config) {
	self.loading = false;
	return config;
}, function (error) {
	return Promise.reject(error);
});
http.interceptors.request.eject(loadingInterceptor);

const api = {
	admin:{
		login: {
			url: 'admin/login',
			required_param: ['email', 'password'],
			method: 'post'
		},
		lists: {
			url: 'admin/all',
			required_param: '',
			method: 'get'
		},
		delete: {
			url: 'admin/bulk',
			required_param: ['AdminID', 'AdminID'],
			method: 'delete'
		},
		create: {
			url: 'admin',      
			method: 'post'
		},
		edit: {
			get: {
				url: 'admin'
			},
			patch: {
				url: 'admin',
			}
		}, 
		acl: {
			post: {
				url: 'admin/acl'
			}
		}
	},
	role: {
		lists: {
			url: 'role/all',
			required_param: [''],
			method: 'get'
		},
		edit: {
			get: {
				url: 'role'
			},
			patch: {
				url: 'role'
			}      
		},
		save: {
			post: {
				url: 'role',
			},
			patch: {
				url: 'role'
			}
		}
	},
	right: {
		edit: {
			post: {
				url: 'right'      
			},
			patch: {
				url: 'right'
			}
		}
	},
	post: {
		lists: {
			get:{
				url: 'api/post/all',
			}
		},
		paginate: {
			get: {
				url: 'api/post/paginate'
			}
		},
		singlePost: {
			get: {
				url: 'api/post/post-get'
			},
			post: {
				url: 'api/post/post-create'
			},
			patch: {
				url: 'api/post/post-update'
			},
			delete: {
				url: 'api/post/post-del'
			}
		}
	}

};

var loginControl = new riotx.Store({
	name: 'main-control',
	state: {
		notification: {
			global: {
				notify_message:''
			}
		},
		baseUrl: base_url,
		admin:{
			login: false,
			login_user: '',
			token:'',
			ssid: '',
			security_phase: false,
			path: '',
			list_of_admin: [],
			deleted_status: false,
			created_admin: false,
			edit_admin: null,
			acl: ''
		},
		role: {
			list: '',
			list_of_role: [],
			edit_role: '',
			saved_role: ''
		},
		right: {
			right_updated: ''
		},
		post: {
			lists: '',
			single_post: '',
			updated_post: '',
			deleted_post: ''
		}
	},
	actions: {
		globalNotificationAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					context.commit('GlobalNotificationMutation', data);
				});
		},
		loginAction: function (context, data) {
			return Promise.resolve()
				.then(function () {
					try {
						http.post(api.admin.login.url, data.formdata)
							.then((response) => {
								if(response.status === 200)  {                  
									context.commit('loginMutation', {
										param: response.data.result
									});
								}else{
									throw response.error.message;
								}
							});
					} catch (e) {
						console.error(e);
						return e;
					}
				});
		},
		logoutAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					unAuthRedirect();
				});
		},
		getAccessListAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						http.post(api.admin.acl.post.url,{})
							.then((response) => {
								if(response.status === 200){
									context.commit('getAclMutation', {
										param: response.data
									});
								}else if(response.status === 401){
									unAuthRedirect();
								}
							});
					}catch(e){
						console.error(e);
						return e;
					}
        
				});
		},
		getListOfAdminsAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						http.get(api.admin.lists.url)
							.then((response) =>{
								if(response.status === 200){
									console.log(response.data);
									context.commit('getListOfAdminMutation',{
										param: response.data
									});
								}else{
									throw response.error;
								}
							});
					}catch(e){
						console.error(e);
						return e;
					}        
				});
		},
		delAdminAction: function(context, data){
			return Promise.resolve()
				.then(function() {
					try{
						http.delete(api.admin.delete.url, {data:data.formdata})
							.then((response) => {
								if(response.status === 200){
									context.commit('delAdminsMutation', {
										param: response.data
									});
								}else{
									context.commit('delAdminsMutation', {
										param: response.data
									});
									//throw response.error;
								}
							});
					}catch(e){
						console.error(e);
						return e;
					}
				});
		},
		getRolesAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						http.get(api.role.lists.url)
							.then((response) => {
								if(response.status === 200){
									context.commit('getRolesMutation', {
										param: response.data
									});
								}else{
									//show error notification
								}
							});
					}catch(e){
						console.log(e);
						return e;
					}
				});
		},
		createAdminAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						http.post(api.admin.create.url, data.formdata)
							.then((response) => {
								if(response.status === 200){
									context.commit('createAdminMutation', {
										param: response.data
									});
								}else{
									console.log(response.data);
								}
							});
					}catch(e){
						console.log(e);
						return e;
					}        
				});
		},
		getAdminDetailAction : function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						http.get(api.admin.edit.get.url, {
							params: {
								id: data.param
							}
						}).then((response) => {
							if(response.status === 200) {
								context.commit('getAdminDetailMutation', {
									param: response.data
								});
							}else{
								//show error notification
							}
						});
        
					}catch(e){
						console.log(e);
						return e;          
					}
        
				});
		},
		saveAdminAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						http.patch(api.admin.edit.patch.url + '/' + data.formdata.admin_id, data.formdata)
							.then((response) => {
								if(response.status === 200){
									context.commit('getAdminDetailMutation', {
										param: response.data
									});
								}
							});
					}catch(e){
						console.error(e);
						return e;
					}        
				});
		},
		getRoleDetailAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						http.get(api.role.edit.get.url + '/' + data.param)
							.then((response) => {
								if(response.status === 200){
									context.commit('getRoleDetailMutation', {
										param: response.data
									});
								}
							});
					}catch(e){
						console.error(e);
						return e;
					}        
				});
		},
		saveRoleAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						var action = data.action;
						var role = data.role;
						if(action === 'create'){
							http.post(api.role.save.post.url, role)
								.then((response) => {
									if(response.status === 200){
										context.commit('saveRoleMutation', {
											action: 'create',
											param: response.data
										});
									}else if(response.status === 401){
										unAuthRedirect();
									}
								});
						}else if(action === 'update'){
							var roleid = data.role.roleid;
							http.patch(api.role.save.patch.url + '/' + roleid, role)
								.then((response) => {
									if (response.status === 200) {
										context.commit('saveRoleMutation', {
											action: 'update',
											param: response.data
										});
									} else if (response.status === 401) {
										unAuthRedirect();
									}
								});
						}
					}catch(e){
						console.error(e);
						return e;
					}        
				});
		},
		editRightAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						var right = data.right.role;
						var action = data.right.action;
						var right_id = data.right.right_id;
						var acl = data.right.acl;
						var roleid = data.right.roleid;
						switch(right){
						case 'admin':
							if(action === 'update'){
								http.patch(api.right.edit.patch.url + '/' + right_id, {
									module: 'admin', 
									section: 'none', 
									acl: acl,
									roleid: roleid
								})
									.then((response) => {
										if(response.status === 200){
											context.commit('editRightMutation', {
												param: response.data
											});
										}
									});
							}else{
								http.post(api.right.edit.post.url, {
									module: 'admin',
									section: 'none',
									acl: acl,
									roleid: roleid
								}).then((response) => {
									if (response.status === 200) {
										context.commit('editRightMutation', {
											module: 'admin',
											param: response.data
										});
									}
								});
							}
							break;
						case 'page':
							if (action === 'update') {
								http.patch(api.right.edit.patch.url + '/' + right_id, {
									module: 'page',
									section: 'none',
									acl: acl,
									roleid: roleid
								})
									.then((response) => {
										if (response.status === 200) {
											context.commit('editRightMutation', {
												module: 'page',
												param: response.data
											});
										}
									});
							} else {
								http.post(api.right.edit.post.url, {
									module: 'page',
									section: 'none',
									acl: acl,
									roleid: roleid
								}).then((response) => {
									if (response.status === 200) {
										context.commit('editRightMutation', {
											module: 'page',
											param: response.data
										});
									}
								});
							}
							break;
						case 'post':
							if (action === 'update') {
								http.patch(api.right.edit.patch.url + '/' + right_id, {
									module: 'post',
									section: 'none',
									acl: acl,
									roleid: roleid
								})
									.then((response) => {
										if (response.status === 200) {
											context.commit('editRightMutation', {
												module: 'post',
												param: response.data
											});
										}
									});
							} else {
								http.post(api.right.edit.post.url, {
									module: 'post',
									section: 'none',
									acl: acl,
									roleid: roleid
								}).then((response) => {
									if (response.status === 200) {
										context.commit('editRightMutation', {
											module: 'post',
											param: response.data
										});
									}
								});
							}
							break;
						case 'right':
							if (action === 'update') {
								http.patch(api.right.edit.patch.url + '/' + right_id, {
									module: 'right',
									section: 'none',
									acl: acl,
									roleid: roleid
								})
									.then((response) => {
										if (response.status === 200) {
											context.commit('editRightMutation', {
												module: 'right',
												param: response.data
											});
										}
									});
							} else {
								http.post(api.right.edit.post.url, {
									module: 'right',
									section: 'none',
									acl: acl,
									roleid: roleid
								}).then((response) => {
									if (response.status === 200) {
										context.commit('editRightMutation', {
											module: 'right',
											param: response.data
										});
									}
								});
							}
							break;
						case 'role':
							if (action === 'update') {
								http.patch(api.right.edit.patch.url + '/' + right_id, {
									module: 'role',
									section: 'none',
									acl: acl,
									roleid: roleid
								})
									.then((response) => {
										if (response.status === 200) {
											context.commit('editRightMutation', {
												module: 'role',
												param: response.data
											});
										}
									});
							} else {
								http.post(api.right.edit.post.url, {
									module: 'role',
									section: 'none',
									acl: acl,
									roleid: roleid
								}).then((response) => {
									if (response.status === 200) {
										context.commit('editRightMutation', {
											module: 'role',
											param: response.data
										});
									}
								});
							}
							break;
						case 'user':
							if (action === 'update') {
								http.patch(api.right.edit.patch.url + '/' + right_id, {
									module: 'user',
									section: 'none',
									acl: acl,
									roleid: roleid
								})
									.then((response) => {
										if (response.status === 200) {
											context.commit('editRightMutation', {
												module: 'user',
												param: response.data
											});
										}
									});
							} else {
								http.post(api.right.edit.post.url, {
									module: 'user',
									section: 'none',
									acl: acl,
									roleid: roleid
								}).then((response) => {
									if (response.status === 200) {
										context.commit('editRightMutation', {
											module: 'user',
											param: response.data
										});
									}
								});
							}
							break;
						}
					}catch(e){

					}        
				});
		},
		getPaginatePostAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						var pageNum = data.pageNum;
						http.get(api.post.paginate.get.url + '/' + pageNum)
							.then((response) => {
								if(response.status === 200){
									context.commit('getPaginatePostMutation', {
										param: response.data
									});
								}else if(response.status === 401){
									unAuthRedirect();
								}
							});
					}catch(e){
						console.error(e);
						return e;
					}
				});      
		},
		getPostByIDAction: function(context, data){
			return Promise.resolve()
				.then(function() {					
					try{
						var postId = data.param;
						http.get(api.post.singlePost.get.url + '/' + postId)
							.then((response) => {
								if(response.status === 200){
									context.commit('getPostByIDMutation', {
										param: response.data
									});
								}else if(response.status === 401){
									unAuthRedirect();
								}
							});
					}catch(e){
						console.error(e);
						return e;
					}
				});
		},
		savePostAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						var postId = data.postId;
						var oPost = {};
						if(data.title.length > 0){
							oPost['title'] = data.title;
						}
						if (data.content.length > 0) {
							oPost['content'] = data.content;
						}
						if (! isNaN(data.active)) {
							oPost['active'] = data.active;
						}
						if (! isNaN(data.allowComment)) {
							oPost['allowComment'] = data.comment;
						}
						if (data.publishDate.length > 0) {
							oPost['publishDate'] = data.publishDate;
						}
						if (! isNaN(data.visibility)) {
							oPost['visibility'] = data.visibility;
						}
						http.patch(api.post.singlePost.patch.url + '/' + postId, oPost)
							.then((response) => {
								if(response.status === 200){
									context.commit('savePostMutation', {param:response.data});
								}else if(response.status === 401){
									unAuthRedirect();
								}
							}).catch((err) => {
								alert(err.response.data.error.message);
								console.error('%c ' + err.response.data.error.message, 'color: orange; font-weight: bold;');								
							});
					}catch(e){
						console.error(e);
						return e;
					}					
				});
		},
		deleteSinglePostAction: function(context, data){
			return Promise.resolve()
				.then(function(){
					try{
						var postId = data.postId;
						http.delete(api.post.singlePost.delete.url + '/' + postId)
							.then((response) => {
								if(response.status === 200){
									context.commit('deleteSinglePostMutation', {param: response.data});
								}else if(response.status === 401){
									unAuthRedirect();
								}
							});
					}catch(err){
						alert(err.response.data.error.message);
						console.error('%c ' + err.response.data.error.message, 'color: orange; font-weight: bold;');
					}					
				});
		}
	},
	mutations: {   
		GlobalNotificationMutation: function (context, data){
			context.state.notification.global.notify_message = data.message;
			return ['onGlobalNotify'];
		},
		loginMutation: function (context, data) {
			context.state.admin.login = true;
			context.state.admin.security_phase = data.param.security_phase;
			context.state.admin.path = data.param.path;
			context.state.admin.ssid = data.param.ssid;
			if(data.param.token != null && data.param.token !== undefined){
				context.state.admin.token = data.param.token;
			}

			return ['LoginStatus'];
		},
		getAclMutation: function (context, data){
			context.state.admin.acl = data.param;
			return ['AccessListRetrieved'];
		},
		getListOfAdminMutation: function (context, data){
			context.state.list_of_admin = data.param.result;
			return ['AdminsRetrieved'];
		},
		delAdminsMutation: function (context, data){
			context.state.deleted_status = data.param;
			return ['AdminsDeleted'];
		},
		getRolesMutation: function (context, data) {
			context.state.role.list = data.param.result;
			return ['RolesRetrieved'];
		},
		createAdminMutation: function (context, data){
			context.state.created_admin = data.param.result;
			return ['AdminCreated'];
		},
		getAdminDetailMutation: function (context, data){
			if(Array.isArray(data.param.result)){
				context.state.edit_admin = data.param.result[0];
				return ['GetAdminToEdit'];
			}else{
				context.state.edit_admin = data.param.result;
				return ['UpdatedAdminDetail'];
			}                  
		},
		getRoleDetailMutation: function (context, data) {
			context.state.role.edit_role = data.param.result[0];
			console.log(data.param.result);
			return ['GetRoleToEdit'];
		},
		editRightMutation: function (context, data){
			console.log(data);
			context.state.right.right_updated = data.param;
			return ['RightUpdated'];
		},
		saveRoleMutation : function (context, data){
			if(data.action === 'create'){
				context.state.role.saved_role = data.param;
				return ['RoleCreated'];
			}else if(data.action === 'update'){
				context.state.role.saved_role = data.param;
				return ['RoleSaved'];
			}
		},
		getPaginatePostMutation: function (context, data) {
			context.state.post.lists = data.param;
			return ['RetrievePaginatePosts'];
		},
		getPostByIDMutation : function (context, data){
			context.state.post.single_post = data.param;
			return ['SinglePostRetrieved'];
		},
		savePostMutation: function (context, data){
			context.state.post.updated_post = data.param;
			return ['SinglePostSaved'];
		},
		deleteSinglePostMutation: function (context, data) {
			context.state.post.deleted_post = data.param;
			return ['SinglePostDeleted'];
		}
	},
	getters: {
		globalNotificationGetter: function (context) {
			return context.state.notification.global.notify_message;
		},
		baseURLGetter: function(context){
			return context.state.baseURL;
		},
		loginStatusGetter: function (context) {
			return {
				status: context.state.admin.login,
				token: context.state.admin.token,
				security_phase: context.state.admin.security_phase,
				ssid: context.state.admin.ssid,
				path: context.state.admin.path
			};
		},
		getAccessListGetter: function(context){
			return context.state.admin.acl;
		},
		getListOfAdminGetter: function (context) {
			return context.state.list_of_admin;
		},
		getDeletedAdminsGetter: function (context) {
			return context.state.deleted_status;
		},
		getListOfRoles: function(context){
			return context.state.role.list;
		},
		adminCreationGetter: function(context){
			return context.state.created_admin;
		},
		getEditAdminGetter: function (context) {
			return context.state.edit_admin;
		},
		getEditRoleGetter: function (context) {
			return context.state.role.edit_role;
		},
		getRoleRightGetter: function(context){
			return context.state.right.right_updated;
		},
		getRoleSaveGetter : function (context) {
			return context.state.role.saved_role;
		},
		getPaginatePostGetter: function(context){
			return context.state.post.lists;
		},
		getSinglePostByIDGetter: function(context) {
			return context.state.post.single_post;
		},
		savePostGetter: function (context) {
			return context.state.post.updated_post;
		},
		deleteSinglePostGetter: function (context) {
			return context.state.post.deleted_post;
		}
	}
});

riotx.add(loginControl);
//riotx.debug(true);