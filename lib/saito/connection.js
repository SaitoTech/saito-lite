const EventEmitter = require('events');

class Connection extends EventEmitter {
  constructor() {
    super()

    // permits more than 10 event listeners 
    this.setMaxListeners(100);
    setInterval(() => {
      // console.log("***** app.connection listener counts *****");
      let totalListeners = 0;
      this.eventNames().forEach((eventName, i) => {
        let eventCount = this.listenerCount(eventName);
        totalListeners += eventCount;
        //console.log(`app.connection has ${eventCount} listeners for ${eventName}`);
      });
      console.log(`app.connection has ${totalListeners} listeners`);
    }, 1000);
  }
}

module.exports = Connection;

