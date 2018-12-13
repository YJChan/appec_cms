<sc-edit-post>
  <div class="siimple-form">
    <div class="siimple-field">
      <label class="siimple-label">Title</label><br>
      <input type="text" class="siimple-input siimple-input--fluid sc-input" ref="inpPostTitle" onkeypress="{() => wrtingTitle()}"
        onkeyup="{() => wrtingTitle()}" onkeydown="{() => wrtingTitle()}">
      <div class="siimple--display-block siimple--bg-light siimple--color-dark sc-hint">        
        <small>
          <box-icon name='link'></box-icon>
          { baseUrl }post/{ slugText }
        </small>
      </div>
    </div>
    <div class="siimple-field">
      <label class="siimple-label">Category</label><br>
      <sc-multi-select ref="selCategories"></sc-multi-select>
    </div>
    <div class="siimple-field">
      <div id="editor">
      </div>
    </div>
    <div class="siimple-field">
      <label class="siimple-label">Active</label>
      <div class="siimple-checkbox">
        <input type="checkbox" id="chkActive" ref="chkActive">
        <label for="chkActive"></label>
      </div>
      <div class="space"></div>
      <label class="siimple-label">Visibility</label>
      <div class="siimple-checkbox">
        <input type="checkbox" id="chkVisible" ref="chkVisible">
        <label for="chkVisible"></label>
      </div>
      <div class="space"></div>
      <label class="siimple-label">Allow Comment</label>
      <div class="siimple-checkbox">
        <input type="checkbox" id="chkComment" ref="chkComment">
        <label for="chkComment"></label>
      </div>
      <div class="space"></div>
      <label class="siimple-label">Publish Date</label>
      <mino-date theme="primary" ref="inpDate"></mino-date>
    </div>
    <div class="siimple-field">
      <label class="siimple-label">Meta Tag</label><br>
      <input type="text" class="siimple-input siimple-input--fluid sc-input" ref="inpMetaTag">
      <div class="siimple--display-block siimple--bg-light siimple--color-dark sc-hint">        
        <small>
          <box-icon name='info-circle'></box-icon>
          Meta tags contain information about a website. Search engines access certain meta tags so they can,  for instance, display a page title and description in the search results.
        </small>
      </div>
    </div>
    <div class="siimple-field">
      <label class="siimple-label">Author Name</label>
      <input type="text" ref="inpCreator" class="siimple-input sc-input"  maxlength="100" placeholder="Your name"/>
    </div>
    <div class="siimple--clearfix">
      <div class="siimple--float-left">
        <div class="siimple-btn siimple-btn--primary" onclick="{() => saveContent()}">Save</div>
        <div class="siimple-btn siimple-btn--warning" onclick="{() => backToList()}">Back</div>
      </div>
      <div class="siimple--float-right">        
        <div class="siimple-btn siimple-btn--light" onclick="{() => preview()}">
          Preview
        </div>
      </div>
    </div>
  <sc-notify></sc-notify>
  <style>
    .space{
      width: 5%;
      display: inline-block;
    }
    .sc-input{
      background:#f3f3f3; 
      border:1px solid #ccc;
    }
    .sc-hint{
      padding: 0.5em;
      margin-top: 5px;
    }
  </style>
  <script src="../../../mino-ui/mino-date/mino-date.js"></script>
  <script>
    var editor = null;
    var postId = opts.postid !== undefined? opts.postid: '';
    var post = null;
    var postContent = null;    
    var author = null;
    var categoriesSelected = '';
    var baseUrl = '';
    var slugText
    var toolbarOptions = [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image'],                
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction            

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean']                                         // remove formatting button
    ];

    var options = {
      debug: 'info',      
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow',
      placeholder: 'Compose something...',            
    };    
    var mainControl = this.riotx.get('main-control');  
    var cat = [];      
    var self = this;
    this.mixin(minoCookie);

    this.on('before-mount', function(){      
      if(self.opts.postid === ''){
        self.getAuthorInfo();
      }      
      this.getCategories();
    });

    this.on('mount', function () {
      if(self.opts.postid !== ''){
        self.getContent(self.opts.postid);        
      }
      editor = new Quill('#editor', options);
      // quill editor add image handler
      editor.getModule('toolbar').addHandler('image', () => {
        self.selectLocalImage();
      });      
      self.wrtingTitle();      
    });

    getAuthorInfo(){
      var authorId = self.getCookie('aid');
      if(authorId === undefined || authorId === null || authorId === ''){
        authorId = self.getCookie('uid');
      }
      mainControl.action('getAuthorInfoAction', {param: authorId});
    }

    getCategories(){
      mainControl.action('getCategoriesAction', {param: '?active=1'});      
    }

    getContent(id){
      mainControl.action('getPostByIDAction', {param: id});
    }

    wrtingTitle(){
      var titleText = this.refs.inpPostTitle.value !== undefined? this.refs.inpPostTitle.value: '';
      if(titleText !== ''){
        var slug = titleText.replace(/ /g,"-").toLowerCase();
        self.update({
          slugText: slug
        });
      }
    }

    saveContent(){
      var creator = self.getCookie('uid');
      if(creator === undefined || creator === ''){
        creator = self.getCookie('aid');
      }      
      self.categoriesSelected = self.refs.selCategories.getSelected('array');      
      var oPost = {
        postId: self.postId,  
        title: self.refs.inpPostTitle.value,
        content: JSON.stringify(editor.getContents()),
        active: self.refs.chkActive.checked? 1: 0,
        visibility: self.refs.chkVisible.checked? 1: 0,
        allowComment: self.refs.chkComment.checked? 1: 0,
        publishDate: self.refs.inpDate.value,
        AuthorID: creator,
        createdBy: self.refs.inpCreator.value,
        categories: self.categoriesSelected,
        metaTag: self.refs.inpMetaTag.value
      }
      console.log(oPost);
      mainControl.action('savePostAction', oPost);      
    }

    backToList(){
      self.tags['mino-date'].unmount();
      self.parent.editPost('', true);
      self.update();
    }

    initPost(p){
      console.log(p);
      this.refs.inpPostTitle.value = p.title;
      this.refs.chkActive.checked = p.active === 1 ? true: false;
      this.refs.chkVisible.checked = p.visibility === 1 ? true: false;
      this.refs.chkComment.checked = p.allowComment === 1 ? true: false;
      this.refs.inpDate.date = self.formatDate(p.publishDate);     
      this.refs.inpCreator.value = p.createdBy;
      this.refs.inpMetaTag.value = p.metaTag;
      postContent = JSON.parse(p.content);
      if(p.Post_Category !== null){
        console.log(p.Post_Category);
        this.refs.selCategories.setSelected(p.Post_Category);
      }
      editor.setContents(postContent);
    }

    preview(){      
      window.open(self.baseUrl + 'post/' + postId, '_blank');
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

    mainControl.change('SinglePostRetrieved', function(state, c){
      var singlePost = c.getter('getSinglePostByIDGetter');
      var baseUrl = c.getter('baseURLGetter');      
      if (singlePost.success.status){
        self.postId = singlePost.result.PostID;
        self.post = singlePost.result;         
        self.initPost(self.post);
        self.baseUrl = baseUrl;
        self.update();    
      }else{
        console.log(singlePost.error);
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: singlePost.error.message,
          visible: true
        });        
      }
    });

    mainControl.change('SinglePostSaved', function(state, c){
      var singlePost = c.getter('savePostGetter');      
      if(singlePost.success.status){
        self.postId = singlePost.result.PostID;
        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'note',
          stay: 3,
          message: 'Post has been successfully updated!',
          visibile: true
        });
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: singlePost.error.message,
          visibile: true
        });
      }
    });

    mainControl.change('GetAuthourInfo', function(state, c){
      var authorInfo = c.getter('getAuthorInfoGetter');      
      if(authorInfo.success.status){
        self.author = authorInfo.result;
        self.refs.inpCreator.value = self.author.AdminName !== undefined? self.author.AdminName: self.author.Username;
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: singlePost.error.message,
          visibile: true
        });
      }      
    });

    mainControl.change('CategoriesRetrieved', function(state, c) {
      var category = c.getter('getCategoriesGetter');
      var carArr = [];
      if(category.success.status){
        category.result.forEach(function(oCat){
          carArr.push({id: oCat.CatID, name: oCat.catname});
        });
        self.cat = carArr;                    
        self.refs.selCategories.update({
          selections: self.cat          
        });    
        self.update();
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'note',
          stay: 3,
          message: category.error.message,
          visibile: true
        });
      }
    });

    mainControl.change('CategorySelected', function(state, c){
      var category = c.getter('getSelectedCategoriesGetter');
      if(category.length > 0){
        self.categoriesSelected = category;
      }
    });

    formatDate(date) {
      var dte = new Date(date);
      var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];

      var day = dte.getDate();
      var monthIndex = dte.getMonth();
      var year = dte.getFullYear();

      return monthNames[monthIndex] + ' ' + day + ' ' + year;
    }

    /** Quill Extend 
    * Step1. select local image
    *
    */
    selectLocalImage() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      // Listen upload local image and save to server
      input.onchange = () => {
        const file = input.files[0];

        // file type is only image.
        if (/^image\//.test(file.type)) {
          self.saveToServer(file);
        } else {
          console.warn('You could only upload images.');
        }
      };
    }

    /**
     * Step2. save to server
     * @param {File} file
     */
    saveToServer(file) {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('name', file.name);

      const xhr = new XMLHttpRequest();
      var auth_token = self.getCookie('auth_token');      
      xhr.open('POST', 'http://localhost:3000/api/image/upload-image', true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + auth_token);

      xhr.onload = () => {
        if (xhr.status === 200) {      
          const oImage = JSON.parse(xhr.responseText);
          if(oImage.success.status){
            const url = oImage.result.url;
            self.insertToEditor(url);
          }else{
            self.notify({
              position: 'bottom-left',
              theme: 'warning',
              leadstyle: 'note',
              stay: 3,
              message: oImage.error.message,
              visibile: true
            });
          }          
        }else{
          self.notify({
            position: 'bottom-left',
            theme: 'warning',
            leadstyle: 'note',
            stay: 3,
            message: 'Unable to upload image to server, error code: ' + xhr.status,
            visibile: true
          });
        }
      };
      xhr.send(fd);
    }

    /**
     * Step3. insert image url to rich editor.
     * @param {string} url
     */
    insertToEditor(url) {
      // push image url to rich editor.
      const range = editor.getSelection();
      editor.insertEmbed(range.index, 'image', url);
    }    
  </script>
</sc-edit-post>