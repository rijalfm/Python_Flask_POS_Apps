$(document).ready(function() {

	function clock() {
		var clock = new Date();

		var hours = clock.getHours();
		var minutes = clock.getMinutes();
		var seconds = clock.getSeconds();

		if (hours < 10) {
			hours = '0' + hours;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		var clockString = `${hours}:${minutes}:${seconds}`;

		$('#clock')[0].innerHTML=clockString;
	}


	setInterval(function(){
		clock();
	},500)

})