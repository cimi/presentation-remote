var express = require('express'),
    sio = require('socket.io'),
    app = express.createServer(express.logger());

app.configure(function () {
    app.use(express.cookieParser());
    app.use('/res', express.static(__dirname + '/res'));
    app.set('view engine', 'jade');
});
app.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.render('index', { layout: false });
});

var io = sio.listen(app);
var presentations = {};

// use long polling because heroku does not support web sockets
io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});

// start socket server
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
        console.log('remote control for user: ' + userId + ' has connected');
        socket.send(presentations[userId]);
    });

    socket.on('prev', function (presentationId) {
    	// previous slide was requested on the remote
        io.sockets.emit('prev');
    });

    socket.on('next', function (presentationId) {
        // next slide was requested on the remote, send the request to the presentation
        io.sockets.emit('next');
    });


    socket.on('disconnect', function(){
        io.sockets.emit({ announcement: 'client disconnected' });
    });
});
