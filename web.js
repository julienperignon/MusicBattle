//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('X-Frame-Options', 'ALLOW-FROM youtube.com');

    next();
}
var PORT = 8080;
var express = require('express')
var app = express();
app.use(allowCrossDomain);
app.use(express.static('.'));
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})

app.get('/', function(req, res){
  console.log(req);
});

http.listen(PORT, function(){
  console.log('listening on *:%d',PORT);
});