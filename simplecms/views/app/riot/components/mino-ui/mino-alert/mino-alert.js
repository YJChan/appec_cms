riot.tag2('mino-alert', '<div class="alert {type === \'dismiss\'? \'alert-close\': \'\'} {type === \'auto-dismiss\'? \'alert-auto\': \'\'} {class} {theme}" onclick="{type === \'dismiss\' ? () => dismissAlert(e): \'\'}"><yield></yield>{message}</div>', 'mino-alert,[data-is="mino-alert"]{ font-family: \'Lato\', Helvetica, sans-serif; color: #333447; line-height: 1.5; } mino-alert .alert,[data-is="mino-alert"] .alert{ border-radius: 0.2rem; padding: 0.5em 0.675rem; position: relative; margin-bottom: 1rem; } mino-alert .alert-close,[data-is="mino-alert"] .alert-close{ cursor: pointer; } mino-alert .alert-block,[data-is="mino-alert"] .alert-block{ display: block; } mino-alert .light,[data-is="mino-alert"] .light{ background-color: #f4f4f4; color: #1D2F3A; } mino-alert .warning,[data-is="mino-alert"] .warning{ background-color: #F32260; color: #FCF7FA; } mino-alert .success,[data-is="mino-alert"] .success{ background-color: #1ECE80; color: #FCF7FA; } mino-alert .primary,[data-is="mino-alert"] .primary{ background-color: #456990; color: #FCF7FA; } mino-alert .dark,[data-is="mino-alert"] .dark{ background-color: #323C46; color: #FCF7FA; } mino-alert .note,[data-is="mino-alert"] .note{ background-color: #FFD011; color: #1D2F3A; } mino-alert .default,[data-is="mino-alert"] .default{ background-color: #989898; color: #FCF7FA; }', '', function(opts) {

    this.type = opts.type !== undefined? opts.type: 'display';
    this.message = opts.message !== undefined? opts.message: '';
    this.stay = opts.stay !== undefined? opts.stay: '';
    this.class = opts.class;
    this.theme = opts.theme !== undefined? opts.theme: 'default';
    this.display = opts.display;
    var self = this;

    this.on('mount', function(){
      console.log('mounted');

      if(this.type === "auto-dismiss"){
        console.log('auto');
        this.autoDismiss();
      }

      if(this.display !== ""){
        this.root.childNodes[0].style.display = this.display;
      }
    });

    this.dismissAlert = function(){
      dismiss();
    }.bind(this)

    this.autoDismiss = function(){
      if(! isNaN(this.stay)){
        var timeout = parseInt(this.stay) * 1000;
        setInterval(dismiss, timeout);
      }
    }.bind(this)

    function dismiss(){
      self.unmount(true);
    }
});