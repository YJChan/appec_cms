riot.tag2('simple-cms-app', '<sc-navbar></sc-navbar> <div class="siimple-grid"> <div class="siimple-content siimple-content--fluid"> <div class="siimple-grid-row"> <sc-route></sc-route> </div> </div> </div>', '', '', function(opts) {
    this.theme = opts.theme !== undefined? opts.theme: 'light';
    riot.mixin('minoCookie',minoCookie);

    this.mixin(minoCookie);
    this.setCookie('theme', this.theme, 30);
});