<sc-list-admin>
  <mino-alert type="dismiss" theme="warning alert-block" if={delSomeone}>{}</mino-alert>
  <div class="siimple-table siimple-table--striped">
    <div class="siimple-table-header">
      <div class="siimple-table-row">
        <div class="siimple-table-cell" if={acl.admin.acl === 7}></div>
        <div class="siimple-table-cell">Username</div>
        <div class="siimple-table-cell">Email</div>
        <div class="siimple-table-cell">Role Name</div>
        <div class="siimple-table-cell">Level</div>
        <div class="siimple-table-cell">Master</div>
        <div class="siimple-table-cell">Active</div>        
      </div>
    </div>
    <div class="siimple-table-body">
      <div class="siimple-table-row" if={list_of_admins !== []} each={list_of_admins}>
        <div class="siimple-table-cell" if={acl.admin.acl === 7}>          
            <input type="checkbox" ref="chkAdmin" id="chkAdmin" value="{AdminID}" if={isMaster !== 1}/>
        </div>
        <div class="siimple-table-cell">
          <div class="{isMaster !== 1 && acl.admin.acl === 7? 'sc-edit-class': ''}" 
            onclick="{isMaster !== 1 && acl.admin.acl === 7? () => editAdmin(AdminID): ''}">
            {AdminName}<br/> 
            <small if={isMaster !== 1}>{AdminID}</small>           
          </div>
        </div>
        <div class="siimple-table-cell">
          {AdminEmail}
        </div>
        <div class="siimple-table-cell">
          <div class="siimple-tag siimple-tag--yellow">
            {AdminRole.Rolename}
          </div>
        </div>   
        <div class="siimple-table-cell">
          {level}
        </div>
        <div class="siimple-table-cell">
          <div class="siimple-tag {isMaster === 1? 'siimple-tag--navy': 'siimple-tag--grey'}">
            {this.strManipulate(isMaster, {trueValue: 'master', falseValue: 'normal admin'})}   
          </div>
        </div>
        <div class="siimple-table-cell">
          <div class="siimple-tag {active === 1? 'siimple-tag--green': 'siimple-tag--orange'}">
            {this.strManipulate(active, {trueValue: 'active', falseValue: 'inactive'})}
          </div>
        </div>        
      </div>
    </div>
  </div>
  <style>
    small{
      font-size: 11px;
      color: #aaa;
    }

    .sc-edit-class{
      cursor: pointer;    
      padding: 10px;        
    }

    .sc-edit-class:hover{
      background-color: #ddd;
      border-radius: 2px;      
    }
  </style>
  <script src="../../../mino-ui/mino-alert/mino-alert.js"></script>
  <script>
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

    editAdmin(admin_id){
      this.parent.editAdmin(admin_id);            
    }

    strManipulate(val, expected){
      if(val === 1){
        return expected.trueValue;
      }else{
        return expected.falseValue;
      }
    }
  </script>
</sc-list-admin>