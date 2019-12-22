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

    return this;

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
  // now we setup our server
  //
  // const express     = require('express');
  // const app         = express();
  // const webserver   = require('http').Server(app);
  // const io          = require('socket.io')(webserver);


    //
    // enable cross origin polling for socket.io
    //
    // io.origins('*:*');


    ///////////////////////////
    // full-node multi-block //
    ///////////////////////////
    // app.post('/blocks', async (req, res) => {

    //   var blocks = [];

    //   // obtain the blocks and publickeys needed for fetching
    //   try {
    //     var block_hashes = req.body.blocks;
    //     if (block_hashes.length > 50) {
    //       res.status(400);
    //       res.send({
    //         payload: {},
    //         error: {
    //           message: 'Block hash request greater than 50 block hashes'
    //         }
    //       });
    //     }
    //   } catch(err) {
    //     res.status(404);
    //     res.send({
    //       payload: {},
    //       error: {
    //         message: 'Invalid block or publickey array passed to route'
    //       }
    //     });
    //     return;
    //   }

    //   blocks = block_hashes.map(async bhash => {
    //     if (bhash) {
    //       try {
    //   let ts = this.app.blockchain.bsh_ts_hmap[bhash];
    //   let filename = ts + "-" + bhash + ".blk";
    //         if (ts > 0) {
    //           return fs.readFileSync(this.blocks_dir + filename, 'utf8');
    //         }
    //       } catch(err) {
    //         console.error("FETCH BLOCKS ERROR: ", err);
    //         res.status(400)
    //         res.send({
    //           error: {
    //             message: "Could not find block on this server"
    //           }
    //         })
    //       }
    //     }
    //   });

    //   blocks = await Promise.all(blocks);

    //   res.status(200)
    //   res.send({
    //     payload: {
    //       blocks
    //     },
    //     error: {}
    //   });

    // });



    // ////////////////////////////
    // // full-node single block //
    // ////////////////////////////
    // app.get('/blocks/:bhash', (req, res) => {

    //   let bhash = req.params.bhash;
    //   if (bhash == null) { return; }

    //   try {
    //     let ts = this.app.blockchain.bsh_ts_hmap[bhash];
    //     let filename = ts + "-" + bhash + ".blk";
    //     if (ts > 0) {
    //       let blkfilename = this.blocks_dir + filename;
    //       res.sendFile(blkfilename);
    //       return;
    //     }
    //   } catch (err) {
    //     console.error("FETCH BLOCKS ERROR SINGLE BLOCK FETCH: ", err);
    //     res.status(400)
    //     res.send({
    //       error: {
    //         message: `FAILED SERVER REQUEST: could not find block: ${bhash}`
    //       }
    //     })
    //   }
    // });


  /*****

    /////////////////
    // lite-blocks //
    /////////////////
    app.post('/lite-blocks', async (req, res) => {
      let publickeys  = req.body.publickeys;
      if (publickeys == null || publickeys.length == 0) {
        res.status(400);
        res.send({
          payload: {},
          error: {
            message: 'Invalid request, publickey array not passed to route'
          }
        });
      }

      try {
        var block_hashes = req.body.blocks;
      } catch(err) {
        res.status(404);
        res.send({
          payload: {},
          error: {
            message: 'Invalid block array passed to route'
          }
        });
        return;
      }

      let keylist = [];
      publickeys.forEach((pkey) => {
        let peer = this.app.network.returnPeerByPublicKey(pkey);
        if (peer == null) {
          keylist.push(pkey);
        } else {
          keylist = peer.peer.keylist;
        }
      })

      try {
        blocks = block_hashes.map(async bhash => {

          let blk = await this.app.blockchain.returnBlockWithTransactionsByHash(bhash, keylist);

          if (blk == null) {
            res.write("{}");
            res.end();
            return;
          }

          return blk.returnFilteredBlockByKeys(keylist).stringify(1);
        });

        blocks = await Promise.all(blocks);

        res.status(200)
        res.send({
          payload: {
            blocks
          },
          error: {}
        });
      } catch (err) {
        console.error("FETCH LITE BLOCKS ERROR: ", err);
        res.status(400)
        res.send({
          error: {
            message: "FAILED SERVER REQUEST: could not find block: "
          }
        })
      }
    });


    app.get('/lite-blocks/:bhash/:pkey', async (req, res) => {

      let bhash = req.params.bhash;
      let pkey  = req.params.pkey;
      if (bhash == null || pkey == null) { return; }

      let peer = this.app.network.returnPeerByPublicKey(pkey);
      let keylist = [];


      if (peer == null) {
        keylist.push(pkey);
      } else {
        keylist = peer.peer.keylist;
      }

      try {

        let blk = await this.app.blockchain.returnBlockWithTransactionsByHash(bhash, keylist);

        if (blk == null) {
          res.write("{}");
          res.end();
          return;
        }

        let new_blk = blk.returnFilteredBlockByKeys(keylist);
        let stringified_blk = new_blk.stringify(1);
        res.write(stringified_blk);
        res.end();
        return;

      } catch (err) {
        console.error(`FAILED SERVER REQUEST: could not find block: ${bhash}`);
        console.error("FETCH LITE BLOCKS ERROR: ", err);
        res.status(400)
        res.send({
          error: {
            message: "FAILED SERVER REQUEST: could not find block: "
          }
        })
      }
    });
  *****/



  /////////
  // web //
  /////////
  // app.get('/', function (req, res) {
  //   res.sendFile(server_self.web_dir + 'index.html');
  //   return;
  // });
  // app.get('/options', (req, res) => {
  //   this.app.storage.saveClientOptions();
  //   res.setHeader("Cache-Control", "private, no-cache, no-store, must-revalidate");
  //   res.setHeader("expires","-1");
  //   res.setHeader("pragma","no-cache");
  //   res.sendFile(server_self.web_dir + "client.options");
  //   return;
  // });
  // app.get('/browser.js', function (req, res) {

  //   //
  //   // may be useful in the future, if we gzip
  //   // files before releasing for production
  //   //
  //   // gzipped, cached -- if you enable cached
  //   // and gzipped, be sure to manually edit the
  //   // content-length to reflect the size of the
  //   // file
  //   //
  //   //res.setHeader("Cache-Control", "public");
  //   //res.setHeader("Content-Encoding", "gzip");
  //   //res.setHeader("Content-Length", "368432");
  //   //res.sendFile(server_self.web_dir + 'browser.js.gz');
  //   //
  //   var caching = process.env.NODE_ENV == 'prod' ? "private max-age=31536000" : "private, no-cache, no-store, must-revalidate";

  //   res.setHeader("Cache-Control", caching);
  //   res.setHeader("expires","-1");
  //   res.setHeader("pragma","no-cache");
  //   res.sendFile(server_self.web_dir + 'browser.js');
  //   //
  //   //  non-gzipped, cached
  //   //
  //   //res.setHeader("Cache-Control", "public");
  //   //res.setHeader("expires","72000");
  //   //res.sendFile(server_self.web_dir + 'browser.js');
  //   return;
  // });

  //app.use(express.static(path.join(__dirname, 'web')));
  //this.web_dir2                    = path.join(__dirname, '../../web');
  //app.use(express.static(server_self.web_dir));
  //app.use(express.static(path.join(server_self.web_dir2, 'web')));


  /////////////
  // modules //
  /////////////
  //
  // reactivate modules
  //
  //this.app.modules.webServer(app);

    // app.get('*', (req, res) => {
    //   res.status(404).sendFile(`${server_self.web_dir}404.html`);
    //   res.status(404).sendFile(`${server_self.web_dir}tabs.html`);
    // });

    // io.on('connection', (socket) => {
    //   this.app.network.addRemotePeer(socket);
    // });

    // webserver.listen(this.server.port);
    // this.webserver = webserver;
  }

  close() {
    this.webserver.close();
  }

}


module.exports = Server;


