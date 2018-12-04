<sc-manage-category>
  <div class="siimple-alert siimple-alert--warning" if={acl.post === undefined || acl.post === null}>
    You are not allow to access this module!
  </div>
  <div class="simple-grid" if={acl.post.acl > 4}>
    <div class="simple-grid-row">
      <div class="siimple--display-block primary sc-title">
        { title }
      </div>
      <div class="siimple--display-block siimple--bg-light sc-panel" if={list}>
        <div class="siimple-btn siimple-btn--navy {action === 'edit'? 'siimple-btn--disabled': ''}"
          if={acl.post.acl >= 7}
          onclick="{() => createCategory()}">Create
        </div>
        <div class="siimple--float-right">
          <label class="label">Show All:</label>
          <div class="siimple-switch">
            <input type="checkbox" id="showAllSwitch">
            <label for="showAllSwitch" onclick="{() => showAll()}"></label>
            <div></div>
          </div>          
        </div>
      </div>
    </div>
    <div if={isLoading}>
      <div class="siimple-spinner siimple-spinner--teal"></div>    
    </div>
    <sc-list-category></sc-list-category>      
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

    .label{
      line-height: 34px;
    }
  </style>
  <script>
    this.title = 'Manage Category';
    this.list = true;
    this.acl = opts.acl;
    this.all = false;

    createCategory(){
      this.tags['sc-list-category'].editCategory('');
    }

    showAll(){
      if(this.all){
        this.all = false;
        this.tags['sc-list-category'].showAllCategory(false);
      }else{
        this.all = true;
        this.tags['sc-list-category'].showAllCategory(true);
      }      
    }
  </script>
</sc-manage-category>