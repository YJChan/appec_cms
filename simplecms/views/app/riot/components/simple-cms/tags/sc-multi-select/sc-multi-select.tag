<sc-multi-select>
  <div class="multi-select">
    <ul class="selected">
      <li each="{ selected }">
        <div class="selected-container">{ name }<a onclick="{ parent.remove }">x</a>
        </div>
      </li>
      <li class="selector" onclick="{ show }">&nbsp;</li>
    </ul>

    <ul class="selections" show="{ showing }">
      <li each="{ selections }">
        <div onclick="{ parent.select }">{ name }</div>
      </li>
    </ul>  
  </div>
  <style>      
    .selected {
      min-height: 30px;
      min-width: 200px;
      border: 1px solid black;
    }
    .multi-select ul {
      list-style-type: none;
      padding: 0;
      margin-left: 0;
      border: 1px solid #ccc;
      font-weight: bold;
      border-radius: 0px 0px 4px 4px;
    }
    .selected {
      padding: 2px;
      margin: 0 0 -1px;
      width: 100%;
      display: table;
      table-layout: fixed;
    }
    .selected li div {
      border: 1px solid #bbb;
      padding: 5px;
      margin: 4px;
      cursor: pointer;
    }
    .selected li div,
    .selected li a {
      float: left;
      margin-right: 5px;
    }
    .selected li a {
      text-decoration: none;
      color: darkblue;
      border: 1px solid darkblue;
      background-color: lightslategrey;
      padding: 0 5px;
      border-radius: 4px;
    }
    .selector {
      width: 100%;
      border: none;
      height: 30px;
    }
    .selections {
      border: 1px solid #ccc;
      margin-top: 0px;
      position: absolute;
      width: 400px;
      z-index: 10;
      background: #f4f4f4;
      border-radius: 0px 0px 4px 4px;
      line-height: 1.5;
    }
    .selections li {
      padding: 5px;
    }
    .selections li:hover {
      background-color: #ccccff;
      cursor: pointer;
    }
    .selected-container{
      border-radius: 4px;
    }
    label {
      margin-top: 8px;
    }
    .show {
      display: block;
    }
    .hide {
      display: none;
    }
  </style>
  <script>  
    this.selections = opts.selections !== undefined? opts.selections.sort(function(a,b) {return a.name > b.name}) : '';
    this.selected = [];    
    this.showing = false;
    this.selectedFunc = opts.selectedFunc !== undefined? opts.selectedFunc: '';
    this.setSelectedFunc = opts.setSelectedFunc !== undefined? opts.setSelectedFunc: '';
    this.getSelectedFunc = opts.getSelectedFunc !== undefined? opts.getSelectedFunc: '';
    var mainControl = this.riotx.get('main-control');
    var self = this;

    remove(e){
      this._swap(e.item, this.selected, this.selections);
      mainControl.action(this.selectedFunc, {param: e.item.id, action: 'remove'});
      console.log(this.selected);
    }

    select(e){
      this._swap(e.item, this.selections, this.selected);
      mainControl.action(this.selectedFunc, {param: e.item.id, action: 'select'});
      console.log(this.selected);
    }

    show(e){
      this.showing = !this.showing;
    }

    _swap(item, src, dest){
      dest.push(item);
      src.splice(src.indexOf(item), 1);
      this.showing = false;
    }

    getSelected(type = 'string'){
      var selectedCat = '';
      if(type === 'string'){        
        for(var n in this.selected){
          if(selectedStr.length > 0){
            selectedCat += ', ' + this.selected[n];
          }else{
            selectedCat = this.selected[n];
          }
        }
      }else{
        selectedCat = this.selected;
      }            
      return selectedCat;
    }

    setSelected(items){
      for(var n in items){
        this._swap(items[n], this.selections, this.selected);
      }
    }

    mainControl.change(self.setSelectedFunc, function(state, c){
      var selArray = c.getter(self.getSelectedFunc);
      if(selArray.length > 0){
        self.selected = selArray;
      }
    });

  </script>
</sc-multi-select>