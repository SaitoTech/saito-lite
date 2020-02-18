const ProfileAppspace = require('./lib/email-appspace/profile-appspace');
var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');


class Profile extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Profile";
    this.description    = "BETA module uses circulating transactions on the blockchain to keep profile information publicly circulating";
    this.categories     = "Utilities";


    this.link           = "/email?module=settings";
    this.categories     = "UI Admin Utilities";
    this.description    = "User profile module for Saito";

    this.profile        = this.loadProfile(this.app);
    this.profile_utxo   = "";

    return this;
  }


  initialize(app) {
  }

  respondTo(type) {

    if (type == 'settings-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
	    data.profile = app.modules.returnModule("Profile");
     	    document.getElementById("settings-appspace").innerHTML += '<a class="button" href="/email/?module=profile">View/Edit Profile</a>';
          }
	  obj.attachEvents = function (app, data) {
	    data.profile = app.modules.returnModule("Profile");
     	    //ProfileSettingsAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = function (app, data) {
	    data.profile = app.modules.returnModule("Profile");
     	    ProfileAppspace.render(app, data);
          }
	  obj.attachEvents = function (app, data) {
	    data.profile = app.modules.returnModule("Profile");
     	    ProfileAppspace.attachEvents(app, data);
	  }
      return obj;
    }

    return null;
  }




  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let profile_self = app.modules.returnModule("Profile");

    if (conf == 0) {

      //
      // if transaction is for someone I am following
      //
      if (app.keys.findByPublicKey(tx.transaction.from[0].add) != null) {
	if (txmsg.request == "update identicon") {
	  if (txmsg.identicon != "") {
	    app.keys.updateIdenticon(tx.transaction.from[0].add, txmsg.identicon);
	    try {
	      document.querySelector("profile-avatar").innerHTML = '<img style="max-width:100px;max-height:100px" src="'+txmsg.identicon+'">';
	    } catch (err) {
	    }
	  }
	}
      }
    }
  }



  updatePublicIdenticon(app, identicon) {

    let newtx = app.wallet.createUnsignedTransactionWithDefaultFee(app.wallet.returnPublicKey());
    newtx.transaction.msg = {
      module: "Profile",
      request: "update identicon",
      identicon : identicon ,
    };
    newtx = app.wallet.signTransaction(newtx);
    app.network.propagateTransaction(newtx);

  }


  saveProfile(app) {
    app.options.profile = this.profile;
    app.storage.saveOptions();
  }

  loadProfile(app) {
    if (app.options.profile) {
      return app.options.profile;
    } else {
      return {};
    }
  }


}


module.exports = Profile;

