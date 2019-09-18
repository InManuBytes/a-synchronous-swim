const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const http = require('http');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = queue => {
  messageQueue = queue;
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
  if (req.method === 'GET') {
    res.writeHead(200, headers);

    res.end(randomDirection());
    console.log('RES', res);
    next();
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
