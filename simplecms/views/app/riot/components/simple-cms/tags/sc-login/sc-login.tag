<sc-login>
  <div class="center {theme}" if={login === false}>
    <div class="entry-logo">      
    </div>
    <div class="entry-form">
      <h3>Welcome to </h3>
      <h2> Appec Simple CMS</h2>
      <small>Strength and growth come only through continuous effort and struggle.</small>
      <hr>
      <input ref="admin_email" type="email" class="login-input input-box" placeholder="email"/>
      <input ref="admin_pwd" type="password" class="login-input input-box" placeholder="password"/>
      <br/>
      <button type="submit" class="primary btn" onclick="{() => AdminLogin()}">Login</button>    
    </div>
  </div>
  <!--  <div class="center {theme}" if={login === true && security_phase === true}>
    <input ref="admin_security_phase" type="text" class="login-input input-box" 
      placeholder="Please enter your security phase to proceed"/>
    <mino-btn type="submit" theme="note" onclick="{() => SecurityPhaseVerification()}">Verify</mino-btn>
  </div>  -->
  <sc-notify></sc-notify>
  <style>    
    .center {
      position: absolute;      
      left: 50%;
      transform: translate(-50%, 0%);      
      text-align:center;      
      height: 98.5% ;
      background-color: white;
      border: 1px solid #1c1f3d;
      border-radius: 3.5px;
    }

    .entry-logo{
      background-image: url('/images/appec-logo-dark.png');
      background-repeat: no-repeat;
      background-size: 55%;
      height:250px;
      background-position: center;
      background-color: #161824;
    }

    .entry-form{
      padding: 50px;
    }

    h2{
      font-weight: 400;
    }

    .login-input{
      display: block;
      width: 80%;
      margin: 10px auto;
      font-family: 'Lato', Helvetica, sans-serif;
    }

    .btn{
      display: inline-block;  
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.3rem 0.75rem;
      font-size: 0.9rem;
      line-height: 1.5;
      width:85%;
      cursor:pointer;
      border-radius: 0.2rem;
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
          self.setCookie('uid', loginStatus.uid);
          self.setCookie('aid', loginStatus.aid);
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

    mainControl.change('onGlobalNotify', function(state, c){
      var message = c.getter('globalNotificationGetter');
      riot.mount('sc-notify', {
        position: 'bottom-right',
        theme: 'note',
        leadstyle: 'dark',
        visible: true,
        stay: '3',
        message: message
      });
      self.update();
    });

    AdminLogin(){
      if(this.refs.admin_email.value !== '' && this.refs.admin_pwd.value!== ''){
        var loginForm = {
          admin_email: this.refs.admin_email.value,
          admin_pwd: this.refs.admin_pwd.value
        }      
        mainControl.action('loginAction', {formdata:loginForm});
      }else{
        mainControl.action('globalNotificationAction', {message: 'Email and passwrod cannot be empty!'});
      }
    }
    
    proceed(path){
      baseURL = mainControl.getter('baseURLGetter');
      window.location.replace('/' + path + '/admin');
    }
  </script>
</sc-login>