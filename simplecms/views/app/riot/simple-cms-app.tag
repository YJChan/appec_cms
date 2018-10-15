<simple-cms-app>
  <sc-navbar></sc-navbar>
  <div class="siimple-grid">    
    <div class="siimple-content siimple-content--fluid">
      <div class="siimple-grid-row">
        <sc-route></sc-route>
      </div>
    </div>
  </div>  
  <style>
  
  </style>
  <script>
    this.theme = opts.theme !== undefined? opts.theme: 'light';        
    var self = this;
    var mainControl = this.riotx.get('main-control');    
    riot.mixin('minoCookie',minoCookie);    
    this.mixin(minoCookie);
    this.setCookie('theme', this.theme, 30);    
  </script>
</simple-cms-app>