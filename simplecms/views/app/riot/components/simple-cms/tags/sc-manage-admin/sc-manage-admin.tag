<sc-manage-admin>  
  <div class="simple-grid">
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title">
        Manage Admin
      </div>
      <div class="siimple--display-block siimple--bg-light sc-panel">
        <div class="siimple-btn siimple-btn--navy" onclick="{() => createAdmin()}">Create</div>
        <!--  <div class="siimple-btn siimple-btn--green">Current Online</div>  -->
        <div class="siimple-btn siimple-btn--red siimple--float-right" 
          onclick="{() => deleteAdmin()}">Delete</div>
      </div>
    </div>
    <sc-list-admin if={list}></sc-list-admin>
    <sc-edit-admin if={edit}></sc-edit-admin>
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


  </script>
</sc-manage-admin>