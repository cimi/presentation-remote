(function () { 
    // extracts all parameters from the query string used
    // to retrieve the script; used to get the userid and the socket.io url
    var requestParameters = {};
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

    var uid = requestParameters['uid'] || 'anonymous';
    //var sioUri = (requestParameters['host'] ? (requestParameters['ssl'] ? 'https://' : 'http://') + requestParameters['host'] : undefined);
    var socket = io.connect(requestParameters['sio-host']);

    socket.on('connect', function () {
        socket.emit('n', uid);
        console.log('presentation connected');
    });

    socket.on('next', function () {
        nextSlide();
    });

    socket.on('prev', function () {
        prevSlide();
    });
})();
