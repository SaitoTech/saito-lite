const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const ArcadeInfoboxAnnouncements = require('./lib/arcade-infobox/arcade-infobox-announcements');

class Announcements extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Announcements";
    this.description = "System and network update notifications for integration with other modules";
    this.categories = "Information Utilities";
    this.announcement = "";

  }



  onPeerHandshakeComplete(app, peer) {

    let announcements_self = app.modules.returnModule("Announcements");
    let arcade_self = app.modules.returnModule("Arcade");

    app.modules.returnModule("Announcements").sendPeerDatabaseRequestWithFilter(

      "Announcements" ,

      `SELECT * FROM announcements ORDER BY id DESC LIMIT 1`,

      (res) => {

        if (res.rows) {
          res.rows.forEach(row => {

            announcements_self.announcement = row.announcement;

	    if (arcade_self.browser_active == 1) { 
	      ArcadeInfoboxAnnouncements.render(app, announcements_self);
	      ArcadeInfoboxAnnouncements.attachEvents(app, announcements_self);
	    }

          });
        }
      }
    );
  }



  async onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let announcements_self = app.modules.returnModule("Announcements");

    if (conf == 0) {

      if (txmsg.module == "Announcements") {

        let announcement = txmsg.announcement;
	let created_at = new Date().getTime();

        if (announcement != undefined) {

          //
          // insert into invites
          //
          let sql = `INSERT INTO announcements (
                announcement ,
                publickey ,
                tx ,
                created_at ,
              ) VALUES (
                $annoucement ,
                $publickey ,
                $tx ,
                $created_at ,
              )`;
          let params = {
            $announcement: announcement ,
            $publickey: tx.transaction.from[0].add ,
            $tx: JSON.stringify(tx.transaction) ,
            $created_at: created_at,
          };
          await app.storage.executeDatabase(sql, params, "announcements");

        }
      }
    }
  }




  respondTo(type = "") {
    if (type == "arcade-infobox") {
      let obj = {};
      obj.render = this.renderArcadeInfobox;
      obj.attachEvents = this.attachEventsArcadeInfobox;
      return obj;
    }
    return null;
  }
  renderArcadeInfobox(app, mod) {
    ArcadeInfoboxAnnouncements.render(app, app.modules.returnModule("Announcements"));
  }
  attachEventsArcadeInfobox(app, mod) {
    ArcadeInfoboxAnnouncements.attachEvents(app, app.modules.returnModule("Announcements"));
  }

}

module.exports = Announcements;

