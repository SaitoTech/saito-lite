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
    let where_clause = "";
    if (search_options.category != "" && search_options.category != undefined) {
      where_clause = " WHERE categories LIKE \"%" + search_options.category.replace(/\W/, '') + "%\"";
    }
    if (search_options.search != "" && search_options.search != undefined) {
      if (where_clause == "") { 
	where_clause = " WHERE ";
      } else {
	where_clause += " AND ";
      }
      where_clause += " (name LIKE \"%" + search_options.search.replace(/\W/, '') + "%\" OR description LIKE \"%" + search_options.search.replace(/\W/, '') + "%\" OR version LIKE \"%" + search_options.search + "%\")";
    }
    if (search_options.version != "" && search_options.version != undefined) {
      if (where_clause == "") {
	where_clause = " WHERE ";
      } else {
	where_clause += " AND ";
      }
      where_clause += " version = \"" + search_options.version + "\"";
    }
    let featured = 0; 
    if (search_options.featured == 1) { featured = 1; }
    if (where_clause == "") { 
      where_clause = " WHERE ";
    } else {
      where_clause += " AND ";
    }
    if (featured == 1) {
      where_clause += " featured = 1";
    } else {
      where_clause += " (featured = 1 OR featured = 0) ";
    }

    //
    // form sql query
    //
    console.log("SELECT name, description, version, image, publickey, unixtime, bid, bsh FROM modules " + where_clause);
    let sql_query = ("SELECT name, description, version, image, publickey, unixtime, bid, bsh FROM modules " + where_clause);

    //
    // fetch modules from appstore
    //
console.log("Fetching: " + (new Date().getTime()));
    mod.sendPeerDatabaseRequestWithFilter(

        "AppStore" ,

	sql_query ,

        (res) => {

	try {
          document.querySelector(".appstore-overlay-grid").innerHTML = "";
	} catch (err) {}

console.log("Fetched: " + (new Date().getTime()));

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

		let this_btn = e.currentTarget;
		let app_img = null;
		for (var i = 0; i < this_btn.childNodes.length; i++) {
    		  if (this_btn.childNodes[i].className == "appstore-overlay-app-image") {
		    app_img = this_btn.childNodes[i].style.background;
    		  }    
    		}    

                let module_obj = JSON.parse(app.crypto.base64ToString(e.currentTarget.id));
		let data = {};
                data.module = module_obj;
                data.image = app_img;
                AppStoreAppDetails.render(app, data);
                AppStoreAppDetails.attachEvents(app, data);
	      };
    	    });
          } catch (err) { console.log("error in appstore callback"); }
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
    // developers overlay
    //
//    document.querySelector('.appstore-overlay-developers').onclick = (e) => {
//      window.location = "https://org.saito.tech/developers";
//      return false;
//    };

    //
    // search
    //
    document.getElementById('appstore-search-box').addEventListener('keypress', (e) => {
      let key = e.which || e.keyCode;
      if (key === 13) {
	try {
          document.querySelector(".appstore-overlay-grid").innerHTML = '<div class="game-loader-spinner loader" id="game-loader-spinner"></div>';
	} catch (err) {}
	let options = { search : e.currentTarget.value , category : "" , featured : 0 };
	search_self.render(app, mod, options);	
	search_self.attachEvents(app, mod);	
      }
    });

  }
}

