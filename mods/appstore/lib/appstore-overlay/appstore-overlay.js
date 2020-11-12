const AppStoreOverlayTemplate = require('./appstore-overlay.template.js');
const AppStoreOverlayAppTemplate = require('./appstore-overlay-app.template.js');
const SaitoOverlay = require('./../../../../lib/saito/ui/saito-overlay/saito-overlay');
const AppStoreAppDetails = require('./appstore-app-details/appstore-app-details.js');

module.exports = AppStoreAppspace = {

  render(app, mod, search_options={}) {

    mod.overlay = new SaitoOverlay(app, mod);
    mod.overlay.render(app, mod);
    mod.overlay.attachEvents(app, mod);

    mod.overlay.showOverlay(app, mod, AppStoreOverlayTemplate());

    //
    // server also performs sanity checks, but we'll do basic ones here too
    //
    let where_clause = ""; if (search_options.category != "") {
      where_clause = " WHERE categories LIKE \"%" + search_options.category.replace(/\W/, '') + "%\"";
    }
    if (search_options.search != "") {
      if (where_clause == "") { 
	where_clause = " WHERE ";
      } else {
	where_clause += " AND ";
      }
      where_clause += " description LIKE \"%" + search_options.search.replace(/\W/, '') + "%\"";
    }
    let featured = 0; if (search_options.featured == 1) { featured = 1; }
    if (where_clause == "") { 
      where_clause = " WHERE ";
    } else {
      where_clause += " AND ";
    }
    if (featured == 1) {
      where_clause += " featured = 1";
    } else {
      where_clause += " featured = 1 OR featured = 0";
    }

    //
    // form sql query
    //
    let sql_query = ("SELECT name, description, version, publickey, unixtime, bid, bsh FROM modules " + where_clause);

console.log(sql_query);

    //
    // fetch modules from appstore
    //
    mod.sendPeerDatabaseRequestWithFilter(

        "AppStore" ,

	sql_query ,

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

    search_self = this;

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

    //
    // search box
    //
    document.getElementById('appstore-search-box').addEventListener('focus', (e) => {
      e.currentTarget.placeholder = "";
      e.currentTarget.value = "";
    });

    //
    // search
    //
    document.getElementById('appstore-search-box').addEventListener('keypress', (e) => {
      let key = e.which || e.keyCode;
      if (key === 13) {

        alert("Search Query: " + e.currentTarget.value);

	let options = { search : e.currentTarget.value , category : "" , featured : 0 };
	search_self.render(app, mod, options);	

      }
    });



  }

}
