window.onload = function(){
	appec.common.init();
	appec.blog.init();
};

let appec = {
	siteurl: 'http://localhost:3000',
	common: {
		init: function(){
			$('.carousel').carousel({interval: 10000});
		},
		redirectTo: function(url, target){
			switch(target){
			case 'tab':
				window.open(url, '_blank');
				break;
			case 'window':
				window.open(url);
				break;
			case 'current':
				window.location.replace(url);
				break;
			default:
				window.open(url, '_blank');
			}
		}
	},
	blog: {
		init: function(){
			window.fbAsyncInit = function() {
				FB.init({
					appId            : '342566779679298',
					autoLogAppEvents : true,
					xfbml            : true,
					version          : 'v3.2'
				});
			};
		
			(function(d, s, id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement(s); js.id = id;
				js.src = 'https://connect.facebook.net/en_US/sdk.js';
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		},
		manipulateFontSize: function(act){
			let size = $('.post-content').css('font-size');
			size = size.substring(0, size.length -2);	
			if(act > 0){				
				size = Number(size) + 1;
			}else{
				size = Number(size) - 1;
			}											
			if(size <= 30 && size >= 10){
				$('.post-content').css('font-size', size + 'px');
			}
		},
		fbShare: function(shareUrl){
			let url = encodeURI(shareUrl);
			FB.ui({
				display: 'popup',
				method: 'share_open_graph',
				action_type: 'og.likes',
				action_properties: JSON.stringify({
					object: url,
				})
			}, function(response){});
		},
		twitterShare: function(shareUrl) {
			let url = encodeURI(shareUrl);
			let twitterWindow = window.open('https://twitter.com/share?url=' + url, 'twitter-popup', 'height=350,width=600');
			if(twitterWindow.focus) { twitterWindow.focus(); }
			return false;
		},
		linkedInShare: function(shareUrl){
			let url = encodeURI(shareUrl);
			let appName = encodeURI('Appec Blog');
			let linkedInWindow = window.open('https://www.linkedin.com/shareArticle?url=' + url + '&mini=true&source=' + appName, 'linkedin-popup', 'height=570,width=520');			
			if(linkedInWindow.focus){linkedInWindow.focus();}
			return false;
		},
		paginateRedirect: function (pageNum, direction, categoryId = '') {
			let url = window.location.pathname;
			let urls = url.split('/');
			let n = 0;
			let goingToPage = 1;
			url = window.location.origin;

			if(direction === 'next'){
				while(n < urls.length - 1){
					url += urls[n] + '/';
					n++;
				}
				goingToPage = pageNum + 1;
				url = url + goingToPage;
				if(categoryId !== ''){
					url += '?category=' + categoryId;
				}
				appec.common.redirectTo(url, 'current');
			}else if(direction === 'prev'){
				while(n < urls.length - 1){
					url += urls[n] + '/';
					n++;
				}
				goingToPage = pageNum - 1;
				url = url + goingToPage;
				if(categoryId !== ''){
					url += '?category=' + categoryId;
				}				
				appec.common.redirectTo(url, 'current');
			}else{
				url += '/post/all/';
				url += pageNum;
				if(categoryId !== '' && categoryId !== undefined){
					url += '?category=' + categoryId;
				}	
				appec.common.redirectTo(url, 'current');
			}
		}
	}
};