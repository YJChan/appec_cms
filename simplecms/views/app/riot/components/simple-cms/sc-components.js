riot.tag2('sc-image-select', '<div class="siimple-content siimple-content--fluid img-border"> <img class="img-upload" ref="imgSelect" id="preview" src="https://via.placeholder.com/1080x320"> <input type="file" onchange="{() => previewFile()}" ref="fileImg" id="fileImg" name="fileImg" class="upload-bar"> <label for="fileImg">Choose a file</label> </div>', 'sc-image-select .img-border,[data-is="sc-image-select"] .img-border{ border: 1px solid #ccc; border-radius: 3px; } sc-image-select .img-upload,[data-is="sc-image-select"] .img-upload{ width: 100%; } sc-image-select .upload-bar,[data-is="sc-image-select"] .upload-bar{ width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1; } sc-image-select .upload-bar + label,[data-is="sc-image-select"] .upload-bar + label{ font-size: 1em; font-weight: 700; color: #546778; display: inline-block; padding: 5px; border-radius:3px; background-color: #dde5ee; } sc-image-select .upload-bar:focus + label,[data-is="sc-image-select"] .upload-bar:focus + label,sc-image-select .upload-bar + label:hover,[data-is="sc-image-select"] .upload-bar + label:hover{ background-color: lightslategrey; cursor: pointer; color: white; outline: 1px dotted #000; outline: -webkit-focus-ring-color auto 5px; }', '', function(opts) {
    this.reader = new FileReader();
    this.fileInBase64 = '';
    this.imageID = '';
    this.imgExist = false;
    var imgSrc = opts.imgsrc !== undefined && opts.imgsrc !== null? opts.imgsrc : '';
    var self = this;

    this.on('mount', function(){
      console.log('image source : %s', imgSrc);
      self.fileInBase64 = '';
      if(opts.imgsrc === undefined || opts.imgsrc === null || opts.imgsrc === ''){
        console.log(imgSrc);
        self.refs.imgSelect.src = 'https://via.placeholder.com/1080x420';
      }
    });

    this.on('update', function(){
      if(this.imageID !== ''){
        this.imgExist = true;
      }else{
        this.imgExist = false;
      }
    })

    this.previewFile = function() {

      var preview = document.querySelector('img');
      var file    = document.querySelector('input[type=file]').files[0];

      self.reader.addEventListener("load", function () {
        preview.src = self.reader.result;
        self.fileInBase64 = self.reader.result;
      }, false);

      if (file) {
        self.reader.readAsDataURL(file);
      }
    }.bind(this)

    this.getFileBase64String = function(){
      return self.fileInBase64;
    }.bind(this)

    this.getImageUrl = function(){
      return self.imgSrc;
    }.bind(this)

    this.setImageUrl = function(url){
      self.imgSrc = url;
      self.imgExist = true;
      self.refs.imgSelect.src = url;

    }.bind(this)

    this.setImageID = function(id){
      self.imgExist = true;
      self.imageID = id;
    }.bind(this)

    this.getImageID = function(){
      return self.imageID;
    }.bind(this)

});
riot.tag2('sc-login', '<div class="center {theme}" if="{login === false}"> <div class="entry-logo"> </div> <div class="entry-form"> <div class="entry-field"> <h3>Welcome to </h3> <h2> Appec Simple CMS</h2> <small>Strength and growth come only through continuous effort and struggle.</small> </div> <hr> <div class="entry-field"> <input ref="admin_email" class="login-input input-box" placeholder="email" type="email"> <input ref="admin_pwd" type="password" class="login-input input-box" placeholder="password"> </div> <br> <div class="entry-btn"> <button type="submit" class="primary btn" onclick="{() => AdminLogin()}">Login</button> </div> </div> </div> <sc-notify></sc-notify>', '@media (min-width: 320px) and (max-width: 480px) { sc-login .entry-logo,[data-is="sc-login"] .entry-logo{ background-image: url(\'/images/appec-logo-dark.png\'); background-repeat: no-repeat; background-size: 55%; height:110px; background-position: center; background-color: #161824; } sc-login .entry-btn,[data-is="sc-login"] .entry-btn{ margin: 0 auto; text-align:center; } sc-login .entry-field,[data-is="sc-login"] .entry-field{ text-align: center; } } @media (min-width: 481px) and (max-width: 767px) { sc-login .entry-logo,[data-is="sc-login"] .entry-logo{ background-image: url(\'/images/appec-logo-dark.png\'); background-repeat: no-repeat; background-size: 55%; height:200px; background-position: center; background-color: #161824; } sc-login .entry-btn,[data-is="sc-login"] .entry-btn{ margin: 0 auto; text-align:center; } sc-login .entry-field,[data-is="sc-login"] .entry-field{ text-align: center; } } @media (min-width: 768px) and (max-width: 1024px) { sc-login .entry-logo,[data-is="sc-login"] .entry-logo{ background-image: url(\'/images/appec-logo-dark.png\'); background-repeat: no-repeat; background-size: 45%; height:300px; background-position: center; background-color: #161824; } sc-login .entry-btn,[data-is="sc-login"] .entry-btn{ margin: 0 auto; text-align:center; } sc-login .entry-field,[data-is="sc-login"] .entry-field{ text-align: center; } } @media (min-width: 1025px) and (max-width: 1920px) { sc-login .center,[data-is="sc-login"] .center{ position: absolute; left: 50%; transform: translate(-50%, 0%); text-align:center; height: 98.5% ; background-color: white; border: 1px solid #1c1f3d; border-radius: 3.5px; } sc-login .entry-logo,[data-is="sc-login"] .entry-logo{ background-image: url(\'/images/appec-logo-dark.png\'); background-repeat: no-repeat; background-size: 55%; height:250px; background-position: center; background-color: #161824; } sc-login .entry-form,[data-is="sc-login"] .entry-form{ padding: 50px; } } sc-login h2,[data-is="sc-login"] h2{ font-weight: 400; } sc-login .login-input,[data-is="sc-login"] .login-input{ display: block; width: 80%; margin: 10px auto; font-family: \'Lato\', Helvetica, sans-serif; } sc-login .btn,[data-is="sc-login"] .btn{ display: inline-block; text-align: center; white-space: nowrap; vertical-align: middle; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; border: 1px solid transparent; padding: 0.3rem 0.75rem; font-size: 0.9rem; line-height: 1.5; width:85%; cursor:pointer; border-radius: 0.2rem; }', '', function(opts) {
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
          self.setCookie('uid', loginStatus.uid);
          self.setCookie('aid', loginStatus.aid);
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

    mainControl.change('onGlobalNotify', function(state, c){
      var message = c.getter('globalNotificationGetter');
      riot.mount('sc-notify', {
        position: 'bottom-right',
        theme: 'note',
        leadstyle: 'dark',
        visible: true,
        stay: '3',
        message: message
      });
      self.update();
    });

    this.AdminLogin = function(){
      if(this.refs.admin_email.value !== '' && this.refs.admin_pwd.value!== ''){
        var loginForm = {
          admin_email: this.refs.admin_email.value,
          admin_pwd: this.refs.admin_pwd.value
        }
        mainControl.action('loginAction', {formdata:loginForm});
      }else{
        mainControl.action('globalNotificationAction', {message: 'Email and passwrod cannot be empty!'});
      }
    }.bind(this)

    this.proceed = function(path){
      baseURL = mainControl.getter('baseURLGetter');
      window.location.replace('/' + path + '/admin');
    }.bind(this)
});
riot.tag2('sc-edit-admin', '<div class="simple-grid" if="{! isLoading}"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-content-title"> {act === \'create\'? \'Create\': \'Edit\'} Admin </div> <div class="siimple--display-block siimple--bg-white sc-content-panel"> <div class="siimple-form"> <div class="siimple-form-title" if="{act===\'create\'}">Create a new admin</div> <div class="siimple-form-title" if="{act===\'edit\'}">Edit Admin - {edit_admin.AdminName}</div> <div class="siimple-form-detail">Please fill up the form to complete the form.</div> <div class="siimple-form-field"> <label class="siimple-label input-label">Admin Name </label> <input type="text" ref="inpAdminName" class="siimple-input" placeholder="Johnny English"> <div class="space"></div> <label class="siimple-label input-label">Admin Email</label> <input ref="inpAdminEmail" class="siimple-input" placeholder="johnny@email.com" type="email"> </div> <div class="siimple-form-field"> <label class="siimple-label input-label">Password</label> <input type="password" ref="inpPassword" class="siimple-input" placeholder="******"> <div class="space"></div> <label class="siimple-label input-label">Confirm Password</label> <input type="password" ref="inpConfPassword" class="siimple-input" placeholder="******"> </div> <div class="siimple-form-field"> <label class="siimple-label input-label">Role</label> <select class="siimple-select" ref="roleSel" if="{change_role}"> <option each="{roles}" if="{active === 1}" riot-value="{RoleID}">{Rolename}</option> </select> &nbsp; <div class="siimple-close close-btn" if="{edit_admin !== \'\' && change_role}" onclick="{() => changeRole(false)}"></div> <span class="siimple-tag label-btn {edit_admin.RoleID !== null? \'siimple-tag--yellow\': \'siimple-tag--red\'}" if="{!change_role}" onclick="{() => changeRole(true)}"> {edit_admin.RoleID !== null? edit_admin.Rolename: \'No Role\'} </span> <input ref="roleSel" type="hidden" riot-value="{edit_admin.RoleID}" if="{!change_role}"> <div class="space"></div> <label class="siimple-label">Level</label> <select class="siimple-select" ref="levelSel"> <option>1</option> <option>2</option> <option>3</option> <option>4</option> </select> <div class="space"></div> <label class="siimple-label">Active</label> <div class="siimple-checkbox"> <input type="checkbox" ref="activeChk" id="activeChk"> <label for="activeChk"></label> </div> </div> <div class="siimple-form-field"> <div class="siimple-form-field-label">Security Phase</div> <input type="text" ref="inpSecurePhase" class="siimple-input siimple-input--fluid"> </div> <div class="siimple-form-field"> <div class="siimple-btn siimple-btn--blue" onclick="{() => saveAdmin()}" if="{admin_id !== \'\'}">Save</div> <div class="siimple-btn siimple-btn--blue" onclick="{() => createAdmin()}" if="{admin_id === \'\'}">Create</div> &nbsp; <div class="siimple-btn siimple-btn--red" onclick="{() => cancelCreate()}">Cancel</div> </div> </div> </div> </div> <div>', 'sc-edit-admin .space,[data-is="sc-edit-admin"] .space{ width: 5%; display: inline-block; } sc-edit-admin .close-btn,[data-is="sc-edit-admin"] .close-btn{ margin: 5px 4px; } sc-edit-admin .input-label,[data-is="sc-edit-admin"] .input-label{ width: 15%; } sc-edit-admin .label-btn,[data-is="sc-edit-admin"] .label-btn{ height: 25px; width: 5%; text-align: center; line-height: 2.5; } sc-edit-admin .sc-content-title,[data-is="sc-edit-admin"] .sc-content-title{ padding: 5px; border-radius: 3px 3px 0px 0px; margin: 15px 0px 0px 0px; } sc-edit-admin .sc-content-panel,[data-is="sc-edit-admin"] .sc-content-panel{ padding: 15px; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.roles = '';
    this.created_admin = '';
    this.admin_id = '';
    this.edit_admin = '';
    this.change_role = false;
    this.act = opts.act !== undefined? opts.act: 'create';
    this.acl = opts.acl;
    riot.scAdminWard = new scAdminObserver();
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){

    });

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

    mainControl.change('AccessListRetrieved', function(state, c){
      var r = c.getter('getAccessListGetter');
      if(r.success.status){
        self.acl = r.result;
      }else{

      }
      console.log(self.acl);
      self.update();
    });
});
riot.tag2('sc-list-admin', '<mino-alert type="dismiss" theme="warning alert-block" if="{delSomeone}">{}</mino-alert> <div class="siimple-table siimple-table--striped"> <div class="siimple-table-header"> <div class="siimple-table-row"> <div class="siimple-table-cell" if="{acl.admin.acl === 7}"></div> <div class="siimple-table-cell">Username</div> <div class="siimple-table-cell">Email</div> <div class="siimple-table-cell">Role Name</div> <div class="siimple-table-cell">Level</div> <div class="siimple-table-cell">Master</div> <div class="siimple-table-cell">Active</div> </div> </div> <div class="siimple-table-body"> <div class="siimple-table-row" if="{list_of_admins !== []}" each="{list_of_admins}"> <div class="siimple-table-cell" if="{acl.admin.acl === 7}"> <input type="checkbox" ref="chkAdmin" id="chkAdmin" riot-value="{AdminID}" if="{isMaster !== 1}"> </div> <div class="siimple-table-cell"> <div class="{isMaster !== 1 && acl.admin.acl === 7? \'sc-edit-class\': \'\'}" onclick="{isMaster !== 1 && acl.admin.acl === 7? () => editAdmin(AdminID): \'\'}"> {AdminName}<br> <small if="{isMaster !== 1}">{AdminID}</small> </div> </div> <div class="siimple-table-cell"> {AdminEmail} </div> <div class="siimple-table-cell"> <div class="siimple-tag siimple-tag--yellow"> {AdminRole.Rolename} </div> </div> <div class="siimple-table-cell"> {level} </div> <div class="siimple-table-cell"> <div class="siimple-tag {isMaster === 1? \'siimple-tag--navy\': \'siimple-tag--grey\'}"> {this.strManipulate(isMaster, {trueValue: \'master\', falseValue: \'normal admin\'})} </div> </div> <div class="siimple-table-cell"> <div class="siimple-tag {active === 1? \'siimple-tag--green\': \'siimple-tag--orange\'}"> {this.strManipulate(active, {trueValue: \'active\', falseValue: \'inactive\'})} </div> </div> </div> </div> </div>', 'sc-list-admin small,[data-is="sc-list-admin"] small{ font-size: 11px; color: #aaa; } sc-list-admin .sc-edit-class,[data-is="sc-list-admin"] .sc-edit-class{ cursor: pointer; padding: 10px; } sc-list-admin .sc-edit-class:hover,[data-is="sc-list-admin"] .sc-edit-class:hover{ background-color: #ddd; border-radius: 2px; }', '', function(opts) {
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
    this.acl = opts.acl;
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
riot.tag2('sc-manage-admin', '<div class="siimple-alert siimple-alert--warning" if="{acl.admin === undefined || acl.admin === null}"> You are not allow to access this module! </div> <div class="simple-grid" if="{acl.admin.acl > 4}"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title siimple--clearfix"> <div class="sc-menu-title"> Manage Admin </div> </div> <div class="siimple--display-block siimple--bg-light sc-panel"> <div class="siimple-alert siimple-alert--primary" if="{acl.admin.acl < 6}"> You are only allow to view the admin details. </div> <div class="siimple-btn siimple-btn--navy {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" if="{acl.admin.acl >= 6}" onclick="{() => createAdmin()}">Create</div> <div class="siimple-btn siimple-btn--red siimple--float-right {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" if="{acl.admin.acl >= 7}" onclick="{() => deleteAdmin()}">Delete</div> </div> </div> <div if="{isLoading}"> <div class="siimple-spinner siimple-spinner--teal"></div> </div> <sc-list-admin if="{list}" acl="{acl}"></sc-list-admin> <sc-edit-admin if="{edit}" admin_id="{admin_id}" act="{action}" acl="{acl}"></sc-edit-admin> <div>', 'sc-manage-admin .sc-menu-title,[data-is="sc-manage-admin"] .sc-menu-title{ display: inline-block; width:68%; text-align: center; } sc-manage-admin .sc-action-title,[data-is="sc-manage-admin"] .sc-action-title{ display: inline-block; width: 15% } sc-manage-admin .action-btn,[data-is="sc-manage-admin"] .action-btn{ padding: 2px; } sc-manage-admin .sc-title,[data-is="sc-manage-admin"] .sc-title{ padding: 5px; border-radius: 3px 3px 0px 0px; margin: -15px -15.5px 15px -15.5px } sc-manage-admin .sc-panel,[data-is="sc-manage-admin"] .sc-panel{ padding: 10px; margin: -15px -15px 20px -15px; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.list = true;
    this.list_of_admins = [];
    this.edit = false;
    this.admin_id = '';
    this.isLoading = false;
    this.action = 'create';
    this.acl = opts.acl;
    riot.scAdminWard = new scAdminObserver();
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){
      this.isLoading = true;
    });

    this.on('mount', function(){
      this.getAdminList();
      console.log(this.acl);
    });

    this.on('update', function(){
      if(this.acl !== null){
        this.isLoading = false;
      }else{
        this.isLoading = true;
      }
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

    mainControl.change('AccessListRetrieved', function(state, c){
      var r = c.getter('getAccessListGetter');
      if(r.success.status){
        self.acl = r.result;
      }else{

      }
      console.log(self.acl);
      self.update();
    });

});
riot.tag2('sc-list-category', '<table class="sc-table"> <tr class="sc-tr-header-left"> <td class="sc-th" style="width:60%;">Category Name</td> <td class="sc-th" style="width:10%;">Active</td> <td class="sc-th" style="width:30%;">Action</td> </tr> <tbody> <tr each="{list_of_cat}"> <td class="sc-td-data"> <div class="sc-edit-class"> <input type="text" class="input-readonly" ref="inpCatName{CatID}" riot-value="{catname}" readonly> </div> </td> <td class="sc-td-data"> <div class="siimple-switch"> <input type="checkbox" ref="chkActive{CatID}" id="{CatID}" checked="{active === 1? \'checked\': \'\'}"> <label for="{CatID}"></label> <div></div> </div> </td> <td class="sc-td-data"> <div class="siimple-btn siimple-btn--yellow" onclick="{() => editCategory(CatID)}"> Edit </div> <div class="siimple-btn siimple-btn--error" onclick="{() => delCategory(CatID)}"> Disable </div> </td> </tr> </tbody> </table> <sc-notify></sc-notify> <sc-modal title="Edit Category" ref="editModal" footeraction="1"> <yield to="body"> <div class="siimple-field"> <input ref="inpName" class="input-box md-input-fluid" riot-value="{mObj.catname}"> </div> <div class="siimple-field"> <div class="siimple-switch"> <input type="checkbox" ref="chkActive" id="md{mObj.CatID}" checked="{mObj.active? \'checked\': \'\'}"> <label for="md{mObj.CatID}"></label> <div></div> </div> </div> </yield> <yield to="footer"> </yield> </sc-modal>', 'sc-list-category .input-readonly,[data-is="sc-list-category"] .input-readonly{ display: inline; padding: 0.2rem 0.45rem; font-size: 1rem; line-height: 1.5; color: #1D2F3A; background-color: #f3f3f3; background-clip: padding-box; border: 0px; border-radius: 0.2rem; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; margin: 5px; } sc-list-category .md-input-fluid,[data-is="sc-list-category"] .md-input-fluid{ width: 95%; }', '', function(opts) {
    list_of_cat = [];
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){

    });

    this.on('mount', function(){
      this.getCategories(true);
    });

    this.on('update', function(){

    })

    this.notify = function(notifyObj){
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

    this.getCategories = function(activeOnly = false){
      if(activeOnly){
        mainControl.action('getCategoriesAction', {param: '?active=1'});
      }else{
        mainControl.action('getCategoriesAction', {param: '/all'});
      }
    }.bind(this)

    this.editCategory = function(catId = ''){
      var oCat = null;
      if(catId !== ''){
        oCat = {
          CatID : catId,
          catname: this.refs['inpCatName' + catId].value,
          active: this.refs['chkActive' + catId].checked
        }
      }else{
        oCat = {
          CatID : '',
          catname: '',
          active: true
        }
      }
      this.refs.editModal.showModal(oCat);
    }.bind(this)

    this.delCategory = function(catId){
      if(catId !== ''){
        mainControl.action('delCategoryAction', {param: catId});
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: 'No category ID provided',
          visibile: true
        });
      }
    }.bind(this)

    this.modalConfirm = function(){
      var oCat = {
        CatID : '',
        catname: this.tags['sc-modal'].refs.inpName.value,
        active: this.tags['sc-modal'].refs.chkActive.checked? 1 : 0
      };
      if(! self.isEmpty(mObj)){
        oCat.CatID = mObj.CatID;
      }

      mainControl.action('saveCategoryAction', {param: oCat});
    }.bind(this)

    this.modalCancel = function(){
      this.tags['sc-modal'].refs.inpName.value = '';
      this.refs.editModal.exitModal();
    }.bind(this)

    this.showAllCategory = function(status){
      if(status){
        this.getCategories(false);
      }else{
        this.getCategories(true);
      }
    }.bind(this)

    mainControl.change('CategoriesRetrieved', function(state, c){
      var category = c.getter('getCategoriesGetter');
      var carArr = [];
      if(category.success.status){
        self.list_of_cat = category.result;
        self.update();
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: category.error.message,
          visibile: true
        });
      }
    });

    mainControl.change('SavedCategory', function(state, c){
      var category = c.getter('getSavedCategoryGetter');
      if(category.success.status){
        self.refs.editModal.showModal();
        self.getCategories();
        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'primary',
          stay: 3,
          message: category.success.message,
          visibile: true
        });
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: category.error.message,
          visibile: true
        });
      }
    });

    mainControl.change('CategoryDeleted', function(state, c){
      var category = c.getter('getDelCategoryGetter');
      if(category.success.status){
        self.parent.all = true;
        self.showAllCategory(true);
        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'primary',
          stay: 3,
          message: category.success.message,
          visibile: true
        });
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: category.error.message,
          visibile: true
        });
      }
    });

    this.isEmpty = function(obj) {
      for(var key in obj) {
        if(obj.hasOwnProperty(key)){
          return false;
        }
      }
      return true;
    }.bind(this)
});
riot.tag2('sc-manage-category', '<div class="siimple-alert siimple-alert--warning" if="{acl.post === undefined || acl.post === null}"> You are not allow to access this module! </div> <div class="simple-grid" if="{acl.post.acl > 4}"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> {title} </div> <div class="siimple--display-block siimple--bg-light sc-panel" if="{list}"> <div class="siimple-btn siimple-btn--navy {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" if="{acl.post.acl >= 7}" onclick="{() => createCategory()}">Create </div> <div class="siimple--float-right"> <label class="label">Show All:</label> <div class="siimple-switch"> <input type="checkbox" id="showAllSwitch"> <label for="showAllSwitch" onclick="{() => showAll()}"></label> <div></div> </div> </div> </div> </div> <div if="{isLoading}"> <div class="siimple-spinner siimple-spinner--teal"></div> </div> <sc-list-category></sc-list-category> <div>', 'sc-manage-category .sc-title,[data-is="sc-manage-category"] .sc-title{ padding: 5px; border-radius: 3px 3px 0px 0px; margin: -15px -15.5px 15px -15.5px } sc-manage-category .sc-panel,[data-is="sc-manage-category"] .sc-panel{ padding: 10px; margin: -15px -15px 20px -15px; } sc-manage-category .label,[data-is="sc-manage-category"] .label{ line-height: 34px; }', '', function(opts) {
    this.title = 'Manage Category';
    this.list = true;
    this.acl = opts.acl;
    this.all = false;

    this.createCategory = function(){
      this.tags['sc-list-category'].editCategory('');
    }.bind(this)

    this.showAll = function(){
      if(this.all){
        this.all = false;
        this.tags['sc-list-category'].showAllCategory(false);
      }else{
        this.all = true;
        this.tags['sc-list-category'].showAllCategory(true);
      }
    }.bind(this)
});
riot.tag2('sc-edit-post', '<div class="siimple-form"> <div class="siimple-field"> <label class="siimple-label">Title</label><br> <input type="text" class="siimple-input siimple-input--fluid sc-input" ref="inpPostTitle" onkeypress="{() => wrtingTitle()}" onkeyup="{() => wrtingTitle()}" onkeydown="{() => wrtingTitle()}"> <div class="siimple--display-block siimple--bg-light siimple--color-dark sc-hint"> <small> <box-icon name="link"></box-icon> {baseUrl}post/{slugText} </small> </div> </div> <div class="siimple-field"> <label class="siimple-label">Category</label><br> <sc-multi-select ref="selCategories"></sc-multi-select> </div> <div class="siimple-field"> <label class="siimple-label">Cover Photo</label><br> <sc-image-select ref="selCoverImg"></sc-image-select> </div> <div class="siimple-field"> <div id="editor"> </div> </div> <div class="siimple-field"> <label class="siimple-label">Active</label> <div class="siimple-checkbox"> <input type="checkbox" id="chkActive" ref="chkActive"> <label for="chkActive"></label> </div> <div class="space"></div> <label class="siimple-label">Visibility</label> <div class="siimple-checkbox"> <input type="checkbox" id="chkVisible" ref="chkVisible"> <label for="chkVisible"></label> </div> <div class="space"></div> <label class="siimple-label">Allow Comment</label> <div class="siimple-checkbox"> <input type="checkbox" id="chkComment" ref="chkComment"> <label for="chkComment"></label> </div> <div class="space"></div> <label class="siimple-label">Mode</label> <select ref="selMode" class="siimple-select"> <option value="DRAFT">DRAFTING</option> <option value="RELEASE">RELEASE</option> <option value="ARCHIVED">ARCHIVED</option> </select> <div class="space"></div> <label class="siimple-label">Publish Date</label> <mino-date theme="primary" ref="inpDate" type="modal"></mino-date> </div> <div class="siimple-field"> <label class="siimple-label">Meta Tag</label><br> <input type="text" class="siimple-input siimple-input--fluid sc-input" ref="inpMetaTag"> <div class="siimple--display-block siimple--bg-light siimple--color-dark sc-hint"> <small> <box-icon name="info-circle"></box-icon> Meta tags contain information about a website. Search engines access certain meta tags so they can, for instance, display a page title and description in the search results. </small> </div> </div> <div class="siimple-field"> <label class="siimple-label">Author Name</label> <input type="text" ref="inpCreator" class="siimple-input sc-input" maxlength="100" placeholder="Your name"> </div> <div class="siimple--clearfix"> <div class="siimple--float-left"> <div class="siimple-btn siimple-btn--primary" onclick="{() => saveContent()}">Save</div> <div class="siimple-btn siimple-btn--warning" onclick="{() => backToList()}">Back</div> </div> <div class="siimple--float-right"> <div class="siimple-btn siimple-btn--light" onclick="{() => preview()}"> Preview </div> </div> </div> <sc-notify></sc-notify>', 'sc-edit-post .space,[data-is="sc-edit-post"] .space{ width: 5%; display: inline-block; } sc-edit-post .sc-input,[data-is="sc-edit-post"] .sc-input{ background:#f3f3f3; border:1px solid #ccc; } sc-edit-post .sc-hint,[data-is="sc-edit-post"] .sc-hint{ padding: 0.5em; margin-top: 5px; }', '', function(opts) {
riot.tag2('mino-date', '<input type="text" ref="{rname}" class="cal {class}" onclick="{() => renderCalendar()}" riot-value="{date}"><br> <div class="{(render || mRender || yRender) && type=== \'modal\' ? \'modal-back\': \'\'}"></div> <div if="{render}" class="{type !== \'modal\'? \'calendar\': \'calendar-modal\'}"> <div class="title-wrapper"> <div class="t-year-title" onclick="{() => monthYearSelection(\'year\')}"> {minodate.year} </div> <div class="month-title" onclick="{() => monthYearSelection(\'month\')}"> {minodate.getMonthName(minodate.month)} </div> <button type="button" class="month-navigator" onclick="{() => minodate.prevMonth()}">&#8249;</button> <button type="button" class="month-navigator" onclick="{() => minodate.nextMonth()}">&#8250;</button> </div> <div> <div class="week-title">S</div> <div class="week-title">M</div> <div class="week-title">T</div> <div class="week-title">W</div> <div class="week-title">T</div> <div class="week-title">F</div> <div class="week-title">S</div> </div> <div class="month-wrapper"> <div class="week-wrapper" each="{week in weeks}"> <mino-week week="{week}" parentname="{rname}" theme="{theme}"></mino-week> </div> </div> <div class="bottom-action"> <div class="action-wrapper" onclick="{() => clearSelection()}"> clear </div> <div class="action-wrapper" onclick="{() => todaySelection()}"> TODAY </div> <div class="action-wrapper" onclick="{() => renderCalendar()}"> close </div> </div> </div> <div if="{mRender}" class="{type !== \'modal\'? \'calendar\': \'calendar-modal\'}" style="overflow: hidden;"> <div class="year-title" onclick="{() => monthYearSelection(\'year\')}">{minodate.year}</div> <div style="display:flex;"> <div class="month-year-selection"> <div class="month-selection" each="{month, m in minodate.getMonthNames()}" onclick="{() => monthSelection(m)}"> {month} </div> </div> </div> <div style="text-align:center;" class="{theme} monthyear-close" onclick="{() => monthYearClose()}">&times; close</div> </div> <div if="{yRender}" class="{type !== \'modal\'? \'calendar\': \'calendar-modal\'}" style="overflow: hidden;"> <div style="display:flex;"> <div class="month-year-selection"> <div class="year-selection" each="{year, y in minodate.getYearSelection(numOfYears)}" onclick="{() => yearSelection(year)}"> {year} </div> </div> </div> <div style="text-align:center;" class="{theme} monthyear-close" onclick="{() => monthYearClose()}">&times; close</div> </div>', 'mino-date,[data-is="mino-date"]{ font-family: \'Lato\', Helvetica, sans-serif; color: #333447; line-height: 1.5; } @media (min-width: 320px) and (max-width: 480px) { mino-date .calendar-modal,[data-is="mino-date"] .calendar-modal{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: 16px; top: 10%; left: 0; width: 90%; box-shadow: 2px 2px 2px 2px #5a5858; } mino-date .calendar,[data-is="mino-date"] .calendar{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: -5px -25px 20px 0px; width: 80%; } mino-date .month-title,[data-is="mino-date"] .month-title{ width: 52%; display: inline-block; text-align:left; font-weight: 600; font-size: x-large; cursor:pointer; } mino-date .t-year-title,[data-is="mino-date"] .t-year-title{ width: 20%; display: inline-block; text-align:center; font-size: large; cursor:pointer; } mino-date .week-title,[data-is="mino-date"] .week-title{ width:11.25%; text-align: center; display:inline-block; padding:1%; } } @media (min-width: 481px) and (max-width: 767px) { mino-date .calendar-modal,[data-is="mino-date"] .calendar-modal{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: 25px; top: 0; left: 6%; width: 45%; box-shadow: 2px 2px 2px 2px #5a5858; } mino-date .calendar,[data-is="mino-date"] .calendar{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: -5px -25px 20px 0px; width: 290px; } mino-date .month-title,[data-is="mino-date"] .month-title{ width: 48%; display: inline-block; text-align:left; font-weight: 600; font-size: x-large; cursor:pointer; border-radius: 0.2em; padding: 1%; } mino-date .t-year-title,[data-is="mino-date"] .t-year-title{ width: 19.5%; display: inline-block; text-align:center; font-size: large; cursor:pointer; border-radius: 0.2em; padding: 1.5%; } mino-date .week-title,[data-is="mino-date"] .week-title{ width:10.5%; text-align: center; display:inline-block; padding:1%; } } @media (min-width: 768px) and (max-width: 1024px) { mino-date .calendar-modal,[data-is="mino-date"] .calendar-modal{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: 25px; top: 0; left: 6%; width: 45%; box-shadow: 2px 2px 2px 2px #5a5858; } mino-date .calendar,[data-is="mino-date"] .calendar{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: -5px -25px 20px 0px; width: 290px; } mino-date .month-title,[data-is="mino-date"] .month-title{ width: 48%; display: inline-block; text-align:left; font-weight: 600; font-size: x-large; cursor:pointer; border-radius: 0.2em; padding: 1%; } mino-date .t-year-title,[data-is="mino-date"] .t-year-title{ width: 19.5%; display: inline-block; text-align:center; font-size: large; cursor:pointer; border-radius: 0.2em; padding: 1.5%; } mino-date .week-title,[data-is="mino-date"] .week-title{ width:11%; text-align: center; display:inline-block; padding:1%; } } @media (min-width: 1025px) and (max-width: 1920px) { mino-date .calendar,[data-is="mino-date"] .calendar{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: -5px -25px 20px 0px; width: 280px; font-size: smaller; } mino-date .calendar-modal,[data-is="mino-date"] .calendar-modal{ border: 0.15em solid #b9b5b5; display: inline-block; position: absolute; background: #f3f3f3; border-radius: 0.25em; height: auto; margin: 25px; top: 10%; left: 35%; width: 350px; box-shadow: 2px 2px 2px 2px #5a5858; } mino-date .month-title,[data-is="mino-date"] .month-title{ width: 46%; display: inline-block; text-align:left; font-size: x-large; cursor:pointer; font-weight: 600; padding:2%; border-radius: 0.2em; } mino-date .t-year-title,[data-is="mino-date"] .t-year-title{ width: 19.5%; display: inline-block; text-align:center; font-size: large; cursor:pointer; padding:2%; border-radius: 0.2em; } mino-date .week-title,[data-is="mino-date"] .week-title{ width:11%; text-align: center; display:inline-block; padding:1%; } } mino-date .modal-back,[data-is="mino-date"] .modal-back{ position: fixed; z-index: 0; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); } mino-date .bottom-action,[data-is="mino-date"] .bottom-action{ width: 100%; padding: 1px; } mino-date .action-wrapper,[data-is="mino-date"] .action-wrapper{ box-sizing: border-box; display: inline-block; width: 32%; padding: 4px; text-decoration: none; color: inherit; border: 0; background: transparent; text-align: center; cursor: pointer; border-radius: 0.15em; } mino-date .action-wrapper:hover,[data-is="mino-date"] .action-wrapper:hover{ background: #ddd; color: #161125; } mino-date .input-box,[data-is="mino-date"] .input-box{ display: inline; padding: 0.2rem 0.45rem; font-size: 1rem; line-height: 1.5; color: #1D2F3A; background-color: #fff; background-clip: padding-box; border: 1.35px solid #ced4da; border-radius: 0.2rem; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; margin: 5px; } mino-date .input-line,[data-is="mino-date"] .input-line{ display: inline; padding: 0.2rem 0.45rem; font-size: 1rem; line-height: 1.5; color: #1D2F3A; background-color: #fff; background-clip: padding-box; border: 1.35px solid #364a4c; border-top: 0; border-left: 0; border-right: 0; border-radius: 0.2rem; transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; margin: 5px; border-radius: 0; } mino-date .title-wrapper,[data-is="mino-date"] .title-wrapper{ padding: 1%; } mino-date ::-webkit-scrollbar,[data-is="mino-date"] ::-webkit-scrollbar{ display: none; } mino-date .month-year-selection,[data-is="mino-date"] .month-year-selection{ overflow:scroll; box-sizing: content-box; height:auto; margin:0px 15px; text-align:center; width:100%; padding: 1% display: inline-block; } mino-date .month-selection,[data-is="mino-date"] .month-selection{ height:20px; padding: 10px 15px; display: inline-block; border-radius: 0.2em; cursor: pointer; } mino-date .year-selection,[data-is="mino-date"] .year-selection{ height:20px; padding: 15px 15px; display: inline-block; border-radius: 0.2em; cursor: pointer; margin: 5px; } mino-date .t-year-title:hover,[data-is="mino-date"] .t-year-title:hover{ background-color: #ddd; } mino-date .year-selection:hover,[data-is="mino-date"] .year-selection:hover{ background-color: #ddd; } mino-date .month-title:hover,[data-is="mino-date"] .month-title:hover{ background-color: #ddd; } mino-date .month-selection:hover,[data-is="mino-date"] .month-selection:hover{ background-color: #ddd; } mino-date .year-title,[data-is="mino-date"] .year-title{ font-size: 15.5pt; text-align: center; cursor: pointer; padding: 2%; border-radius: 0.2em; } mino-date .year-title:hover,[data-is="mino-date"] .year-title:hover{ background: #ddd; } mino-date .monthyear-close,[data-is="mino-date"] .monthyear-close{ cursor: pointer } mino-date .display-wrapper,[data-is="mino-date"] .display-wrapper{ text-align: center; } mino-date .month-wrapper,[data-is="mino-date"] .month-wrapper{ display:inline-block; width: 100%; } mino-date .week-wrapper,[data-is="mino-date"] .week-wrapper{ width: 100%; height:auto; display:block; padding: 1%; } mino-date .month-navigator,[data-is="mino-date"] .month-navigator{ width:11%; border-radius: 0.2em; border: 0; font-size: 15.5pt; padding: 0px; cursor: pointer; background-color: #f3f3f3; } mino-date .month-navigator:hover,[data-is="mino-date"] .month-navigator:hover{ background: #ddd; } mino-date .light,[data-is="mino-date"] .light{ background-color: #f4f4f4; color: #1D2F3A; } mino-date .warning,[data-is="mino-date"] .warning{ background-color: #F32260; color: #FCF7FA; } mino-date .success,[data-is="mino-date"] .success{ background-color: #1ECE80; color: #FCF7FA; } mino-date .primary,[data-is="mino-date"] .primary{ background-color: #456990; color: #FCF7FA; } mino-date .dark,[data-is="mino-date"] .dark{ background-color: #323C46; color: #FCF7FA; } mino-date .note,[data-is="mino-date"] .note{ background-color: #FFD011; color: #1D2F3A; } mino-date .default,[data-is="mino-date"] .default{ background-color: #989898; color: #FCF7FA; } mino-date .cal,[data-is="mino-date"] .cal{ background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDgwIDgwIiBoZWlnaHQ9IjgwcHgiIGlkPSJJY29ucyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgODAgODAiIHdpZHRoPSI4MHB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Zz48cGF0aCBkPSJNNjEsMjAuMDQ3aC02VjE1aC01djUuMDQ3SDMwVjE1aC01djUuMDQ3aC01LjkxOWMtMi4yMDksMC00LDEuNzkxLTQsNFY2MWMwLDIuMjA5LDEuNzkxLDQsNCw0SDYxYzIuMjA5LDAsNC0xLjc5MSw0LTQgICBWMjQuMDQ3QzY1LDIxLjgzOCw2My4yMDksMjAuMDQ3LDYxLDIwLjA0N3ogTTYwLDYwSDIwVjM1aDQwVjYweiBNNjAsMzBIMjB2LTVoNDBWMzB6Ii8+PHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeD0iMzgiIHk9IjQwIi8+PHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeD0iNDgiIHk9IjQwIi8+PHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeD0iMzgiIHk9IjUwIi8+PHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeD0iMjgiIHk9IjUwIi8+PC9nPjwvc3ZnPg==) no-repeat scroll 4.5px 4.5px; background-position: right; background-repeat: no-repeat; background-size: 30px; }', '', function(opts) {
var minoDateObserver = function () {
  riot.observable(this);

  this.date = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    fullDate: new Date(),
    getFullDate: function(format){
      if(format === "short"){
        return this.fullDate.getMonth() + "/" + this.fullDate.getDate() + "/" + this.fullDate.getFullYear();
      } else if (format === "short") {
        return this.fullDate.getDate() + "-" + this.fullDate.getMonth() + "-" + this.fullDate.getFullYear();
      }else{
        return this.getMonthName(this.fullDate.getMonth()) + " " + this.fullDate.getDate() + " " + this.fullDate.getFullYear();
      }
    },
    getMonthName: function (month) {
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[month];
    }
  }
}

    this.type = opts.type;
    this.day = opts.day !== undefined? opts.day: new Date().getDate();
    this.month = opts.month !== undefined ? opts.month: new Date().getMonth();
    this.year = opts.year !== undefined? opts.year: new Date().getFullYear();
    this.rname = opts.rname !== undefined? opts.rname: '';
    this.date = opts.date !== undefined? opts.date: '';
    this.format = opts.format !== undefined? opts.format : "long";
    this.daysOfMonth = 31;
    this.weeks = [];
    this.render = false;
    this.mRender = false;
    this.yRender = false;
    this.theme = opts.theme !== undefined? opts.theme : "primary";
    this.class = opts.class !== undefined? opts.class : "input-line";
    this.options = {
      weekStartDay: opts.weekStartDay === undefined? opts.weekStartDay: 'SUN',
      displayType: opts.displayType === undefined? opts.displayType: 'MONTH',
      format: opts.format !== undefined? opts.format : "long"
    };
    this.numOfYears = opts.numofyears !== undefined? opts.numofyears: 10;
    this.value = '';
    riot.minoDateObserver = new minoDateObserver();
    var self = this;

    const weekDay = function(){
      this.day = 0;
      this.month = 0;
      this.year = 1900;
      this.weekDay = 1;
      this.show = false;
      this.inMonth = true;
      this.init = false;
      this.setWeekDay = function(weekDay) {
        this.weekDay = weekDay;
      };
      this.setDate = function(day, month, year){
        this.day = day;
        this.month = month;
        this.year = year;
      };
      this.setVisibility = function(show){
        this.show = show;
      };
      this.setInMonth = function(inMonth){
        this.inMonth = inMonth;
      };
      this.setInit = function(init){
        this.init = init;
      }
    };

    this.on('before-mount', function(){
      this.initMinoDate();
      this.computeCalendar();
    });

    this.on('mount', function(){

      if(this.date === ""){
        this.minodate.setSelected(this.minodate.day, this.minodate.month, this.minodate.year);
      }else{
        var tmpDateObj = new Date(this.date);
        this.minodate.setSelected(tmpDateObj.getDate(), tmpDateObj.getMonth(), tmpDateObj.getFullYear());
      }
    });

    this.on('update', function(){
      this.computeCalendar();
    });

    this.initMinoDate = function(){
      var initDateType = 0;
      if(this.date !== ""){
        initDateType = 1;
      }
      this.minodate.init(this.day, this.month, this.year, this.options, initDateType, this.date);
    }.bind(this)

    this.renderCalendar = function(){
      if(this.render){
        this.render = false;
      }else{
        this.render = true;
      }
      this.update();
    }.bind(this)

    this.computeCalendar = function(){
      this.weeks = [];
      var visible = false;
      var dayCount = 0;
      var lastMthDayCount = 0;
      var nextMonthCount = 0;
      var firstDayFound = false;
      var lastDayFound = false;
      var lastMonthDayInWeek1 = this.minodate.getLastMonthRemainingDay();
      var dteObj = new Date(this.minodate.year, this.minodate.month - 1, lastMonthDayInWeek1);
      var day = 1;
      if(this.minodate.selectedDate !== null){
        day = this.minodate.selectedDate.getDate();
      }else{
        day = this.minodate.day;
      }
      lastMthDayCount = dteObj.getDate();

      var weeksCount = 6;
      for(var w = 1; w <= weeksCount; w++){
        var week = [];
        for(var n = 0; n < 7; n++){
          if(w === 1){
            if(n === this.minodate.getFirstDayOfTheMonth()){
              visible = true;
              firstDayFound = true;
            }
          }
          if(firstDayFound){
            dayCount++;
            var wd = new weekDay();
            if(dayCount <= this.minodate.getDaysOfMonth()){
              wd.setVisibility(visible);
              wd.setDate(dayCount, this.minodate.month, this.minodate.year);
              if(day === dayCount){
                wd.setInit(true);
              }
              week.push(wd);
            }else{
              lastDayFound = true;
            }
          }else{
            lastMthDayCount++;
            var wd = new weekDay();
            wd.setDate(lastMthDayCount, this.minodate.month - 1 , this.minodate.year);
            wd.setVisibility(true);
            wd.setInMonth(false);
            week.push(wd);
          }

          if(lastDayFound){
            nextMonthCount++;
            var wd = new weekDay();
            wd.setVisibility(true);
            wd.setInMonth(false);
            wd.setDate(nextMonthCount, this.minodate.month + 1, this.minodate.year);
            week.push(wd);
          }
        }
        this.weeks.push(week);
      }
    }.bind(this)

    this.setSelectedDate = function(dtObj){
      this.minodate.setSelected(dtObj.day, dtObj.month, dtObj.year);
      this.renderCalendar();
    }.bind(this)

    this.monthYearSelection = function(renderOption){
      if(renderOption === "month"){
        this.mRender = true;
        this.render = false;
        this.update();
      }else if(renderOption === "year"){
        this.mRender = false;
        this.render = false;
        this.yRender = true;
        this.update();
      }
    }.bind(this)

    this.monthSelection = function(m){
      this.minodate.month = m;
      this.mRender = false;
      this.render = true;
      this.update();
    }.bind(this)

    this.yearSelection = function(y){
      this.minodate.year = y;
      this.mRender = false;
      this.render = true;
      this.yRender = false;
      this.update();
    }.bind(this)

    this.monthYearClose = function(){
      this.mRender = false;
      this.yRender = false;
      this.render = true;
      this.update();
    }.bind(this)

    this.todaySelection = function(){
      this.minodate.setSelected(this.minodate.todayDate.getDate(), this.minodate.todayDate.getMonth(), this.minodate.todayDate.getFullYear());
      this.renderCalendar();
    }.bind(this)

    this.clearSelection = function(){
      this.date = "";
      this.renderCalendar();
    }.bind(this)

    this.minodate = {
      day : new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      todayDate: new Date(),
      dte: null,
      weekStartDay: 0,
      displayType: 'MONTH',
      daysOfMonth: 31,
      lastMthRemaiDays: 0,
      nextMonthBeginDay: 1,
      selectedDate : null,
      showDate: {
        iso: "",
        short: "",
        long: ""
      },
      format: "long",
      init: function(day, month, year, options, initDateType, date=null){
        this.day = parseInt(day);
        this.month = parseInt(month);
        this.year = parseInt(year);
        this.todayDate = new Date();
        if(initDateType === 1){
          this.dte = new Date(date);
        }else{
          this.dte = new Date(year, month, day);
        }
        this.weekStartDay = options.weekStartDay;
        this.displayType = options.displayType;
        this.daysOfMonth = this.dte.getDate();
        this.selectedDate = null;
        this.format = options.format;
      },
      getDate: function(format){
        if(format === "iso"){
          return this.formatDate(this.todayDate, "iso");
        } else if (format === "short") {
          return this.formatDate(this.todayDate, "short");
        }else{
          return this.formatDate(this.todayDate, "long");
        }
      },
      setDate: function(day, month, year){
        this.day = day;
        this.month = month;
        this.year = year;
        this.dte = new Date(year, month, day);
      },
      setSelected: function(day, month, year){
        this.selectedDate = new Date(year, month, day);
        this.day = day;
        this.month = month;
        this.year = year;
        this.showDate.iso = this.formatDate(this.selectedDate, "iso");
        this.showDate.short = this.formatDate(this.selectedDate, "short");
        this.showDate.long = this.formatDate(this.selectedDate, "long");
        self.update();
        if(self.refs.displayDate !== undefined){
          self.refs.displayDate.innerHTML = this.showDate.long !== ""? this.showDate.long: this.getDate();
        }
        if(self.format === "iso"){
          self.date = this.showDate.iso;
        }else if(self.format === "short"){
          self.date = this.showDate.short;
        }else{
          self.date = this.showDate.long;
        }
        self.value = self.date;
        self.update();

        riot.minoDateObserver.trigger('selectedActive', {day:day});
      },
      prevMonth: function(){
        var year = parseInt(this.year);
        var month = parseInt(this.month);
        var day = parseInt(this.day);

        day = 1;
        if(this.month - 1 < 0){
          month = 11;
          year = parseInt(this.year) - 1;
        }else{
          month = parseInt(this.month) - 1;
          year = parseInt(this.year);
        }
        this.setDate(1, month, year);
        if(this.selectedDate !== null){
          this.setSelected(this.selectedDate.getDate(), month, year);
        }
        self.update();
      },
      nextMonth: function(){
        var year = parseInt(this.year);
        var month = parseInt(this.month);
        var day = parseInt(this.day);

        day = 1;
        if(month + 1 > 11){
          month = 0;
          year = parseInt(this.year) + 1;
        }else{
          month = parseInt(this.month) + 1;
          year = parseInt(this.year);
        }
        this.setDate(day, month, year);
        if(this.selectedDate !== null){
          this.setSelected(this.selectedDate.getDate(), month, year);
        }

        self.update();
      },
      getMonthName: function(month){
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month];
      },
      getMonthNames: function(){
        return ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
      },
      getYearSelection: function(num = 10){
        var starting = parseInt(this.year) - num;
        var ending = parseInt(this.year) + (num - 1);
        var yearArr = [];
        for(var n = starting; n <= ending; n++){
          yearArr.push(n);
        }
        return yearArr;
      },
      formatDate: function(date, format=null){
        var f = format === null? this.format: format;
        var month = date.getMonth();
        var day = date.getDate();
        var year = date.getFullYear();
        if(f === "iso"){
          month = parseInt(month) + 1;
          return year + "-" + month + "-" + day;
        }else if(f === "short"){
          month = parseInt(month) + 1;
          return month + "/" + day + "/" + year;
        }else{
          return this.getMonthName(month) + " " + day + " " + year;
        }
      },
      getFirstDayOfTheMonth: function(){
        var dtObj = new Date(this.year, this.month, 1);
        return dtObj.getDay();
      },
      getDaysOfMonth: function(){
        return new Date(this.year, this.month + 1, 0).getDate();
      },
      getLastMonthRemainingDay: function(){
        var weekPos = this.getFirstDayOfTheMonth();
        var lastMth = new Date(this.year, this.month, 0);
        this.lastMthRemaiDays = lastMth.getDate() - weekPos;
        return this.lastMthRemaiDays;
      },
      getNextMonthStartDays: function(){
        var nextMth = new Date(this.year, this.month + 1, 1);
        this.nextMonthBeginDay = nextMth.getDay() + 1;
        var weekDayRemain = 7 - this.nextMonthBeginDay;
        return weekDayRemain;
      },
      weeksCount : function() {
        var firstOfMonth = new Date(this.year, this.month, 1);
        var day = firstOfMonth.getDay() || 6;
        var day = firstOfMonth.getDay();
        day = day === 0 ? 1 : day;
        if (day < 1) { day-- }
        var diff = 7 - day;
        console.log('diff: ' + diff);

        var lastOfMonth = new Date(this.year, this.month - 1, 0);
        var lastDate = lastOfMonth.getDate();
        if (lastOfMonth.getDay() === 1) {
          diff--;
        }
        console.log('lastDate: ' + lastDate);;
        var result = Math.ceil((lastDate - diff) / 7);
        console.log('result: ' + parseInt(result) + 1);
        return result + 1;
      },
      getWeekCount: function(){
        var firstOfMonth = new Date(this.year, this.month, 1);
        var day = firstOfMonth.getDay() || 6;
        day = day === 1 ? 0 : day;
        if (day) { day-- }
        var diff = 7 - day;
        var lastOfMonth = new Date(this.year, this.month + 1, 0);
        var lastDate = lastOfMonth.getDate();
        if (lastOfMonth.getDay() >= 0) {
            diff--;
        }
        var result = Math.ceil((lastDate - diff) / 7);
        return result + 1;
      },
      getWeekCount2: function(){
        var weekCount = 4;
        var firstOfMonth = new Date(this.year, this.month, 1);
        var day = firstOfMonth.getDay();
        if(day > 0){
          weekCount++;
        }

        var lastOfMonth = new Date(this.year, this.month, 0);
        var lastDate = lastOfMonth.getDate();
        if (lastOfMonth.getDay() >= 0 && lastOfMonth.getDay() <= 5) {
            weekCount++;
        }else if(lastOfMonth.getDay() === 6){
          weekCount--;
        }
        return weekCount;
      }
    }
});
riot.tag2('mino-day', '<div class="day-wrapper {! inMonth? \'not-in-month\': \'\'} {selected? theme: \'\'}" onclick="{() => setCalendarDate(day, month, year)}"> {show === true? day: \'N/A\'} </div>', '@media (min-width: 1025px) and (max-width: 1920px) { mino-day .day-wrapper,[data-is="mino-day"] .day-wrapper{ cursor:pointer; width:14%; height:32px; display: inline-block; text-align:center; vertical-align:middle; line-height:2; } mino-day .not-in-month,[data-is="mino-day"] .not-in-month{ color: #bbb; } mino-day .active,[data-is="mino-day"] .active{ background-color: #456990; border-radius: 0.25em; } } @media (min-width: 481px) and (max-width: 767px) { mino-day .day-wrapper,[data-is="mino-day"] .day-wrapper{ cursor:pointer; width:14%; height:32px; display: inline-block; text-align:center; vertical-align:middle; line-height:2; } mino-day .not-in-month,[data-is="mino-day"] .not-in-month{ color: #bbb; } mino-day .active,[data-is="mino-day"] .active{ background-color: #456990; border-radius: 0.25em; } } @media (min-width: 768px) and (max-width: 1024px) { mino-day .day-wrapper,[data-is="mino-day"] .day-wrapper{ cursor:pointer; width:14%; height:32px; display: inline-block; text-align:center; vertical-align:middle; line-height:2; } mino-day .not-in-month,[data-is="mino-day"] .not-in-month{ color: #bbb; } mino-day .active,[data-is="mino-day"] .active{ background-color: #456990; border-radius: 0.25em; } } @media (min-width: 320px) and (max-width: 480px) { mino-day .day-wrapper,[data-is="mino-day"] .day-wrapper{ cursor:pointer; width:14%; height:32px; display: inline-block; text-align:center; vertical-align:middle; line-height:2.1; } mino-day .not-in-month,[data-is="mino-day"] .not-in-month{ color: #bbb; } mino-day .active,[data-is="mino-day"] .active{ background-color: #456990; border-radius: 0.25em; } } mino-day .day-wrapper:hover,[data-is="mino-day"] .day-wrapper:hover{ background-color:#ccc; border-radius: 0.25em; } mino-day .light,[data-is="mino-day"] .light{ background-color: #f4f4f4; color: #1D2F3A; border-radius: 0.25em; } mino-day .warning,[data-is="mino-day"] .warning{ background-color: #F32260; color: #FCF7FA; border-radius: 0.25em; } mino-day .success,[data-is="mino-day"] .success{ background-color: #1ECE80; color: #FCF7FA; border-radius: 0.25em; } mino-day .primary,[data-is="mino-day"] .primary{ background-color: #456990; color: #FCF7FA; border-radius: 0.25em; } mino-day .dark,[data-is="mino-day"] .dark{ background-color: #323C46; color: #FCF7FA; border-radius: 0.25em; } mino-day .note,[data-is="mino-day"] .note{ background-color: #FFD011; color: #1D2F3A; border-radius: 0.25em; } mino-day .default,[data-is="mino-day"] .default{ background-color: #989898; color: #FCF7FA; border-radius: 0.25em; }', '', function(opts) {

    this.week = opts.week;
    this.day = opts.day !== undefined? parseInt(opts.day): 1;
    this.month = opts.month !== undefined? parseInt(opts.month): 0;
    this.year = opts.year !== undefined? parseInt(opts.year): 1900;
    this.inMonth = opts.inmonth;
    this.selected = opts.init? opts.init: false;
    this.fullDate = new Date(this.year, this.month, this.year);
    this.theme = opts.theme;

    var self = this;

    this.setCalendarDate = function(){
      this.selected = true;
      this.update();
      this.parent.setMonthDay({
        year: this.year,
        month: this.month,
        day: this.day
      });
    }.bind(this)

    riot.minoDateObserver.on('selectedActive', function(day){
      if(self.day !== day.day){
        self.selected = false;
        self.update();
      }
    });

});
riot.tag2('mino-week', '<mino-day each="{week}" day="{day}" month="{month}" year="{year}" show="{show}" inmonth="{inMonth}" init="{init}" theme="{theme}"></mino-day>', '', '', function(opts) {

  this.week = opts.week;
  this.theme = opts.theme;

  this.setMonthDay = function(dtObj){
    this.parent.setSelectedDate(dtObj);
  }.bind(this)
});
    var editor = null;
    var postId = opts.postid !== undefined? opts.postid: '';
    var post = null;
    var postContent = null;
    var author = null;
    var categoriesSelected = '';
    var baseUrl = '';
    var slugText
    var toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],

      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']
    ];

    var options = {
      debug: 'info',
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow',
      placeholder: 'Compose something...',
    };
    var mainControl = this.riotx.get('main-control');
    var cat = [];
    var self = this;
    this.mixin(minoCookie);

    this.on('before-mount', function(){
      if(self.opts.postid === ''){
        self.getAuthorInfo();
      }
      this.getCategories();
    });

    this.on('mount', function () {
      if(self.opts.postid !== ''){
        self.getContent(self.opts.postid);
      }
      editor = new Quill('#editor', options);

      editor.getModule('toolbar').addHandler('image', () => {
        self.selectLocalImage();
      });
      self.wrtingTitle();
    });

    this.getAuthorInfo = function(){
      var authorId = self.getCookie('aid');
      if(authorId === undefined || authorId === null || authorId === ''){
        authorId = self.getCookie('uid');
      }
      mainControl.action('getAuthorInfoAction', {param: authorId});
    }.bind(this)

    this.getCategories = function(){
      mainControl.action('getCategoriesAction', {param: '?active=1'});
    }.bind(this)

    this.getContent = function(id){
      mainControl.action('getPostByIDAction', {param: id});
    }.bind(this)

    this.wrtingTitle = function(){
      var titleText = this.refs.inpPostTitle.value !== undefined? this.refs.inpPostTitle.value: '';
      if(titleText !== ''){
        var slug = titleText.replace(/ /g,"-").toLowerCase();
        self.update({
          slugText: slug
        });
      }
    }.bind(this)

    this.saveContent = function(){
      var creator = self.getCookie('uid');
      if(creator === undefined || creator === ''){
        creator = self.getCookie('aid');
      }
      self.categoriesSelected = self.refs.selCategories.getSelected('array');
      var coverPhotoID = self.refs.selCoverImg.getImageID()
      var coverPhoto = self.refs.selCoverImg.getFileBase64String();
      var oPost = {
        postId: self.postId,
        title: self.refs.inpPostTitle.value,
        content: JSON.stringify(editor.getContents()),
        active: self.refs.chkActive.checked? 1: 0,
        visibility: self.refs.chkVisible.checked? 1: 0,
        allowComment: self.refs.chkComment.checked? 1: 0,
        publishDate: self.refs.inpDate.value,
        AuthorID: creator,
        createdBy: self.refs.inpCreator.value,
        categories: self.categoriesSelected,
        metaTag: self.refs.inpMetaTag.value,
        mode: self.refs.selMode.value,
        fileImg: coverPhoto,
        postImgID: coverPhotoID
      }
      console.log(oPost);
      mainControl.action('savePostAction', oPost);
    }.bind(this)

    this.backToList = function(){
      self.tags['mino-date'].unmount();
      self.parent.editPost('', true);
      self.update();
    }.bind(this)

    this.initPost = function(p){
      console.log(p);
      this.refs.inpPostTitle.value = p.title;
      this.refs.chkActive.checked = p.active === 1 ? true: false;
      this.refs.chkVisible.checked = p.visibility === 1 ? true: false;
      this.refs.chkComment.checked = p.allowComment === 1 ? true: false;
      this.refs.inpDate.date = self.formatDate(p.publishDate);
      this.refs.inpCreator.value = p.createdBy;
      this.refs.inpMetaTag.value = p.metaTag;
      this.refs.selMode.value = p.mode;
      postContent = JSON.parse(p.content);
      if(p.Post_Category.length > 0){
        this.refs.selCategories.setSelected(p.Post_Category);
      }
      if(p.Post_Image.length > 0){
        this.refs.selCoverImg.setImageID(p.Post_Image[0].ImageID);
        this.refs.selCoverImg.setImageUrl(p.Post_Image[0].url);
      }
      editor.setContents(postContent);
    }.bind(this)

    this.preview = function(){
      window.open(self.baseUrl + 'post/' + postId, '_blank');
    }.bind(this)

    this.notify = function(notifyObj){
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

    mainControl.change('SinglePostRetrieved', function(state, c){
      var singlePost = c.getter('getSinglePostByIDGetter');
      var baseUrl = c.getter('baseURLGetter');
      if (singlePost.success.status){
        self.postId = singlePost.result.PostID;
        self.post = singlePost.result;
        self.initPost(self.post);
        self.baseUrl = baseUrl;
        self.update();
      }else{
        console.log(singlePost.error);
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: singlePost.error.message,
          visible: true
        });
      }
    });

    mainControl.change('SinglePostSaved', function(state, c){
      var singlePost = c.getter('savePostGetter');
      if(singlePost.success.status){
        self.postId = singlePost.result.PostID;
        if (singlePost.result.Post_Image.length > 0 ){
          self.refs.selCoverImg.setImageID(singlePost.result.Post_Image[0].ImageID);
        }

        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Post has been successfully updated!',
          visibile: true
        });
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: singlePost.error.message,
          visibile: true
        });
      }
    });

    mainControl.change('GetAuthourInfo', function(state, c){
      var authorInfo = c.getter('getAuthorInfoGetter');
      if(authorInfo.success.status){
        self.author = authorInfo.result;
        self.refs.inpCreator.value = self.author.AdminName !== undefined? self.author.AdminName: self.author.Username;
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: singlePost.error.message,
          visibile: true
        });
      }
    });

    mainControl.change('CategoriesRetrieved', function(state, c) {
      var category = c.getter('getCategoriesGetter');
      var carArr = [];
      if(category.success.status){
        category.result.forEach(function(oCat){
          carArr.push({id: oCat.CatID, name: oCat.catname});
        });
        self.cat = carArr;
        self.refs.selCategories.update({
          selections: self.cat
        });
        self.update();
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: category.error.message,
          visibile: true
        });
      }
    });

    mainControl.change('CategorySelected', function(state, c){
      var category = c.getter('getSelectedCategoriesGetter');
      if(category.length > 0){
        self.categoriesSelected = category;
      }
    });

    this.formatDate = function(date) {
      var dte = new Date(date);
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var day = dte.getDate();
      var monthIndex = dte.getMonth();
      var year = dte.getFullYear();

      return monthNames[monthIndex] + ' ' + day + ' ' + year;
    }.bind(this)

    this.selectLocalImage = function() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      input.onchange = () => {
        const file = input.files[0];

        if (/^image\//.test(file.type)) {
          self.saveToServer(file);
        } else {
          console.warn('You could only upload images.');
        }
      };
    }.bind(this)

    this.saveToServer = function(file) {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('name', file.name);

      const xhr = new XMLHttpRequest();
      var auth_token = self.getCookie('auth_token');
      xhr.open('POST', 'http://localhost:3000/api/image/upload-image', true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const oImage = JSON.parse(xhr.responseText);
          if(oImage.success.status){
            const url = oImage.result.url;
            self.insertToEditor(url);
          }else{
            self.notify({
              position: 'bottom-left',
              theme: 'warning',
              leadstyle: 'note',
              stay: 3,
              message: oImage.error.message,
              visibile: true
            });
          }
        }else{
          self.notify({
            position: 'bottom-left',
            theme: 'warning',
            leadstyle: 'note',
            stay: 3,
            message: 'Unable to upload image to server, error code: ' + xhr.status,
            visibile: true
          });
        }
      };
      xhr.send(fd);
    }.bind(this)

    this.insertToEditor = function(url) {

      const range = editor.getSelection();
      editor.insertEmbed(range.index, 'image', url);
    }.bind(this)

});
riot.tag2('sc-list-post', '<div class="siimple-content siimple-content--fluid {searching}"> <div> <sc-post-card each="{p, index in list_of_post}" post="{p}"></sc-post-card> </div> </div>', 'sc-list-post .blur-bg,[data-is="sc-list-post"] .blur-bg{ filter: blur(2px); }', '', function(opts) {
    this.list_of_post = [];
    this.delPost = false;
    this.delMsg = '';
    this.searching  = ''
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){

    });

    this.on('mount', function(){
      self.getPostList(0);
    });

    this.getPostList = function(page){
      mainControl.action('getPaginatePostAction', {pageNum: page});
      self.parent.update({
        isLoading: true
      });
    }.bind(this)

    mainControl.change('RetrievePaginatePosts', function(state, c){
      var result = c.getter('getPaginatePostGetter');
      console.log(result);
      self.list_of_post = result.result.posts;
      self.parent.update({
        isLoading : false
      });
      self.update();
    });

    this.editPost = function(id, backToList = false){
      self.parent.editPost(id, backToList);
    }.bind(this)

    this.updateList = function(){
      self.getPostList(0);
    }.bind(this)

    this.onblur = function(status){
      if(status){
        self.update({
          searching: 'blur-bg'
        });
      }else{
        self.update({
          searching: ''
        });
      }
    }.bind(this)

});
riot.tag2('sc-manage-post', '<div class="siimple-alert siimple-alert--warning" if="{acl.post === undefined || acl.post === null}"> You are not allow to access this module! </div> <div class="simple-grid" if="{acl.post.acl > 4}"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> {title} </div> <div class="siimple--display-block siimple--bg-light sc-panel" if="{list}"> <div class="siimple-btn siimple-btn--navy {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" if="{acl.post.acl >= 7}" onclick="{() => createPost()}">Create</div> <sc-search-post></sc-search-post> </div> </div> <div if="{isLoading}"> <div class="siimple-spinner siimple-spinner--teal"></div> </div> <sc-list-post if="{list}" ref="postListing"></sc-list-post> <sc-edit-post if="{edit}" postid="{post_id}"></sc-edit-post> <div>', 'sc-manage-post .sc-title,[data-is="sc-manage-post"] .sc-title{ padding: 5px; border-radius: 3px 3px 0px 0px; margin: -15px -15.5px 15px -15.5px } sc-manage-post .sc-panel,[data-is="sc-manage-post"] .sc-panel{ padding: 10px; margin: -15px -15px 20px -15px; }', '', function(opts) {
    this.list = true;
    this.edit = false;
    this.action = 'create';
    this.post_id = '';
    this.isLoading = false;
    this.acl = opts.acl;
    this.title = 'Manage Post';
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){

    });

    this.on('mount', function(){
      this.isLoading = true;
    });

    this.createPost = function(){
      this.list = false;
      this.edit = true;
      this.update();
    }.bind(this)

    this.editPost = function(id, backAction = false){
      if(backAction){
        this.list = true;
        this.edit = false;
        this.post_id = '';
        this.title = 'Manage Post';
        this.update();
      }else{
        this.list = false;
        this.edit = true;
        this.post_id = id;
        this.title = 'Edit Post';
        this.update();
      }
    }.bind(this)

    this.onSearching = function(status){
      this.tags['sc-list-post'].onblur(status);
    }.bind(this)

});
riot.tag2('sc-post-card', '<div class="siimple-card sc-card"> <div class="siimple-card-body"> <div style="float:left; width:90%; font-weight:700;">{post.title}</div> <div style="float: right; cursor:pointer;" onclick="{() => setFeaturePost(post.PostID)}"> <box-icon name="star" type="solid" if="{isFeature === 1}"></box-icon> <box-icon name="star" if="{isFeature !== 1}"></box-icon> </div> <p> {displayContent(post.content)} </p> </div> <div class="siimple-card-footer"> <div class="siimple--clearfix"> <div class="siimple--float-left"> <div class="author">author</div> <div class="siimple--bg-primary siimple--color-white author"> {displayAuthor()} </div> </div> <div class="siimple--float-right"> views: {post.views} </div> </div> <div> <small>created {displayDate(post.createdAt)} </small> </div> <div> <div class="siimple--clearfix"> <div class="siimple-btn siimple-btn--grey siimple--width-25" style="padding:0px 10px 0px 10px;" onclick="{() => viewPost(post.PostID)}">View </div> <div class="siimple-btn siimple-btn--yellow siimple--width-25" style="padding:0px 10px 0px 10px;" onclick="{() => editPost(post.PostID)}"> Edit </div> <div class="siimple-btn siimple-btn--error siimple--width-25" style="padding:0px 10px 0px 10px;" onclick="{() => deletePost(post.PostID)}"> Delete </div> </div> </div> </div> </div> <sc-notify></sc-notify>', 'sc-post-card .sc-card,[data-is="sc-post-card"] .sc-card{ display: inline-block !important; height: auto; margin: 10px 10px 10px 10px !important; border: 1px solid #ddd; max-width: 420px; } sc-post-card .author,[data-is="sc-post-card"] .author{ display: inline-block; padding: 0px 5px 0px 5px; border-radius: 4px; }', '', function(opts) {
    this.post = opts.post;
    var self = this;
    var mainControl = this.riotx.get('main-control');
    var baseUrl = '';
    this.isFeature = opts.post.isFeature !== undefined? opts.post.isFeature: 0;
    this.on('mount', function(){

    });

    this.displayContent = function(content){
      var postContent = JSON.parse(content);
      content = '';
      for(var r = 0; r < 4; r++){
        if(postContent.ops[r] !== undefined){
          if(typeof(postContent.ops[r].insert) !== 'object') {
            content += postContent.ops[r].insert + '\n';
          }
        }
      }

      return content.substring(0, 300) + '...';
    }.bind(this)

    this.displayDate = function(dte){
      var createdDte = new Date(dte);
      return createdDte.toDateString();
    }.bind(this)

    this.displayAuthor = function(){
      return self.post.createdBy !== null? self.post.createdBy : '';
    }.bind(this)

    this.viewPost = function(postId){
      self.baseUrl = mainControl.getter('baseURLGetter');
      console.log(self.baseUrl);
      window.open(self.baseUrl + 'post/' + postId, '_blank');
    }.bind(this)

    this.editPost = function(postId, backToList = false){
      self.parent.editPost(postId, backToList);
    }.bind(this)

    this.deletePost = function(postId){
      mainControl.action('deleteSinglePostAction', {postId: postId});
    }.bind(this)

    this.setFeaturePost = function(postId){
      if(this.isFeature === 0){
        mainControl.action('setFeaturePostAction', {postId: postId});
      }else{
        mainControl.action('rmvFeaturePostAction', {postId: postId});
      }
    }.bind(this)

    this.notify = function(notifyObj){
      if(notifyObj !== null){
        riot.mount('sc-notify', {
          position : notifyObj.position,
          theme : notifyObj.theme,
          leadstyle : notifyObj.leadstyle,
          stay : notifyObj.stay,
          message : notifyObj.message,
          visible : true
        });

      }
    }.bind(this)

    mainControl.change('SinglePostDeleted', function(state, c){
      var result = c.getter('deleteSinglePostGetter');
      if(result.success.status){
        self.notify({
          position: 'top-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Post has been deleted!',
          visible: true
        });
      }else{
        self.notify({
          position: 'top-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: result.error.message,
          visible: true
        });
      }
      self.parent.updateList();
    });

    mainControl.change('FeaturePostSet', function(state, c){
      var result = c.getter('setFeaturePostGetter');
      if(result.success.status)  {
        self.isFeature = 1;
        self.notify({
          position: 'top-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Selected post has been set featured.',
          visible: true
        });
        self.parent.updateList();
      }else{
        self.notify({
          position: 'top-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: result.error.message,
          visible: true
        });
      }
    });

    mainControl.change('FeaturePostRemoved', function(state, c){
      var result = c.getter('rmvFeaturePostGetter');
      if(result.success.status)  {
        self.isFeature = 0;
        self.notify({
          position: 'top-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Selected post has been removed from feature.',
          visible: true
        });
        self.parent.updateList();
      }else{
        self.notify({
          position: 'top-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: result.error.message,
          visible: true
        });
      }
    });
});
riot.tag2('sc-search-post', '<form> <div class="siimple-field sc-field"> <input type="text" class="sc-search siimple-input" placeholder="title, content, category, ..." ref="inpSearch" onkeyup="{() => searchKeyWord()}" onkeydown="{() => searchKeyWord()}" onkeypress="{() => searchKeyWord()}"> <div class="siimple-btn siimple-btn--green sc-search-btn"><box-icon name="search"></box-icon></div> </div> <div class="sc-search-result"> <div class="sc-result-row" each="{r, index in listOfResults}" onclick="{() => gotoPost(r.PostID)}" riot-style="margin-top: {index > 0 ? ((index -1) * 24)+ (index * 65): -20}px"> <b> {r.title} </b><br> <div class="siimple--clearfix"> <div class="siimple--float-left"> <span class="siimple-tag siimple-tag--green">{r.catname}</span> </div> <div class="siimple--float-right"> <span class="siimple-tag siimple-tag--primary siimple-tag--rounded"> by {r.createdBy} </span> </div> </div> <div class="sc-result-btn siimple--bg-light siimple--display-block siimple--color-dark">view</div> </div> </div> </form> <sc-notify></sc-notify>', 'sc-search-post,[data-is="sc-search-post"]{ display: inline-block; float: right; } sc-search-post .sc-search,[data-is="sc-search-post"] .sc-search{ width: 25em; background: #f3f3f3; border-radius: 4px 0px 0px 4px; height: 34px; } sc-search-post .sc-field,[data-is="sc-search-post"] .sc-field{ display: flex; } sc-search-post .sc-search-btn,[data-is="sc-search-post"] .sc-search-btn{ line-height: 3; border-radius: 0px 4px 4px 0px; } sc-search-post .sc-search-result,[data-is="sc-search-post"] .sc-search-result{ } sc-search-post .sc-result-row,[data-is="sc-search-post"] .sc-result-row{ border: 1px solid #ddd; padding: 10px; width: 25em; z-index: 999; position: absolute; background: white; margin-top: -22px; right: 5%; cursor: pointer; } sc-search-post .sc-result-btn,[data-is="sc-search-post"] .sc-result-btn{ padding: 0px 50px; margin-top: 10px; text-align: center; margin: 10px -10px -10px -10px; }', '', function(opts) {
    var self = this;
    var listOfResults = [];
    var baseUrl = '';
    var mainControl = this.riotx.get('main-control');

    this.searchKeyWord = function(){
      var text = this.refs.inpSearch.value !== ''? this.refs.inpSearch.value: '';
      if(text.length >= 2){
        self.parent.onSearching(true);
        mainControl.action('searchPostAction', {param: text});
      }else{
        self.parent.onSearching(false);
        self.update({
          listOfResults: []
        });
      }
    }.bind(this)

    this.gotoPost = function(postId){
      window.open(self.baseUrl + 'post/' + postId, '_blank');
    }.bind(this)

    this.notify = function(notifyObj){
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

    mainControl.change('SearchPostRetrieved', function(state, c){
      var result = c.getter('searchPostGetter');
      self.baseUrl = c.getter('baseURLGetter');
      if(result.success.status){
        self.update({
          listOfResults: result.result.queryResult
        });
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'primary',
          stay: 3,
          message: result.error.message !== ''? result.error.message : 'Unknown result'
        });
      }
    });
});


riot.tag2('sc-edit-role', '<div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-content-title"> {act === \'create\'? \'Create\': \'Edit\'} Role </div> <div class="siimple--display-block siimple--bg-white sc-content-panel"> <div class="siimple-form"> <div class="siimple-form-title" if="{act===\'create\'}">Create a new Role</div> <div class="siimple-form-title" if="{act===\'edit\'}">Edit Role - {edit_role.Rolename}</div> <div class="siimple-form-detail">Please fill up the form to complete the form.</div> <div class="siimple-form-field"> <label class="siimple-label input-label">Role Name </label> <input type="text" ref="inpRoleName" class="siimple-input"> <div class="space"></div> <label class="siimple-label">Active</label> <div class="siimple-checkbox"> <input type="checkbox" ref="activeChk" id="activeChk"> <label for="activeChk"></label> </div> <div class="sc-block"></div> <div class="siimple-form-field"> <div class="siimple-btn siimple-btn--blue" onclick="{() => saveRole()}" if="{role_id !== \'\'}">Save</div> <div class="siimple-btn siimple-btn--blue" onclick="{() => createRole()}" if="{role_id === \'\'}">Create</div> &nbsp; <div class="siimple-btn siimple-btn--red" onclick="{() => cancelCreate()}">Cancel</div> </div> </div> </div> </div> </div> </div> <div class="siimple-tip siimple-tip--primary sc-tip"> Please select the role access right below. The updated access right will be reflect on the user next login. </div> <div class="simple-grid"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-content-title"> {act === \'create\'? \'Create\': \'Edit\'} Right - {edit_role.Rolename} </div> <div class="siimple--display-block siimple--bg-white sc-content-panel"> <div class="siimple-form"> <div class="siimple-form-field"> <div class="siimple-table"> <div class="siimple-table-header"> <div class="siimple-table-row"> <div class="siimple-table-cell">Modules</div> <div class="siimple-table-cell">Acess Level</div> </div> </div> <div class="siimple-table-body"> <div class="siimple-table-row"> <div class="siimple-table-cell">Admin</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="adminRoleSel" onchange="{() => onChangeRight(\'admin\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Page</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="pageRoleSel" onchange="{() => onChangeRight(\'page\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Post</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="postRoleSel" onchange="{() => onChangeRight(\'post\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Right</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="rightRoleSel" onchange="{() => onChangeRight(\'right\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">Role</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="roleRoleSel" onchange="{() => onChangeRight(\'role\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> <div class="siimple-table-row"> <div class="siimple-table-cell">User</div> <div class="siimple-table-cell"> <select class="siimple-select" ref="userRoleSel" onchange="{() => onChangeRight(\'user\')}"> <option value="0">No Right</option> <option value="4">Read</option> <option value="6">Read & Write</option> <option value="7">Read & Write & Delete</option> </select> </div> </div> </div> </div> </div> </div> </div> </div> </div> <div> <sc-notify></sc-notify>', 'sc-edit-role .sc-block,[data-is="sc-edit-role"] .sc-block{ margin:10px; height:5px; } sc-edit-role .space,[data-is="sc-edit-role"] .space{ width: 5%; display: inline-block; } sc-edit-role .close-btn,[data-is="sc-edit-role"] .close-btn{ margin: 5px 4px; } sc-edit-role .input-label,[data-is="sc-edit-role"] .input-label{ width: 15%; } sc-edit-role .label-btn,[data-is="sc-edit-role"] .label-btn{ height: 25px; width: 5%; text-align: center; line-height: 2.5; } sc-edit-role .sc-content-title,[data-is="sc-edit-role"] .sc-content-title{ padding: 5px; border-radius: 3px 3px 0px 0px; margin: 15px 0px 0px 0px; } sc-edit-role .sc-content-panel,[data-is="sc-edit-role"] .sc-content-panel{ padding: 15px; } sc-edit-role .sc-tip,[data-is="sc-edit-role"] .sc-tip{ margin: 15px 0px 15px 0px; }', '', function(opts) {
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
riot.tag2('sc-manage-role', '<div class="siimple-alert siimple-alert--warning" if="{acl.role === undefined || acl.role === null}"> You are not allow to access this module! </div> <div class="simple-grid" if="{acl.role.acl > 4}"> <div class="simple-grid-row"> <div class="siimple--display-block primary sc-title"> Manage Role </div> <div class="siimple--display-block siimple--bg-light sc-panel"> <div class="siimple-btn siimple-btn--navy {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" if="{acl.role.acl >= 7}" onclick="{() => createRole()}">Create</div> <div class="siimple-btn siimple-btn--success siimple--float-right {action === \'edit\'? \'siimple-btn--disabled\': \'\'}" if="{acl.role.acl >= 4}" onclick="{() => refreshRole()}">Refresh</div> </div> </div> <div if="{isLoading}"> <div class="siimple-spinner siimple-spinner--teal"></div> </div> <sc-list-role if="{list}" acl="{acl}"></sc-list-role> <sc-edit-role if="{edit}" role_id="{role_id}" act="{action}" acl="{acl}"></sc-edit-role> <div>', 'sc-manage-role .sc-title,[data-is="sc-manage-role"] .sc-title{ padding: 5px; border-radius: 3px 3px 0px 0px; margin: -15px -15.5px 15px -15.5px } sc-manage-role .sc-panel,[data-is="sc-manage-role"] .sc-panel{ padding: 10px; margin: -15px -15px 20px -15px; }', '', function(opts) {
var scAdminObserver = function () {
  riot.observable(this);
}

    this.list = true;
    this.edit = false;
    this.action = 'create';
    this.role_id = '';
    this.isLoading = false;
    this.acl = opts.acl;
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){
      this.getRoleList();
    });

    this.on('mount', function(){
      this.isLoading = true;
      mainControl.getter('getAccessListGetter', {});

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
riot.tag2('sc-modal', '<div class="modal {size}" if="{show}"> <div class="modal-header"> <div class="siimple--clearfix"> <div class="siimple--float-left">{title}</div> <div class="siimple--float-right modal-btn" onclick="{() => exitModal()}"> <box-icon name="x"></box-icon> </div> </div> </div> <div class="modal-body"> <yield from="body"></yield> </div> <div class="modal-footer"> <yield from="footer"></yield> <div class="siimple-btn siimple-btn--primary" if="{footeraction}" onclick="{parent.modalConfirm}" ref="btnConfirm">Save</div> <div class="siimple-btn siimple-btn--red" if="{footeraction}" onclick="{parent.modalCancel}" ref="btnCancel">Cancel</div> </div> </div>', 'sc-modal .modal,[data-is="sc-modal"] .modal{ background-color: #f3f3f3; color: #111; border: 1px solid #ddd; position: absolute; top: 15%; left: 50%; transform: translate(-50%, -50%); z-index: 10002; padding: 15px; border-radius: 4px; } sc-modal .small,[data-is="sc-modal"] .small{ width: 70%; } sc-modal .medium,[data-is="sc-modal"] .medium{ width: 50%; } sc-modal .large,[data-is="sc-modal"] .large{ width: 30%; } sc-modal .modal-btn,[data-is="sc-modal"] .modal-btn{ cursor: pointer; }', '', function(opts) {
    show = opts.show !==  undefined? true : false;
    title = opts.title !== undefined? opts.title: "";
    size = opts.size !== undefined? opts.size: "medium";
    body = opts.body !== undefined? opts.body: "";
    footer = opts.footer !== undefined? opts.footer: "";
    mObj = opts.mObj !== undefined? opts.mObj: {};
    footeraction = opts.footeraction === "1" ? true : false;
    var self = this;

    this.on('mount', function(){
      if(show){
        document.getElementById("modal-bd").style.display = "block";
      }
    })

    this.showModal = function(oParam = null){
      if(oParam !== null){
        mObj = oParam;
      }

      if(this.show){
        this.show = false;
        document.getElementById("modal-bd").style.display = "none";
        this.update();
      }else{
        this.show = true;
        document.getElementById("modal-bd").style.display = "block";
        this.update();
      }
    }.bind(this)

    this.exitModal = function(){
      this.show = false;

      document.getElementById("modal-bd").style.display = "none";
      this.update();
    }.bind(this)
});
riot.tag2('sc-multi-select', '<div class="multi-select"> <ul class="selected"> <li each="{selected}"> <div class="selected-container">{name}<a onclick="{parent.remove}">x</a> </div> </li> <li class="selector" onclick="{show}">&nbsp;</li> </ul> <ul class="selections" show="{showing}"> <li each="{selections}"> <div onclick="{parent.select}">{name}</div> </li> </ul> </div>', 'sc-multi-select .selected,[data-is="sc-multi-select"] .selected{ min-height: 30px; min-width: 200px; border: 1px solid black; } sc-multi-select .multi-select ul,[data-is="sc-multi-select"] .multi-select ul{ list-style-type: none; padding: 0; margin-left: 0; border: 1px solid #ccc; font-weight: bold; border-radius: 0px 0px 4px 4px; } sc-multi-select .selected,[data-is="sc-multi-select"] .selected{ padding: 2px; margin: 0 0 -1px; width: 100%; display: table; table-layout: fixed; } sc-multi-select .selected li div,[data-is="sc-multi-select"] .selected li div{ border: 1px solid #bbb; padding: 5px; margin: 4px; cursor: pointer; } sc-multi-select .selected li div,[data-is="sc-multi-select"] .selected li div,sc-multi-select .selected li a,[data-is="sc-multi-select"] .selected li a{ float: left; margin-right: 5px; } sc-multi-select .selected li a,[data-is="sc-multi-select"] .selected li a{ text-decoration: none; color: darkblue; border: 1px solid darkblue; background-color: lightslategrey; padding: 0 5px; border-radius: 4px; } sc-multi-select .selector,[data-is="sc-multi-select"] .selector{ width: 100%; border: none; height: 30px; } sc-multi-select .selections,[data-is="sc-multi-select"] .selections{ border: 1px solid #ccc; margin-top: 0px; position: absolute; width: 400px; z-index: 10; background: #f4f4f4; border-radius: 0px 0px 4px 4px; line-height: 1.5; } sc-multi-select .selections li,[data-is="sc-multi-select"] .selections li{ padding: 5px; } sc-multi-select .selections li:hover,[data-is="sc-multi-select"] .selections li:hover{ background-color: #ccccff; cursor: pointer; } sc-multi-select .selected-container,[data-is="sc-multi-select"] .selected-container{ border-radius: 4px; } sc-multi-select label,[data-is="sc-multi-select"] label{ margin-top: 8px; } sc-multi-select .show,[data-is="sc-multi-select"] .show{ display: block; } sc-multi-select .hide,[data-is="sc-multi-select"] .hide{ display: none; }', '', function(opts) {

    this.selections = opts.selections !== undefined? opts.selections.sort(function(a,b) {return a.name > b.name}) : [];
    this.selected = [];
    this.showing = false;
    this.selectedFunc = opts.selectedFunc !== undefined? opts.selectedFunc: '';
    this.setSelectedFunc = opts.setSelectedFunc !== undefined? opts.setSelectedFunc: '';
    this.getSelectedFunc = opts.getSelectedFunc !== undefined? opts.getSelectedFunc: '';
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.remove = function(e){
      this._swap(e.item, this.selected, this.selections);
      console.log(this.selected);
    }.bind(this)

    this.select = function(e){
      this._swap(e.item, this.selections, this.selected);
      console.log(this.selected);
    }.bind(this)

    this.show = function(e){
      this.showing = !this.showing;
    }.bind(this)

    this._swap = function(item, src, dest){
      dest.push(item);
      src.splice(src.indexOf(item), 1);
      this.showing = false;
    }.bind(this)

    this.getSelected = function(type = 'string'){
      var selectedCat = '';
      if(type === 'string'){
        for(var n in this.selected){
          if(selectedStr.length > 0){
            selectedCat += ', ' + this.selected[n];
          }else{
            selectedCat = this.selected[n];
          }
        }
      }else{
        selectedCat = this.selected;
      }
      return selectedCat;
    }.bind(this)

    this.setSelected = function(items){
      if(this.selections.length > 0){
        this.selectionCompare(items, this.selections);
      }
      this.update();
    }.bind(this)

    this.selectionCompare = function(arr1, arr2){
      const matchArr = [];
      arr1.forEach((e1) => arr2.forEach((e2) => {
        if(e1.CatID === e2.id){
          this._swap(e2, this.selections, this.selected);
        }
      }));
    }.bind(this)

});
riot.tag2('sc-navbar', '<div class="siimple-navbar siimple-navbar--extra-large siimple-navbar--dark"> <div class="siimple-navbar-title">Admin panel</div> <div class="siimple--float-right"> <div class="siimple-navbar-item">Profile</div> <div class="siimple-navbar-item" onclick="{() => logout()}">Logout</div> </div> </div>', '', '', function(opts) {
    var mainControl = this.riotx.get('main-control');

    this.logout = function(){
      mainControl.action('logoutAction', {})  ;
    }.bind(this)
});
riot.tag2('sc-notify', '<div class="{notify_pos} {theme} {leadstyle}" show="{visible}"> {message} </div>', 'sc-notify .light,[data-is="sc-notify"] .light{ background-color: #f4f4f4; color: #1D2F3A; } sc-notify .warning,[data-is="sc-notify"] .warning{ background-color: #F32260; color: #FCF7FA; } sc-notify .success,[data-is="sc-notify"] .success{ background-color: #1ECE80; color: #FCF7FA; } sc-notify .primary,[data-is="sc-notify"] .primary{ background-color: #456990; color: #FCF7FA; } sc-notify .dark,[data-is="sc-notify"] .dark{ background-color: #323C46; color: #FCF7FA; } sc-notify .note,[data-is="sc-notify"] .note{ background-color: #FFD011; color: #1D2F3A; } sc-notify .default,[data-is="sc-notify"] .default{ background-color: #989898; color: #FCF7FA; } sc-notify .primary-border-left,[data-is="sc-notify"] .primary-border-left{ border-left: 5px solid #456990 !important; } sc-notify .dark-border-left,[data-is="sc-notify"] .dark-border-left{ border-left: 5px solid #323c46 !important; } sc-notify .light-border-left,[data-is="sc-notify"] .light-border-left{ border-left: 5px solid #f4f4f4 !important; } sc-notify .warning-border-left,[data-is="sc-notify"] .warning-border-left{ border-left: 5px solid #f32260 !important; } sc-notify .note-border-left,[data-is="sc-notify"] .note-border-left{ border-left: 5px solid #FFD011 !important; } sc-notify .default-border-left,[data-is="sc-notify"] .default-border-left{ border-left: 5px solid #989898 !important; } sc-notify .success-border-left,[data-is="sc-notify"] .success-border-left{ border-left: 5px solid #1ECE80 !important; } @media (min-width: 320px) and (max-width: 480px) { sc-notify .notify-bottom-right,[data-is="sc-notify"] .notify-bottom-right{ right: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 60%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-bottom-left,[data-is="sc-notify"] .notify-bottom-left{ left: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 60%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-top-right,[data-is="sc-notify"] .notify-top-right{ right: 0; top: calc(100vh - 95%); border: 1px solid #ddd; border-radius: 0.2em; width: 60%; display: inline-block; padding: 15px; margin: 15px; position: absolute } sc-notify .notify-top-left,[data-is="sc-notify"] .notify-top-left{ left: 0; top: calc(100vh - 95%); border: 1px solid #ddd; border-radius: 0.2em; width: 60%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-center,[data-is="sc-notify"] .notify-center{ left: 40%; top: calc(100vh - 50%); border: 1px solid #ddd; border-radius: 0.2em; width: 60%; display: inline-block; padding: 20px; margin: 15px; position: absolute } } @media (min-width: 481px) and (max-width: 767px) { sc-notify .notify-bottom-right,[data-is="sc-notify"] .notify-bottom-right{ right: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 50%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-bottom-left,[data-is="sc-notify"] .notify-bottom-left{ left: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 50%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-top-right,[data-is="sc-notify"] .notify-top-right{ right: 0; top: 0; border: 1px solid #ddd; border-radius: 0.2em; width: 50%; display: inline-block; padding: 15px; margin: 15px; position: absolute } sc-notify .notify-top-left,[data-is="sc-notify"] .notify-top-left{ left: 0; top: 0; border: 1px solid #ddd; border-radius: 0.2em; width: 50%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-center,[data-is="sc-notify"] .notify-center{ left: 40%; top: calc(100vh - 50%); border: 1px solid #ddd; border-radius: 0.2em; width: 50%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-progress,[data-is="sc-notify"] .notify-progress{ width: 1%; height: 4px; bottom: 0; position: absolute; left: 0; } } @media (min-width: 768px) and (max-width: 1024px) { sc-notify .notify-bottom-right,[data-is="sc-notify"] .notify-bottom-right{ right: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 30%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-bottom-left,[data-is="sc-notify"] .notify-bottom-left{ left: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 30%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-top-right,[data-is="sc-notify"] .notify-top-right{ right: 0; top: calc(100vh - 95%); border: 1px solid #ddd; border-radius: 0.2em; width: 30%; display: inline-block; padding: 15px; margin: 15px; position: absolute } sc-notify .notify-top-left,[data-is="sc-notify"] .notify-top-left{ left: 0; top: calc(100vh - 95%); border: 1px solid #ddd; border-radius: 0.2em; width: 30%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-center,[data-is="sc-notify"] .notify-center{ left: 40%; top: calc(100vh - 50%); border: 1px solid #ddd; border-radius: 0.2em; width: 30%; display: inline-block; padding: 20px; margin: 15px; position: absolute } sc-notify .notify-progress,[data-is="sc-notify"] .notify-progress{ width: 1%; height: 4px; bottom: 0; position: absolute; left: 0; } } @media (min-width: 1025px) and (max-width: 1920px) { sc-notify .notify-bottom-right,[data-is="sc-notify"] .notify-bottom-right{ right: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 15px; position: absolute; } sc-notify .notify-bottom-left,[data-is="sc-notify"] .notify-bottom-left{ left: 0; max-height: 25px; height: calc(100% - 25px); border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 10px; position: absolute; } sc-notify .notify-top-right,[data-is="sc-notify"] .notify-top-right{ right: 0; top: calc(100vh - 95%); border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 15px; margin: 15px; position: absolute; } sc-notify .notify-top-left,[data-is="sc-notify"] .notify-top-left{ left: 0; top: calc(100vh - 95%); border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 15px; position: absolute; } sc-notify .notify-center,[data-is="sc-notify"] .notify-center{ left: 40%; top: calc(100vh - 50%); border: 1px solid #ddd; border-radius: 0.2em; width: 20%; display: inline-block; padding: 20px; margin: 15px; position: absolute; } sc-notify .notify-progress,[data-is="sc-notify"] .notify-progress{ width: 1%; height: 4px; bottom: 0; position: absolute; left: 0; } }', '', function(opts) {
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
riot.tag2('sc-route', '<div class="siimple-grid-col siimple-grid-col--2"> <div class="siimple-menu sc-menu"> <div class="siimple-menu-group">Administration</div> <div each="{admin_routes}"> <a class="siimple-menu-item" href="#{url}">{name}</a> </div> </div> <div class="siimple-menu sc-menu"> <div class="siimple-menu-group">Post</div> <div each="{post_routes}"> <a class="siimple-menu-item" href="#{url}">{name}</a> </div> </div> </div> <div class="siimple-grid-col siimple-grid-col--10"> <div if="{isLoading}"> <div class="siimple-spinner siimple-spinner--teal"></div> </div> <div class="siimple-content siimple-content--fluid sc-main-panel" if="{isLoading === false}"> <sc-manage-admin if="{admin_route.m_admin}" acl="{acl}"></sc-manage-admin> <sc-manage-role if="{admin_route.m_role}" acl="{acl}"></sc-manage-role> <sc-manage-post if="{post_route.m_post}" acl="{acl}"></sc-manage-post> <sc-manage-category if="{post_route.m_category}" acl="{acl}"></sc-manage-category> </div> </div> <div id="modal-bd" class="modal-backdrop"></div>', 'sc-route .sc-menu,[data-is="sc-route"] .sc-menu{ border: 1px solid #ddd; padding:10px; border-radius: 4px; } sc-route .sc-main-panel,[data-is="sc-route"] .sc-main-panel{ padding: 15px; border: 1px solid #ddd; border-radius: 4px; }', '', function(opts) {
    this.mixin(minoCookie);
    this.theme = '';
    this.admin_routes = [
      {name: 'Manage Admins', url:'manage-admins', module: 'admin'},
      {name: 'Manage Roles', url: 'manage-roles', module: 'role'},
    ];
    this.post_routes = [
      {name: 'Manage Posts', url: 'manage-posts', module: 'post'},
      {name: 'Manage Categories', url: 'manage-category', module: 'post'},
      {name: 'Manage Tags', url: 'manage-tags', module: 'post'},
    ];
    this.admin_route = {
      m_admin: false,
      m_right: false,
      m_role: false
    };
    this.post_route = {
      m_post: false,
      m_category: false,
      m_tag: false
    };

    this.isLoading = true;
    this.acl = '';
    var self = this;
    var mainControl = this.riotx.get('main-control');

    this.on('before-mount', function(){
      mainControl.action('getAccessListAction', {});
    });

    this.on('mount', function(){
      this.theme = this.getCookie('theme');
      this.update();
    });

    this.on('update', function(){
      var r = mainControl.getter('getAccessListGetter');
      if(r !== null && r !== ''){
        if(r.success.status){
          self.acl = r.result;
          this.isLoading = false;
        }else{
          mainControl.action('getAccessListAction', {});
        }
      }
    });

    mainControl.change('AccessListRetrieved', function(state, c){
      var r = c.getter('getAccessListGetter');
      if(r.success.status){
        self.acl = r.result;
        this.isLoading = false;
      }else{

      }
      console.log(self.acl);
      self.update();

    });

    this.rotueChange = function(r){
      for(var r_name in this.admin_route){
        if(r === r_name){
          this.admin_route[r_name] = true;
        }else{
          this.admin_route[r_name] = false;
        }
      }
      for(var r_name in this.post_route){
        if(r === r_name){
          this.post_route[r_name] = true;
        }else{
          this.post_route[r_name] = false;
        }
      }
    }.bind(this)

    var sc_route = route.create();
    sc_route('manage-admins', function(){
      self.rotueChange('m_admin');
      self.update({
        acl: self.acl
      });
    });

    sc_route('manage-roles', function(){
      self.rotueChange('m_role');
      self.update({
        acl: self.acl
      });
    });

    sc_route('manage-posts', function(){
      self.rotueChange('m_post');
      self.update({
        acl: self.acl
      });
    });

    sc_route('manage-category', function(){
      self.rotueChange('m_category');
      self.update({
        acl: self.acl
      });
    });

    sc_route('manage-tag', function(){
      self.rotueChange('m_tag');
      self.update({
        acl: self.acl
      });
    });

    route.start(true);

});