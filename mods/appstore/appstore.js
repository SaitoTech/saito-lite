const saito = require('../../lib/saito/saito');
const helpers = require('../../lib/helpers/index');
const ModTemplate = require('../../lib/templates/modtemplate');
const EmailAppStore = require('./lib/email-appspace/appstore-appspace');
const AppStoreOverlay = require('./lib/appstore-overlay/appstore-overlay');
const AppStoreBundleConfirm = require('./lib/appstore-overlay/appstore-bundle-confirm');
const AppStoreModuleIndexedConfirm = require('./lib/appstore-overlay/appstore-module-indexed-confirm');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const fs = require('fs');
const path = require('path');



class AppStore extends ModTemplate {

  constructor(app) {
    super(app);

    this.app = app;

    this.name          = "AppStore";
    this.description   = "Application manages installing, indexing, compiling and serving Saito modules.";
    this.categories    = "Utilities Dev";
    this.featured_apps = ['Polkadot','Kusama', 'Westend', 'Design', 'Debug', 'Midnight', 'Hearts', 'Settlers', 'President', 'Scotland'];
    this.header        = null;

    this.bundling_timer = null;
    this.renderMode    = "none";
    this.search_options = {};

  }


  //
  // appstore upload is in email
  //
  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
      obj.render = this.renderEmail;
      obj.attachEvents = this.attachEventsEmail;
      obj.script = '<link ref="stylesheet" href="/appstore/css/email-appspace.css" />';
      return obj;
    }
    return null;
  }
  renderEmail(app, mod) {
    appstore_mod = app.modules.returnModule("AppStore");
    EmailAppStore.render(app, appstore_mod);
  }
  attachEventsEmail(app, mod) {
    appstore_mod = app.modules.returnModule("AppStore");
    EmailAppStore.attachEvents(app, appstore_mod);
  }




  //
  // click-to-access overlay access
  //
  initializeHTML(app) {

    super.initializeHTML(app);

    if (this.header == null) {
      this.header = new SaitoHeader(app, this);
    }
    this.header.render(app, this);
    this.header.attachEvents(app, this);

  }
  handleUrlParams(urlParams) {
    let i = urlParams.get('app');
    if (i) {
      let search_options = {};
	  search_options.version = i;
      this.search_options = search_options;
      this.renderMode = "standalone";
    }
  }
  onPeerHandshakeComplete(app, mod) {
    if (this.renderMode == "standalone") {
      AppStoreOverlay.render(this.app, this, this.search_options);
      AppStoreOverlay.attachEvents(this.app, this);
    }
  }


  //
  // database queries inbound here
  //
  async handlePeerRequest(app, message, peer, mycallback = null) {

    super.handlePeerRequest(app, message, peer, mycallback);

    if (message.request === "appstore search modules") {

      let squery1 = "%" + message.data + "%";
      let squery2 = message.data;

      let sql = "SELECT name, description, version, categories, publickey, unixtime, bid, bsh FROM modules WHERE description LIKE $squery1 OR name = $squery2";
      let params = {
        $squery1: squery1,
        $squery2: squery2,
      };

console.log(sql);
console.log(JSON.stringify(params));

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
  async installModule(app) {

    if (this.app.BROWSER == 1) { return; }

    await super.installModule(app);

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

      if (!fs.existsSync(path.resolve(__dirname, `mods`))) {
        fs.mkdirSync(path.resolve(__dirname, `mods`));
      }

      //
      // zip each module and output it to modules subdir
      //
      dirs.forEach(dir => {

console.log("##########################");
console.log("processing: " + dir);
console.log("##########################");

        let mod_path = path.resolve(__dirname, `mods/${dir}.zip`);
        let output = fs.createWriteStream(mod_path);

        var archive = archiver('zip', {
          zlib: { level: 9 } // Sets the compression level.
        });

        archive.on('error', function (err) {
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
          fileArray.splice(0, 2);
          let filename = fileArray.join('/');
          // let pathBasename = path.basename(file);
          archive.append(fileReadStream, { name: filename });
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function () {

          let mod_zip_filename = path.basename(this.path);
          let mod_path = path.resolve(__dirname, `mods/${mod_zip_filename}`);
          let newtx = app.wallet.createUnsignedTransactionWithDefaultFee();
          let zip = fs.readFileSync(mod_path, { encoding: 'base64' });

	  //
	  // TODO - fix 
	  //
	  // massive zip files bypassing tx size limits cause issues with 
	  // some versions of NodeJS. In others they over-size and fail
	  // elegantly. adding this check to prevent issues with server
	  // on start, particularly with Red Imperium.
	  //
	  if (zip.length <= 30000000) {

            newtx.msg = {
              module: "AppStore",
              request: "submit module",
              module_zip: zip,
              name: dir,
            };

            newtx = app.wallet.signTransaction(newtx);
            app.network.propagateTransaction(newtx);

	  }

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

      switch (txmsg.request) {
        case 'submit module':
          this.submitModule(blk, tx);
	  if (tx.isFrom(app.wallet.returnPublicKey())) {
            try {
              document.querySelector(".appstore-loading-text").innerHTML = "Your application is being broadcast to the network. <p></p>Your AppStore should receive it within <span class=\"time_remaining\">45</span> seconds.";
              let appstore_mod = app.modules.returnModule("AppStore");
              appstore_mod.time_remaining = 45;
              appstore_mod.bundling_timer = setInterval(() => {
                if (appstore_mod.time_remaining <= 0) {
                  clearInterval(appstore_mod.bundling_timer);
		  AppStoreModuleIndexedConfirm.render(appstore_mod.app, appstore_mod);
		  AppStoreModuleIndexedConfirm.attachEvents(appstore_mod.app, appstore_mod);
                } else {
                  appstore_mod.time_remaining--;
                  if (appstore_mod.time_remaining >= 1) {
                    try {
                      document.querySelector(".time_remaining").innerHTML = appstore_mod.time_remaining;
                    } catch (err) {
                      clearInterval(appstore_mod.bundling_timer);
                    }
                  }
                }
              }, 1000);

            } catch (err) {
            }
	  }
          break;
        case 'request bundle':
          if (tx.isFrom(app.wallet.returnPublicKey())) {
            try {
              document.querySelector(".appstore-loading-text").innerHTML = "Your application is being processed by the network. Your upgrade should be complete within about <span class=\"time_remaining\">120</span> seconds.";
	      let appstore_mod = app.modules.returnModule("AppStore");
	      appstore_mod.time_remaining = 120;
	      appstore_mod.bundling_timer = setInterval(() => {
		if (appstore_mod.time_remaining < 0) {
		  clearInterval(appstore_mod.bundling_timer);
		} else {
		  appstore_mod.time_remaining--;
		  if (appstore_mod.time_remaining >= 0) {
		    try {
	 	      document.querySelector(".time_remaining").innerHTML = appstore_mod.time_remaining;
		    } catch (err) {
		      clearInterval(appstore_mod.bundling_timer);
		    }
		  }
		}
	      }, 1000);

            } catch (err) {
            }
          }
          if (!tx.isTo(app.wallet.returnPublicKey())) { 
	    return; 
	  }
          this.requestBundle(blk, tx);
          break;
        case 'receive bundle':
          if (tx.isTo(app.wallet.returnPublicKey()) && !tx.isFrom(app.wallet.returnPublicKey())) {
            console.log("##### BUNDLE RECEIVED #####");
            //
            // 
            //
            if (app.options.appstore) {
              if (app.options.appstore.default != "") {
                if (tx.isFrom(app.options.appstore.default)) {
                  this.receiveBundle(blk, tx);
                }
              }
            }
          }
          break;
      }
    }
  }



  async getNameAndDescriptionFromZip(zip_bin, zip_path) {

    const fs = this.app.storage.returnFileSystem();
    const path = require('path');
    const unzipper = require('unzipper');

    //
    // convert base64 to vinary
    //
    let zip_bin2 = Buffer.from(zip_bin, 'base64').toString('binary');

    fs.writeFileSync(path.resolve(__dirname, zip_path), zip_bin2, { encoding: 'binary' });

    let name = 'Unknown Module';
    let image = "";
    let description = 'unknown';
    let categories = 'unknown';

    try {

      const directory = await unzipper.Open.file(path.resolve(__dirname, zip_path));

      let promises = directory.files.map(async file => {

        if (file.path === "web/img/arcade.jpg") {
          let content = await file.buffer();
          image = "data:image/jpeg;base64," + content.toString('base64')
	}
        if (file.path === "web/img/saito_icon.jpg") {
          let content = await file.buffer();
          image = "data:image/jpeg;base64," + content.toString('base64')
	}

        if (file.path.substr(0,3) == "lib") { return; }
        if (file.path.substr(-2) !== "js") { return; }
        //if (file.path.substr(2).indexOf("/") > -1) { return; }
        if (file.path.indexOf("web/") > -1) { return; }
        if (file.path.indexOf("www/") > -1) { return; }
        if (file.path.indexOf("lib/") > -1) { return; }
        if (file.path.indexOf("license/") > -1) { return; }
        if (file.path.indexOf("docs/") > -1) { return; }
        if (file.path.indexOf("sql/") > -1) { return; }

        let content = await file.buffer();
        let zip_text = content.toString('utf-8')
	let zip_lines = zip_text.split("\n");

	let found_name = 0;
	let found_description = 0;
	let found_categories = 0;	

	for (let i = 0; i < zip_lines.length && i < 50 && (found_name == 0 || found_description == 0 || found_categories == 0); i++) {

	  //
	  // get name
	  //
	  if (/this.name/.test(zip_lines[i]) && found_name == 0) {
	    found_name = 1;
	    if (zip_lines[i].indexOf("=") > 0) {
//console.log("FP: " + file.path);
	      name = zip_lines[i].substring(zip_lines[i].indexOf("="));
	      name = cleanString(name);
	      name = name.replace(/^\s+|\s+$/gm,'');
	      if (name.length > 50) { name = "Unknown"; found_name = 0; }
	      if (name === "name") { name = "Unknown"; found_name = 0; }
	    }
	  }

	  //
	  // get description
	  //
	  if (/this.description/.test(zip_lines[i]) && found_description == 0) {
	    found_description = 1;
	    if (zip_lines[i].indexOf("=") > 0) {
	      description = zip_lines[i].substring(zip_lines[i].indexOf("="))    
	      description = cleanString(description);
	      description = description.replace(/^\s+|\s+$/gm,'');
	    }
	  }

	  //
	  // get categories
	  //
	  if (/this.categories/.test(zip_lines[i]) && found_categories == 0) {
	    found_categories = 1;
	    if (zip_lines[i].indexOf("=") > 0) {
	      categories = zip_lines[i].substring(zip_lines[i].indexOf("="))    
	      categories = cleanString(categories);
	      categories = categories.replace(/^\s+|\s+$/gm,'');
	    }
	  }
	}


        function cleanString(str) {
	  str = str.replace(/^\s+|\s+$/gm,'');
          str = str.substring(1, str.length - 1);
          return [...str].map(char => {
            if (char == ' ') { return ' '; }
            if (char == '.') { return '.'; }
            if (char == ',') { return ','; }
            if (char == '!') { return '!'; }
            if (char == '`') { return ''; }
            if (char == "\\" || char == "\'" || char == "\"" || char == ";") { return ''; }
            if (! (/[a-zA-Z0-9_-]/.test(char))) { return ''; }
            return char;
          }).join('');
        }
      });

      await Promise.all(promises);
    } catch (err) {
      console.log("ERROR UNZIPPING: " + err);
    }

    //
    // delete unziped module
    //
    fs.unlink(path.resolve(__dirname, zip_path));
    return { name, image , description, categories };

  }






  async submitModule(blk, tx) {

    if (this.app.BROWSER == 1) { 

      if (tx.isFrom(this.app.wallet.returnPublicKey())) {

        let newtx = this.app.wallet.createUnsignedTransaction();
            newtx.msg.module       = "Email";
            newtx.msg.title        = "Saito Application Published";
            newtx.msg.message      = `

	    <p>
	    Your application has been published with the following APP-ID:
	    </p>

	    <p><br /></p>

	    <p>
	    ${this.app.crypto.hash(tx.transaction.ts + "-" + tx.transaction.sig)}
	    </p>

	    <p><br /></p>

	    <p>
	    Please note: if you have problems installing your application, there may be a problem preventing it from compiling successfully. In these cases, we recommend <a href="https://org.saito.tech/developers">installing Saito</a> and testing locally before deploying to the network. You are welcome to contact the Saito team with questions or problems.
	    </p>

        `;
        newtx = this.app.wallet.signTransaction(newtx);
	let emailmod = this.app.modules.returnModule("Email");
	if (emailmod) {
          emailmod.emails.inbox.push(newtx);
	}
        this.app.storage.saveTransaction(newtx);

      }

      return; 

    }

    let sql = `INSERT OR IGNORE INTO modules (name, description, version, image, categories, publickey, unixtime, bid, bsh, tx, featured) VALUES ($name, $description, $version, $image, $categories, $publickey, $unixtime, $bid, $bsh, $tx, $featured)`;

    let { from, sig, ts } = tx.transaction;

    // should happen locally from ZIP
    let { module_zip } = tx.returnMessage();

    let { name, image, description, categories } = await this.getNameAndDescriptionFromZip(module_zip, `mods/module-${sig}-${ts}.zip`);

console.log("-----------------------------");
console.log("--INSERTING INTO APPSTORE --- " + name);
console.log("-----------------------------");
if (name == "Unknown") {
  console.log(`TROUBLE EXTRACTING: mods/module-${sig}-${ts}.zip`);
  //console.log("ZIP: " + module_zip);
  //process.exit();
}

    let featured_app = 0;
    if (tx.transaction.from[0].add == this.app.wallet.returnPublicKey()) { featured_app = 1; }
    if (featured_app == 1) {
      featured_app = 0;
      if (this.featured_apps.includes(name)) {
	featured_app = 1;
      }
    }

console.log(name + " is included? " + featured_app);

    let params = {
      $name: name,
      $description: description || '',
      $version: this.app.crypto.hash(`${ts}-${sig}`),
      $image: image ,
      $categories: categories,
      $publickey: from[0].add,
      $unixtime: ts,
      $bid: blk.block.id,
      $bsh: blk.returnHash(),
      $tx: JSON.stringify(tx.transaction),
      $featured: featured_app,
    };

    if (name != "unknown") {
      try {
      await this.app.storage.executeDatabase(sql, params, "appstore");
      } catch (err) {}

      if (this.featured_apps.includes(name) && tx.isFrom(this.app.wallet.returnPublicKey())) {

        sql = "UPDATE modules SET featured = 0 WHERE name = $name";
        params = { $name: name };
        await this.app.storage.executeDatabase(sql, params, "appstore");


        sql = "UPDATE modules SET featured = 1 WHERE name = $name AND version = $version";
        params = {
          $name: name,
          $version: this.app.crypto.hash(`${ts}-${sig}`),
        };
        await this.app.storage.executeDatabase(sql, params, "appstore");

      }

    }

  }




  async requestBundle(blk, tx) {

    if (this.app.BROWSER == 1) { return; }

    let sql = '';
    let params = '';
    let txmsg = tx.returnMessage();
    let module_list = txmsg.list;

    //
    // module_list consists of a list of the modules to bundle, these contain a name or 
    // version number (or both) depending on how they were originally issued to the 
    // client.
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
    // unversioned apps (first as default)
    //
    //
    for (let i = 0; i < module_names.length; i++) {
      sql = `SELECT * FROM modules WHERE name = $name`;
      params = { $name: module_names[i] };
      let rows = await this.app.storage.queryDatabase(sql, params, "appstore");

      for (let i = 0; i < rows.length; i++) {
        let tx = JSON.parse(rows[i].tx);
        let { module_zip } = new saito.transaction(tx).returnMessage();
        modules_selected.push(
          {
            name: rows[i].name,
            description: rows[i].description,
            zip: module_zip
          }
        );
      }
    }

    //
    // versioned apps (second as overrules default)
    //
    for (let i = 0; i < module_versions.length; i++) {
      sql = `SELECT * FROM modules WHERE version = $version`;
      params = { $version: module_versions[i] };
      let rows = await this.app.storage.queryDatabase(sql, params, "appstore");

      for (let i = 0; i < rows.length; i++) {
        let tx = JSON.parse(rows[i].tx);
        let { module_zip } = new saito.transaction(tx).returnMessage();
        modules_selected.push(
          {
            name: rows[i].name,
            description: rows[i].description,
            zip: module_zip
          }
        );
      }
    }

    //
    // WEBPACK
    //
    let bundle_filename = await this.bundler(modules_selected);

    //
    // insert resulting JS into our bundles database
    //
    let bundle_binary = fs.readFileSync(path.resolve(__dirname, `./bundler/dist/${bundle_filename}`), { encoding: 'binary' });

    //
    // show link to bundle or save in it? Should save it as a file
    //
    sql = `INSERT OR IGNORE INTO bundles (version, publickey, unixtime, bid, bsh, name, script) VALUES ($version, $publickey, $unixtime, $bid, $bsh, $name, $script)`;
    let { from, sig, ts } = tx.transaction;
    params = {
      $version: this.app.crypto.hash(`${ts}-${sig}`),
      $publickey: from[0].add,
      $unixtime: ts,
      $bid: blk.block.id,
      $bsh: blk.returnHash(),
      $name: bundle_filename,
      $script: bundle_binary,
    }

    await this.app.storage.executeDatabase(sql, params, "appstore");

    //
    //
    //
    let online_version = this.app.options.server.endpoint.protocol + "://" + this.app.options.server.endpoint.host + ":" + this.app.options.server.endpoint.port + "/appstore/bundle/" + bundle_filename;

    //
    // send our filename back at our person of interest
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(from[0].add);
    let msg = {
      module: "AppStore",
      request: "receive bundle",
      bundle: online_version
    };
    newtx.msg = msg;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

  }





  async bundler(modules) {

    //
    // shell access
    //
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);

    //
    // modules has name, description, version, zip
    //
    const fs = this.app.storage.returnFileSystem();
    const path = require('path');
    const unzipper = require('unzipper');

    let ts = new Date().getTime();
    let hash = this.app.crypto.hash(modules.map(mod => mod.version).join(''));

    let bash_script_create = `mods/compile-${ts}-${hash}-create`;
    let bash_script = `mods/compile-${ts}-${hash}`;
    
    let newappdir = `${ts}-${hash}`;

    let bash_script_content = '';
    let bash_script_delete = '';
    let bash_script_create_dirs = '';

    //
    // create and execute script that creates directories
    //
    bash_script_create_dirs = 'cp -rf '  + __dirname + "/../../bundler/default " + __dirname + "/../../bundler/" + newappdir + "\n";
    bash_script_create_dirs += 'rm -f '  + __dirname + "/../../bundler/" + newappdir + "/config/*.js" + "\n";
    bash_script_create_dirs += 'rm -rf ' + __dirname + "/../../bundler/" + newappdir + "/mods" + "\n";
    bash_script_create_dirs += 'mkdir  ' + __dirname + "/../../bundler/" + newappdir + "/mods" + "\n";
    bash_script_create_dirs += 'mkdir  ' + __dirname + "/../../bundler/" + newappdir + "/dist" + "\n";

    fs.writeFileSync(path.resolve(__dirname, bash_script_create), bash_script_create_dirs, { encoding: 'binary' });
    try {
      let cwdir = __dirname;
      let createdir_command = 'sh ' + bash_script_create;
      const { stdout, stderr } = await exec(createdir_command, { cwd: cwdir, maxBuffer: 4096 * 2048 });
    } catch (err) {
      console.log(err);
    }

    bash_script_content += 'cd ' + __dirname + '/mods' + "\n";
    bash_script_delete  += 'cd ' + __dirname + '/mods' + "\n";

    //
    // save MODS.zip and create bash script to unzip
    //
    let module_paths = modules.map(mod => {

      let mod_path = `mods/${returnSlug(mod.name)}-${ts}-${hash}.zip`;


      bash_script_content += `unzip -o ${returnSlug(mod.name)}-${ts}-${hash}.zip -d ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)} \\*.js \\*.css \\*.html \\*.wasm` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/web` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/www` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/sql` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/DESCRIPTION.txt` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/BUGS.txt` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/README.txt` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/README.md` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/install.sh` + "\n";
      bash_script_content += `rm -rf ../../../bundler/${newappdir}/mods/${returnSlug(mod.name)}/license` + "\n";

      bash_script_delete += `rm -rf ${returnSlug(mod.name)}-${ts}-${hash}.zip` + "\n";
      bash_script_delete += `rm -rf ../../bundler/${newappdir}/mods/${returnSlug(mod.name)}` + "\n";

      let zip_bin2 = Buffer.from(mod.zip, 'base64').toString('binary');
      fs.writeFileSync(path.resolve(__dirname, mod_path), zip_bin2, { encoding: 'binary' });
      //return `${returnSlug(mod.name)}-${ts}-${hash}/${returnSlug(mod.name)}`;
      return `${returnSlug(mod.name)}/${returnSlug(mod.name)}.js`;
    });

    bash_script_delete += `rm -f ${__dirname}/mods/compile-${ts}-${hash}-create` + "\n";
    bash_script_delete += `rm -f ${__dirname}/mods/compile-${ts}-${hash}` + "\n";

    //
    // write our modules config file
    //
    let modules_config_filename = `modules.config-${ts}-${hash}.json`;
    await fs.writeFile(path.resolve(__dirname, `../../bundler/${newappdir}/config/${modules_config_filename}`),
      JSON.stringify({ mod_paths: module_paths })
    );

    //
    // other filenames
    //
    let bundle_filename = `saito-${ts}-${hash}.js`;
    let index_filename = `index-${ts}-${hash}.js`;

    //
    // write our index file for bundling
    //
    let IndexTemplate = require('./bundler/templates/index.template.js');
    await fs.writeFile(path.resolve(__dirname, `../../bundler/${newappdir}/config/${index_filename}`),
      IndexTemplate(modules_config_filename)
    );

    //
    // execute bundling process
    //
    let entry = path.resolve(__dirname, `../../bundler/${newappdir}/config/${index_filename}`);
    let output_path = path.resolve(__dirname, `./bundler/dist`);

    bash_script_content += 'cd ' + __dirname + "\n";
    bash_script_content += 'cd ../../' + "\n";
    bash_script_content += `sh bundle.sh ${entry} ${output_path} ${bundle_filename}`;

console.log("COMPILING: " + `sh bundle.sh ${entry} ${output_path} ${bundle_filename}`);

    bash_script_content += "\n";
    bash_script_content += bash_script_delete;

    fs.writeFileSync(path.resolve(__dirname, bash_script), bash_script_content, { encoding: 'binary' });
    try {
      let cwdir = __dirname;
      let bash_command = 'sh ' + bash_script;
      const { stdout, stderr } = await exec(bash_command, { cwd: cwdir, maxBuffer: 4096 * 2048 });
    } catch (err) {
      console.log(err);
    }

console.log(newappdir + " --- " + index_filename + " ------ " + bash_script);

    //
    // create tx
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee();
    let bundle_bin = "";

console.log("Bundle Filename: " + bundle_filename);
console.log("Bundle __dirname: " + __dirname);

    if (fs) { bundle_bin = fs.readFileSync(path.resolve(__dirname, `./bundler/dist/${bundle_filename}`), { encoding: 'binary' }); }
    newtx.msg = { module: "AppStore", request: "add bundle", bundle: bundle_bin };
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);

    //
    // cleanup
    //
    await fs.rmdir(path.resolve(__dirname, `../../bundler/${newappdir}/`), function () {
      console.log("Appstore Compilation Files Removed!");
    });

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

      expressapp.use('/' + encodeURI(this.name), express.static(__dirname + "/web"));
      expressapp.get('/appstore/bundle/:filename', async (req, res) => {

        let scriptname = req.params.filename;

        let sql = "SELECT script FROM bundles WHERE name = $scriptname";
        let params = {
          $scriptname: scriptname
        }
        let rows = await app.storage.queryDatabase(sql, params, "appstore");

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
        res.write(`

	  let x = confirm("Server reports it does not contain your Saito javascript bundle. This can happen across server upgrades with remotely-hosted application bundles. Do you wish to reset to use the server default and update your default AppStore to this server?");
	  if (x) { 

	    try {

	      if (typeof(Storage) !== "undefined") {
	        let options = null;
	        let data = localStorage.getItem("options");
	        if (data) {
	  	  options = JSON.parse(data); 
	          options.appstore = "";
	          options.bundle = "";
	          options.modules = [];
	          localStorage.setItem("options", JSON.stringify(options));
		  window.location.reload(false);
    		}
	      }

	    } catch (err) {
  	      alert("Error attempting to reset to use default Saito: " + err);
	    }
	  }

	`);

        res.end();
      });
    }
  }



  //////////////////
  // UI Functions //
  //////////////////
  openAppstoreOverlay(options) {
    AppStoreOverlay.render(this.app, this, options);
    AppStoreOverlay.attachEvents(this.app, this);
  }


}
module.exports = AppStore;




//
// supporting utility functions
//
// recursively go through and find all files in dir
function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}
function returnSlug(nme) {
  nme = nme.toLowerCase();
  nme = nme.replace(/\t/g, "_");
  return nme;
}
function deleteDirs(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  dirents.forEach((dirent) => {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory() && fs.readdirSync(res).length == 0) {
      fs.rmdirSync(res, { maxRetries: 100, recursive: true });
    } else {
      deleteDirs(res);
      // delete after children have been
      fs.rmdirSync(res, { maxRetries: 100, recursive: true });
    }
  });
}

