<sc-image-select>
  <div class='siimple-content siimple-content--fluid img-border'>
    <img class='img-upload' ref='imgSelect' id='preview' src='https://via.placeholder.com/1080x320'/>    
    <input type='file' onchange='{() => previewFile()}' ref='fileImg' id='fileImg' name='fileImg' class="upload-bar"/>
    <label for="fileImg">Choose a file</label>
  </div>
  <style>
    .img-border{
      border: 1px solid #ccc;
      border-radius: 3px;
    }
    .img-upload{
      width: 100%;
    }
    .upload-bar{
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }

    .upload-bar + label {
      font-size: 1em;
      font-weight: 700;
      color: #546778;      
      display: inline-block;
      padding: 5px;
      border-radius:3px;
      background-color: #dde5ee;
    }

    .upload-bar:focus + label,
    .upload-bar + label:hover {
        background-color: lightslategrey;
        cursor: pointer;
        color: white;
        outline: 1px dotted #000;
	      outline: -webkit-focus-ring-color auto 5px;
    }
  </style>
  <script>
    this.reader = new FileReader();
    this.fileInBase64 = '';
    this.imageID = '';
    this.imgExist = false;
    var imgSrc = opts.imgsrc !== undefined && opts.imgsrc !== null? opts.imgsrc : '';
    var self = this;

    this.on('mount', function(){
      console.log('image source : %s', imgSrc); 
      self.fileInBase64 = '';
      if(opts.imgsrc === undefined || opts.imgsrc === null || opts.imgsrc === ''){
        console.log(imgSrc);
        self.refs.imgSelect.src = 'https://via.placeholder.com/1080x420';
      }
    });

    this.on('update', function(){
      if(this.imageID !== ''){
        this.imgExist = true;
      }else{
        this.imgExist = false;
      }
    })

    previewFile() {
      //console.log('ah ha, catch you');
      var preview = document.querySelector('img');
      var file    = document.querySelector('input[type=file]').files[0];

      self.reader.addEventListener("load", function () {
        preview.src = self.reader.result;
        self.fileInBase64 = self.reader.result;
      }, false);

      if (file) {
        self.reader.readAsDataURL(file);
      }
    }

    getFileBase64String(){
      return self.fileInBase64;
    }

    getImageUrl(){
      return self.imgSrc;
    }

    setImageUrl(url){
      self.imgSrc = url;
      self.imgExist = true;
      self.refs.imgSelect.src = url;
      //self.update();
    }

    setImageID(id){
      self.imgExist = true;
      self.imageID = id;      
    }

    getImageID(){
      return self.imageID;
    }

  </script>
</sc-image-select>