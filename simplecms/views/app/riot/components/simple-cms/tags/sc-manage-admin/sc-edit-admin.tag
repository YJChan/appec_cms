<sc-edit-admin>
  <div class="simple-grid">
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title">
        Create Admin
      </div>
      <div class="siimple--display-block siimple--bg-white sc-panel">
        <div class="siimple-form">
          <div class="siimple-form-title">Create a new admin</div>
          <div class="siimple-form-detail">Please fill up the form to complete the creation</div>
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
            <select class="siimple-select" ref="roleSel">
              <option each={roles} value="{RoleID}">{Rolename}</option>
            </select>
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
            <label class="siimple-label">Master</label>
            <div class="siimple-checkbox">              
              <input type="checkbox" ref="masterChk" id="masterChk">
              <label for="masterChk"></label>
            </div>                        
          </div>
          <div class="siimple-form-field">
            <div class="siimple-form-field-label">Security Phase</div>
            <input type="text" ref="inpSecurePhase" class="siimple-input siimple-input--fluid" placeholder="Superhero is everywhere!"/>
          </div>
          <div class="siimple-form-field">
            <div class="siimple-btn siimple-btn--blue" onclick="{() => createAdmin()}">Create</div>
            <div class="siimple-btn siimple-btn--red siimple--float-right" 
              onclick="{() => cancelCreate()}">Cancel</div>
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
    .input-label{
      width: 15%;
    }
  </style>
  <script type="text/javascript" src="../../observers/sc-admin-observer.js"></script>
  <script>
    this.roles = '';
    this.created_admin = '';
    riot.scAdminWard = new scAdminObserver();
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('mount', function(){
      this.getRolesList();
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
        //show notification
      }
    }

    cancelCreate(){
      self.parent.deleteAdmin();
    }

    mainControl.change('AdminCreated', function(state, c){
      self.created_admin = c.getter('adminCreationGetter');
      console.log(self.created_admin);
      self.parent.deleteAdmin();      
    });

    mainControl.change('RolesRetrieved', function(state, c){
      self.roles = c.getter('getListOfRoles');
      self.update();
    });

  </script>
</sc-edit-admin>