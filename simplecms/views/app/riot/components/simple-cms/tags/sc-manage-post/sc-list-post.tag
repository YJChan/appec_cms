<sc-list-post>
  <div class="siimple-content siimple-content--fluid { searching }">
    <div>
      <sc-post-card each={p, index in list_of_post} post={p}></sc-post-card>
    </div>
  </div>
  <style>
    .blur-bg{
      filter: blur(2px);
    }
  </style>
  <script>
    this.list_of_post = [];
    this.delPost = false;
    this.delMsg = '';
    this.searching  = ''
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){
      
    });

    this.on('mount', function(){
      self.getPostList(0);
    });

    getPostList(page){      
      mainControl.action('getPaginatePostAction', {pageNum: page});            
      self.parent.update({
        isLoading: true
      });      
    }

    mainControl.change('RetrievePaginatePosts', function(state, c){
      var result = c.getter('getPaginatePostGetter');      
      console.log(result);
      self.list_of_post = result.result.posts;
      self.parent.update({
        isLoading : false
      }); 
      self.update();
    });

    editPost(id, backToList = false){
      self.parent.editPost(id, backToList);      
    }

    updateList(){
      self.getPostList(0);
    }

    onblur(status){
      if(status){
        self.update({
          searching: 'blur-bg'
        });
      }else{
        self.update({
          searching: ''
        });
      }      
    }

  </script>
</sc-list-post>