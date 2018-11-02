<sc-manage-post>
  <div class="siimple-alert siimple-alert--warning" if={acl.post === undefined || acl.post === null}>
    You are not allow to access this module!
  </div>
  <div class="simple-grid" if={acl.post.acl > 4}>
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title">
        Manage Post
      </div>
      <div class="siimple--display-block siimple--bg-light sc-panel">
        <div class="siimple-btn siimple-btn--navy {action === 'edit'? 'siimple-btn--disabled': ''}"
          if={acl.post.acl >= 7}
          onclick="{() => createPost()}">Create</div>        
        <div class="siimple-btn siimple-btn--success siimple--float-right {action === 'edit'? 'siimple-btn--disabled': ''}" 
          if={acl.post.acl >= 4}
          onclick="{() => refreshPost()}">Refresh</div>
      </div>
    </div>
    <div if={isLoading}>
      <div class="siimple-spinner siimple-spinner--teal"></div>    
    </div>
    <sc-list-post if={list}></sc-list-post>
    <sc-edit-post if={edit} postid={post_id}></sc-edit-post>
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
  <script>
    this.list = true;
    this.edit = false;
    this.action = 'create';
    this.post_id = '';
    this.isLoading = false;
    this.acl = opts.acl;    
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){
      
    });

    this.on('mount', function(){
      this.isLoading = true;      
    });

    createPost(){
      this.list = false;
      this.edit = true; 
      this.update();
    }

    editPost(id, backAction = false){
      if(backAction){
        this.list = true;
        this.edit = false;
        this.post_id = '';        
        this.update();        
      }else{
        this.list = false;
        this.edit = true;
        this.post_id = id;        
        this.update();
      }
    }

    updateList(){
      
    }    
  </script>
</sc-manage-post>