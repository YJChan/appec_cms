<sc-manage-admin>
  <div class="siimple-alert siimple-alert--warning" if={acl.admin === undefined || acl.admin === null}>
    You are not allow to access this module!
  </div>
  <div class="simple-grid" if={acl.admin.acl > 4}>
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title siimple--clearfix">        
        <div class="sc-menu-title">
          Manage Admin
        </div>
      </div>
      <div class="siimple--display-block siimple--bg-light sc-panel">
        <div class="siimple-alert siimple-alert--primary" if={acl.admin.acl < 6}>
          You are only allow to view the admin details.
        </div>
        <div class="siimple-btn siimple-btn--navy {action === 'edit'? 'siimple-btn--disabled': ''}" 
         if={acl.admin.acl >= 6} onclick="{() => createAdmin()}">Create</div>        
        <div class="siimple-btn siimple-btn--red siimple--float-right {action === 'edit'? 'siimple-btn--disabled': ''}" 
         if={acl.admin.acl >= 7} onclick="{() => deleteAdmin()}">Delete</div>
      </div>
    </div>
    <div if={isLoading}>
      <div class="siimple-spinner siimple-spinner--teal"></div>    
    </div>
    <sc-list-admin if={list} acl={acl}></sc-list-admin>
    <sc-edit-admin if={edit} admin_id={admin_id} act={action} acl={acl}></sc-edit-admin>
  <div>
  <style>
    .sc-menu-title{
      display: inline-block;
      width:68%;
      text-align: center;
    }
    .sc-action-title{
      display: inline-block;
      width: 15%
    }
    .action-btn{
      padding: 2px;
    }
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

    getAdminList(){   
      mainControl.action('getListOfAdminsAction', {});
    }

    createAdmin(){
      if(! this.edit){
        this.list = false;
        this.edit = true;
        this.action = 'create';      
      }
      this.update();      
    }

    deleteAdmin(){
      if(! this.list){
        this.list = true;
        this.edit = false;    
        this.getAdminList();
        this.update();
      }else{
        riot.scAdminWard.trigger('delAction');
      }      
    }

    editAdmin(admin_id){
      this.admin_id = admin_id;
      this.list = false;
      this.edit = true;
      this.action = 'edit';
      mainControl.action('getAdminDetailAction', {param: admin_id});
      this.update();
    }

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
        //notification
      }
      console.log(self.acl);
      self.update();
    });

  </script>
</sc-manage-admin>