<sc-manage-role>
  <div class="simple-grid">
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title">
        Manage Role
      </div>
      <div class="siimple--display-block siimple--bg-light sc-panel">
        <div class="siimple-btn siimple-btn--navy {action === 'edit'? 'siimple-btn--disabled': ''}" 
          onclick="{() => createRole()}">Create</div>        
        <div class="siimple-btn siimple-btn--success siimple--float-right {action === 'edit'? 'siimple-btn--disabled': ''}" 
          onclick="{() => refreshRole()}">Refresh</div>
      </div>
    </div>
    <div if={isLoading}>
      <div class="siimple-spinner siimple-spinner--teal"></div>
    </br/>
    </div>
    <sc-list-role if={list}></sc-list-role>
    <sc-edit-role if={edit} role_id={role_id} act={action}></sc-edit-role>    
  <div>
  <style>  
    .sc-title {
      padding: 5px;
      border-radius: 4px 4px 0px 0px;
    }

    .sc-panel{
      padding: 10px;
      margin-bottom: 15px;
    }  
  </style>
  <script type="text/javascript" src="../../observers/sc-admin-observer.js"></script>
  <script>
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