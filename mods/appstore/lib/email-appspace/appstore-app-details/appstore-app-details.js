let AppstoreAppDetailsTemplate = require('./appstore-app-details.template.js');

module.exports = AppstoreAppDetails = {

  render(app, data) {
    const {el_parser} = data.helpers;
    if (!document.querySelector('.appstore-app-install-overlay'))
      document.querySelector('body').append(el_parser('<div class="appstore-app-install-overlay"></div>'));

    document.querySelector('.appstore-app-install-overlay').innerHTML = AppstoreAppDetailsTemplate(app, data);
    document.querySelector('.appstore-app-install-overlay').style.display = "block";

    //this should not be here - but - it works.
    fitty('.appstore-app-install-name');
  },


  attachEvents(app, data) {

    // remove event listeners
    //document.querySelector('.email-detail-left-options').innerHTML = document.querySelector('.email-detail-left-options').innerHTML;
    document.querySelector('#email-form-back-button').onclick = () => {

      document.querySelector('.appstore-app-install-overlay').style.display = "none";
      document.querySelector('.appspace-appstore-container').style.display = "grid";

      //document.querySelector('.email-detail-left-options').innerHTML = document.querySelector('.email-detail-left-options').innerHTML;

      let emailmod = app.modules.returnModule("Email");
      if (emailmod) {

        if (!data) { data = {}; }
        data.email = emailmod;
        data.mods = emailmod.mods;
        emailmod.renderMain(app, data);
        emailmod.renderSidebar(app, data);

      }
    }

    document.querySelector('.appstore-app-install-overlay').onclick = () => {
      document.querySelector('.appstore-app-install-overlay').style.display = 'none';
    }

    console.log("ATTACHING EVENTS WITH MODULE: " + data.module);
    console.log(JSON.stringify(data.module));

    let dm = data.module;

    document.querySelector('.appstore-app-install-confirm-btn').onclick = () => {

      //remove close event on shim until finished.
      document.querySelector('.appstore-app-install-overlay').onclick = () => { return false;}

      let module_list = [];
      module_list.push(dm);

      let dmname = dm.name;

      console.log("MODULE LIST IS: " + JSON.stringify(module_list));

      //let mods_to_include = app.options.modules.splice(0,5);
      let mods_to_include = [];
      if (app.options.modules) {
        mods_to_include = app.options.modules;
      } else {
alert("ERROR: your wallet does not report having modules. Please reset");
return;
      }

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
          module_list.push({ name: mods_to_include[i].name, version: mods_to_include[i].version });
        }
      }


      //
      // READY TO SUBMIT
      //
      if (app.options.appstore) {
        if (app.options.appstore.default != "") {
          var newtx = app.wallet.createUnsignedTransactionWithDefaultFee(app.options.appstore.default, 0);
          if (newtx == null) { return; }
          newtx.transaction.msg.module = "AppStore";
          newtx.transaction.msg.request = "request bundle";
          newtx.transaction.msg.list = module_list;
          newtx = app.wallet.signTransaction(newtx);
          app.network.propagateTransaction(newtx);

          document.querySelector('.appstore-app-install-overlay').innerHTML = `
            <div class="appstore-bundler-install-notice">
              <center class="appstore-loading-text" style="margin-bottom:20px">Your custom Saito bundle is being compiled. Please do not leave this page -- estimated time to completion 60 seconds.</center>
              <center><div class="loader" id="game_spinner"></div></center>
            </div>
          `;

        } else {

          document.querySelector(".appstore-app-install-overlay").innerHTML = `
            <div class="appstore-bundler-install-notice">
              <center style="margin-bottom:20px">Your wallet does not specify a trusted party to compile your software for you. Please download and compile manually.
            </div>
          `;

        }
      } else {

        document.querySelector(".appstore-app-install-overlay").innerHTML = `
          <div class="appstore-bundler-install-notice">
            <center style="margin-bottom:20px">Your wallet does not specify a trusted party to compile your software for you. Please download and compile manually.
          </div>
        `;

      }
    }
  }
}

