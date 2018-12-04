<sc-modal>  
  <div class="modal {size}" if={show}>
    <div class="modal-header">
      <div class="siimple--clearfix">
        <div class="siimple--float-left">{title}</div>
        <div class="siimple--float-right modal-btn" onclick="{() => exitModal()}">
          <box-icon name='x'></box-icon>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <yield from="body"/>
    </div>
    <div class="modal-footer">
      <yield from="footer"/>
      <div class="siimple-btn siimple-btn--primary" if={footeraction} 
       onclick={parent.modalConfirm} ref="btnConfirm">Save</div>
      <div class="siimple-btn siimple-btn--red" if={footeraction} 
       onclick={parent.modalCancel} ref="btnCancel">Cancel</div>
    </div>
  </div>
  <style>
    .modal{      
      background-color: #f3f3f3;  
      color: #111;      
      border: 1px solid #ddd;
      position: absolute;
      top: 15%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10002;      
      padding: 15px;
      border-radius: 4px;
    }

    .small{
      width: 70%;
    }

    .medium{
      width: 50%;
    }

    .large{
      width: 30%;
    }

    .modal-btn{
      cursor: pointer;
    }
  </style>
  <script>
    show = opts.show !==  undefined? true : false;
    title = opts.title !== undefined? opts.title: "";
    size = opts.size !== undefined? opts.size: "medium";
    body = opts.body !== undefined? opts.body: "";
    footer = opts.footer !== undefined? opts.footer: "";
    mObj = opts.mObj !== undefined? opts.mObj: {};
    footeraction = opts.footeraction === "1" ? true : false;
    var self = this;
    
    this.on('mount', function(){
      if(show){
        document.getElementById("modal-bd").style.display = "block";
      }
    })

    showModal(oParam = null){
      if(oParam !== null){
        mObj = oParam;
      }

      if(this.show){
        this.show = false;
        document.getElementById("modal-bd").style.display = "none";
        this.update();
      }else{
        this.show = true;
        document.getElementById("modal-bd").style.display = "block";
        this.update();
      }
    }

    exitModal(){
      this.show = false;
      //this.mObj = null;
      document.getElementById("modal-bd").style.display = "none";
      this.update();
    }
  </script>
</sc-modal>