<sc-login>
  <div class="center {theme}" if={login === false}>
    <h3>Welcome to </h3>
    <h2> Appec Simple CMS</h2>
    <small>Strength and growth come only through continuous effort and struggle.</small>
    <hr>
    <input ref="admin_email" type="email" class="login-input input-box" placeholder="email"/>
    <input ref="admin_pwd" type="password" class="login-input input-box" placeholder="password"/>
    <br/>
    <mino-btn type="submit" theme="primary" onclick="{() => AdminLogin()}">Login</mino-btn>    
  </div>
  <!--  <div class="center {theme}" if={login === true && security_phase === true}>
    <input ref="admin_security_phase" type="text" class="login-input input-box" 
      placeholder="Please enter your security phase to proceed"/>
    <mino-btn type="submit" theme="note" onclick="{() => SecurityPhaseVerification()}">Verify</mino-btn>
  </div>  -->
  <style>    
    .center {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);      
      text-align:center;
      padding: 50px;      
    }

    h2{
      font-weight: 400;
    }
    .login-input{
      display: inline-flex;
      width: 300px;
      font-family: 'Lato', Helvetica, sans-serif;
    }
  </style>
  <script>
    this.mixin(minoCookie);
    this.theme = '';
    this.login = false;
    this.security_phase = false;
    var baseURL = '';
    var self = this;

    var mainControl = this.riotx.get('main-control');

    this.on('mount', function(){
      this.theme = this.getCookie('theme');
      this.update();
    });

    mainControl.change('LoginStatus', function(state, c){
      var loginStatus = c.getter('loginStatusGetter');
      if(loginStatus.status){
        if(loginStatus.token !== '' && loginStatus.token !== null){
          self.setCookie('auth_token', loginStatus.token, 1);
          self.setCookie('ssid', loginStatus.ssid, 3);
          self.login = true;
          if(loginStatus.security_phase){
            self.security_phase = true;
            self.update();
          }else{
            self.proceed(loginStatus.path);
          }
        }
      }
    });

    AdminLogin(){
      var loginForm = {
        admin_email: this.refs.admin_email.value,
        admin_pwd: this.refs.admin_pwd.value
      }
      mainControl.action('loginAction', {formdata:loginForm});
    }

    SecurityPhaseVerification(){
      console.log('verify');
    }

    proceed(path){
      baseURL = mainControl.getter('baseURLGetter');
      window.location.replace('/' + path + '/admin');
    }
  </script>
</sc-login>