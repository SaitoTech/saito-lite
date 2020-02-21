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
    }

    //
    // sanity check
    //
    if (this.server.host == "" || this.server.port == 0) {
      console.log("Not starting local server as no hostname / port in options file");
      return;
    }

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


