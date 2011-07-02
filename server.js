var presentations = {};
var io = require('socket.io').listen(8088);
io.sockets.on('connection', function(socket) {

    socket.on('presentation', function (userId, presentationId) {
        // presentation has connected to the server
	presentations[userId] = presentationId;
    });

    socket.on('slide changed', function (current) {
    	// return current slide index
	socket.emit('slide changed', 'Slide was changed');
    });

    socket.on('remote', function (userId) {
        // remote control has connected to the server
	// return presentations that accept the userId
	socket.send(presentations[userId]);
    });

    socket.on('prev', function (presentationId) {
    	// previous slide was requested on the remote
	io.sockets.socket(presentationId).emit('prev');
    });

    socket.on('next', function (presentationId) {
      // next slide was requested on the remote, send the request to the presentation
      io.sockets.socket(presentationId).emit('next');
    });


    socket.on('disconnect', function(){
        io.sockets.emit({ announcement: 'client disconnected' });
    });
});