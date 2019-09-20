const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const http = require('http');
//const {messages, dequeue} = require('./messageQueue');


// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;

// we pass in messageQueue which includes messages and the related functions
//messageQueue = {messages=[...msg],enqueue:fn,dequeue:fn}
module.exports.initialize = queue => {
  messageQueue = queue;
  console.log("messageQueue", messageQueue);
};

let randomDirection = () => {
  let directions = ['left', 'right', 'up', 'down'];
  let number = Math.floor(Math.random() * Math.floor(4));
  return directions[number];
};

module.exports.router = (req, res, next = () => {}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next();
  }
// why is it calling so many GET requests
  if (req.method === 'GET') {
    res.writeHead(200, headers);
    // call initialize with the messages array
    // res.end(randomDirection()); // just checking to see the response works
    // make sure we're sending the data back with right type
    if (messageQueue !== null) {
      // res.end(messageQueue[0])
      // dequeue();
      // messageQueue = messages;
      // somehow we need to call dequeue and change messagequeue
      res.end(messageQueue.dequeue())//this is pass the first command into the body of the response
      // and at the same time update the messages array
      next();
    } else {
      res.end(); //send first command over to the client
      next();
    }
    // feed one at a time to the get
    // so we can dequeue every time we do it
    // call initialize again to change message array
    // console.log('RES', res);
    }
  // the following three lines were supplied to us, I just copied them into the block of the if statement I wrote on line 18. Using postman I was able to get the response to console log in the terminal with line 20

  // res.writeHead(200, headers);
  // res.end();
  // next(); // invoke next() at the end of a request to help with testing!
};

// everything from here down was added by us...
// http
//   .get('http://127.0.0.1:3000', res => {
//     const { statusCode } = res;
//     const contentType = res.headers['content-type'];

//     let error;
//     if (statusCode !== 200) {
//       error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
//     } else if (!/^application\/json/.test(contentType)) {
//       error = new Error(
//         'Invalid content-type.\n' +
//           `Expected application/json but received ${contentType}`
//       );
//     }
//     if (error) {
//       console.error(error.message);
//       // consume response data to free up memory
//       res.resume();
//       return;
//     }

//     res.setEncoding('utf8');
//     let rawData = '';
//     res.on('data', chunk => {
//       rawData += chunk;
//     });
//     res.on('end', () => {
//       try {
//         const parsedData = JSON.parse(rawData);
//         console.log(parsedData);
//       } catch (e) {
//         console.error(e.message);
//       }
//     });
//   })
//   .on('error', e => {
//     console.error(`Got error: ${e.message}`);
//   });
