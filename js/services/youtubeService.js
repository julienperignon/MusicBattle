
/* global $ */
/* global app */
/* global factory */
app.service('youtubeService',[function() {
	
	this.youtubeLinkPattern = /https?:\/\/(?:[a-zA_Z]{2,3}.)?(?:youtube\.com\/watch\?)((?:[\w\d\-\_\=]+&amp;(?:amp;)?)*v(?:&lt;[A-Z]+&gt;)?=([0-9a-zA-Z\-\_]+))/i;
	
	this.getEmbedVideoUrlFromNormalUrl = function(url){
		if(url == undefined)
			return '';
		var video_id = url.split('v=')[1];
		if(video_id == undefined)
		return '';
		var ampersandPosition = video_id.indexOf('&');
		if(ampersandPosition != -1) {
			video_id = video_id.substring(0, ampersandPosition);
		}
			
		return "https://www.youtube.com/embed/" +video_id;
	}
}]);