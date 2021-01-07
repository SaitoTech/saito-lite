const EventEmitter = require('events');

class Connection extends EventEmitter {
  constructor() {
    super()

    // permits more than 10 event listeners 
    this.setMaxListeners(10000);

  }
}

module.exports = Connection;

