// const express = require('express');
// const app = express();
//
// app.get('/', (req, res) => res.send('Hello World!'));
//
// app.listen(3000, () => console.log('Example app listening on port 3000!'));

var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("hello world!\n");
});
server.listen(3000);