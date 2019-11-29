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

  installModule(app) {
    if (this.app.BROWSER == 1) { return; }

    super.installModule(app);

    const archiver = require('archiver');
    const path = require('path');
    const { readdirSync, readFileSync, createWriteStream } = require('fs');

    //
    // get a list of module directories
    //
    const getDirectories = source =>
      readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

    let mods_dir_path = path.resolve(__dirname, '../');
    let dirs = getDirectories(mods_dir_path);

    //
    // zip each module and output it to modules subdir
    //
    dirs.forEach(dir => {
      let mod_path = path.resolve(__dirname, `modules/${dir}.zip`);
      let output = createWriteStream(mod_path);
      var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      });

      archive.on('error', function(err) {
        throw err;
      });

      archive.pipe(output);
      archive.directory(`${mods_dir_path}/${dir}/`);
      archive.finalize();

      //
      // read in the zip file as base64 and propagate it to the network
      //
      let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
      let zip = readFileSync(mod_path, { encoding: 'base64' });
      newtx.transaction.msg = {
        module: "AppStore",
        request: "submit module",
        name: dir,
        description: "This is an official Saito module",
        module_zip: zip,
      };
      newtx = this.app.wallet.signTransaction(newtx);
      this.app.network.propagateTransaction(newtx);
    });
  }

  initialize(app) {
    super.initialize(app);
  }

  onConfirmation(blk, tx, conf, app) {
    // let appstore = app.modules.returnModule('AppStore');
    let txmsg = tx.returnMessage();
    if (conf == 0) {
      switch(txmsg.request) {
        case 'submit module':
          this.submitModule(blk, tx);
          break;
        case 'add bundle':
          this.addBundle(blk, tx);
          break;
        default:
          break;
      }
    }
  }

  submitModule(blk, tx) {
    let sql = `INSERT INTO modules (name, description, version, publickey, unixtime, bid, bsh, tx)
    VALUES ($name, $description, $version, $publickey, $unixtime, $bid, $bsh, $tx)`;

    let { from, sig, ts } = tx.transaction;
    let { name, description } = tx.returnMessage();

    let params = {
      $name:	name,
      $description:	description,
      $version:	`${ts}-${sig}`,
      $publickey:	from[0].add,
      $unixtime:	ts,
      $bid:	blk.block.id,
      $bsh:	blk.returnHash(),
      $tx:	JSON.stringify(tx.transaction),
    };

    this.app.storage.executeDatabase(sql, params, "appstore");
  }

  addBundle(blk, tx) {
    let sql = `INSERT INTO bundles (version, publickey, unixtime, bid, bsh, script)
    VALUES ($version, $publickey, $unixtime, $bid, $bsh, $script)`;
    let { from, sig, ts, msg } = tx.transaction;
    let params = {
      $version	:	`${ts}-${sig}`,
      $publickey	:	from[0].add ,
      $unixtime	:	ts ,
      $bid		:	blk.block.id ,
      $bsh		:	blk.returnHash() ,
      $script : msg.bundle,
    }
    this.app.storage.executeDatabase(sql, params, "appstore");
  }

  createBundleTX(filename) {
    const path = require('path');
    let fs = this.app.storage.returnFileSystem();
    if (fs) {
      let bundle_base64 = fs.readFileSync(path.resolve(__dirname, `bundler/dist/${filename}`), { encoding: 'base64' });
      let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
      newtx.transaction.msg = { module: "AppStore", request: "add bundle", bundle: bundle_base64 };
      return this.app.wallet.signTransaction(newtx);
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
        const path = require('path');
        //
        // require inclusion of  module versions and paths for loading into the system
        //
        let { versions, paths } = req.body;

        let ts = new Date().getTime();
        let hash = this.app.crypto.hash(versions.join(''));

        let bundle_filename = `saito-${ts}-${hash}.js`;
        let index_filename  = `index-${ts}-${hash}.js`;
        let modules_config_filename = `modules.config-${ts}-${hash}.json`;

        //
        // write our modules config file
        //
        await fs.writeFile(path.resolve(__dirname, `bundler/${modules_config_filename}`),
          JSON.stringify({paths})
        );

        //
        // write our index file for bundling
        //
        let IndexTemplate = require('./bundler/templates/index.template.js');
        await fs.writeFile(path.resolve(__dirname, `bundler/${index_filename}`),
          IndexTemplate(modules_config_filename)
        );

        //
        // TODO: unzip existing modules and stage them
        //

        //
        // execute bundling process
        //
        let entry = path.resolve(__dirname, `bundler/${index_filename}`);
        let output_path = path.resolve(__dirname, 'bundler/dist');

        const util = require('util');
        const exec = util.promisify(require('child_process').exec);

        try {
          const { stdout, stderr } = await exec(
            `node webpack.js ${entry} ${output_path} ${bundle_filename}`
          );
        } catch (err) {
          console.log(err);
        }

        // Done processing

        //
        // file cleanup
        //
        fs.unlink(path.resolve(__dirname, `bundler/${index_filename}`));
        fs.unlink(path.resolve(__dirname, `bundler/${modules_config_filename}`));


        //
        // if there are no errors, send response back
        //
        res.send({
          payload: {
            filename: bundle_filename
          }
        });

        //
        // create tx
        //
        let newtx = this.createBundleTX(bundle_filename);

        //
        // publish our bundle
        //
        this.app.network.propagateTransaction(newtx);

        //
        // delete bundle
        //
        fs.unlink(path.resolve(__dirname, `bundler/dist/${bundle_filename}`));
      });
    }
  }

}




module.exports = AppStore;


