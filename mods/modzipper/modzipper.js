var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Modzipper extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Modzipper";
    this.mods		= ['debug','chess','escrow','imperium','pandemic','poker','roles','testing','twilight','wallet','wordblocks'];

    this.zipped_and_submitted = 0;

    return this;
  }




  installModule(app) {

    let modzipper_self = app.modules.returnModule("Modzipper");

    if (app.BROWSER != 0) { return; }

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


console.log("installing " + dir);

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

console.log("ZIPPED MODULE: " + JSON.stringify(newtx.transaction));

      this.app.network.propagateTransaction(newtx);
    });

  }
}


module.exports = Modzipper;

