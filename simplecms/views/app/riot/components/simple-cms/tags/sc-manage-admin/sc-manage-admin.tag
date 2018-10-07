<sc-manage-admin>  
  <div class="simple-grid">
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title">
        Manage Admin
      </div>
      <div class="siimple--display-block siimple--bg-light sc-panel">
        <div class="siimple-btn siimple-btn--navy {action === 'edit'? 'siimple-btn--disabled': ''}" 
          onclick="{() => createAdmin()}">Create</div>        
        <div class="siimple-btn siimple-btn--red siimple--float-right {action === 'edit'? 'siimple-btn--disabled': ''}" 
          onclick="{() => deleteAdmin()}" >Delete</div>
      </div>
    </div>
    <div if={isLoading}>
    <div class="siimple-spinner siimple-spinner--teal"></div>
    </br/>
    </div>
    <sc-list-admin if={list}></sc-list-admin>
    <sc-edit-admin if={edit} admin_id={admin_id} act={action}></sc-edit-admin>
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

  </script>
</sc-manage-admin>