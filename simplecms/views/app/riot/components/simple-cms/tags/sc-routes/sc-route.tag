<sc-route>    
  <div class="siimple-grid-col siimple-grid-col--2">    
    <div class="siimple-menu sc-menu">
        <div class="siimple-menu-group">Administration</div>
        <div each={routes}>
          <a class="siimple-menu-item" href="#{url}">{name}</a>
        </div>
    </div>
  </div>
  <div class="siimple-grid-col siimple-grid-col--10">
    <div class="siimple-content siimple-content--fluid sc-main-panel">
      <sc-manage-admin if={admin_route.m_admin}></sc-manage-admin>
      <sc-manage-right if={admin_route.m_right}></sc-manage-right>
      <sc-manage-role if={admin_route.m_role}></sc-manage-role>   
    </div>     
  </div>
  <style>
    .sc-menu{
      border: 1px solid #ddd;
      padding:10px;
      border-radius: 4px;
    }
    
    .sc-main-panel{
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  </style>
  <script>
    this.mixin(minoCookie);
    this.theme = '';        
    this.routes = [
      {name: 'Manage Admins', url:'manage-admins'},
      {name: 'Manage Rights',url: 'manage-rights'},
      {name: 'Manage Roles', url: 'manage-roles'}
    ];
    this.admin_route = {
      m_admin: false,
      m_right: false,
      m_role: false
    };

    var self = this;
    var mainControl = this.riotx.get('main-control');
    
    this.on('mount', function(){      
      this.theme = this.getCookie('theme');
      this.update();
    });

    rotueChange(r){
      for(var r_name in this.admin_route){
        if(r === r_name){
          this.admin_route[r_name] = true;
        }else{
          this.admin_route[r_name] = false;
        }
      }      
    }

    var sc_route = route.create();
    sc_route('manage-admins', function(){
      self.rotueChange('m_admin');
      self.update();
    }); 

    sc_route('manage-rights', function(){
      self.rotueChange('m_right');
      self.update();
    });

    sc_route('manage-roles', function(){
      self.rotueChange('m_role');
      self.update();
    });

    route.start(true);

  </script>
</sc-route>