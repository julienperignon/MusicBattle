
/* global $ */
/* global app */
/* global factory */
app.service('youtubeService',[function() {
	this.getEmbedVideoUrlFromNormalUrl = function(url){
		if(url == undefined)
			return '';
		var video_id = url.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');
		if(ampersandPosition != -1) {
			video_id = video_id.substring(0, ampersandPosition);
		}
			
		return "https://www.youtube.com/embed/" +video_id;
	}
}]);