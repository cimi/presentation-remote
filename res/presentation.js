var socket = io.connect(SOCKET_IO_HOST);

var requestParameters = {};
// extracts all parameters from the query string of this script
// used to get an eventual userId
(function () {
    var scripts, currentScript, queryString;

    scripts = document.getElementsByTagName('script');
    currentScript = scripts[ scripts.length - 1 ];
    queryString = currentScript.getAttribute('src').replace(/[^\?]*/,'').split('&');
    for(var i=0; i < queryString.length; i++) {
        var keyVal = queryString[i].split('=');
        requestParameters[ keyVal[0] ] = keyVal[1];
    }
}());

var presentationId = requestParameters['presentationId'] || 'anonymous';

socket.on('connect', function () {
	socket.emit('presentation', presentationId);
	console.log('presentation connected');
});

socket.on('next', function () {
	nextSlide();
});

socket.on('prev', function () {
	prevSlide();
});
