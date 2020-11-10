const AppStoreOverlayTemplate = require('./appstore-overlay.template.js');
const AppStoreOverlayAppTemplate = require('./appstore-overlay-app.template.js');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');
const AppStoreAppDetails = require('./appstore-app-details/appstore-app-details.js');

module.exports = AppStoreAppspace = {

  render(app, mod) {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, AppStoreOverlayTemplate());

    //
    // fetch modules from appstore
    //
    mod.sendPeerDatabaseRequestWithFilter(

        "AppStore" ,

        `SELECT name, description, version, publickey, unixtime, bid, bsh FROM modules WHERE featured = 1` ,

        (res) => {

        if (res.rows != undefined) {
          let installed_apps = [];
          if (app.options.modules) {
            for (let i = 0; i < app.options.modules.length; i++) {
              installed_apps.push(app.options.modules[i].name);
            }
          }
          for (let z = 0; z < res.rows.length; z++) {
            if (installed_apps.includes(res.rows[z].name) || res.rows[z].name == "name" || res.rows[z].name == "Unknown") {
              res.rows.splice(z, 1);
              z--;
            } else {
            }
          }
          try {

	    //
	    // show content
	    //
            document.querySelector(".appstore-overlay-grid").innerHTML = "";
            for (let i = 0; i < res.rows.length; i++) {
              app.browser.addElementToDom(AppStoreOverlayAppTemplate(app, res.rows[i]), "appstore-overlay-grid");
	    }

    	    //
    	    // install module (button)
      	    //
    	    Array.from(document.getElementsByClassName("appstore-overlay-app")).forEach(installbtn => {
      	      installbtn.onclick = (e) => {
                let module_obj = JSON.parse(app.crypto.base64ToString(e.currentTarget.id));
		let data = {};
                data.module = module_obj;
                AppStoreAppDetails.render(app, data);
                AppStoreAppDetails.attachEvents(app, data);
	      };
    	    });

          } catch (err) {
          }
        }
      }
    );
  },



  attachEvents(app, mod) {

    //
    // install module (button)
    //
    Array.from(document.getElementsByClassName("appstore-app-install-btn")).forEach(installbtn => {

      installbtn.onclick = (e) => {
        let module_obj = JSON.parse(app.crypto.base64ToString(e.currentTarget.id));
        data.module = module_obj;
        AppStoreAppDetails.render(app, data);
        AppStoreAppDetails.attachEvents(app, data);
      };
    });

  }

}
