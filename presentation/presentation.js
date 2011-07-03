var socket = io.connect('http://ec2-46-137-129-147.eu-west-1.compute.amazonaws.com:8088/');
socket.on('connect', function () {
	socket.emit('remote', 'user01');
	console.log('presentation connected');
});

socket.on('next', function () {
	console.log('next slide requested');
	nextSlide();
	console.log('next slide executed');
});

socket.on('prev', function () {
	console.log('prev slide requested');
	prevSlide();
});
