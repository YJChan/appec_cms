<sc-manage-role>
  <div class="siimple-alert siimple-alert--warning" if={acl.role === undefined || acl.role === null}>
    You are not allow to access this module!
  </div>
  <div class="simple-grid" if={acl.role.acl > 4}>
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title">
        Manage Role
      </div>
      <div class="siimple--display-block siimple--bg-light sc-panel">
        <div class="siimple-btn siimple-btn--navy {action === 'edit'? 'siimple-btn--disabled': ''}"
          if={acl.role.acl >= 7}
          onclick="{() => createRole()}">Create</div>        
        <div class="siimple-btn siimple-btn--success siimple--float-right {action === 'edit'? 'siimple-btn--disabled': ''}" 
          if={acl.role.acl >= 4}
          onclick="{() => refreshRole()}">Refresh</div>
      </div>
    </div>
    <div if={isLoading}>
      <div class="siimple-spinner siimple-spinner--teal"></div>    
    </div>
    <sc-list-role if={list} acl={acl}></sc-list-role>
    <sc-edit-role if={edit} role_id={role_id} act={action} acl={acl}></sc-edit-role>    
  <div>
  <style>  
    .sc-title {
      padding: 5px;
      border-radius: 3px 3px 0px 0px;
      margin: -15px -15.5px 15px -15.5px
    }
    .sc-panel{
      padding: 10px;
      margin: -15px -15px 20px -15px;
    }
  </style>
  <script type="text/javascript" src="../../observers/sc-admin-observer.js"></script>
  <script>
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

    getRoleList(){
      this.isLoading = true;
      mainControl.action('getRolesAction', {});
    }

    createRole(){
      this.list = false;
      this.edit = true;
      this.action = 'create';
      this.update();
    }

    editRole(role_id){
      this.list = false;
      this.edit = true;
      //call get role function
      mainControl.action('getRoleDetailAction', {param: role_id});
      this.action = 'edit';
      this.update();
    }

    refreshRole(){
      this.list = true;
      this.edit = false;
      this.getRoleList();
      this.update();
    }

  </script>
</sc-manage-role>