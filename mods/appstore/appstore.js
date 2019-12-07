var ModTemplate;
try {
  ModTemplate = require('ModTemplate');
} catch {
  ModTemplate = require('../../lib/templates/modtemplate');
}
const AppStoreAppspace = require('./lib/email-appspace/appstore-appspace');
const AppStoreBundleConfirm = require('./lib/email-appspace/appstore-bundle-confirm');

const fs = require('fs');
const path = require('path');

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

class AppStore extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;
    this.name = "AppStore";
    this.featured_apps = ['Email','Testing','Escrow','Design'];
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
  }
  attachEventsEmail(app, data) {
     data.appstore = app.modules.returnModule("AppStore");
     AppStoreAppspace.attachEvents(app, data);
  }



  //
  // database queries inbound here
  //
  async handlePeerRequest(app, message, peer, mycallback=null) {

    if (message.request === "appstore load modules") {

      let sql = "SELECT name, description, version, publickey, unixtime, bid, bsh FROM modules WHERE featured = 1";
      let params = {};
      let rows = await this.app.storage.queryDatabase(sql, params, message.data.dbname);

      let res = {};
          res.err = "";
          res.rows = rows;

      mycallback(res);

    }


    if (message.request === "appstore search modules") {

      let squery1 = "%"+message.data+"%";
      let squery2 = message.data;

      let sql = "SELECT name, description, version, publickey, unixtime, bid, bsh FROM modules WHERE description LIKE $squery1 OR name = $squery2";
      let params = {
	$squery1	: squery1  ,
	$squery2	: squery2  ,
      };

      let rows = await this.app.storage.queryDatabase(sql, params, "appstore");

      let res = {};
          res.err = "";
          res.rows = rows;

      mycallback(res);

    }


  }


  //
  // publish modules into database on module install
  //
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

      if (!fs.existsSync(path.resolve(__dirname, `mods`))){
        fs.mkdirSync(path.resolve(__dirname, `mods`));
      }

      //
      // zip each module and output it to modules subdir
      //
      dirs.forEach(dir => {

        let mod_path = path.resolve(__dirname, `mods/${dir}.zip`);
        let output = fs.createWriteStream(mod_path);

        var archive = archiver('zip', {
          zlib: { level: 9 } // Sets the compression level.
        });

        archive.on('error', function(err) {
          throw err;
        });

        archive.pipe(output);

        let file_array = getFiles(`${mods_dir_path}/${dir}/`);

        //
        // append them to the archiver
        //
        file_array.forEach(file => {
          let fileReadStream = fs.createReadStream(file);
          var fileArray = path.relative(process.cwd(), file).split('/');
          fileArray.splice(0,2);
          let filename = fileArray.join('/');
          // let pathBasename = path.basename(file);
          archive.append(fileReadStream, { name: filename });
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {

          let mod_zip_filename = path.basename(this.path);
          let mod_path = path.resolve(__dirname, `mods/${mod_zip_filename}`);
          // let zip_text = fs.readFileSync(mod_path, 'utf-8');
          // let name, description = this.getNameAndDescriptionFromZip(zip_text);
          //
          // read in the zip file as base64 and propagate it to the network
          //
          let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
          let zip = fs.readFileSync(mod_path, { encoding: 'binary' });

          newtx.transaction.msg = {
            module: "AppStore",
            request: "submit module",
            zip,
            name: dir,
          };

          newtx = app.wallet.signTransaction(newtx);
          app.network.propagateTransaction(newtx);
        });

        archive.finalize();
      });

    }
  }

  initialize(app) {
    super.initialize(app);
  }


  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    if (conf == 0) {

      switch(txmsg.request) {
        case 'submit module':
          this.submitModule(blk, tx);
          break;
        case 'request bundle':
          this.requestBundle(blk, tx);
          break;
        case 'receive bundle':
          if (tx.isTo(app.wallet.returnPublicKey()) && !tx.isFrom(app.wallet.returnPublicKey())) {
            this.receiveBundle(blk, tx);
          }
          break;
      }
    }
  }


  async getNameAndDescriptionFromZip(zip_bin, zip_path) {

    const fs = this.app.storage.returnFileSystem();
    const path = require('path');
    const unzipper = require('unzipper');

    fs.writeFileSync(path.resolve(__dirname, zip_path), zip_bin, { encoding: 'binary' });

    let name = 'Unknown Module';
    let description = 'unknown';

    try {
      const directory = await unzipper.Open.file(path.resolve(__dirname, zip_path));
      // const file =
      let promises = directory.files.map(async file => {
        let content = await file.buffer();
        let zip_text = content.toString('utf-8')

        //
        // get name and description
        let getNameRegex = RegExp('[\n\r]*this.name\s*([^\n\r]*)');
        let getDescriptionRegex = RegExp('[\n\r]*this.description\s*([^\n\r]*)');
        let cleanupRegex = RegExp('=(.*)');

        let nameMatch = zip_text.match(getNameRegex);
        let descriptionMatch = zip_text.match(getDescriptionRegex);

        if (!nameMatch) { return; }
        if (nameMatch[1].length > 30) { return; }
        if (nameMatch[1] == "this.name\s*([^\n\r]*)');") { return; }

        function cleanString(str) {
          str = str.substring(1, str.length - 1);
          return [...str].map(char => {
            if (char == "\'" || char == "\"" || char == ";") return ''
            return char
          }).join('');
        }

        let nameCleanup = nameMatch[1].match(cleanupRegex);
        if (!nameCleanup) { return; }
        name = cleanString(nameCleanup[1]);

        if (!descriptionMatch) { return; }
        let descriptionCleanup = descriptionMatch[1].match(cleanupRegex);
        if (!descriptionCleanup) { return; }
        description = cleanString(descriptionCleanup[1]);

      });

      await Promise.all(promises);
    } catch(err) {
      console.log(err);
    }

    //
    // delete unziped module
    //
    fs.unlink(path.resolve(__dirname, zip_path));

    return { name, description };
  }


  async submitModule(blk, tx) {

    if (this.app.BROWSER == 1) { return; }

    let sql = `INSERT INTO modules (name, description, version, publickey, unixtime, bid, bsh, tx, featured)
    VALUES ($name, $description, $version, $publickey, $unixtime, $bid, $bsh, $tx, $featured)`;

    let { from, sig, ts } = tx.transaction;

    // should happen locally from ZIP
    let { zip } = tx.returnMessage();

    let { name, description } = await this.getNameAndDescriptionFromZip(zip, `mods/module-${sig}-${ts}.zip`);

    let params = {
      $name: name,
      $description	: description || '',
      $version		: `${ts}-${sig}`,
      $publickey	: from[0].add,
      $unixtime		: ts,
      $bid		: blk.block.id,
      $bsh		: blk.returnHash(),
      $tx		: JSON.stringify(tx.transaction),
      $featured		: 0,
    };
    await this.app.storage.executeDatabase(sql, params, "appstore");


    if (this.featured_apps.includes(name) && tx.isFrom(this.app.wallet.returnPublicKey())) {

      sql = "UPDATE modules SET featured = 0 WHERE name = $name";
      params = { $name : name };
      await this.app.storage.executeDatabase(sql, params, "appstore");

      sql = "UPDATE modules SET featured = 1 WHERE name = $name AND version = $version";
      params = {
        $name : name,
        $version : `${ts}-${sig}`,
      };
      await this.app.storage.executeDatabase(sql, params, "appstore");

    }


  }




  async requestBundle(blk, tx) {

    if (this.app.BROWSER == 1) { return; }

    let sql = '';
    let params = '';
    let txmsg = tx.returnMessage();
    let module_list = txmsg.list;

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

    //
    // TO-DO single query, not loop
    //
    for (let i = 0; i < module_versions.length; i++) {
      sql = `SELECT * FROM modules WHERE version = $version`;
      params = { $version : module_versions[i] };
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
    let bundle_filename = await this.bundler(modules_selected);


    //
    // insert resulting JS into our bundles database
    //
    let bundle_binary = fs.readFileSync(path.resolve(__dirname, `bundler/dist/${bundle_filename}`), { encoding: 'binary' });

    //
    // show link to bundle or save in it? Should save it as a file
    //
    sql = `INSERT INTO bundles (version, publickey, unixtime, bid, bsh, name, script) VALUES ($version, $publickey, $unixtime, $bid, $bsh, $name, $script)`;
    let { from, sig, ts } = tx.transaction;
    params = {
      $version		:	`${ts}-${sig}`,
      $publickey	:	from[0].add,
      $unixtime		:	ts,
      $bid		:	blk.block.id ,
      $bsh		:	blk.returnHash(),
      $name		: 	bundle_filename,
      $script 		: 	bundle_binary,
    }
    await this.app.storage.executeDatabase(sql, params, "appstore");

    //
    //
    //
    let online_version = "http://"+this.app.options.server.endpoint.host+":"+this.app.options.server.endpoint.port+"/appstore/bundle/"+bundle_filename;

console.log(bundle_filename + " -- " + online_version);

    //
    // send our filename back at our person of interest
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(from[0].add);
    let msg = {
      module: "AppStore",
      request: "receive bundle",
      bundle: online_version
    };
    newtx.transaction.msg = msg;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  }



  async bundler(modules) {

    //
    // modules has name, description, zip (helpful)
    //
    // require inclusion of  module versions and paths for loading into the system
    //

    const fs = this.app.storage.returnFileSystem();
    const path = require('path');
    const unzipper = require('unzipper');

    let ts = new Date().getTime();
    let hash = this.app.crypto.hash(modules.map(mod => mod.version).join(''));

    //
    // first
    //
    let modules_config_filename = `modules.config-${ts}-${hash}.json`;

    let module_paths = modules.map(mod => {
      let mod_path = `mods/${mod.name.toLowerCase()}-${ts}-${hash}.zip`;
      fs.writeFileSync(path.resolve(__dirname, mod_path), mod.zip, { encoding: 'binary' });
      fs.createReadStream(path.resolve(__dirname, mod_path))
        .pipe(unzipper.Extract({
          path: path.resolve(__dirname, `bundler/mods/${mod.name.toLowerCase()}-${ts}-${hash}`)
        }));

      //
      // delete the other files
      //
      fs.unlink(path.resolve(__dirname, mod_path));

      // return the path
      return `appstore/bundler/mods/${mod.name.toLowerCase()}-${ts}-${hash}/${mod.name.toLowerCase()}`;
    });

    //
    // write our modules config file
    //
    await fs.writeFile(path.resolve(__dirname, `../../bundler/${modules_config_filename}`),
      JSON.stringify({ mod_paths: module_paths })
    );

console.log("Module Paths: " + JSON.stringify(module_paths));

    //
    // other filenames
    //
    let bundle_filename = `saito-${ts}-${hash}.js`;
    let index_filename  = `index-${ts}-${hash}.js`;

    //
    // write our index file for bundling
    //
    let IndexTemplate = require('./bundler/templates/index.template.js');
    await fs.writeFile(path.resolve(__dirname, `../../bundler/${index_filename}`),
      IndexTemplate(modules_config_filename)
    );

    //
    // execute bundling process
    //
    let entry = path.resolve(__dirname, `../../bundler/${index_filename}`);
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

    //
    // cleanup
    //
    fs.unlink(path.resolve(__dirname, `bundler/${index_filename}`));
    fs.unlink(path.resolve(__dirname, `bundler/${modules_config_filename}`));


    //
    // create tx
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    let bundle_bin = "";
    if (fs) { bundle_bin = fs.readFileSync(path.resolve(__dirname, `bundler/dist/${bundle_filename}`), { encoding: 'binary' }); }
    newtx.transaction.msg = { module: "AppStore", request: "add bundle", bundle: bundle_bin };
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

    //
    // delete mods in bundler/mods
    module_paths.forEach(modpath => {
      let mod_dir = modpath.split('/')[3];
      let files = getFiles(path.resolve(__dirname, `bundler/mods/${mod_dir}`));
      files.forEach(file_path => fs.unlink(file_path));
      fs.rmdir(path.resolve(__dirname, `bundler/mods/${mod_dir}`));
    });

    //
    // delete files in root bundler
    try {
      let bundler_dir = path.resolve(__dirname, `../../bundler`);
      let files = getFiles(bundler_dir);
      files.forEach(file_path => fs.unlink(file_path));
    } catch(err) {
      console.log(err);
    }

    return bundle_filename;
  }

  receiveBundle(blk, tx) {

    if (this.app.BROWSER != 1) { return; }

    let txmsg = tx.returnMessage();

      let data = {};
          data.appstore = this;
          data.bundle_appstore_publickey = tx.transaction.from[0].add;
          data.appstore_bundle = txmsg.bundle;

      AppStoreBundleConfirm.render(this.app, data);
      AppStoreBundleConfirm.attachEvents(this.app, data);

  }




  //
  // override webserver to permit module-hosting
  //
  webServer(app, expressapp, express) {

    let fs = app.storage.returnFileSystem();
    if (fs != null) {

      expressapp.use('/'+encodeURI(this.name), express.static(__dirname + "/web"));
      expressapp.get('/appstore/bundle/:filename', async (req, res) => {

console.log("\n\n\nscriptname!");
        let scriptname = req.params.filename;

console.log("REQUEST FOR SCRIPTNAME: " + scriptname);

        let sql = "SELECT script FROM bundles WHERE name = $scriptname";
        let params = {
          $scriptname	:	scriptname
        }
        let rows = await app.storage.queryDatabase(sql, params, "appstore");

// console.log("ROWS: " + JSON.stringify(rows));

        if (rows) {
          if (rows.length > 0) {

            res.setHeader('Content-type', 'text/javascript');
            res.charset = 'UTF-8';
            res.write(rows[0].script);
            res.end();

            return;
          }
        }

        res.setHeader('Content-type', 'text/javascript');
        res.charset = 'UTF-8';
        res.write('alert("Server does not contain your Saito javascript bundle...");');
        res.end();
      });
    }
  }

}




module.exports = AppStore;
