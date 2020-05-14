// const saito = require('./../saito');
const express     = require('express');
const app         = express();
const webserver   = require('http').Server(app);
const io          = require('socket.io')(webserver);
const fs          = require('fs');
const path        = require('path');
const bodyParser  = require('body-parser');



/**
 * Constructor
 */
class Server {

  constructor(app) {

    this.app                        = app || {};

    this.blocks_dir                 = path.join(__dirname, '../../../data/blocks/');
    this.web_dir                    = path.join(__dirname, '../../../web/');

    this.server                     = {};
    this.server.host                = "";
    this.server.port                = 0;
    this.server.publickey           = "";
    this.server.protocol            = "";
    this.server.name                = "";

    this.server.endpoint            = {};
    this.server.endpoint.host       = "";
    this.server.endpoint.port       = 0;
    this.server.endpoint.protocol   = "";

    this.webserver                  = null;
    this.io                         = null;

  }


  initialize() {

    let server_self = this;

    if (this.app.BROWSER == 1) { return; }

    //
    // update server information from options file
    //
    if (this.app.options.server != null) {
      this.server.host = this.app.options.server.host;
      this.server.port = this.app.options.server.port;
      this.server.protocol = this.app.options.server.protocol;
      this.server.name = this.app.options.server.name || "";
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
    // enable cross origin polling for socket.io
    //
    io.origins('*:*');

    // body-parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());



    /////////////////
    // full blocks //
    /////////////////
    app.get('/blocks/:bhash/:pkey', (req, res) => {

      let bhash = req.params.bhash;
      if (bhash == null) { return; }

      try {
        let ts = this.app.blockchain.bsh_ts_hmap[bhash];
        let filename = `${ts}-${bhash}.blk`;
        if (ts > 0) {

          res.writeHead(200, {
            "Content-Type": "text/plain",
            "Content-Transfer-Encoding": "utf8"
          });

	  // const src = fs.createReadStream(this.blocks_dir + filename, {encoding: 'binary'});
	  // spv errors if we server different from server in SPV/Lite 
          const src = fs.createReadStream(this.blocks_dir + filename, {encoding: 'utf8'});
          src.pipe(res);
        }
      } catch (err) {

	//
	// file does not exist on disk, check in memory
	//
       // let blk = await this.app.blockchain.returnBlockByHash(bsh);

        console.error("FETCH BLOCKS ERROR SINGLE BLOCK FETCH: ", err);
        res.status(400)
        res.send({
          error: {
            message: `FAILED SERVER REQUEST: could not find block: ${bhash}`
          }
        })
      }
    });


    /////////////////
    // lite-blocks //
    /////////////////
    app.get('/lite-blocks/:bhash/:pkey', async (req, res) => {

      if (req.params.bhash == null) { return; }
      if (req.params.pkey == null) { return; }
 
     let bsh = req.params.bhash;
      let pkey = req.params.pkey;
      let keylist = [];

      let peer = this.app.network.returnPeerByPublicKey(pkey);

      if (peer == null) {
	keylist.push(pkey);
      } else {
	keylist = peer.peer.keylist;
      }

      let blk = await this.app.blockchain.returnBlockByHashFromMemoryOrDisk(bsh, 1);

      if (blk == null) {
        res.send("{}");
        return;
      } else {
        let newblk = blk.returnLiteBlock(bsh, keylist);
	//
	// formerly binary / binary, but that results in different encoding push than full blocks, so SPV fails
	//
        //res.end(new Buffer(newblk.returnBlockFileData(), 'utf8'), 'binary');
        res.end(new Buffer(newblk.returnBlockFileData(), 'binary'), 'binary');
        return;
      }

      return;

    });


    /////////
    // web //
    /////////
    app.get('/options', (req, res) => {
      //this.app.storage.saveClientOptions();
      // res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
      // res.setHeader("expires","-1");
      // res.setHeader("pragma","no-cache");
      //res.sendFile(server_self.web_dir + "client.options");
      res.send(this.app.storage.returnClientOptions());
      return;
    });

    app.get('/r', (req, res) => {
      res.sendFile(server_self.web_dir + "refer.html");
      return;
    });

 
    app.get('/saito.js', function (req, res) {

      //
      // may be useful in the future, if we gzip
      // files before releasing for production
      //
      // gzipped, cached
      //
      //res.setHeader("Cache-Control", "public");
      //res.setHeader("Content-Encoding", "gzip");
      //res.setHeader("Content-Length", "368432");
      //res.sendFile(server_self.web_dir + 'saito.js.gz');
      //
      // non-gzipped, cached
      //
      //res.setHeader("Cache-Control", "public");
      //res.setHeader("expires","72000");
      //res.sendFile(server_self.web_dir + '/dist/saito.js');
      //
      // caching in prod
      //
      var caching = process.env.NODE_ENV == 'prod' ? "private max-age=31536000" : "private, no-cache, no-store, must-revalidate";
      res.setHeader("Cache-Control", caching);
      res.setHeader("expires","-1");
      res.setHeader("pragma","no-cache");
      res.sendFile(server_self.web_dir + '/dist/saito.js');
      return;
    });

    //
    // make root directory recursively servable
    //
    app.use(express.static(server_self.web_dir));

    /////////////
    // modules //
    /////////////
    this.app.modules.webServer(app, express);

    app.get('*', (req, res) => {
      res.status(404).sendFile(`${server_self.web_dir}404.html`);
      res.status(404).sendFile(`${server_self.web_dir}tabs.html`);
    });


    io.on('connection', (socket) => {
      this.app.network.addRemotePeer(socket);
    });

    webserver.listen(this.server.port);
    this.webserver = webserver;
  }

  close() { this.webserver.close(); }

}


module.exports = Server;
