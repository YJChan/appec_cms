<sc-search-post>
  <form>
    <div class="siimple-field sc-field">
      <input type="text" class="sc-search siimple-input" placeholder="title, content, category, ..." ref="inpSearch"
        onkeyup="{() => searchKeyWord()}" onkeydown="{() => searchKeyWord()}" onkeypress="{() => searchKeyWord()}">
      <div class="siimple-btn siimple-btn--green sc-search-btn"><box-icon name='search'></box-icon></div>
    </div>
    <div class="sc-search-result">
      <div class="sc-result-row" each={r, index in listOfResults} onclick="{() => gotoPost(r.PostID)}"
        style="margin-top: {index > 0 ? ((index -1) * 24)+ (index * 65): -20}px">
        <b> { r.title } </b><br/>
        <div class="siimple--clearfix">
          <div class="siimple--float-left"> 
            <span class="siimple-tag siimple-tag--green">{ r.catname }</span>
          </div>
          <div class="siimple--float-right">
            <span class="siimple-tag siimple-tag--primary siimple-tag--rounded">
              by { r.createdBy }
            </span>
          </div>
        </div>        
        <div class="sc-result-btn siimple--bg-light siimple--display-block siimple--color-dark">view</div>
      </div>
    </div>
  </form>
  <sc-notify></sc-notify>
  <style>
    :scope{
      display: inline-block;
      float: right;      
    }
    .sc-search {
      width: 25em;
      background: #f3f3f3;                  
      border-radius: 4px 0px 0px 4px;
      height: 34px;
    }

    .sc-field{
      display: flex;
    }

    .sc-search-btn{
      line-height: 3;
      border-radius: 0px 4px 4px 0px;
    }

    .sc-search-result{

    }

    .sc-result-row{
      border: 1px solid #ddd;
      padding: 10px;
      width: 25em;
      z-index: 999;
      position: absolute;
      background: white;      
      margin-top: -22px;
      right: 5%;
      cursor: pointer;
    }

    .sc-result-btn{
      padding: 0px 50px;
      margin-top: 10px;      
      text-align: center;      
      margin: 10px -10px -10px -10px;
    }
  </style>
  <script>
    var self = this;
    var listOfResults = [];
    var baseUrl = '';
    var mainControl = this.riotx.get('main-control');

    searchKeyWord(){
      var text = this.refs.inpSearch.value !== ''? this.refs.inpSearch.value: '';
      if(text.length >= 2){
        self.parent.onSearching(true);
        mainControl.action('searchPostAction', {param: text});
      }else{        
        self.parent.onSearching(false);
        self.update({
          listOfResults: []
        });
      }
    }

    gotoPost(postId){
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
    
    mainControl.change('SearchPostRetrieved', function(state, c){
      var result = c.getter('searchPostGetter');
      self.baseUrl = c.getter('baseURLGetter');
      if(result.success.status){
        self.update({
          listOfResults: result.result.queryResult
        });
      }else{
        self.notify({
          position: 'bottom-left',
          theme: 'warning',
          leadstyle: 'primary',
          stay: 3,
          message: result.error.message !== ''? result.error.message : 'Unknown result'
        });
      }
    });
  </script>
</sc-search-post>

