<sc-edit-admin>
  <div class="simple-grid" if={! isLoading}>
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-content-title">
        {act === 'create'? 'Create': 'Edit'} Admin
      </div>
      <div class="siimple--display-block siimple--bg-white sc-content-panel">
        <div class="siimple-form">
          <div class="siimple-form-title" if={act==='create'}>Create a new admin</div>
          <div class="siimple-form-title" if={act==='edit'}>Edit Admin - {edit_admin.AdminName}</div>
          <div class="siimple-form-detail">Please fill up the form to complete the form.</div>
          <div class="siimple-form-field">
            <label class="siimple-label input-label">Admin Name </label>
            <input type="text" ref="inpAdminName" class="siimple-input" placeholder="Johnny English"/>
            <div class="space"></div>            
            <label class="siimple-label input-label">Admin Email</label>
            <input type="email" ref="inpAdminEmail" class="siimple-input" placeholder="johnny@email.com"/>
          </div>
          <div class="siimple-form-field">
            <label class="siimple-label input-label">Password</label>
            <input type="password" ref="inpPassword" class="siimple-input" placeholder="******"/>
            <div class="space"></div>
            <label class="siimple-label input-label">Confirm Password</label>
            <input type="password" ref="inpConfPassword" class="siimple-input" placeholder="******"/>
          </div>
          <div class="siimple-form-field">
            <label class="siimple-label input-label">Role</label>
            <select class="siimple-select" ref="roleSel" if={change_role}>
              <option each={roles} if={active === 1} value="{RoleID}">{Rolename}</option>
            </select>
            &nbsp;
            <div class="siimple-close close-btn" if={edit_admin !== '' && change_role} onclick="{() => changeRole(false)}"></div>
            <span class="siimple-tag label-btn {edit_admin.RoleID !== null? 'siimple-tag--yellow': 'siimple-tag--red'}" if={!change_role} onclick="{() => changeRole(true)}">
              {edit_admin.RoleID !== null? edit_admin.Rolename: 'No Role'}
            </span>
            <input ref="roleSel" type="hidden" value="{edit_admin.RoleID}" if={!change_role}/>
            <div class="space"></div>
            <label class="siimple-label">Level</label>
            <select class="siimple-select" ref="levelSel">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
            <div class="space"></div>
            <label class="siimple-label">Active</label>
            <div class="siimple-checkbox">              
              <input type="checkbox" ref="activeChk" id="activeChk">
              <label for="activeChk"></label>
            </div>
            <!--  <label class="siimple-label">Master</label>
            <div class="siimple-checkbox">              
              <input type="checkbox" ref="masterChk" id="masterChk">
              <label for="masterChk"></label>
            </div>                          -->
          </div>
          <div class="siimple-form-field">
            <div class="siimple-form-field-label">Security Phase</div>
            <input type="text" ref="inpSecurePhase" class="siimple-input siimple-input--fluid"/>
          </div>
          <div class="siimple-form-field">
            <div class="siimple-btn siimple-btn--blue" onclick="{() => saveAdmin()}" 
              if={admin_id !== ''}>Save</div>
            <div class="siimple-btn siimple-btn--blue" onclick="{() => createAdmin()}"
               if={admin_id === ''}>Create</div>
            &nbsp;
            <div class="siimple-btn siimple-btn--red" onclick="{() => cancelCreate()}">Cancel</div>            
          </div>
        </div>
      </div>
    </div>    
  <div>
  <style>
    .space{
      width: 5%;
      display: inline-block;
    }
    .close-btn{
      margin: 5px 4px;
    }
    .input-label{
      width: 15%;
    }
    .label-btn{
      height: 25px;
      width: 5%;
      text-align: center;
      line-height: 2.5;
    }
    .sc-content-title{
      padding: 5px;
      border-radius: 3px 3px 0px 0px;
      margin: 15px 0px 0px 0px;
    }
    .sc-content-panel{
      padding: 15px;      
    }
  </style>
  <script type="text/javascript" src="../../observers/sc-admin-observer.js"></script>
  <script>
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

    getRolesList(){
      mainControl.action('getRolesAction', {});
    }

    passwordValidate(pwd, conf_pwd){      
      if(pwd === conf_pwd){
        return true;
      }else{
        return false;
      }
    }

    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    createAdmin(){
      var admin_name = this.refs.inpAdminName.value;
      var admin_email = this.refs.inpAdminEmail.value;
      var password  = this.refs.inpPassword.value;
      var confirm_password = this.refs.inpConfPassword.value;
      var role = this.refs.roleSel.value;
      var level = this.refs.levelSel.value;
      var active = this.refs.activeChk.checked ? 1: 0;
      var security_phase = this.refs.inpSecurePhase.value;
      //var master = this.refs.masterChk.checked ? 1: 0;
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
        //show notification
      }
    }

    saveAdmin(){
      var admin_id = self.admin_id;
      var admin_name = this.refs.inpAdminName.value;
      var admin_email = this.refs.inpAdminEmail.value;
      var password  = this.refs.inpPassword.value;
      var confirm_password = this.refs.inpConfPassword.value;
      var role = this.refs.roleSel.value;
      var level = this.refs.levelSel.value;
      var active = this.refs.activeChk.checked ? 1: 0;
      var security_phase = this.refs.inpSecurePhase.value;
      //var master = this.refs.masterChk.checked ? 1: 0;
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
        //show notification
      }
    }

    cancelCreate(){
      self.parent.action = 'create';
      self.parent.deleteAdmin();
    }
    
    changeRole(c){
      this.change_role = c;
      self.update();
    }

    adminDetail(){
      self.refs.inpAdminName.value = self.edit_admin.AdminName;
      self.refs.inpAdminEmail.value = self.edit_admin.AdminEmail;      
      self.refs.levelSel.value = self.edit_admin.level;
      self.refs.activeChk.checked = self.edit_admin.active === 1? true: false;
      //self.refs.masterChk.checked = self.edit_admin.isMaster === 1? true: false;      
      self.refs.inpSecurePhase.value = self.edit_admin.security_phase;        
    }
    
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
        //notification
      }
      console.log(self.acl);
      self.update();
    });
  </script>
</sc-edit-admin>