<sc-edit-post>
  <div class="siimple-form">
    <div class="siimple-field">
      <label class="siimple-label">Title</label><br>
      <input type="text" class="siimple-input siimple-input--fluid" style="border-bottom: 1px solid #111;border-top: 0;
        border-left: 0;border-right: 0;border-radius: 0px; background: transparent" ref="inpPostTitle">
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
      <mino-date theme="primary" type="modal" ref="inpDate"></mino-date>
    </div>
    <div class="siimple-btn siimple-btn--primary" onclick="{() => saveContent()}">Save</div>
    <div class="siimple-btn siimple-btn--warning" onclick="{() => backToList()}">Back</div>
  </div>
  <sc-notify></sc-notify>
  <style>
    .space{
      width: 5%;
      display: inline-block;
    }            
  </style>
  <script src="../../../mino-ui/tags/mino-date/mino-date.js"></script>
  <script>
    var editor = null;
    var postId = opts.postid !== undefined? opts.postid: '';
    var post = null;
    var postContent = null;
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
    var self = this;
    this.mixin(minoCookie);

    this.on('before-mount', function(){
      if(self.opts.postid !== ''){
        self.getContent(self.opts.postid);        
      }      
    });

    this.on('mount', function () {
      editor = new Quill('#editor', options);
      // quill editor add image handler
      editor.getModule('toolbar').addHandler('image', () => {
        self.selectLocalImage();
      });
    });

    getContent(id){
      mainControl.action('getPostByIDAction', {param: id});
    }

    saveContent(){
      var oPost = {
        postId: self.postId,  
        title: self.refs.inpPostTitle.value,
        content: JSON.stringify(editor.getContents()),
        active: self.refs.chkActive.checked? 1: 0,
        visibility: self.refs.chkVisible.checked? 1: 0,
        allowComment: self.refs.chkComment.checked? 1: 0,
        publishDate: self.refs.inpDate.value
      }
      mainControl.action('savePostAction', oPost);      
    }

    backToList(){
      self.tags['mino-date'].unmount();
      self.parent.editPost('', true);
      self.update();
    }

    initPost(p){
      this.refs.inpPostTitle.value = p.title;
      this.refs.chkActive.checked = p.active === 1 ? true: false;
      this.refs.chkVisible.checked = p.visibility === 1 ? true: false;
      this.refs.chkComment.checked = p.allowComment === 1 ? true: false;
      this.refs.inpDate.date = self.formatDate(p.publishDate);      
      postContent = JSON.parse(p.content);   
      editor.setContents(postContent);
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
      if (singlePost.success.status){
        self.postId = singlePost.result.PostID;
        self.post = singlePost.result;        
        self.initPost(self.post);
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