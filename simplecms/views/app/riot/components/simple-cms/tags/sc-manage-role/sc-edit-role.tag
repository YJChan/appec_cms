<sc-edit-role>
  <div class="simple-grid">
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-content-title">
        {act === 'create'? 'Create': 'Edit'} Role
      </div>
      <div class="siimple--display-block siimple--bg-white sc-content-panel">
        <div class="siimple-form">
          <div class="siimple-form-title" if={act==='create'}>Create a new Role</div>
          <div class="siimple-form-title" if={act==='edit'}>Edit Role - {edit_role.Rolename}</div>
          <div class="siimple-form-detail">Please fill up the form to complete the form.</div>
          <div class="siimple-form-field">
            <label class="siimple-label input-label">Role Name </label>
            <input type="text" ref="inpRoleName" class="siimple-input"/>
            <div class="space"></div>            
            <label class="siimple-label">Active</label>
            <div class="siimple-checkbox">              
              <input type="checkbox" ref="activeChk" id="activeChk">
              <label for="activeChk"></label>
            </div>         
            <div class="sc-block"></div>   
            <div class="siimple-form-field">
              <div class="siimple-btn siimple-btn--blue" onclick="{() => saveRole()}" if={role_id !== ''}>Save</div>
              <div class="siimple-btn siimple-btn--blue" onclick="{() => createRole()}" if={role_id === ''}>Create</div>
              &nbsp;
              <div class="siimple-btn siimple-btn--red" onclick="{() => cancelCreate()}">Cancel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="siimple-tip siimple-tip--primary sc-tip">
    Please select the role access right below. The updated access right will be reflect on the user next login.
  </div>
  <div class="simple-grid">
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-content-title">
        {act === 'create'? 'Create': 'Edit'} Right - {edit_role.Rolename}
      </div>
      <div class="siimple--display-block siimple--bg-white sc-content-panel">
        <div class="siimple-form">
            <div class="siimple-form-field">              
              <div class="siimple-table">
                <div class="siimple-table-header">
                  <div class="siimple-table-row">
                    <div class="siimple-table-cell">Modules</div>
                    <div class="siimple-table-cell">Acess Level</div>                    
                  </div>
                </div>
                <div class="siimple-table-body">
                  <div class="siimple-table-row">
                    <div class="siimple-table-cell">Admin</div>
                    <div class="siimple-table-cell">
                      <select class="siimple-select" ref="adminRoleSel" onchange="{() => onChangeRight('admin')}">
                        <option value="0">No Right</option>
                        <option value="4">Read</option>
                        <option value="6">Read & Write</option>
                        <option value="7">Read & Write & Delete</option>
                      </select>
                    </div>                    
                  </div>                  
                  <div class="siimple-table-row">
                    <div class="siimple-table-cell">Page</div>
                    <div class="siimple-table-cell">
                      <select class="siimple-select" ref="pageRoleSel" onchange="{() => onChangeRight('page')}">
                        <option value="0">No Right</option>
                        <option value="4">Read</option>
                        <option value="6">Read & Write</option>
                        <option value="7">Read & Write & Delete</option>
                      </select>
                    </div>                    
                  </div>
                  <div class="siimple-table-row">
                    <div class="siimple-table-cell">Post</div>
                    <div class="siimple-table-cell">
                      <select class="siimple-select" ref="postRoleSel" onchange="{() => onChangeRight('post')}">
                        <option value="0">No Right</option>
                        <option value="4">Read</option>
                        <option value="6">Read & Write</option>
                        <option value="7">Read & Write & Delete</option>
                      </select>
                    </div>                    
                  </div>
                  <div class="siimple-table-row">
                    <div class="siimple-table-cell">Right</div>
                    <div class="siimple-table-cell">
                      <select class="siimple-select" ref="rightRoleSel" onchange="{() => onChangeRight('right')}">
                        <option value="0">No Right</option>
                        <option value="4">Read</option>
                        <option value="6">Read & Write</option>
                        <option value="7">Read & Write & Delete</option>
                      </select>
                    </div>                    
                  </div>
                  <div class="siimple-table-row">
                    <div class="siimple-table-cell">Role</div>
                    <div class="siimple-table-cell">
                      <select class="siimple-select" ref="roleRoleSel" onchange="{() => onChangeRight('role')}">
                        <option value="0">No Right</option>
                        <option value="4">Read</option>
                        <option value="6">Read & Write</option>
                        <option value="7">Read & Write & Delete</option>
                      </select>
                    </div>                    
                  </div>
                  <div class="siimple-table-row">
                    <div class="siimple-table-cell">User</div>
                    <div class="siimple-table-cell">
                      <select class="siimple-select" ref="userRoleSel" onchange="{() => onChangeRight('user')}">
                        <option value="0">No Right</option>
                        <option value="4">Read</option>
                        <option value="6">Read & Write</option>
                        <option value="7">Read & Write & Delete</option>
                      </select>
                    </div>                    
                  </div>
                </div>
              </div>
            </div>
          </div>                    
        </div>
      </div>
    </div>    
  <div>
  <sc-notify></sc-notify>
<style>
  .sc-block{
    margin:10px;
    height:5px;    
  }
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
    .sc-tip{
      margin: 15px 0px 15px 0px;
    }
</style>
<script type="text/javascript" src="../../observers/sc-admin-observer.js"></script>
<script>
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

  //riot.scNotify = new scNotifyObserver();
  var mainControl = this.riotx.get('main-control');
  var self = this;
  
  this.on('mount', function(){
    
  });
  
  this.on('update', function(){
    if(self.role_id !== '' && self.edit_role !== ''){
      self.roleDetail();
    }
  });
  
  cancelCreate(){
    self.parent.action = 'create';
    self.parent.refreshRole();
  }

  mainControl.change('GetRoleToEdit', function(state, c){
    self.edit_role = c.getter('getEditRoleGetter');
    self.role_id = self.edit_role.RoleID;      
    self.update();
  });

  roleDetail(){
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
  }

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

  notify(notifyObj){
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
  }

  //create role first
  createRole(){
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
  }

  //update role
  saveRole(){
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
  }

  onChangeRight(module){
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
  }

  isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
      return false;
    }
    return true;
  }
</script>
</sc-edit-role>