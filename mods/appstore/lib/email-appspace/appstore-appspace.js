const AppStoreAppspaceTemplate 	  = require('./appstore-appspace.template.js');
const AppStoreAppspacePublish     = require('./appstore-appspace-publish/appstore-publish.js');
const AppStoreAppBoxTemplate      = require('./appstore-app-box.template.js');
const AppStoreAppCategoryTemplate = require('./appstore-app-category.template.js');


module.exports = AppStoreAppspace = {

    render(app, data) {

      let appstore_self = this;

      document.querySelector(".email-appspace").innerHTML = AppStoreAppspaceTemplate();

      //
      // fetch modules from appstore
      //
      data.appstore.sendPeerDatabaseRequest(
        "appstore", "modules", "name, description, version, publickey, unixtime, bid, bsh",
        "",
        null,
        function(res, data) {
        if (res.rows != undefined) {
          for (let i = 0; i < res.rows.length; i++) {
            document.querySelector(".appstore-app-list").innerHTML += AppStoreAppBoxTemplate(app, res.rows[i]);
          }
        }

        appstore_self.attachEvents(app, data);
      });

      //
      // load some categories
      //
      document.querySelector(".appstore-browse-list").innerHTML += AppStoreAppCategoryTemplate({});

    },

    attachEvents(app, data) {

      document.getElementById('appstore-publish-button').onclick = () => {
        AppStoreAppspacePublish.render(app, data);
        AppStoreAppspacePublish.attachEvents(app, data);
      }


      //
      // Create Game
      //
      Array.from(document.getElementsByClassName("appstore-app-install-btn")).forEach(installbtn => {

        installbtn.onclick = (e) => {

          let module_obj = JSON.parse(app.crypto.base64ToString(e.currentTarget.id));

          let module_list = [];
              module_list.push(module_obj);
          for (let i = 0; i < app.options.modules.length; i++) {
            let replacing_old = 0;
            for (let z = 0; z < module_list.length; z++) {
              if (module_obj.name != "" && module_list[z].name != module_obj.name) {
                replacing_old = 1;
              }
            }
            if (replacing_old == 0) {
                module_list.push({ name : app.options.modules[i].name , version : app.options.modules[i].version });
            }
          }

          //
          // READY TO SUBMIT
          //
          var newtx = app.wallet.createUnsignedTransactionWithDefaultFee(app.wallet.returnPublicKey(), 0);
          if (newtx == null) { return; }
          newtx.transaction.msg.module   = "AppStore";
          newtx.transaction.msg.request  = "request bundle";
          newtx.transaction.msg.list	 = module_list;
          newtx = app.wallet.signTransaction(newtx);
          app.network.propagateTransaction(newtx);

        };
      });
    }

}
