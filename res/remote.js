var socket = io.connect();
socket.on('connect', function () {
    socket.emit('remote', 'user01');
    console.log('remote control connected');
});

socket.on('reconnecting', function () {
    console.log('Reconnecting to the server');
});

socket.on('error', function (e) {
    console.log(e, "An error occured");
});

$(document).ready(function () {
    var next = $('#next'), prev = $('#prev');

    next.live('tap', function () {
        socket.emit('next');
    });

    prev.live('tap', function () {
        socket.emit('prev');
    });
});
