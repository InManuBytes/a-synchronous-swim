const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const http = require('http');
//const {messages, dequeue} = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
// the background image lives in ./background.jpg
////////////////////////////////////////////////////////

let messageQueue = null;

// we pass in messageQueue which includes messages and the related functions
//messageQueue = {messages=[...msg],enqueue:fn,dequeue:fn}
module.exports.initialize = queue => {
  messageQueue = queue;
  console.log('messageQueue', messageQueue);
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
  // for post requests
  if (req.method === 'POST') {
    // new background image
    if (req.url === "/background.jpg") {
      //----------------------------------------------------------
      //   _________ __
      //   /   _____//  |________   ____ _____    _____   ______
      //   \_____  \\   __\_  __ \_/ __ \\__  \  /     \ /  ___/
      //    _____\  \|  |  |  | \/\  ___/ / __ \|  Y Y  \\___ \
      //  /_______  /|__|  |__|    \____ >____  /__|_|  /____  >
      //          \/                   \/     \/      \/     \/
      // In a Node.js based HTTP server:
      // REQ request is a readable stream, and
      // RES response is a writable stream
      // To write data to a writable stream you need to call write() on the stream instance.
      // We need a write stream instance for our backgroundImageFile:
      //
      // UNCOMMENT THE LINES 54-61 BELOW TO USE STREAMS
      //
      var writeImageStream = fs.createWriteStream(this.backgroundImageFile);
      req.on('data', chunk => {
        console.log("overwriting file");
        writeImageStream.write(chunk);
      });
      res.writeHead(201, headers);
      res.end();
      next();
      // ^ This way of solving it is actually part of the advanced content...
      //
      // You could also do it with fs.writeFile, but you have to have the right
      // kind of fileData... I wasn't able to get it be the right type of file data
      // while messing around with fs.writeFile, it kept giving me an error for using a string
      // which is why I ended up looking around google and found streams.
      // The syntax for fs.writeFile:
      //    fs.writeFile(file, fileData, (err) => {})
      // where fileData is either a string or Buffer,
      // "The encoding option is ignored if data is a buffer."
      // When you console.log(data) on line 68 => <Buffer ::hex:: >
      //
      // When I saved the data as a string this didn't work...
      // The syntax for getting the data is:
      //     let rawImageData = '';
      //     req.on('data', chunk => {
      //       rawImageData += chunk;
      //     });
      //
      // So first you have to declare the right raw data
      // let rawImageData = ?;
      // I guess the only other option is a Buffer
      // ----------------------------------------------
      // __________        _____  _____
      // \______   \__  ___/ ____\/ ____\___________
      //  |    |  _/  | | \   __\\   __\/ __ \_  __ \
      //  |    |   \  |_| /|  |   |  | \  ___/|  | \/
      //  |______  /_____/ |__|   |__|  \___  >__|
      //         \/                        \/
      // What is a Buffer?
      // FROM:
      // https://nodejs.org/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length
      // The Buffer class is a global type for dealing with binary data directly.
      // It can be constructed in a variety of ways.
      // Buffer.from('string', encoding) would work for us, possibly
      //
      // then you can grab the chunks and add it to that rawImageData variable
      // and then pass it onto fs.writeFile:
      // I guess technically you could create a buffer from the string
      //
      // UNCOMMENT THE LINES BELOW TO USE fs.writeFILE !!not passing tests
      //
      // let rawImageData = '';
      // req.on('data', chunk => {
      //  rawImageData += chunk //adding it here depends on the type of your rawImageData
      // })
      // let rawImageBuffer = Buffer.from(rawImageData);
      // fs.writeFile(this.backgroundImageFile, rawImageBuffer, (err) => {
      //   if (err) {
      //     res.writeHead(401, headers);
      //   } else {
      //     res.writeHead(201, headers);
      //   }
      //   res.end();
      //   next();
      // });
    }
  }
  // why is it calling so many GET requests?
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, headers); // is this showing up in the response?
      // call initialize with the messages array
      // res.end(randomDirection()); // just checking to see the response works
      // make sure we're sending the data back with right type
      if (messageQueue !== null) {
        // somehow we need to call dequeue and change messagequeue
        res.end(messageQueue.dequeue()); //this passes the first command into the body of the response
        // and at the same time update the messages array
      } else {
        res.end('up'); //default for no saved keypresses
      }
      next();
    } else if (req.url === '/background.jpg') {
      // sets 'background.jpg' as endpoint
      console.log('REQ.URL', req.url);
      fs.readFile(this.backgroundImageFile, (err, data) => {
        if (err) {
          console.log('ERR', err);
          res.writeHead(404, headers);
          res.end();
        } else {
          console.log('getting background image');
          res.writeHead(200, headers);
          res.write(data, 'binary');
          res.end();
        }
        next();
      });
    }

    // var imageURL = /.\.jpg/;
    // if (imageURL.test(req.url)) {
    //   fs.readFile(req.url, 'Base64', (err, data) => {
    //     if (err) {
    //       res.writeHead(404, headers); //throw 404
    //       console.log(err);
    //       res.end();
    //       next();
    //     } else {
    //       //found
    //       console.log('DATA', data);
    //       res.writeHead(200, { 'Content-Type': 'image/jpg' });
    //       res.end(data, 'Base64');
    //       next();
    //     }
    //   });
    // }
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
