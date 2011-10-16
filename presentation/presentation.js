var socket = io.connect('http://ec2-46-137-129-147.eu-west-1.compute.amazonaws.com:8088/');

var getVars = {};
(function(){
    var scripts, currentScript, queryString;

    scripts = document.getElementsByTagName('script');
    currentScript = scripts[ scripts.length - 1 ];
    queryString = currentScript.getAttribute('src').replace(/[^\?]*/,'').split('&');
    for(var i=0;i<queryString.length;i++){
        var keVal = queryString[i].split('=');
        getVars[ keyVal[0] ] = keyVal[1];
    }
}());

var presentationId = getVars['presentationId'] || 'anonymous';

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
