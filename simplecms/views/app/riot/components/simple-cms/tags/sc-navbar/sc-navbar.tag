<sc-navbar>
  <div class="siimple-navbar siimple-navbar--extra-large siimple-navbar--dark">
    <div class="siimple-navbar-title">Admin panel</div>
    <div class="siimple--float-right">
      <div class="siimple-navbar-item">Profile</div>
      <div class="siimple-navbar-item" onclick="{() => logout()}">Logout</div>
    </div>
  </div>
  <style>

  </style>
  <script>
    var mainControl = this.riotx.get('main-control');

    logout(){
      mainControl.action('logoutAction', {})  ;
    }
  </script>
</sc-navbar>