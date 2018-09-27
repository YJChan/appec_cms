riot.tag2('sc-login', '<div class="center {theme}" if="{login === false}"> <h3>Welcome to </h3> <h2> Appec Simple CMS</h2> <small>Strength and growth come only through continuous effort and struggle.</small> <hr> <input ref="admin_email" class="login-input input-box" placeholder="email" type="email"> <input ref="admin_pwd" type="password" class="login-input input-box" placeholder="password"> <br> <mino-btn type="submit" theme="primary" onclick="{() => AdminLogin()}">Login</mino-btn> </div>', 'sc-login .center,[data-is="sc-login"] .center{ position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); text-align:center; padding: 50px; } sc-login h2,[data-is="sc-login"] h2{ font-weight: 400; } sc-login .login-input,[data-is="sc-login"] .login-input{ display: inline-flex; width: 300px; font-family: \'Lato\', Helvetica, sans-serif; }', '', function(opts) {
    this.mixin(minoCookie);
    this.theme = '';
    this.login = false;
    this.security_phase = false;
    var baseURL = '';
    var self = this;

    var mainControl = this.riotx.get('main-control');

    this.on('mount', function(){
      this.theme = this.getCookie('theme');
      this.update();
    });

    mainControl.change('LoginStatus', function(state, c){
      var loginStatus = c.getter('loginStatusGetter');
      if(loginStatus.status){
        if(loginStatus.token !== '' && loginStatus.token !== null){
          self.setCookie('auth_token', loginStatus.token, 1);
          self.setCookie('ssid', loginStatus.ssid, 3);
          self.login = true;
          if(loginStatus.security_phase){
            self.security_phase = true;
            self.update();
          }else{
            self.proceed(loginStatus.path);
          }
        }
      }
    });

    this.AdminLogin = function(){
      var loginForm = {
        admin_email: this.refs.admin_email.value,
        admin_pwd: this.refs.admin_pwd.value
      }
      mainControl.action('loginAction', {formdata:loginForm});
    }.bind(this)

    this.SecurityPhaseVerification = function(){
      console.log('verify');
    }.bind(this)

    this.proceed = function(path){
      baseURL = mainControl.getter('baseURLGetter');
      window.location.replace('/' + path + '/admin');
    }.bind(this)
});
riot.tag2('sc-edit-admin', '<div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> Create Admin </div> <div class="siimple--display-block siimple--bg-white sc-panel"> <div class="siimple-form"> <div class="siimple-form-title">Create a new admin</div> <div class="siimple-form-detail">Please fill up the form to complete the creation</div> <div class="siimple-form-field"> <label class="siimple-label input-label">Admin Name </label> <input type="text" ref="inpAdminName" class="siimple-input" placeholder="Johnny English"> <div class="space"></div> <label class="siimple-label input-label">Admin Email</label> <input ref="inpAdminEmail" class="siimple-input" placeholder="johnny@email.com" type="email"> </div> <div class="siimple-form-field"> <label class="siimple-label input-label">Password</label> <input type="password" ref="inpPassword" class="siimple-input" placeholder="******"> <div class="space"></div> <label class="siimple-label input-label">Confirm Password</label> <input type="password" ref="inpConfPassword" class="siimple-input" placeholder="******"> </div> <div class="siimple-form-field"> <label class="siimple-label input-label">Role</label> <select class="siimple-select" ref="roleSel"> <option each="{roles}" riot-value="{RoleID}">{Rolename}</option> </select> <div class="space"></div> <label class="siimple-label">Level</label> <select class="siimple-select" ref="levelSel"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> <div class="space"></div> <label class="siimple-label">Active</label> <div class="siimple-checkbox"> <input type="checkbox" ref="activeChk" id="activeChk"> <label for="activeChk"></label> </div> <label class="siimple-label">Master</label> <div class="siimple-checkbox"> <input type="checkbox" ref="masterChk" id="masterChk"> <label for="masterChk"></label> </div> </div> <div class="siimple-form-field"> <div class="siimple-form-field-label">Security Phase</div> <input type="text" ref="inpSecurePhase" class="siimple-input siimple-input--fluid" placeholder="Superhero is everywhere!"> </div> <div class="siimple-form-field"> <div class="siimple-btn siimple-btn--blue" onclick="{() => createAdmin()}">Create</div> <div class="siimple-btn siimple-btn--red siimple--float-right" onclick="{() => cancelCreate()}">Cancel</div> </div> </div> </div> </div> <div>', 'sc-edit-admin .space,[data-is="sc-edit-admin"] .space{ width: 5%; display: inline-block; } sc-edit-admin .input-label,[data-is="sc-edit-admin"] .input-label{ width: 15%; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.roles = '';
    this.created_admin = '';
    riot.scAdminWard = new scAdminObserver();
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('mount', function(){
      this.getRolesList();
    });

    this.getRolesList = function(){
      mainControl.action('getRolesAction', {});
    }.bind(this)

    this.passwordValidate = function(pwd, conf_pwd){
      if(pwd === conf_pwd){
        return true;
      }else{
        return false;
      }
    }.bind(this)

    this.validateEmail = function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }.bind(this)

    this.createAdmin = function(){
      var admin_name = this.refs.inpAdminName.value;
      var admin_email = this.refs.inpAdminEmail.value;
      var password  = this.refs.inpPassword.value;
      var confirm_password = this.refs.inpConfPassword.value;
      var role = this.refs.roleSel.value;
      var level = this.refs.levelSel.value;
      var active = this.refs.activeChk.checked ? 1: 0;
      var master = this.refs.masterChk.checked ? 1: 0;
      var validated = false;
      validated = this.passwordValidate(password, confirm_password);
      validated = this.validateEmail(admin_email);
      if(validated){
        var admin = {
          admin_name: admin_name,
          admin_email: admin_email,
          admin_pwd: password,
          role: role,
          level: level,
          active: active,
          isMaster: master
        }
        mainControl.action('createAdminAction', {formdata: admin});
      }else{

      }
    }.bind(this)

    this.cancelCreate = function(){
      self.parent.deleteAdmin();
    }.bind(this)

    mainControl.change('AdminCreated', function(state, c){
      self.created_admin = c.getter('adminCreationGetter');
      console.log(self.created_admin);
      self.parent.deleteAdmin();
    });

    mainControl.change('RolesRetrieved', function(state, c){
      self.roles = c.getter('getListOfRoles');
      self.update();
    });

});
riot.tag2('sc-list-admin', '<mino-alert type="dismiss" theme="warning alert-block" if="{delSomeone}">{}</mino-alert> <div class="siimple-table siimple-table--hover"> <div class="siimple-table-header"> <div class="siimple-table-row"> <div class="siimple-table-cell"></div> <div class="siimple-table-cell">Username</div> <div class="siimple-table-cell">Email</div> <div class="siimple-table-cell">Role Name</div> <div class="siimple-table-cell">Level</div> <div class="siimple-table-cell">Master</div> <div class="siimple-table-cell">Active</div> </div> </div> <div class="siimple-table-body"> <div class="siimple-table-row" if="{list_of_admins !== []}" each="{list_of_admins}"> <div class="siimple-table-cell"> <input type="checkbox" ref="chkAdmin" riot-value="{AdminID}" if="{isMaster !== 1}"> </div> <div class="siimple-table-cell"> {AdminName}<br> <small onclick="{() => editAdmin()}">{AdminID}</small> </div> <div class="siimple-table-cell"> {AdminEmail} </div> <div class="siimple-table-cell"> <div class="siimple-tag siimple-tag--yellow"> {AdminRole.Rolename} </div> </div> <div class="siimple-table-cell"> {level} </div> <div class="siimple-table-cell"> <div class="siimple-tag {isMaster === 1? \'siimple-tag--navy\': \'siimple-tag--grey\'}"> {this.strManipulate(isMaster, {trueValue: \'master\', falseValue: \'normal admin\'})} </div> </div> <div class="siimple-table-cell"> <div class="siimple-tag {active === 1? \'siimple-tag--green\': \'siimple-tag--orange\'}"> {this.strManipulate(active, {trueValue: \'active\', falseValue: \'inactive\'})} </div> </div> </div> </div> </div>', 'sc-list-admin small,[data-is="sc-list-admin"] small{ font-size: 11px; color: #aaa; }', '', function(opts) {
riot.tag2('mino-alert', '<div class="alert {type === \'dismiss\'? \'alert-close\': \'\'} {type === \'auto-dismiss\'? \'alert-auto\': \'\'} {class} {theme}" onclick="{type === \'dismiss\' ? () => dismissAlert(e): \'\'}"><yield></yield>{message}</div>', 'mino-alert,[data-is="mino-alert"]{ font-family: \'Lato\', Helvetica, sans-serif; color: #333447; line-height: 1.5; } mino-alert .alert,[data-is="mino-alert"] .alert{ border-radius: 0.2rem; padding: 0.5em 0.675rem; position: relative; margin-bottom: 1rem; } mino-alert .alert-close,[data-is="mino-alert"] .alert-close{ cursor: pointer; } mino-alert .alert-block,[data-is="mino-alert"] .alert-block{ display: block; } mino-alert .light,[data-is="mino-alert"] .light{ background-color: #f4f4f4; color: #1D2F3A; } mino-alert .warning,[data-is="mino-alert"] .warning{ background-color: #F32260; color: #FCF7FA; } mino-alert .success,[data-is="mino-alert"] .success{ background-color: #1ECE80; color: #FCF7FA; } mino-alert .primary,[data-is="mino-alert"] .primary{ background-color: #456990; color: #FCF7FA; } mino-alert .dark,[data-is="mino-alert"] .dark{ background-color: #323C46; color: #FCF7FA; } mino-alert .note,[data-is="mino-alert"] .note{ background-color: #FFD011; color: #1D2F3A; } mino-alert .default,[data-is="mino-alert"] .default{ background-color: #989898; color: #FCF7FA; }', '', function(opts) {

    this.type = opts.type !== undefined? opts.type: 'display';
    this.message = opts.message !== undefined? opts.message: '';
    this.stay = opts.stay !== undefined? opts.stay: '';
    this.class = opts.class;
    this.theme = opts.theme !== undefined? opts.theme: 'default';
    this.display = opts.display;
    var self = this;

    this.on('mount', function(){
      console.log('mounted');

      if(this.type === "auto-dismiss"){
        console.log('auto');
        this.autoDismiss();
      }

      if(this.display !== ""){
        this.root.childNodes[0].style.display = this.display;
      }
    });

    this.dismissAlert = function(){
      dismiss();
    }.bind(this)

    this.autoDismiss = function(){
      if(! isNaN(this.stay)){
        var timeout = parseInt(this.stay) * 1000;
        setInterval(dismiss, timeout);
      }
    }.bind(this)

    function dismiss(){
      self.unmount(true);
    }
});
    this.list_of_admins = opts.lists !== undefined? opts.lists: [];
    this.delSomeone = false;
    this.delMsg = '';
    var self = this;
    var mainControl = this.riotx.get('main-control');

    this.on('mount', function(){

    });

    mainControl.change('AdminsRetrieved', function(state, c){
      self.list_of_admins = c.getter('getListOfAdminGetter');
      self.update();
    });

    mainControl.change('AdminsDeleted', function(state, c){
      var delStatus = c.getter('getDeletedAdminsGetter');
      if(delStatus.success.status){
        self.delSomeone = true;
        self.delMsg = delStatus.result;
        self.parent.getAdminList();
        self.update();
      }else{
        self.delSomeone = true;
        self.delMsg = delStatus.error.msg;
        self.update();
      }
    });

    riot.scAdminWard.on('delAction', function(){
      var adminsToDel = [];
      if (self.refs.chkAdmin.length  > 1){
        for(var i in self.refs.chkAdmin){
          if(self.refs.chkAdmin[i].checked){
            adminsToDel.push(self.refs.chkAdmin[i].value);
          }
        }
      }else{
        adminsToDel.push(self.refs.chkAdmin.value);
      }
      if(adminsToDel.length > 0){
        var admins = {
          admins: adminsToDel
        };
        mainControl.action('delAdminAction', {formdata: admins});
      }
    });

    this.editAdmin = function(){
      alert('navigate');
      console.log('navigate to edit');
    }.bind(this)

    this.strManipulate = function(val, expected){
      if(val === 1){
        return expected.trueValue;
      }else{
        return expected.falseValue;
      }
    }.bind(this)

});
riot.tag2('sc-manage-admin', '<div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> Manage Admin </div> <div class="siimple--display-block siimple--bg-light sc-panel"> <div class="siimple-btn siimple-btn--navy" onclick="{() => createAdmin()}">Create</div> <div class="siimple-btn siimple-btn--red siimple--float-right" onclick="{() => deleteAdmin()}">Delete</div> </div> </div> <sc-list-admin if="{list}"></sc-list-admin> <sc-edit-admin if="{edit}"></sc-edit-admin> <div>', 'sc-manage-admin .sc-title,[data-is="sc-manage-admin"] .sc-title{ padding: 5px; border-radius: 4px 4px 0px 0px; } sc-manage-admin .sc-panel,[data-is="sc-manage-admin"] .sc-panel{ padding: 10px; margin-bottom: 15px; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.list = true;
    this.list_of_admins = [];
    this.edit = false;

    riot.scAdminWard = new scAdminObserver();
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('mount', function(){
      this.getAdminList()
    });

    this.getAdminList = function(){
      mainControl.action('getListOfAdminsAction', {});
    }.bind(this)

    this.createAdmin = function(){
      if(! this.edit){
        this.list = false;
        this.edit = true;
      }
      this.update();

    }.bind(this)

    this.deleteAdmin = function(){
      if(! this.list){
        this.list = true;
        this.edit = false;
        this.getAdminList();
        this.update();
      }else{
        riot.scAdminWard.trigger('delAction');
      }
    }.bind(this)

});
riot.tag2('sc-manage-right', '<h1>Manage right</h1>', '', '', function(opts) {
});
riot.tag2('sc-manage-role', '<h1>Manage role</h1>', '', '', function(opts) {
});
riot.tag2('sc-navbar', '<div class="siimple-navbar siimple-navbar--extra-large siimple-navbar--dark"> <div class="siimple-navbar-title">Admin panel</div> <div class="siimple--float-right"> <div class="siimple-navbar-item">Profile</div> <div class="siimple-navbar-item">Logout</div> </div> </div>', '', '', function(opts) {
});
riot.tag2('sc-route', '<div class="siimple-grid-col siimple-grid-col--2"> <div class="siimple-menu sc-menu"> <div class="siimple-menu-group">Administration</div> <div each="{routes}"> <a class="siimple-menu-item" href="#{url}">{name}</a> </div> </div> </div> <div class="siimple-grid-col siimple-grid-col--10"> <div class="siimple-content siimple-content--fluid sc-main-panel"> <sc-manage-admin if="{admin_route.m_admin}"></sc-manage-admin> <sc-manage-right if="{admin_route.m_right}"></sc-manage-right> <sc-manage-role if="{admin_route.m_role}"></sc-manage-role> </div> </div>', 'sc-route .sc-menu,[data-is="sc-route"] .sc-menu{ border: 1px solid #ddd; padding:10px; border-radius: 4px; } sc-route .sc-main-panel,[data-is="sc-route"] .sc-main-panel{ padding: 15px; border: 1px solid #ddd; border-radius: 4px; }', '', function(opts) {
    this.mixin(minoCookie);
    this.theme = '';
    this.routes = [
      {name: 'Manage Admins', url:'manage-admins'},
      {name: 'Manage Rights',url: 'manage-rights'},
      {name: 'Manage Roles', url: 'manage-roles'}
    ];
    this.admin_route = {
      m_admin: false,
      m_right: false,
      m_role: false
    };

    var self = this;
    var mainControl = this.riotx.get('main-control');

    this.on('mount', function(){
      this.theme = this.getCookie('theme');
      this.update();
    });

    this.rotueChange = function(r){
      for(var r_name in this.admin_route){
        if(r === r_name){
          this.admin_route[r_name] = true;
        }else{
          this.admin_route[r_name] = false;
        }
      }
    }.bind(this)

    var sc_route = route.create();
    sc_route('manage-admins', function(){
      self.rotueChange('m_admin');
      self.update();
    });

    sc_route('manage-rights', function(){
      self.rotueChange('m_right');
      self.update();
    });

    sc_route('manage-roles', function(){
      self.rotueChange('m_role');
      self.update();
    });

    route.start(true);

});