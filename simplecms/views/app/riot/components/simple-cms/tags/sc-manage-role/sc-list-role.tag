<sc-list-role>
<mino-alert type="dismiss" theme="warning alert-block" if={delSomeone}>{}</mino-alert>
  <table class="sc-table">
    <tr class="sc-tr-header">
      <td rowspan="2" class="sc-th">Role Name</td>
      <td rowspan="2" class="sc-th">Active</td>
      <td colspan="6" class="sc-th" style="text-align:center">Access Rights </td>
    </tr>
    <tr class="sc-tr-header">
      <td class="sc-th">Admin</td>
      <td class="sc-th">Page</td>
      <td class="sc-th">Post</td>
      <td class="sc-th">Right</td>
      <td class="sc-th">Role</td>
      <td class="sc-th">User</td>
    </tr>
    <tbody>
      <tr style="text-align:center;" each={list_of_role}>
        <td class="sc-td-data">
          <div class="sc-edit-class" onclick="{() => editRole(RoleID)}">
            {Rolename}<br/>
            <small>{RoleID}</small>
          </div>
        </td>
        <td class="sc-td-data">
          <span class="siimple-tag siimple-tag--{ active === 1? 'success': 'warning'}">
          {active === 1? 'active': 'inactive'}
          </span>
        </td>
        <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, 'admin')}</span></td>
        <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, 'page')}</span></td>
        <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, 'post')}</span></td>
        <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, 'right')}</span></td>
        <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, 'role')}</span></td>
        <td class="sc-td-data"><span class="siimple-tag siimple-tag--navy">{getRoleRight(RoleRight, 'user')}</span></td>        
      </tr>
    </tbody>
  </table>
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
  <script src="../../../mino-ui/tags/mino-alert/mino-alert.js"></script>
  <script>
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
      //self.update();
    });

    editRole(role_id){
      self.parent.editRole(role_id);
    }

    getRoleRight(arrRoleRight, module){
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
    }

  </script>
</sc-list-role>