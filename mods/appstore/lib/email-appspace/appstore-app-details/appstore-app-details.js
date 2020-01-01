let AppstoreAppDetailsTemplate = require('./appstore-app-details.template.js');

module.exports = AppstoreAppDetails = {

  render(app, data) {
    if (!document.querySelector('.appstore-appspace-install-overlay')) {
      document.querySelector('.email-appspace').innerHTML += AppstoreAppDetailsTemplate();
    }
    document.querySelector('.appspace-appstore-container').style.display = "none";
    document.querySelector('.appstore-app-install-overlay').style.display = "block";

    document.querySelector('.appstore-app-install-name').innerHTML = data.module.name;
    document.querySelector('.appstore-app-install-description').innerHTML = data.module.description;
    document.querySelector('.appstore-app-install-version').innerHTML = data.module.version;
    document.querySelector('.appstore-app-install-publickey').innerHTML = data.module.publickey;
    document.querySelector('.appstore-app-install-unixtime').innerHTML = data.module.unixtime;
    document.querySelector('.appstore-app-install-bsh').innerHTML = data.module.bsh;
    document.querySelector('.appstore-app-install-bid').innerHTML = data.module.bid;
  },


  attachEvents(app, data) {

    // remove event listeners
    document.querySelector('.email-detail-left-options').innerHTML = document.querySelector('.email-detail-left-options').innerHTML;
    document.querySelector('#email-form-back-button').onclick = () => {

      document.querySelector('.appstore-app-install-overlay').style.display = "none";
      document.querySelector('.appspace-appstore-container').style.display = "grid";

      document.querySelector('.email-detail-left-options').innerHTML = document.querySelector('.email-detail-left-options').innerHTML;

      let emailmod = app.modules.returnModule("Email");
      if (emailmod) {

        if (!data) { data = {}; }
	data.email = emailmod;
	data.mods = emailmod.mods;
	emailmod.renderMain(app, data);
	emailmod.renderSidebar(app, data);

      }
    }


console.log("ATTACHING EVENTS WITH MODULE: " + data.module);
console.log(JSON.stringify(data.module));

    let dm = data.module;

    document.querySelector('.appstore-app-install-confirm-btn').onclick = () => {

      let module_list = [];
          module_list.push(dm);

      let dmname = dm.name;

console.log("MODULE LIST IS: " + JSON.stringify(module_list));

      //let mods_to_include = app.options.modules.splice(0,5);
      let mods_to_include = app.options.modules;

      //
      // currently can't include a bunch of modules
      //
      for (let i = 0; i < mods_to_include.length; i++) {

        let replacing_old = 0;

        for (let z = 0; z < module_list.length; z++) {

          if (dmname != "") {
	    if (module_list[z].name == mods_to_include[i].name) {
              replacing_old = 1;
            }
          }
        }

        if (replacing_old == 0) {
          module_list.push({ name : mods_to_include[i].name , version : mods_to_include[i].version });
        }
      }


      //
      // READY TO SUBMIT
      //
      var newtx = app.wallet.createUnsignedTransactionWithDefaultFee(app.wallet.returnPublicKey(), 0);
      if (newtx == null) { return; }
      newtx.transaction.msg.module   = "AppStore";
      newtx.transaction.msg.request  = "request bundle";
      newtx.transaction.msg.list     = module_list;
alert("LIST: " + JSON.stringify(module_list));
      newtx = app.wallet.signTransaction(newtx);
      app.network.propagateTransaction(newtx);

      document.querySelector(".email-appspace").innerHTML = `
        <div class="appstore-bundler-install-notice">
          <center style="margin-bottom:20px">Your custom Saito bundle is being compiled. Please do not leave this page -- estimated time to completion 60 seconds.</center>
          <center><div class="loader" id="game_spinner"></div></center>
        </div>
      `;

    }
  }
}

