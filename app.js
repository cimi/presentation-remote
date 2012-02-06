// set up dependencies
var express = require('express'),
    sio = require('socket.io'),
    everyauth = require('everyauth'),
    fs = require('fs'),
    authconfig = require('./config.auth.js'),
    logfile = fs.createWriteStream('./app.log', {flags : 'a'});

// configure authentication with third parties
var app = express.createServer(express.logger({ stream : logfile }), everyauth.middleware());
everyauth.debug = true;
everyauth.facebook
        .appId(authconfig.fb.appId)
        .appSecret(authconfig.fb.appsecret)
        .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
            express.logger('dev');
            express.logger(fbUserMetadata);
        })
        .redirectPath('/login');
        
// general configuration for the application
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'waddafuckisthis'}));
    app.use('/res', express.static(__dirname + '/res'));
    app.set('view engine', 'jade');
});

everyauth.helpExpress(app);
app.listen(process.env.PORT || 3000);

// set up index page to serve the rendered remote
app.get('/', function (req, res) {
    res.render('index', { layout: false });
});

app.get('/login', function (req, res) {
    res.render('login', { layout: false });
});

// start socket.io server
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
