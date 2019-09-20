
const messages = []; // the storage unit for messages

module.exports.messages = messages;

module.exports.enqueue = (message) => {
  console.log(`Enqueing message: ${message}`);
  messages.push(message);
  console.log("messages array: ", messages);
};

module.exports.dequeue = () => {
  // returns undefined if messages array is empty
  return messages.shift();
};

// we need a way to get the messages to other files