class Server {

  constructor(app) {

    this.app                        = app || {};

    // this.blocks_dir                 = path.join(__dirname, '../../data/blocks/');
    // this.web_dir                    = path.join(__dirname, '../../web/');

    this.server                     = {};
    this.server.host                = "";
    this.server.port                = 0;
    this.server.publickey           = "";
    this.server.protocol            = "";

    this.server.receivetxs          = 1;
    this.server.receiveblks         = 1;
    this.server.receivegts          = 1;
    this.server.sendtxs             = 1;
    this.server.sendblks            = 1;
    this.server.sendgts             = 1;

    this.server.endpoint            = {};
    this.server.endpoint.host       = "";
    this.server.endpoint.port       = 0;
    this.server.endpoint.protocol   = "";

    this.webserver                  = null;
    this.io                         = null;

  }


  returnServerURL() {
    return (this.server.endpoint.protocol + "://" + this.server.endpoint.host + ":" + this.server.endpoint.port);
  }




  initialize() {

    // let server_self = this;

    if (this.app.BROWSER == 1) { return; }

    //
    // update server information from options file
    //
    if (this.app.options.server != null) {
      this.server.host = this.app.options.server.host;
      this.server.port = this.app.options.server.port;
      this.server.protocol = this.app.options.server.protocol;
      this.server.name = this.app.options.server.name || "";
      this.server.sendblks = (typeof this.server.sendblks == "undefined") ? 1 : this.server.sendblks;
      this.server.sendtxs = (typeof this.server.sendtxs == "undefined") ? 1 : this.server.sendblks;
      this.server.sendgts = (typeof this.server.sendgts == "undefined") ? 1 : this.server.sendblks;
      this.server.receiveblks = (typeof this.server.receiveblks == "undefined") ? 1 : this.server.sendblks;
      this.server.receivetxs = (typeof this.server.receivetxs == "undefined") ? 1 : this.server.sendblks;
      this.server.receivegts = (typeof this.server.receivegts == "undefined") ? 1 : this.server.sendblks;
    }

    //
    // sanity check
    //
    if (this.server.host == "" || this.server.port == 0) {
      console.log("Not starting local server as no hostname / port in options file");
      return;
    }

    if (this.app.options.server.receivetxs === 0) { this.server.receivetxs = 0; }
    if (this.app.options.server.receiveblks === 0) { this.server.receiveblks = 0; }
    if (this.app.options.server.receivegts === 0) { this.server.receivegts = 0; }
    if (this.app.options.server.sendtxs === 0) { this.server.sendtxs = 0; }
    if (this.app.options.server.sendblks === 0) { this.server.sendblks = 0; }
    if (this.app.options.server.sendgts === 0) { this.server.sendgts = 0; }

    //
    // init endpoint
    //
    if (this.app.options.server.endpoint != null) {
      this.server.endpoint.port = this.app.options.server.endpoint.port;
      this.server.endpoint.host = this.app.options.server.endpoint.host;
      this.server.endpoint.protocol = this.app.options.server.endpoint.protocol;
      this.server.endpoint.publickey = this.app.options.server.publickey;
    } else {
      var {host, port, protocol, publickey} = this.server
      this.server.endpoint = {host, port, protocol, publickey};
      this.app.options.server.endpoint = {host, port, protocol, publickey};
      this.app.storage.saveOptions();
    }

    //
    // save options
    //
    this.app.options.server = this.server;
    this.app.storage.saveOptions();


    //
    // lite-clients have no server
    //
    // see core/server.js
    //

  }

  close() {
    this.webserver.close();
  }

}


module.exports = Server;


