<sc-route>    
  <div class="siimple-grid-col siimple-grid-col--2">    
    <div class="siimple-menu sc-menu">
        <div class="siimple-menu-group">Administration</div>
        <div each={admin_routes}>
          <a class="siimple-menu-item" href="#{url}">{name}</a>
        </div>
    </div>
    <div class="siimple-menu sc-menu">
        <div class="siimple-menu-group">Post</div>
        <div each={post_routes}>
          <a class="siimple-menu-item" href="#{url}">{name}</a>
        </div>
    </div>
  </div>
  <div class="siimple-grid-col siimple-grid-col--10">
    <div if={isLoading}>
      <div class="siimple-spinner siimple-spinner--teal"></div>    
    </div>
    <div class="siimple-content siimple-content--fluid sc-main-panel" if={isLoading === false}>      
      <sc-manage-admin if={admin_route.m_admin} acl={acl}></sc-manage-admin>
      <sc-manage-role if={admin_route.m_role} acl={acl}></sc-manage-role>
      <sc-manage-post if={post_route.m_post} acl={acl}></sc-manage-post>
      <sc-manage-category if={post_route.m_category} acl={acl}></sc-manage-category>
    </div>     
  </div>
  <div id="modal-bd" class="modal-backdrop"></div>
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
    this.admin_routes = [
      {name: 'Manage Admins', url:'manage-admins', module: 'admin'},      
      {name: 'Manage Roles', url: 'manage-roles', module: 'role'},      
    ];
    this.post_routes = [
      {name: 'Manage Posts', url: 'manage-posts', module: 'post'},
      {name: 'Manage Categories', url: 'manage-category', module: 'post'},
      {name: 'Manage Tags', url: 'manage-tags', module: 'post'},
    ];
    this.admin_route = {
      m_admin: false,
      m_right: false,
      m_role: false
    };
    this.post_route = {
      m_post: false,
      m_category: false,
      m_tag: false
    };

    this.isLoading = true;
    this.acl = '';
    var self = this;
    var mainControl = this.riotx.get('main-control');
                
    this.on('before-mount', function(){
      mainControl.action('getAccessListAction', {});
    });

    this.on('mount', function(){      
      this.theme = this.getCookie('theme');      
      this.update();
    });

    this.on('update', function(){
      var r = mainControl.getter('getAccessListGetter');
      if(r !== null && r !== ''){
        if(r.success.status){
          self.acl = r.result;          
          this.isLoading = false;
        }else{          
          mainControl.action('getAccessListAction', {});
        }
      }
    });

    mainControl.change('AccessListRetrieved', function(state, c){
      var r = c.getter('getAccessListGetter');
      if(r.success.status){
        self.acl = r.result;  
        this.isLoading = false;      
      }else{
        //notification
      }      
      console.log(self.acl);
      self.update();
      //riot.update({
      //  acl:self.acl
      //});
    });

    rotueChange(r){
      for(var r_name in this.admin_route){
        if(r === r_name){
          this.admin_route[r_name] = true;
        }else{
          this.admin_route[r_name] = false;
        }
      }
      for(var r_name in this.post_route){
        if(r === r_name){
          this.post_route[r_name] = true;
        }else{
          this.post_route[r_name] = false;
        }
      }          
    }

    var sc_route = route.create();
    sc_route('manage-admins', function(){
      self.rotueChange('m_admin');
      self.update({
        acl: self.acl
      });
    }); 

    sc_route('manage-roles', function(){
      self.rotueChange('m_role');
      self.update({
        acl: self.acl
      });
    });

    sc_route('manage-posts', function(){
      self.rotueChange('m_post');
      self.update({
        acl: self.acl
      });
    });

    sc_route('manage-category', function(){
      self.rotueChange('m_category');
      self.update({
        acl: self.acl
      });
    });

    sc_route('manage-tag', function(){
      self.rotueChange('m_tag');
      self.update({
        acl: self.acl
      });
    });

    route.start(true);

  </script>
</sc-route>