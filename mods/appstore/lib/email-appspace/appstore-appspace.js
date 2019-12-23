const AppStoreAppspaceTemplate 	  = require('./appstore-appspace.template.js');
const AppStoreAppspacePublish     = require('./appstore-appspace-publish/appstore-publish.js');
const AppStoreAppBoxTemplate      = require('./appstore-app-box.template.js');
const AppStoreAppCategoryTemplate = require('./appstore-app-category.template.js');
const AppStoreAppDetails          = require('./appstore-app-details/appstore-app-details.js');


module.exports = AppStoreAppspace = {

    render(app, data) {

      document.querySelector(".email-appspace").innerHTML = AppStoreAppspaceTemplate();

      //
      // fetch modules from appstore
      //
      data.appstore.sendPeerDatabaseRequest(
        "appstore", "modules", "name, description, version, publickey, unixtime, bid, bsh",
        "featured = 1",
        null,
        (res) => {
        if (res.rows != undefined) {
	  this.populateAppsSpace(app, data, res.rows);
	}

      });

      //
      // load some categories
      //
      //document.querySelector(".appstore-browse-list").innerHTML += AppStoreAppCategoryTemplate({});

    },

    populateAppsSpace(app, data, rows) {

      document.querySelector(".appstore-app-list").innerHTML = "";
      for (let i = 0; i < rows.length; i++) {
        document.querySelector(".appstore-app-list").innerHTML += AppStoreAppBoxTemplate(app, rows[i]);
      }

      //
      // make apps installable
      //
      this.attachEventsToModules(app, data);

    },


    attachEventsToModules(app, data) {

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
    },


    attachEvents(app, data) {

      //
      // publish apps
      //
      document.getElementById('appstore-publish-button').onclick = () => {
        AppStoreAppspacePublish.render(app, data);
        AppStoreAppspacePublish.attachEvents(app, data);
      }

      //
      // search box
      //
      document.getElementById('appstore-search-box').addEventListener('click', (e) => {
	e.currentTarget.placeholder = "";
        e.currentTarget.value = "";
      });

      document.getElementById('appstore-search-box').addEventListener('keypress', (e) => {
        let key = e.which || e.keyCode;
        if (key === 13) {

          alert("Search Query: " + e.currentTarget.value);

	  var message             = {};
    	  message.request         = "appstore search modules";
          message.data		  = e.currentTarget.value;

          app.network.sendRequestWithCallback(message.request, message.data, (res) => {
alert("received data in return");
console.log(JSON.stringify(res));
            if (res.rows != undefined) {
	      this.populateAppsSpace(app, data, res.rows);
	    }
	  });
        }
      });
    }

}
