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

    let fs = app.storage.returnFileSystem();

    if (fs != null) {

      const archiver = require('archiver');
      const path = require('path');

      //
      // get a list of module directories
      //
      const getDirectories = source =>
        fs.readdirSync(source, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name)

      let mods_dir_path = path.resolve(__dirname, '../');
      let dirs = getDirectories(mods_dir_path);

      //
      // zip each module and output it to modules subdir
      //
      dirs.forEach(dir => {

        let mod_path = path.resolve(__dirname, `modules/${dir}.zip`);
        let output = fs.createWriteStream(mod_path);

        var archive = archiver('zip', {
          zlib: { level: 9 } // Sets the compression level.
        });

        archive.on('error', function(err) {
          throw err;
        });

        archive.pipe(output);

        //
        // recursively go through and find all files in dir
        //
        function getFiles(dir) {
          const dirents = fs.readdirSync(dir, { withFileTypes: true });
          const files = dirents.map((dirent) => {
            const res = path.resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
          });
          return Array.prototype.concat(...files);
        }

        let file_array = getFiles(`${mods_dir_path}/${dir}/`);

        //
        // append them to the archiver
        //
        file_array.forEach(file => {
          let fileReadStream = fs.createReadStream(file);
          let pathBasename = path.basename(file);
          archive.append(fileReadStream, { name: pathBasename});
        });

        archive.finalize();
      });

      //
      // introduce a second loop to avoid data races with archiver
      //
      dirs.forEach(dir => {
        let mod_path = path.resolve(__dirname, `modules/${dir}.zip`);
        //
        // read in the zip file as base64 and propagate it to the network
        //
        let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
        let zip = fs.readFileSync(mod_path, { encoding: 'base64' });

        newtx.transaction.msg = {
          module: "AppStore",
          request: "submit module",
          zip: zip,
        };

        newtx = this.app.wallet.signTransaction(newtx);
        this.app.network.propagateTransaction(newtx);
      });

    }
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
        case 'request bundle':
          this.requestBundle(blk, tx);
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

    // should happen locally from ZIP
    let { zip } = tx.returnMessage();

    let name    = "Module Name";
    let description = "Module Description"

    let params = {
      $name:		name,
      $description:	description,
      $version:		`${ts}-${sig}`,
      $publickey:	from[0].add,
      $unixtime:	ts,
      $bid:		blk.block.id,
      $bsh:		blk.returnHash(),
      $tx:		JSON.stringify(tx.transaction),
    };

    this.app.storage.executeDatabase(sql, params, "appstore");
  }


  async requestBundle(blk, tx) {

    let sql = '';
    let params = '';
    let txmsg = tx.returnMessage();
    let module_list = txmsg.list;

console.log("request bundle: " + JSON.stringify(module_list));

    //
    // module list = [
    //   { name : "Email" , version : "" } ,
    //   { name : "", version : "1830591927-AE752CDF7529E0419C2E13ABCCD6ABCA252313" }
    // ]
    //
    let module_names = [];
    let module_versions = [];
    let modules_selected = [];

    for (let i = 0; i < module_list.length; i++) {
      if (module_list[i].version != "") {
	module_versions.push(module_list[i].version);
      } else {
	if (module_list[i].name != "") {
	  module_names.push(module_list[i].name);
        }
      }
    }

console.log("VER: " + JSON.stringify(module_versions));
console.log("NAMES: " + JSON.stringify(module_names));

    //
    // TO-DO single query, not loop
    //
    for (let i = 0; i < module_versions.length; i++) {
      sql = `SELECT * FROM modules WHERE version = $version`;
      params = { $version : module_versions[i] };
      let rows = await this.app.storage.queryDatabase(sql, params, "appstore");

console.log(sql);
console.log(params);
console.log(rows);

      for (let i = 0; i < rows.length; i++) {
        let tx = JSON.parse(rows[i].tx);
        modules_selected.push(
	  {
	    name : rows[i].name ,
	    description : rows[i].description ,
	    zip : tx.msg.zip 
	  }
        );
      }
    }

    //
    // supplement with preferred versions of unversioned apps
    //
    //
    for (let i = 0; i < module_names.length; i++) {
      sql = `SELECT * FROM modules WHERE name = $name`;
      params = { $name : module_names[i] };
      let rows = await this.app.storage.queryDatabase(sql, params, "appstore");

      for (let i = 0; i < rows.length; i++) {
        let tx = JSON.parse(rows[i].tx);
        modules_selected.push(
	  {
	    name : rows[i].name ,
	    description : rows[i].description ,
	    zip : tx.msg.zip 
	  }
        );
      }
    }

console.log("MOD SEL: " + JSON.stringify(modules_selected));

    //
    // modules_selected contains our modules
    //
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK CANT GET ENOUGH OF THIS WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    // WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK WEBPACK
    //
    //
    //


    //
    // insert resulting JS into our bundles database
    //
    sql = `INSERT INTO bundles (version, publickey, unixtime, bid, bsh, script) VALUES ($version, $publickey, $unixtime, $bid, $bsh, $script)`;
    let { from, sig, ts, msg } = tx.transaction;
    params = {
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


