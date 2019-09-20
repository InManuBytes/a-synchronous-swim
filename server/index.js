


const keypressHandler = require('./js/keypressHandler');

//every time there is a keypress we should save them in the messageQueue?
const messageQueue = require('./js/messageQueue');
const httpHandler = require('./js/httpHandler');

keypressHandler.initialize(
  //message => {
  //console.log(`Message received: ${message}`)};//working
  messageQueue.enqueue // actually takes in a callback as an argument 
  //and will then call it on the message
);
httpHandler.initialize(messageQueue) //will pass on the messages array and the related methods

const http = require('http');
const server = http.createServer(httpHandler.router);

const port = 3000;
const ip = '127.0.0.1';
server.listen(port, ip);

console.log('Server is running in the terminal!');
console.log(`Listening on http://${ip}:${port}`);
