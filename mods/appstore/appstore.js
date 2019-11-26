const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const AppStoreAppspace = require('./lib/email-appspace/appstore-appspace');
const AppStoreSearch = require('./lib/email-appspace/appstore-search');



class AppStore extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "AppStore";
  }




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
      return obj;
    }
    return null;
  }

  renderEmail(app, data) {
     data.appstore = app.modules.returnModule("AppStore");
     AppStoreAppspace.render(app, data);
     AppStoreSearch.render(app, data);
  }

  attachEventsEmail(app, data) {
     data.appstore = app.modules.returnModule("AppStore");
     AppStoreAppspace.attachEvents(app, data);
     AppStoreSearch.attachEvents(app, data);
  }



  //
  // database queries inbound here
  //
  async handlePeerRequest(app, message, peer, mycallback=null) {

    if (message.request === "appstore load modules") {

      let sql = "SELECT * FROM modules";
      let params = {};
      let rows = await this.app.storage.queryDatabase(sql, params, message.data.dbname);

      let res = {};
          res.err = "";
          res.rows = rows;

      mycallback(res);

    }
  }



  initialize(app) {
    super.initialize(app);

    // let sql = "INSERT INTO modules (name, description, version, publickey, unixtime, bid, bsh, tx) VALUES ($name, $description, $version, $publickey, $unixtime, $bid, $bsh, $tx)";
    // let params = {
	  // $name		:	"Application Name" ,
	  // $description	:	"Application Description" ,
	  // $version	:	1234 ,
	  // $publickey	:	"1241231" ,
	  // $unixtime	:	1234 ,
	  // $bid		:	413 ,
	  // $bsh		:	"513123" ,
	  // $tx		:	"this is the transaction"
    // }
    // app.storage.executeDatabase(sql, params, "appstore");

  }


  onConfirmation(blk, tx, conf, app) {
    // let appstore = app.modules.returnModule('AppStore');
    let txmsg = tx.returnMessage();
    if (conf == 0) {
      switch(txmsg.request) {
        case 'submit module':
          this.submitModule(blk, tx);
          break;
        default:
          break;
      }
    }
  }

  submitModule(blk, tx) {
    console.log('PUBLISHING MODULE');
    let sql = `INSERT INTO modules (name, description, version, publickey, unixtime, bid, bsh, tx)
    VALUES ($name, $description, $version, $publickey, $unixtime, $bid, $bsh, $tx)`;
    let { from, sig, ts } = tx.transaction;
    let params = {
      $name		:	`Application ${ts}`,
      $description	:	`Application ${ts}`,
      $version	:	`${ts}-${sig}`,
      $publickey	:	from[0].add ,
      $unixtime	:	ts ,
      $bid		:	blk.block.id ,
      $bsh		:	blk.returnHash() ,
      $tx		:	JSON.stringify(tx.transaction),
    }
    this.app.storage.executeDatabase(sql, params, "appstore");
  }

  createBundleTX(filename) {
    let fs = app.storage.returnFileSystem();
    if (fs) {
      let bundle_base64 = fs.readFileSync('/path/to/file.jpg', { encoding: 'base64' });
      let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
      newtx.transaction.msg = { module: "AppStore", request: "submit module", bundle: bundle_base64 };
      return app.wallet.signTransaction(newtx);
    }
    return null;
  }




  //
  // override webserver to permit module-hosting
  //
  webServer(app, expressapp, express) {

    let fs = app.storage.returnFileSystem();
    if (fs != null) {
      expressapp.use('/'+encodeURI(this.name), express.static(__dirname + "/web"));

      expressapp.post('/bundle', async (req, res) => {
        //
        // require inclusion of  module versions and paths for loading into the system
        //
        let { versions, paths } = req.body;

        let ts = new Date().getTime();
        let hash = this.app.crypto.hash(versions.join(''));

        let modules_filename = `modules.config-${ts}-${hash}.json`

        await fs.writeFile(path.resolve(__dirname, `bundler/${modules_filename}`),
          JSON.stringify({paths})
        );

        let IndexTemplate = require(index.template.js);
        let index_filename = `saito-${ts}-${hash}.js`;

        await fs.writeFile(path.resolve(__dirname, `bundler/modules.config-${ts}-${hash}.json`),
          IndexTemplate(modules_config_filename)
        );

        //
        // TODO: unzip existing modules and stage them
        //

        //
        // create temp module_paths file and index.client.js\
        //
        let webpackConfig = require('../../webpack/webpack.config');
        webpackConfig.entry = ["babel-polyfill", path.resolve(__dirname, `./bundler/index-${ts}-${hash}.js`)],
        webpackConfig.output = {
            path: path.resolve(__dirname, './bundler/dist'),
            filename: index_filename
        }

        //
        // write config to file
        //
        try {
          await fs.writeFile(path.resolve(__dirname, `bundler/webpack.config-${ts}-${sig}.json`));
        } catch(err) {
          console.log(err);
        }

        //
        // execute bundling process
        //
        const util = require('util');
        const exec = util.promisify(require('child_process').exec);

        try {
          //
          // TODO: json
          //
          const { stdout, stderr } = await exec('webpack --config ./bundler/webpack.config.json' );

          //
          // if there are no errors
          //
          res.send({
            payload: {
              filename
            }
          });

          let newtx = this.createBundleTX(filename);

          //
          // publish our bundle
          //
          this.app.network.propagateTransaction(newtx);
        } catch(err) {
          console.log(err);
        }
      });
    }
  }

}




module.exports = AppStore;


