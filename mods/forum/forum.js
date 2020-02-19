const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const ForumMain = require('./lib/forum-main/forum-main');
const ForumPost = require('./lib/forum-main/forum-post');
const ForumTeaser = require('./lib/forum-main/forum-teaser');
const ForumComment = require('./lib/forum-main/forum-comment');


/**
const h2m = require('h2m');
const fs   = require('fs');
const util = require('util');
const URL  = require('url-parse');
const path = require('path');
const markdown = require( "markdown" ).markdown;
const { exec } = require('child_process');
const linkifyHtml = require('linkifyjs/html');

const request = require('request');
const ImageResolver = require('image-resolver');
const Jimp = require('jimp');
**/




class Forum extends ModTemplate {

  constructor(app) {

    super(app);

    this.name                 = "Forum";

    this.forum                = {};
    this.forum.posts_per_page = 30;
    this.forum.posts	      = [];  // posts and comments
    this.forum.post 	      = "";  // posts and comments
    this.forum.comments       = [];
    this.forum.comment	      = "";
    this.forum.teasers	      = [];
    this.forum.teaser	      = "";
    this.forum.firehose       = 1;   // 1 = show everything / 0 = only friends
    this.forum.filter         = 0;   // 0 = all comments / only from ppl i follow

  }


  updatePostsPerPage(nf) {
    this.forum.posts_per_page = nf;
    this.saveForum();
  }

  updateFilter(nf) {
    this.forum.filter = nf;
    this.saveForum();
  }

  updateFirehose(nf) {
    this.forum.firehose = nf;
    this.saveForum();
  }




  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }

    let forum_self = this;

    //
    // load teasers from server
    //
    this.sendPeerDatabaseRequest("forum", "teasers", "*", "", null, (res, data) => {
      if (res.rows) {
        res.rows.forEach(row => {
console.log("ROW is: " + JSON.stringify(row));
	  let txobj = JSON.parse(row.tx);
          let tx = new saito.transaction(txobj.transaction);
console.log("TX is: " + JSON.stringify(tx));
          forum_self.forum.teasers.push(tx);
        });

console.log("TEASERS is: " + JSON.stringify(forum_self.forum.teasers));


	data = {};
	data.forum = forum_self;

        ForumMain.render(this.app, data);
        ForumMain.attachEvents(this.app, data);

      }
    });
  }





  initializeHTML(app) {

    let data = {};
        data.forum = this;

    ForumMain.render(this.app, data);
    ForumMain.attachEvents(this.app, data);

  }




  webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);

    let forum_self = this;

    expressapp.get('/forum/posts', function (req, res) {
      let tx = new saito.transaction();
          tx.transaction.msg.post_id = "1";
          tx.transaction.msg.title = "This is our title";
          tx.transaction.msg.content = "This is our content";
      res.setHeader('Content-type', 'text/html');
      res.charset = 'UTF-8';
      res.write(JSON.stringify(tx));
      res.end();
      return;
    });
  }


  async handlePeerRequest(app, msg, peer, mycallback) {

    if (msg.request === "forum load teasers") {

      //
      // create fake post
      //
      let newtx = app.wallet.createUnsignedTransaction();
          newtx.transaction.msg.module = "Forum";
          newtx.transaction.msg.type = "post";
          newtx.transaction.msg.post_id = "1";
          newtx.transaction.msg.parent_id = "1";
          newtx.transaction.msg.title = "This is our title";
          newtx.transaction.msg.content = "This is our content";
      newtx = app.wallet.signTransaction(newtx);

      let res = {};
	  res.err = "";
	  res.rows = [];

      res.rows.push({ tx : newtx });

console.log("SENDING: " + JSON.stringify(res.rows));

      mycallback(res);

      return;

    }

    //
    // fall through for other queries
    //
    super.handlePeerRequest(app, msg, peer, mycallback);

  }



  onConfirmation(blk, tx, conf, app) {

    if (app.BROWSER == 0) {
      if (conf == 0) {
        let forum_self = app.modules.returnModule("Forum");
        if (tx.transaction.msg.type == "comment") { forum_self.saveComment(tx); }
        if (tx.transaction.msg.type == "post") { myforum.savePost(tx); }
      }
    }

  }


  savePost(tx) {
    console.log("Saving Post!");
  }

  saveComment(tx) {
    console.log("Saving Comment!");
  }

  saveForum() {
    this.app.options.forum = this.forum;
    this.app.options.forum.forum.posts = [];
    this.app.options.forum.forum.post = "";
    this.app.storage.saveOptions();
  }






  formateDate(unixtime) {

    if (unixtime.toString().length < 13) { return unixtime; }

    x    = new Date(unixtime);
    nowx = new Date();

    y = "";

    if (x.getMonth()+1 == 1) { y += "Jan "; }
    if (x.getMonth()+1 == 2) { y += "Feb "; }
    if (x.getMonth()+1 == 3) { y += "Mar "; }
    if (x.getMonth()+1 == 4) { y += "Apr "; }
    if (x.getMonth()+1 == 5) { y += "May "; }
    if (x.getMonth()+1 == 6) { y += "Jun "; }
    if (x.getMonth()+1 == 7) { y += "Jul "; }
    if (x.getMonth()+1 == 8) { y += "Aug "; }
    if (x.getMonth()+1 == 9) { y += "Sep "; }
    if (x.getMonth()+1 == 10) { y += "Oct "; }
    if (x.getMonth()+1 == 11) { y += "Nov "; }
    if (x.getMonth()+1 == 12) { y += "Dec "; }

    y += x.getDate();

    if (x.getFullYear() != nowx.getFullYear()) {
      y += " ";
      y += x.getFullYear();
    } else {
      if (x.getMonth() == nowx.getMonth() && x.getDate() == nowx.getDate()) {
        am_or_pm = "am";
        tmphour = x.getHours();
        tmpmins = x.getMinutes();

        if (tmphour >= 12) { if (tmphour > 12) { tmphour -= 12; }; am_or_pm = "pm"; }
        if (tmphour == 0) { tmphour = 12; };
        if (tmpmins < 10) {
          y = tmphour + ":0" + tmpmins + " "+am_or_pm;
        } else {
          y = tmphour + ":" + tmpmins + " "+am_or_pm;
        }
      }
    }
    return y;
  }





  formatAuthor(author, msg=null) {

    if (this.app.crypto.isPublicKey(author) != 1) { 
      return author;
    }

    let id = this.app.keys.returnIdentifierByPublicKey(author);

    if (id == "") {
      return author.substring(0, 8) + "...";
    } else {
      return id;
    }
  }

}
module.exports = Forum;













