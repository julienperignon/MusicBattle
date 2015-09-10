var PORT = 8080;
var express = require('express')
var app = express();
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