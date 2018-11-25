<sc-list-category>
  <table class="sc-table">
    <tr class="sc-tr-header-left">
      <td class="sc-th" style="width:60%;">Category Name</td>
      <td class="sc-th" style="width:10%;">Active</td>     
      <td class="sc-th" style="width:30%;">Action</td>
    </tr>    
    <tbody>
      <tr each={list_of_cat}>
        <td class="sc-td-data">
          <div class="sc-edit-class">
            <input type="text" class="input-readonly" ref="inpCatName{CatID}" value="{catname}" readonly/>
          </div>
        </td>
        <td class="sc-td-data">
          <div class="siimple-switch">
            <input type="checkbox" ref="chkActive{CatID}" id="{CatID}" checked="{active === 1? 'checked': ''}"/>
            <label for="{CatID}"></label>
            <div></div>
          </div>
        </td>
        <td class="sc-td-data">
          <div class="siimple-btn siimple-btn--yellow" onclick={() => editCategory(CatID)}>
            Edit
          </div>
          <div class="siimple-btn siimple-btn--error">
            Delete
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <sc-notify></sc-notify>
  <sc-modal title="Edit Category" ref="editModal" footeraction="1">
    <yield to="body">
      <div class="siimple-field">
        <input ref="inpName" class="input-box md-input-fluid" value="{mObj.catname}"/>
      </div>
      <div class="siimple-field">
        <div class="siimple-switch">
          <input type="checkbox" ref="chkActive" id="md{mObj.CatID}" checked="{mObj.active? 'checked': ''}"/>
          <label for="md{mObj.CatID}"></label>
          <div></div>
        </div>
      </div>
    </yield>
    <yield to="footer">            
    </yield>
  </sc-modal>
  <style>
    .input-readonly{
      display: inline;
      padding: 0.2rem 0.45rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #1D2F3A;
      background-color: #f3f3f3;
      background-clip: padding-box;
      border: 0px;
      border-radius: 0.2rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      margin: 5px;
    }

    .md-input-fluid{
      width: 95%;
    }
  </style>
  <script>
    list_of_cat = [];
    var mainControl = this.riotx.get('main-control');
    var self = this;

    this.on('before-mount', function(){
         
    });

    this.on('mount', function(){
      this.getCategories();      
    });

    this.on('update', function(){
      
    })

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

    getCategories(){
      mainControl.action('getCategoriesAction', {param: 'all'});
    }

    editCategory(catId = ''){
      var oCat = null;
      if(catId !== ''){
        oCat = {
          CatID : catId,
          catname: this.refs['inpCatName' + catId].value,
          active: this.refs['chkActive' + catId].checked
        }
      }      
      this.refs.editModal.showModal(oCat);
    }

    modalConfirm(){      
      var oCat = {
        CatID : '',
        catname: this.tags['sc-modal'].refs.inpName.value,
        active: this.tags['sc-modal'].refs.chkActive.checked? 1 : 0
      };
      if(! self.isEmpty(mObj)){
        oCat.CatID = mObj.CatID;
      }
      console.log(oCat);
      mainControl.action('saveCategoryAction', {param: oCat});
    } 

    modalCancel(){
      this.refs.editModal.showModal();
    }

    mainControl.change('CategoriesRetrieved', function(state, c){
      var category = c.getter('getCategoriesGetter');
      var carArr = [];
      if(category.success.status){        
        self.list_of_cat = category.result;    
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

    mainControl.change('SavedCategory', function(state, c){
      var category = c.getter('getSavedCategoryGetter');
      if(category.success.status){
        self.refs.editModal.showModal();
        self.getCategories();
        self.notify({
          position: 'bottom-left',
          theme: 'success',
          leadstyle: 'primary',
          stay: 3,
          message: category.success.message,
          visibile: true
        });
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

    isEmpty(obj) {
      for(var key in obj) {
        if(obj.hasOwnProperty(key)){
          return false;
        }
      }
      return true;
    }
  </script>
</sc-list-category>