<sc-notify>  
  <div class="{notify_pos} {theme} {leadstyle}" show={visible}>
    {message}        
  </div>  
  <style>
    .light {
      background-color: #f4f4f4;
      color: #1D2F3A;
    }

    .warning {
      background-color: #F32260;
      color: #FCF7FA;
    }

    .success {
      background-color: #1ECE80;
      color: #FCF7FA;
    }

    .primary {
      background-color: #456990;
      color: #FCF7FA;
    }

    .dark {
      background-color: #323C46;
      color: #FCF7FA;
    }

    .note {
      background-color: #FFD011;
      color: #1D2F3A;
    }

    .default {
      background-color: #989898;
      color: #FCF7FA;
    }    

    .primary-border-left{
      border-left: 5px solid #456990 !important;
    }

    .dark-border-left{
      border-left: 5px solid #323c46 !important;
    }

    .light-border-left{
      border-left: 5px solid #f4f4f4 !important;
    }

    .warning-border-left{
      border-left: 5px solid #f32260 !important;
    }

    .note-border-left{
      border-left: 5px solid #FFD011 !important;
    }

    .default-border-left{
      border-left: 5px solid #989898 !important;
    }

    .success-border-left{
      border-left: 5px solid #1ECE80 !important;
    }

    @media (min-width: 320px) and (max-width: 480px) {
      .notify-bottom-right{
        right: 0;
        top: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 60%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

    .notify-bottom-left{
      left: 0;
      top: 0;
      border: 1px solid #ddd;
      border-radius: 0.2em;
      width: 60%;
      display: inline-block;
      padding: 20px;         
      margin: 15px;
      position: absolute
    }
    
    .notify-top-right{
      right: 0;
      top: 0;
      border: 1px solid #ddd;
      border-radius: 0.2em;
      width: 60%;
      display: inline-block;
      padding: 15px;         
      margin: 15px;
      position: absolute
    }

    .notify-top-left{
      left: 0;
      top: 0;
      border: 1px solid #ddd;
      border-radius: 0.2em;
      width: 60%;
      display: inline-block;
      padding: 20px;         
      margin: 15px;
      position: absolute
    }

    .notify-center{
      left: 40%;
      top: 45%;
      border: 1px solid #ddd;
      border-radius: 0.2em;
      width: 60%;
      display: inline-block;
      padding: 20px;         
      margin: 15px;
      position: absolute
    }


    }

    @media (min-width: 481px) and (max-width: 767px) {
      
      .notify-bottom-right{
        right: 0;
        bottom: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 50%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-bottom-left{
        left: 0;
        bottom: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 50%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }
      
      .notify-top-right{
        right: 0;
        top: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 50%;
        display: inline-block;
        padding: 15px;         
        margin: 15px;
        position: absolute
      }

      .notify-top-left{
        left: 0;
        top: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 50%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-center{
        left: 40%;
        top: 45%;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 50%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-progress{
        width: 1%;
        height: 4px;      
        bottom: 0;
        position: absolute;
        left: 0;
      }
    }

    @media (min-width: 768px) and (max-width: 1024px) {

      .notify-bottom-right{
        right: 0;
        bottom: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 30%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-bottom-left{
        left: 0;
        bottom: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 30%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }
      
      .notify-top-right{
        right: 0;
        top: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 30%;
        display: inline-block;
        padding: 15px;         
        margin: 15px;
        position: absolute
      }

      .notify-top-left{
        left: 0;
        top: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 30%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-center{
        left: 40%;
        top: 45%;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 30%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-progress{
        width: 1%;
        height: 4px;      
        bottom: 0;
        position: absolute;
        left: 0;
      }
    }

    @media (min-width: 1025px) and (max-width: 1920px) {
    
      .notify-bottom-right{
        right: 0;
        bottom: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 20%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-bottom-left{
        left: 0;
        bottom: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 20%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }
      
      .notify-top-right{
        right: 0;
        top: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 20%;
        display: inline-block;
        padding: 15px;         
        margin: 15px;
        position: absolute
      }

      .notify-top-left{
        left: 0;
        top: 0;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 20%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-center{
        left: 40%;
        top: 45%;
        border: 1px solid #ddd;
        border-radius: 0.2em;
        width: 20%;
        display: inline-block;
        padding: 20px;         
        margin: 15px;
        position: absolute
      }

      .notify-progress{
        width: 1%;
        height: 4px;      
        bottom: 0;
        position: absolute;
        left: 0;
      }
    }
  </style>  
  <script type="text/javascript" src="../../observers/sc-notify-observer.js"></script>
  <script>
    this.pos = opts.position !== undefined? opts.position: 'bottom-right';
    this.theme = opts.theme !== undefined? opts.theme: 'light';
    this.bar = 'dark';
    this.leadstyle = opts.leadstyle !== undefined? opts.leadstyle: 'primary-border-left';
    this.notify_pos = 'notify-bottom-right';
    this.stay = opts.stay !== undefined? opts.stay: 5;
    this.message = opts.message !== undefined? opts.message: '';
    this.visible = opts.visible !== undefined? opts.visible: false;
    this.count = 0;
    riot.scNotify = new scNotifyObserver();
    var self = this;

    this.on('before-mount', function(){
      this.setNotification();
    });

    this.on('mount', function(){
      this.autoDismiss();
    });    

    this.on('update', function(){      
    });

    autoDismiss(){
      if(! isNaN(this.stay)){
        var timeout = parseInt(this.stay) * 1000;        
        setTimeout(function(){
          console.log('dismiss');
          self.visible = false;            
          self.update();
        }, timeout);  
      } 
    }    

    setNotification(){
      switch(this.pos){
        case 'top-left':
          this.notify_pos = 'notify-top-left ';
          break;
        case 'top-right':
          this.notify_pos = 'notify-top-right ';
          break;
        case 'center':
          this.notify_pos = 'notify-center ';
          break;
        case 'bottom-left':
          this.notify_pos = 'notify-bottom-left ';
          break;
        case 'bottom-right':
          this.notify_pos = 'notify-bottom-right ';
          break;
        default:
          this.notify_pos = 'notify-bottom-right';
      }

      switch(this.leadstyle){
        case 'primary':
          this.leadstyle = 'primary-border-left ';
          this.bar = 'primary';
          break;
        case 'light':
          this.leadstyle = 'light-border-left ';
          this.bar = 'light';
          break;
        case 'dark':
          this.leadstyle = 'dark-border-left ';
          this.bar = 'dark';
          break;
        case 'warning':
          this.leadstyle = 'warning-border-left ';
          this.bar = 'warning';
          break;
        case 'note':
          this.leadstyle = 'note-border-left ';
          this.bar = 'note';
          break;
        case 'default':
          this.leadstyle = 'default-border-left ';
          this.bar = 'default';
          break;
        case 'success':
          this.leadstyle = 'success-border-left ';
          this.bar = 'success';
          break;
        default:
          this.leadstyle = '';
      }
      
    }
  </script>
</sc-notify>