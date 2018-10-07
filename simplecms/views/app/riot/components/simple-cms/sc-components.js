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
riot.tag2('sc-edit-admin', '<div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> {act === \'create\'? \'Create\': \'Edit\'} Admin </div> <div class="siimple--display-block siimple--bg-white sc-panel"> <div class="siimple-form"> <div class="siimple-form-title" if="{act===\'create\'}">Create a new admin</div> <div class="siimple-form-title" if="{act===\'edit\'}">Edit Admin - {edit_admin.AdminName}</div> <div class="siimple-form-detail">Please fill up the form to complete the form.</div> <div class="siimple-form-field"> <label class="siimple-label input-label">Admin Name </label> <input type="text" ref="inpAdminName" class="siimple-input" placeholder="Johnny English"> <div class="space"></div> <label class="siimple-label input-label">Admin Email</label> <input ref="inpAdminEmail" class="siimple-input" placeholder="johnny@email.com" type="email"> </div> <div class="siimple-form-field"> <label class="siimple-label input-label">Password</label> <input type="password" ref="inpPassword" class="siimple-input" placeholder="******"> <div class="space"></div> <label class="siimple-label input-label">Confirm Password</label> <input type="password" ref="inpConfPassword" class="siimple-input" placeholder="******"> </div> <div class="siimple-form-field"> <label class="siimple-label input-label">Role</label> <select class="siimple-select" ref="roleSel" if="{change_role}"> <option each="{roles}" if="{active === 1}" riot-value="{RoleID}">{Rolename}</option> </select> &nbsp; <div class="siimple-close close-btn" if="{edit_admin !== \'\' && change_role}" onclick="{() => changeRole(false)}"></div> <span class="siimple-tag label-btn {edit_admin.RoleID !== null? \'siimple-tag--yellow\': \'siimple-tag--red\'}" if="{!change_role}" onclick="{() => changeRole(true)}"> {edit_admin.RoleID !== null? edit_admin.Rolename: \'No Role\'} </span> <input ref="roleSel" type="hidden" riot-value="{edit_admin.RoleID}" if="{!change_role}"> <div class="space"></div> <label class="siimple-label">Level</label> <select class="siimple-select" ref="levelSel"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> <div class="space"></div> <label class="siimple-label">Active</label> <div class="siimple-checkbox"> <input type="checkbox" ref="activeChk" id="activeChk"> <label for="activeChk"></label> </div> </div> <div class="siimple-form-field"> <div class="siimple-form-field-label">Security Phase</div> <input type="text" ref="inpSecurePhase" class="siimple-input siimple-input--fluid"> </div> <div class="siimple-form-field"> <div class="siimple-btn siimple-btn--blue" onclick="{() => saveAdmin()}" if="{admin_id !== \'\'}">Save</div> <div class="siimple-btn siimple-btn--blue" onclick="{() => createAdmin()}" if="{admin_id === \'\'}">Create</div> &nbsp; <div class="siimple-btn siimple-btn--red" onclick="{() => cancelCreate()}">Cancel</div> </div> </div> </div> </div> <div>', 'sc-edit-admin .space,[data-is="sc-edit-admin"] .space{ width: 5%; display: inline-block; } sc-edit-admin .close-btn,[data-is="sc-edit-admin"] .close-btn{ margin: 5px 4px; } sc-edit-admin .input-label,[data-is="sc-edit-admin"] .input-label{ width: 15%; } sc-edit-admin .label-btn,[data-is="sc-edit-admin"] .label-btn{ height: 25px; width: 5%; text-align: center; line-height: 2.5; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.roles = '';
    this.created_admin = '';
    this.admin_id = '';
    this.edit_admin = '';
    this.change_role = false;
    this.act = opts.act !== undefined? opts.act: 'create';

    riot.scAdminWard = new scAdminObserver();
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('mount', function(){
      if(opts.act === 'create'){
        this.change_role = true;
      }
      this.getRolesList();
    });

    this.on('update', function(){
      if(self.admin_id !== ''){
        self.adminDetail();
      }
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
      var security_phase = this.refs.inpSecurePhase.value;

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
          security_phase: security_phase
        }
        mainControl.action('createAdminAction', {formdata: admin});
      }else{

      }
    }.bind(this)

    this.saveAdmin = function(){
      var admin_id = self.admin_id;
      var admin_name = this.refs.inpAdminName.value;
      var admin_email = this.refs.inpAdminEmail.value;
      var password  = this.refs.inpPassword.value;
      var confirm_password = this.refs.inpConfPassword.value;
      var role = this.refs.roleSel.value;
      var level = this.refs.levelSel.value;
      var active = this.refs.activeChk.checked ? 1: 0;
      var security_phase = this.refs.inpSecurePhase.value;

      var validated = false;
      if(password !== '' || confirm_password !== ''){
        validated = this.passwordValidate(password, confirm_password);
      }
      validated = this.validateEmail(admin_email);
      if(validated){
        var admin = {
          admin_id: admin_id,
          admin_name: admin_name,
          admin_email: admin_email,
          role: role,
          level: level,
          active: active,
          security_phase: security_phase
        }
        if (password !== '' || confirm_password !== ''){
          admin['password'] = password;
        }

        mainControl.action('saveAdminAction', {formdata: admin});
      }else{

      }
    }.bind(this)

    this.cancelCreate = function(){
      self.parent.action = 'create';
      self.parent.deleteAdmin();
    }.bind(this)

    this.changeRole = function(c){
      this.change_role = c;
      self.update();
    }.bind(this)

    this.adminDetail = function(){
      self.refs.inpAdminName.value = self.edit_admin.AdminName;
      self.refs.inpAdminEmail.value = self.edit_admin.AdminEmail;
      self.refs.levelSel.value = self.edit_admin.level;
      self.refs.activeChk.checked = self.edit_admin.active === 1? true: false;

      self.refs.inpSecurePhase.value = self.edit_admin.security_phase;
    }.bind(this)

    mainControl.change('GetAdminToEdit', function(state, c){
      self.edit_admin = c.getter('getEditAdminGetter');
      self.admin_id = self.edit_admin.AdminID;
      self.update();
    });

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
riot.tag2('sc-list-admin', '<mino-alert type="dismiss" theme="warning alert-block" if="{delSomeone}">{}</mino-alert> <div class="siimple-table siimple-table--striped"> <div class="siimple-table-header"> <div class="siimple-table-row"> <div class="siimple-table-cell"></div> <div class="siimple-table-cell">Username</div> <div class="siimple-table-cell">Email</div> <div class="siimple-table-cell">Role Name</div> <div class="siimple-table-cell">Level</div> <div class="siimple-table-cell">Master</div> <div class="siimple-table-cell">Active</div> </div> </div> <div class="siimple-table-body"> <div class="siimple-table-row" if="{list_of_admins !== []}" each="{list_of_admins}"> <div class="siimple-table-cell"> <input type="checkbox" ref="chkAdmin" id="chkAdmin" riot-value="{AdminID}" if="{isMaster !== 1}"> </div> <div class="siimple-table-cell"> <div class="{isMaster !== 1? \'sc-edit-class\': \'\'}" onclick="{isMaster !== 1? () => editAdmin(AdminID): \'\'}"> {AdminName}<br> <small if="{isMaster !== 1}">{AdminID}</small> </div> </div> <div class="siimple-table-cell"> {AdminEmail} </div> <div class="siimple-table-cell"> <div class="siimple-tag siimple-tag--yellow"> {AdminRole.Rolename} </div> </div> <div class="siimple-table-cell"> {level} </div> <div class="siimple-table-cell"> <div class="siimple-tag {isMaster === 1? \'siimple-tag--navy\': \'siimple-tag--grey\'}"> {this.strManipulate(isMaster, {trueValue: \'master\', falseValue: \'normal admin\'})} </div> </div> <div class="siimple-table-cell"> <div class="siimple-tag {active === 1? \'siimple-tag--green\': \'siimple-tag--orange\'}"> {this.strManipulate(active, {trueValue: \'active\', falseValue: \'inactive\'})} </div> </div> </div> </div> </div>', 'sc-list-admin small,[data-is="sc-list-admin"] small{ font-size: 11px; color: #aaa; } sc-list-admin .sc-edit-class,[data-is="sc-list-admin"] .sc-edit-class{ cursor: pointer; padding: 10px; } sc-list-admin .sc-edit-class:hover,[data-is="sc-list-admin"] .sc-edit-class:hover{ background-color: #ddd; border-radius: 2px; }', '', function(opts) {
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
      self.parent.update({
        isLoading: false
      })
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

    this.editAdmin = function(admin_id){
      this.parent.editAdmin(admin_id);
    }.bind(this)

    this.strManipulate = function(val, expected){
      if(val === 1){
        return expected.trueValue;
      }else{
        return expected.falseValue;
      }
    }.bind(this)
});
riot.tag2('sc-manage-admin', '<div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> Manage Admin </div> <div class="siimple--display-block siimple--bg-light sc-panel"> <div class="siimple-btn siimple-btn--navy {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" onclick="{() => createAdmin()}">Create</div> <div class="siimple-btn siimple-btn--red siimple--float-right {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" onclick="{() => deleteAdmin()}">Delete</div> </div> </div> <div if="{isLoading}"> <div class="siimple-spinner siimple-spinner--teal"></div> </br/> </div> <sc-list-admin if="{list}"></sc-list-admin> <sc-edit-admin if="{edit}" admin_id="{admin_id}" act="{action}"></sc-edit-admin> <div>', 'sc-manage-admin .sc-title,[data-is="sc-manage-admin"] .sc-title{ padding: 5px; border-radius: 4px 4px 0px 0px; } sc-manage-admin .sc-panel,[data-is="sc-manage-admin"] .sc-panel{ padding: 10px; margin-bottom: 15px; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.list = true;
    this.list_of_admins = [];
    this.edit = false;
    this.admin_id = '';
    this.isLoading = false;
    this.action = 'create';

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
        this.action = 'create';
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

    this.editAdmin = function(admin_id){
      this.admin_id = admin_id;
      this.list = false;
      this.edit = true;
      this.action = 'edit';
      mainControl.action('getAdminDetailAction', {param: admin_id});
      this.update();
    }.bind(this)

    mainControl.change('UpdatedAdminDetail', function(state, c){
      var edit_admin = c.getter('getEditAdminGetter');
      console.log(edit_admin);
      if(edit_admin !== null){
        self.list = true;
        self.edit = false;
        self.isLoading = true;
        self.getAdminList();
      }
      self.update();
    });

});
riot.tag2('sc-edit-role', '<div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> {act === \'create\'? \'Create\': \'Edit\'} Role </div> <div class="siimple--display-block siimple--bg-white sc-panel"> <div class="siimple-form"> <div class="siimple-form-title" if="{act===\'create\'}">Create a new Role</div> <div class="siimple-form-title" if="{act===\'edit\'}">Edit Role - {edit_role.Rolename}</div> <div class="siimple-form-detail">Please fill up the form to complete the form.</div> <div class="siimple-form-field"> <label class="siimple-label input-label">Role Name </label> <input type="text" ref="inpRoleName" class="siimple-input"> <div class="space"></div> <label class="siimple-label">Active</label> <div class="siimple-checkbox"> <input type="checkbox" ref="activeChk" id="activeChk"> <label for="activeChk"></label> </div> <div class="sc-block"></div> <div class="siimple-form-field"> <div class="siimple-btn siimple-btn--blue" onclick="{() => saveRole()}" if="{role_id !== \'\'}">Save</div> <div class="siimple-btn siimple-btn--blue" onclick="{() => createRole()}" if="{role_id === \'\'}">Create</div> &nbsp; <div class="siimple-btn siimple-btn--red" onclick="{() => cancelCreate()}">Cancel</div> </div> </div> </div> </div> </div> </div> <div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> {act === \'create\'? \'Create\': \'Edit\'} Right - {edit_role.Rolename} </div> <div class="siimple--display-block siimple--bg-white sc-panel"> <div class="siimple-tip siimple-tip--primary"> Please select the role access right below. The updated access right will be reflect on the user next login. </div> <div class="siimple-form"> <div class="siimple-form-field"> <div class="siimple-table"> <div class="siimple-table-header"> <div class="siimple-table-row"> <div class="siimple-table-cell">Modules</div> <div class="siimple-table-cell">Acess Level</div> </div> </div> <div class="siimple-table-body"> <div class="siimple-table-row"> <div class="siimple-table-cell">Admin</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="adminRoleSel" onchange="{() => onChangeRight(\'admin\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Page</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="pageRoleSel" onchange="{() => onChangeRight(\'page\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Post</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="postRoleSel" onchange="{() => onChangeRight(\'post\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Right</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="rightRoleSel" onchange="{() => onChangeRight(\'right\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Role</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="roleRoleSel" onchange="{() => onChangeRight(\'role\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">User</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="userRoleSel" onchange="{() => onChangeRight(\'user\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div> <sc-notify></sc-notify>', 'sc-edit-role .sc-block,[data-is="sc-edit-role"] .sc-block{ margin:10px; height:5px; } sc-edit-role .space,[data-is="sc-edit-role"] .space{ width: 5%; display: inline-block; } sc-edit-role .close-btn,[data-is="sc-edit-role"] .close-btn{ margin: 5px 4px; } sc-edit-role .input-label,[data-is="sc-edit-role"] .input-label{ width: 15%; } sc-edit-role .label-btn,[data-is="sc-edit-role"] .label-btn{ height: 25px; width: 5%; text-align: center; line-height: 2.5; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

  this.act = opts.act !== undefined? opts.act: 'create';
  this.edit_role = '';
  this.role_id = '';
  this.right_list_none = {
    admin: {
      right_id: '',
      role: 'admin',
      action: 'create'
    },
    page: {
      right_id: '',
      role: 'page',
      action: 'create'
    },
    post: {
      right_id: '',
      role: 'post',
      action: 'create'
    },
    right: {
      right_id: '',
      role: 'right',
      action: 'create'
    },
    role: {
      right_id: '',
      role: 'role',
      action: 'create'
    },
    user: {
      right_id: '',
      role: 'user',
      action: 'create'
    }

  };

  var mainControl = this.riotx.get('main-control');
  var self = this;

  this.on('mount', function(){

  });

  this.on('update', function(){
    if(self.role_id !== '' && self.edit_role !== ''){
      self.roleDetail();
    }
  });

  this.cancelCreate = function(){
    self.parent.action = 'create';
    self.parent.refreshRole();
  }.bind(this)

  mainControl.change('GetRoleToEdit', function(state, c){
    self.edit_role = c.getter('getEditRoleGetter');
    self.role_id = self.edit_role.RoleID;
    self.update();
  });

  this.roleDetail = function(){
    self.refs.inpRoleName.value = self.edit_role.Rolename;
    self.refs.activeChk.checked = self.edit_role.active;
    var rights = self.edit_role.RoleRight;
    for(var i in rights){
      if(rights[i].module.module === "admin"){
        if(! self.isEmpty(self.right_list_none.admin)){
          self.refs.adminRoleSel.value = rights[i].module.acl;
          self.right_list_none['admin'] = {
            right_id : rights[i].RightID,
            role: 'admin',
            action: 'update'
          };
        }else{
          self.right_list_none['admin'] = {
            right_id : '',
            role: 'admin',
            action: 'create'
          };
        }
      }
      if(rights[i].module.module === "page"){
        if(! self.isEmpty(self.right_list_none.page)){
          self.refs.pageRoleSel.value = rights[i].module.acl;
          self.right_list_none['page'] = {
            right_id : rights[i].RightID,
            role: 'page',
            action: 'update'
          };
        }else{
          self.right_list_none['page'] = {
            right_id : '',
            role: 'page',
            action: 'create'
          };
        }
      }
      if(rights[i].module.module === "post"){
        if(! self.isEmpty(self.right_list_none.post)){
          self.refs.postRoleSel.value = rights[i].module.acl;
          self.right_list_none['post'] = {
            right_id : rights[i].RightID,
            role: 'post',
            action: 'update'
          };
        }else{
          self.right_list_none['post']={
            right_id : '',
            role: 'post',
            action: 'create'
          };
        }
      }
      if(rights[i].module.module === "right"){
        if(! self.isEmpty(self.right_list_none.right)){
          self.refs.rightRoleSel.value = rights[i].module.acl;
          self.right_list_none['right'] = {
            right_id : rights[i].RightID,
            role: 'right',
            action: 'update'
          };
        }else{
          self.right_list_none['right'] = {
            right_id : '',
            role: 'right',
            action: 'create'
          };
        }
      }
      if(rights[i].module.module === "role"){
        if(! self.isEmpty(self.right_list_none.role)){
          self.refs.roleRoleSel.value = rights[i].module.acl;
          self.right_list_none['role'] = {
            right_id : rights[i].RightID,
            role: 'role',
            action: 'update'
          };
        }else{
          self.right_list_none['role'] = {
            right_id : '',
            role: 'role',
            action: 'create'
          };
        }
      }
      if(rights[i].module.module === "user"){
        if(! self.isEmpty(self.right_list_none.user)){
          self.refs.userRoleSel.value = rights[i].module.acl;
          self.right_list_none['user'] = {
            right_id : rights[i].RightID,
            role: 'user',
            action: 'update'
          };
        }else{
          self.right_list_none['user'] = {
            right_id : '',
            role: 'user',
            action: 'create'
          };
        }
      }
    }
    console.log(self.right_list_none);
  }.bind(this)

  mainControl.change('RoleCreated', function(state, c){
    var role = c.getter('getRoleSaveGetter');
    console.log(role);
    if(role.success.status){
      self.role_id = role.result.RoleID;
      self.edit_role = role.result;
      self.edit_role['RoleRight'] = [];
      self.notify({
        position: 'bottom-left',
        theme: 'success',
        leadstyle: 'primary',
        stay: '3',
        message: role.success.message
      });
    }else{
      self.notify({
        position: 'bottom-left',
        theme: 'warning',
        leadstyle: 'default',
        stay: '3',
        message: role.error.message
      });
    }
    self.update();
  });

  mainControl.change('RoleSaved', function(state, c){
    var role = c.getter('getRoleSaveGetter');
    if(role.success.status){
      self.role_id = role.result.RoleID;
      self.edit_role.active = role.result.active;
      self.edit_role.Rolename = role.result.Rolename;
      self.notify({
        position: 'bottom-left',
        theme: 'success',
        leadstyle: 'primary',
        stay: '3',
        message: role.success.message
      });
    }else{
      self.notify({
        position: 'bottom-left',
        theme: 'warning',
        leadstyle: 'default',
        stay: '3',
        message: role.error.message
      });
    }
    self.update();
  });

  mainControl.change('RightUpdated', function(state, c){
    var right_updated = c.getter('getRoleRightGetter');
    var notification = null;

    if(right_updated.success.status){
      self.edit_role.RoleRight.push(right_updated.result);
      self.roleDetail();
      notification = {
        position: 'bottom-left',
        theme: 'success',
        leadstyle: 'primary',
        stay: '3',
        message: right_updated.success.message
      };
    }else{
      notification = {
        position: 'bottom-left',
        theme: 'warning',
        leadstyle: 'default',
        stay: '3',
        message: right_updated.error.message
      };
    }

    self.notify(notification);
  });

  this.notify = function(notifyObj){
    console.log(notifyObj);
    if(notifyObj !== null){
      riot.mount('sc-notify', {
        position : notifyObj.position,
        theme : notifyObj.theme,
        leadstyle : notifyObj.leadstyle,
        stay : notifyObj.stay,
        message : notifyObj.message,
        visible : true
      });

      self.update();
    }
  }.bind(this)

  this.createRole = function(){
    var roleName = this.refs.inpRoleName.value;
    var active = this.refs.activeChk.checked ? 1: 0;
    if(roleName !== ''){
      var role = {
        rolename: roleName,
        active: active
      };
      mainControl.action('saveRoleAction', {action: 'create', role: role});
    }else{
      self.notify({
        position: 'bottom-left',
        theme: 'warning',
        leadstyle: 'default',
        stay: '3',
        message: 'Role name cannot be empty!'
      });
    }
  }.bind(this)

  this.saveRole = function(){
    var roleName = this.refs.inpRoleName.value;
    var active = this.refs.activeChk.checked ? 1: 0;
    if(roleName !== ''){
      var role = {
        roleid : self.role_id,
        rolename: roleName,
        active: active
      };
      mainControl.action('saveRoleAction', {action: 'update', role: role});
    }else{
      self.notify({
        position: 'bottom-left',
        theme: 'warning',
        leadstyle: 'default',
        stay: '3',
        message: 'Role name cannot be empty!'
      });
    }
  }.bind(this)

  this.onChangeRight = function(module){
    var adminRight = this.refs.adminRoleSel.value;
    var pageRight = this.refs.pageRoleSel.value;
    var postRight = this.refs.postRoleSel.value;
    var rightRight = this.refs.rightRoleSel.value;
    var roleRight = this.refs.roleRoleSel.value;
    var userRight = this.refs.userRoleSel.value;

    if(self.role_id !== ''){
      switch(module){
        case 'admin':
          if(self.isEmpty(self.right_list_none)){
            mainControl.action('editRightAction', {
              right: {
                role: 'admin',
                action: 'create',
                right_id: '',
                acl: adminRight,
                roleid: self.role_id
              }
            });
          }else{
            mainControl.action('editRightAction', {
              right: {
                role: self.right_list_none.admin.role,
                action: self.right_list_none.admin.action,
                right_id: self.right_list_none.admin.right_id,
                acl: adminRight,
                roleid: self.role_id
              }
            });
          }
          break;
        case 'page':
          if(self.isEmpty(self.right_list_none)){
            mainControl.action('editRightAction', {
              right: {
                role: 'page',
                action: 'create',
                right_id: '',
                acl: pageRight,
                roleid: self.role_id
              }
            });
          }else{
            mainControl.action('editRightAction', {
              right: {
                role: self.right_list_none.page.role,
                action: self.right_list_none.page.action,
                right_id: self.right_list_none.page.right_id,
                acl: pageRight,
                roleid: self.role_id
              }
            });
          }
          break;
        case 'post':
          if(self.isEmpty(self.right_list_none)){
            mainControl.action('editRightAction', {
              right: {
                role: 'post',
                action: 'create',
                right_id: '',
                acl: postRight,
                roleid: self.role_id
              }
            });
          }else{
            mainControl.action('editRightAction', {
              right: {
                role: self.right_list_none.post.role,
                action: self.right_list_none.post.action,
                right_id: self.right_list_none.post.right_id,
                acl: postRight,
                roleid: self.role_id
              }
            });
          }
          break;
        case 'right':
          if(self.isEmpty(self.right_list_none)){
            mainControl.action('editRightAction', {
              right: {
                role: 'right',
                action: 'create',
                right_id: '',
                acl: rightRight,
                roleid: self.role_id
              }
            });
          }else{
            mainControl.action('editRightAction', {
              right: {
                role: self.right_list_none.right.role,
                action: self.right_list_none.right.action,
                right_id: self.right_list_none.right.right_id,
                acl: rightRight,
                roleid: self.role_id
              }
            });
          }
          break;
        case 'role':
          if(self.isEmpty(self.right_list_none)){
            mainControl.action('editRightAction', {
              right: {
                role: 'role',
                action: 'create',
                right_id: '',
                acl: roleRight,
                roleid: self.role_id
              }
            });
          }else{
            mainControl.action('editRightAction', {
              right: {
                role: self.right_list_none.role.role,
                action: self.right_list_none.role.action,
                right_id: self.right_list_none.role.right_id,
                acl: roleRight,
                roleid: self.role_id
              }
            });
          }
          break;
        case 'user':
          if(self.isEmpty(self.right_list_none)){
            mainControl.action('editRightAction', {
              right: {
                role: 'user',
                action: 'create',
                right_id: '',
                acl: userRight,
                roleid: self.role_id
              }
            });
          }else{
            mainControl.action('editRightAction', {
              right: {
                role: self.right_list_none.user.role,
                action: self.right_list_none.user.action,
                right_id: self.right_list_none.user.right_id,
                acl: userRight,
                roleid: self.role_id
              }
            });
          }
          break;
      }
    }else{
      self.notify({
        position: 'bottom-left',
         theme: 'warning',
        leadstyle: 'default',
        stay: '3',
        message: 'Please create a role before assign access right to him/her.'
      })
    }
  }.bind(this)

  this.isEmpty = function(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
      return false;
    }
    return true;
  }.bind(this)
});
riot.tag2('sc-list-role', '<mino-alert type="dismiss" theme="warning alert-block" if="{delSomeone}">{}</mino-alert> <table class="sc-table"> <tr class="sc-tr-header"> <td rowspan="2" class="sc-th">Role Name</td> <td rowspan="2" class="sc-th">Active</td> <td colspan="6" class="sc-th" style="text-align:center">Access Rights </td> </tr> <tr class="sc-tr-header"> <td class="sc-th">Admin</td> <td class="sc-th">Page</td> <td class="sc-th">Post</td> <td class="sc-th">Right</td> <td class="sc-th">Role</td> <td class="sc-th">User</td> </tr> <tbody> <tr style="text-align:center;" each="{list_of_role}"> <td class="sc-td-data"> <div class="sc-edit-class" onclick="{() => editRole(RoleID)}"> {Rolename}<br> <small>{RoleID}</small> </div> </td> <td class="sc-td-data"> <span class="siimple-tag siimple-tag--{active === 1? \'success\': \'warning\'}"> {active === 1? \'active\': \'inactive\'} </span> </td> <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, \'admin\')}</span></td> <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, \'page\')}</span></td> <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, \'post\')}</span></td> <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, \'right\')}</span></td> <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, \'role\')}</span></td> <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, \'user\')}</span></td> </tr> </tbody> </table>', 'sc-list-role small,[data-is="sc-list-role"] small{ font-size: 11px; color: #aaa; } sc-list-role .sc-edit-class,[data-is="sc-list-role"] .sc-edit-class{ cursor: pointer; padding: 10px; } sc-list-role .sc-edit-class:hover,[data-is="sc-list-role"] .sc-edit-class:hover{ background-color: #ddd; border-radius: 2px; }', '', function(opts) {
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
    this.list_of_role = [];
    this.delRole = false;
    this.delMsg = '';

    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('mount', function(){

    });

    mainControl.change('RolesRetrieved', function(state, c){
      self.list_of_role = c.getter('getListOfRoles');
      self.parent.isLoading = false;
      self.parent.update();

    });

    this.editRole = function(role_id){
      self.parent.editRole(role_id);
    }.bind(this)

    this.getRoleRight = function(arrRoleRight, module){
      var acl = 0;
      for(var i in arrRoleRight){
        if(arrRoleRight[i].module.module === module){
          acl = arrRoleRight[i].module.acl;
          break;
        }
      }
      if(acl === 4){
        return "Read";
      }else if(acl === 6){
        return "Read & Write";
      }else if(acl === 7){
        return "Read & Write & Delete";
      }else{
        return "No Access";
      }
    }.bind(this)

});
riot.tag2('sc-manage-role', '<div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> Manage Role </div> <div class="siimple--display-block siimple--bg-light sc-panel"> <div class="siimple-btn siimple-btn--navy {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" onclick="{() => createRole()}">Create</div> <div class="siimple-btn siimple-btn--success siimple--float-right {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" onclick="{() => refreshRole()}">Refresh</div> </div> </div> <div if="{isLoading}"> <div class="siimple-spinner siimple-spinner--teal"></div> </br/> </div> <sc-list-role if="{list}"></sc-list-role> <sc-edit-role if="{edit}" role_id="{role_id}" act="{action}"></sc-edit-role> <div>', 'sc-manage-role .sc-title,[data-is="sc-manage-role"] .sc-title{ padding: 5px; border-radius: 4px 4px 0px 0px; } sc-manage-role .sc-panel,[data-is="sc-manage-role"] .sc-panel{ padding: 10px; margin-bottom: 15px; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.list = true;
    this.edit = false;
    this.action = 'create';
    this.role_id = '';
    this.isLoading = false;
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('mount', function(){
      this.getRoleList();
    });

    this.getRoleList = function(){
      this.isLoading = true;
      mainControl.action('getRolesAction', {});
    }.bind(this)

    this.createRole = function(){
      this.list = false;
      this.edit = true;
      this.action = 'create';
      this.update();
    }.bind(this)

    this.editRole = function(role_id){
      this.list = false;
      this.edit = true;

      mainControl.action('getRoleDetailAction', {param: role_id});
      this.action = 'edit';
      this.update();
    }.bind(this)

    this.refreshRole = function(){
      this.list = true;
      this.edit = false;
      this.getRoleList();
      this.update();
    }.bind(this)

});
riot.tag2('sc-navbar', '<div class="siimple-navbar siimple-navbar--extra-large siimple-navbar--dark"> <div class="siimple-navbar-title">Admin panel</div> <div class="siimple--float-right"> <div class="siimple-navbar-item">Profile</div> <div class="siimple-navbar-item" onclick="{() => logout()}">Logout</div> </div> </div>', '', '', function(opts) {
    var mainControl = this.riotx.get('main-control');

    this.logout = function(){
      mainControl.action('logoutAction', {})  ;
    }.bind(this)
});
riot.tag2('sc-notify', '<div class="{notify_pos} {theme} {leadstyle}" show="{visible}"> {message} </div>', 'sc-notify .light,[data-is="sc-notify"] .light{ background-color: #f4f4f4; color: #1D2F3A; } sc-notify .warning,[data-is="sc-notify"] .warning{ background-color: #F32260; color: #FCF7FA; } sc-notify .success,[data-is="sc-notify"] .success{ background-color: #1ECE80; color: #FCF7FA; } sc-notify .primary,[data-is="sc-notify"] .primary{ background-color: #456990; color: #FCF7FA; } sc-notify .dark,[data-is="sc-notify"] .dark{ background-color: #323C46; color: #FCF7FA; } sc-notify .note,[data-is="sc-notify"] .note{ background-color: #FFD011; color: #1D2F3A; } sc-notify .default,[data-is="sc-notify"] .default{ background-color: #989898; color: #FCF7FA; } sc-notify .primary-border-left,[data-is="sc-notify"] .primary-border-left{ border-left: 5px solid #456990 !important; } sc-notify .dark-border-left,[data-is="sc-notify"] .dark-border-left{ border-left: 5px solid #323c46 !important; } sc-notify .light-border-left,[data-is="sc-notify"] .light-border-left{ border-left: 5px solid #f4f4f4 !important; } sc-notify .warning-border-left,[data-is="sc-notify"] .warning-border-left{ border-left: 5px solid #f32260 !important; } sc-notify .note-border-left,[data-is="sc-notify"] .note-border-left{ border-left: 5px solid #FFD011 !important; } sc-notify .default-border-left,[data-is="sc-notify"] .default-border-left{ border-left: 5px solid #989898 !important; } sc-notify .success-border-left,[data-is="sc-notify"] .success-border-left{ border-left: 5px solid #1ECE80 !important; } sc-notify .notify-bottom-right,[data-is="sc-notify"] .notify-bottom-right{ right: 0; bottom: 0; border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-bottom-left,[data-is="sc-notify"] .notify-bottom-left{ left: 0; bottom: 0; border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-top-right,[data-is="sc-notify"] .notify-top-right{ right: 0; top: 0; border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 15px; margin: 15px; position: absolute } sc-notify .notify-top-left,[data-is="sc-notify"] .notify-top-left{ left: 0; top: 0; border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-center,[data-is="sc-notify"] .notify-center{ left: 40%; top: 45%; border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-progress,[data-is="sc-notify"] .notify-progress{ width: 1%; height: 4px; bottom: 0; position: absolute; left: 0; }', '', function(opts) {
var scNotifyObserver = function () {
  riot.observable(this);
}

    this.pos = opts.position !== undefined? opts.position: 'bottom-right';
    this.theme = opts.theme !== undefined? opts.theme: 'light';
    this.bar = 'dark';
    this.leadstyle = opts.leadstyle !== undefined? opts.leadstyle: 'primary-border-left';
    this.notify_pos = 'notify-bottom-right';
    this.stay = opts.stay !== undefined? opts.stay: 5;
    this.message = opts.message !== undefined? opts.message: '';
    this.visible = opts.visible !== undefined? opts.visible: false;
    this.count = 0;
    riot.scNotify = new scNotifyObserver();
    var self = this;

    this.on('before-mount', function(){
      this.setNotification();
    });

    this.on('mount', function(){
      this.autoDismiss();
    });

    this.on('update', function(){
    });

    this.autoDismiss = function(){
      if(! isNaN(this.stay)){
        var timeout = parseInt(this.stay) * 1000;
        setTimeout(function(){
          console.log('dismiss');
          self.visible = false;
          self.update();
        }, timeout);
      }
    }.bind(this)

    this.setNotification = function(){
      switch(this.pos){
        case 'top-left':
          this.notify_pos = 'notify-top-left ';
          break;
        case 'top-right':
          this.notify_pos = 'notify-top-right ';
          break;
        case 'center':
          this.notify_pos = 'notify-center ';
          break;
        case 'bottom-left':
          this.notify_pos = 'notify-bottom-left ';
          break;
        case 'bottom-right':
          this.notify_pos = 'notify-bottom-right ';
          break;
        default:
          this.notify_pos = 'notify-bottom-right';
      }

      switch(this.leadstyle){
        case 'primary':
          this.leadstyle = 'primary-border-left ';
          this.bar = 'primary';
          break;
        case 'light':
          this.leadstyle = 'light-border-left ';
          this.bar = 'light';
          break;
        case 'dark':
          this.leadstyle = 'dark-border-left ';
          this.bar = 'dark';
          break;
        case 'warning':
          this.leadstyle = 'warning-border-left ';
          this.bar = 'warning';
          break;
        case 'note':
          this.leadstyle = 'note-border-left ';
          this.bar = 'note';
          break;
        case 'default':
          this.leadstyle = 'default-border-left ';
          this.bar = 'default';
          break;
        case 'success':
          this.leadstyle = 'success-border-left ';
          this.bar = 'success';
          break;
        default:
          this.leadstyle = '';
      }

    }.bind(this)
});
riot.tag2('sc-route', '<div class="siimple-grid-col siimple-grid-col--2"> <div class="siimple-menu sc-menu"> <div class="siimple-menu-group">Administration</div> <div each="{routes}"> <a class="siimple-menu-item" href="#{url}">{name}</a> </div> </div> </div> <div class="siimple-grid-col siimple-grid-col--10"> <div class="siimple-content siimple-content--fluid sc-main-panel"> <sc-manage-admin if="{admin_route.m_admin}"></sc-manage-admin> <sc-manage-role if="{admin_route.m_role}"></sc-manage-role> </div> </div>', 'sc-route .sc-menu,[data-is="sc-route"] .sc-menu{ border: 1px solid #ddd; padding:10px; border-radius: 4px; } sc-route .sc-main-panel,[data-is="sc-route"] .sc-main-panel{ padding: 15px; border: 1px solid #ddd; border-radius: 4px; }', '', function(opts) {
    this.mixin(minoCookie);
    this.theme = '';
    this.routes = [
      {name: 'Manage Admins', url:'manage-admins'},
      {name: 'Manage Roles', url: 'manage-roles'},
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