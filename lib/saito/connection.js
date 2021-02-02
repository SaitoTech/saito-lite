const EventEmitter = require('events');

class Connection extends EventEmitter {
  constructor() {
    super()

    // I set this to 200 because 200 should be sufficient for anything. Default is 10.
    // I'd like to know if we go beyond 200. It is very easy to accidentally
    // create hundreds of listeners here if someone is doing app.connection.on()
    // in a render function that gets called repeatedly, for example.
    this.setMaxListeners(200);
    
    // Please don't delete the following commented code yet:
    // This code should be enabled occasionally just to do a sanity check on 
    // the number of listeners or as a way of doing debugging in case we 
    // start to go beyond 200 totalListeners
    //
    // setInterval(() => {
    //   // console.log("***** app.connection listener counts *****");
    //   let totalListeners = 0;
    //   this.eventNames().forEach((eventName, i) => {
    //     let eventCount = this.listenerCount(eventName);
    //     totalListeners += eventCount;
    //     //console.log(`app.connection has ${eventCount} listeners for ${eventName}`);
    //   });
    //   console.log(`app.connection has ${totalListeners} listeners`);
    // }, 1000);
  }
}

module.exports = Connection;

