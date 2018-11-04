<sc-post-card>
  <div class="siimple-card sc-card">
    <div class="siimple-card-header">
      <div class="siimple-card-title">{post.title}</div>      
    </div>
    <div class="siimple-card-body">
      <p>  
        {displayContent(post.content)}
      </p>
    </div>
    <div class="siimple-card-footer">      
      <div class="siimple--clearfix">
        <div class="siimple--float-left">
          <div class="author">author</div>
          <div class="siimple--bg-primary siimple--color-white author">
            { displayAuthor() }
          </div>
        </div>
        <div class="siimple--float-right">
          views: 
          {post.views}
        </div>
      </div>
      <div>
        <small>created {displayDate(post.createdAt)} </small>
      </div>
      <div>
        <div class="siimple--clearfix">          
            <div class="siimple-btn siimple-btn--primary siimple--width-25"
              onclick="{() => viewPost(post.PostID)}">View
            </div>            
            <div class="siimple-btn siimple-btn--navy siimple--width-25"
              onclick="{() => editPost(post.PostID)}">
              Edit
            </div>
            <div class="siimple-btn siimple-btn--error siimple--width-25"
              onclick="{() => deletePost(post.PostID)}">
              Delete
            </div>
        </div>
      </div>
    </div>
  </div>
  <sc-notify></sc-notify>
  <style>
    .sc-card{
      display: inline-block !important;
      height: auto;
      margin: 10px 10px 10px 10px !important;
      border: 1px solid #ddd;
      max-width: 420px;
    }
    .author{
      display: inline-block;
      padding: 0px 5px 0px 5px;
      border-radius: 4px;
    }
  </style>
  <script>
    this.post = opts.post;
    var self = this;
    var mainControl = this.riotx.get('main-control');

    this.on('mount', function(){

    });

    displayContent(content){
      var postContent = JSON.parse(content);
      return postContent.ops[0].insert.substring(0, 10);
    }

    displayDate(dte){
      var createdDte = new Date(dte);
      return createdDte.toDateString();
    }

    displayAuthor(){
      return self.post.createdBy !== null? self.post.createdBy : '';
    }

    viewPost(postId){
      window.open('http://localhost:3000/post/' + postId, '_blank');
    }

    editPost(postId, backToList = false){
      self.parent.editPost(postId, backToList);      
    }

    deletePost(postId){
      mainControl.action('deleteSinglePostAction', {postId: postId});
    }

    notify(notifyObj){      
      if(notifyObj !== null){
        riot.mount('sc-notify', {
          position : notifyObj.position,
          theme : notifyObj.theme,
          leadstyle : notifyObj.leadstyle,
          stay : notifyObj.stay,
          message : notifyObj.message,
          visible : true
        });
        
        self.update();                
      }
    }

    mainControl.change('SinglePostDeleted', function(state, c){
      var result = c.getter('deleteSinglePostGetter');      
      console.log(result);
      if(result.success.status){
        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Post has been deleted!',
          visible: true
        });   
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: result.error.message,
          visible: true
        });   
      }                  
      self.parent.updateList();
    });

  </script>
</sc-post-card>