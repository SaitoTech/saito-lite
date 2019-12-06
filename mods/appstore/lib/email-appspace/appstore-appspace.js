const AppStoreAppspaceTemplate 	  = require('./appstore-appspace.template.js');
const AppStoreAppspacePublish     = require('./appstore-appspace-publish/appstore-publish.js');
const AppStoreAppBoxTemplate      = require('./appstore-app-box.template.js');
const AppStoreAppCategoryTemplate = require('./appstore-app-category.template.js');


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
        (res, data) => {
        if (res.rows != undefined) {
	  this.populateAppsSpace(app, data, res.rows);
	***REMOVED***

  ***REMOVED***);

      //
      // load some categories
      //
      document.querySelector(".appstore-browse-list").innerHTML += AppStoreAppCategoryTemplate({***REMOVED***);

***REMOVED***,

    populateAppsSpace(app, data, rows) {

      document.querySelector(".appstore-app-list").innerHTML = "";
      for (let i = 0; i < rows.length; i++) {
        document.querySelector(".appstore-app-list").innerHTML += AppStoreAppBoxTemplate(app, rows[i]);
  ***REMOVED***

      //
      // make apps installable
      //
      this.attachEventsToModules(app, data);

***REMOVED***,


    attachEventsToModules(app, data) {

      //
      // install module (button)
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
          ***REMOVED***
        ***REMOVED***
            if (replacing_old == 0) {
                module_list.push({ name : app.options.modules[i].name , version : app.options.modules[i].version ***REMOVED***);
        ***REMOVED***
      ***REMOVED***

  ***REMOVED***
  ***REMOVED*** READY TO SUBMIT
  ***REMOVED***
          var newtx = app.wallet.createUnsignedTransactionWithDefaultFee(app.wallet.returnPublicKey(), 0);
          if (newtx == null) { return; ***REMOVED***
          newtx.transaction.msg.module   = "AppStore";
          newtx.transaction.msg.request  = "request bundle";
          newtx.transaction.msg.list	 = module_list;
          newtx = app.wallet.signTransaction(newtx);
          app.network.propagateTransaction(newtx);

          document.querySelector(".email-appspace").innerHTML = `
            <div>
              <center>Your apps are being downloaded. Please do not leave this page</center>
              <center><div class="loader" id="game_spinner"></div></center>
            </div>
          `;

    ***REMOVED***;
  ***REMOVED***);

***REMOVED***,


    attachEvents(app, data) {

      //
      // publish apps
      //
      document.getElementById('appstore-publish-button').onclick = () => {
        AppStoreAppspacePublish.render(app, data);
        AppStoreAppspacePublish.attachEvents(app, data);
  ***REMOVED***

      //
      // search box
      //
      document.getElementById('appstore-search-box').addEventListener('keypress', (e) => {
        let key = e.which || e.keyCode;
        if (key === 13) {
          alert("Search Query: " + e.currentTarget.value);

	  var message             = {***REMOVED***;
    	  message.request         = "appstore search modules";
          message.data		  = e.currentTarget.value;

          app.network.sendRequestWithCallback(message.request, message.data, (res) => {
alert("received data in return");
console.log(JSON.stringify(res));
            if (res.rows != undefined) {
	      this.populateAppsSpace(app, data, res.rows);
	***REMOVED***
	  ***REMOVED***);
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

***REMOVED***
