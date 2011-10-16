var socket = io.connect('http://ec2-46-137-129-147.eu-west-1.compute.amazonaws.com:8088/');
var presentationId = 42; // TODO: get this from a passed parameter

socket.on('connect', function () {
	socket.emit('remote', presentationId);
	console.log('remote control connected to presentation ', presentationId);
});

socket.on('reconnecting', function () {
	console.log('Reconnecting to the server');
});

socket.on('error', function (e) {
	console.log(e, "An error occured");
});

window.onload = function () {
	var next = document.getElementById('next');
	var prev = document.getElementById('prev');

	next.addEventListener('click', function () {
		socket.emit('next');
	}, false);

	prev.addEventListener('click', function () {
		socket.emit('prev');
	}, false);
}


// timer code - display a countdown timer on the page, refresh every second
var seconds = 25 * 60;
var timer = document.getElementById('timer');
setInterval(function () {
	seconds = seconds - 1;
	timer.innerHTML = Math.floor(seconds / 60) + ":" + (seconds % 60);
}, 1000);
