const base_url = 'http://localhost:3000/';

var readCookie = function (name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {      
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

const http = axios.create({
  baseURL: base_url,
  timeout: 1000000,
  headers: {
    'Authorization': 'Bearer ' + readCookie("auth_token")
  }
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
    }
  },
  role: {
    lists: {
      url: 'role/all',
      required_param: [''],
      method: 'get'
    }
  }
};

var loginControl = new riotx.Store({
  name: 'main-control',
  state: {
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
      created_admin: false
    },
    role: {
      list: ''
    }
  },
  actions: {
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
      })
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
              })
            }else{
              //show error notification
            }
          });
        }catch(e){
          console.log(e);
          return e;
        }        
      })
    }
  },
  mutations: {   
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
    }
  },
  getters: {
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
    }
  }
});

riotx.add(loginControl);
riotx.debug(true);