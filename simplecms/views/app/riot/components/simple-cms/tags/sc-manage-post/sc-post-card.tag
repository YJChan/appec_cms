<sc-post-card>
  <div class="siimple-card sc-card">
    <div class="siimple-card-body">
      <div style='float:left; width:90%; font-weight:700;'>{post.title}</div>
      <div style='float: right; cursor:pointer;' onclick="{() => setFeaturePost(post.PostID)}">
        <box-icon name='star' type='solid' if={isFeature === 1}></box-icon>
        <box-icon name='star' if={isFeature !== 1}></box-icon>
      </div>
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
            <div class="siimple-btn siimple-btn--grey siimple--width-25" style='padding:0px 10px 0px 10px;'
              onclick="{() => viewPost(post.PostID)}">View
            </div>            
            <div class="siimple-btn siimple-btn--yellow siimple--width-25" style='padding:0px 10px 0px 10px;'
              onclick="{() => editPost(post.PostID)}">
              Edit
            </div>
            <div class="siimple-btn siimple-btn--error siimple--width-25" style='padding:0px 10px 0px 10px;'
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
    var baseUrl = '';
    this.isFeature = opts.post.isFeature !== undefined? opts.post.isFeature: 0;
    this.on('mount', function(){

    });

    displayContent(content){
      var postContent = JSON.parse(content);    
      content = '';
      for(var r = 0; r < 4; r++){
        if(postContent.ops[r] !== undefined){
          if(typeof(postContent.ops[r].insert) !== 'object') {
            content += postContent.ops[r].insert + '\n';  
          }      
        }
      }

      return content.substring(0, 300) + '...';
    }

    displayDate(dte){
      var createdDte = new Date(dte);
      return createdDte.toDateString();
    }

    displayAuthor(){
      return self.post.createdBy !== null? self.post.createdBy : '';
    }

    viewPost(postId){      
      self.baseUrl = mainControl.getter('baseURLGetter');
      console.log(self.baseUrl);
      window.open(self.baseUrl + 'post/' + postId, '_blank');
    }

    editPost(postId, backToList = false){
      self.parent.editPost(postId, backToList);      
    }

    deletePost(postId){
      mainControl.action('deleteSinglePostAction', {postId: postId});
    }

    setFeaturePost(postId){
      if(this.isFeature === 0){
        mainControl.action('setFeaturePostAction', {postId: postId});
      }else{
        mainControl.action('rmvFeaturePostAction', {postId: postId});
      }
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

    mainControl.change('FeaturePostSet', function(state, c){
      var result = c.getter('setFeaturePostGetter');
      if(result.success.status)  {
        self.isFeature = 1;
        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Selected post has been set featured.',
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

    mainControl.change('FeaturePostRemoved', function(state, c){
      var result = c.getter('rmvFeaturePostGetter');
      if(result.success.status)  {
        self.isFeature = 0;
        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Selected post has been set featured.',
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