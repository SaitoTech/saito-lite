const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const ForumMain = require('./lib/forum-main/forum-main');
const ForumRightSidebar = require('./lib/forum-right-sidebar/forum-right-sidebar');
const ForumLeftSidebar = require('./lib/forum-left-sidebar/forum-left-sidebar');
const ForumTeaser = require('./lib/forum-main/forum-teaser');
const ForumPost = require('./lib/forum-main/forum-post');
const ForumComment = require('./lib/forum-main/forum-comment');

const Header = require('../../lib/ui/header/header');
const AddressController = require('../../lib/ui/menu/address-controller');

const fs = require('fs');
//const request = require('request');





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


    this.icon_fa = "far fa-comment-alt";
    this.mods                 = [];

    this.view_forum        = "main";
    this.view_post_id      = "";
    this.view_offset  = 0;

  }



  respondTo(type = "") {
    if (type == "header-dropdown") {
      return {};
    }
    return null;
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



  createPostTransaction(title, content, link="", forum="", post_id="", comment_id="", parent_id="") {

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();

    //
    // arcade will listen, but we need game engine to receive to start initialization
    //
    tx.transaction.msg.module     = "Forum";
    tx.transaction.msg.type       = "post";

    tx.transaction.msg.post_id    = post_id;
    tx.transaction.msg.comment_id = comment_id;
    tx.transaction.msg.parent_id  = parent_id;
    tx.transaction.msg.forum      = forum;
    tx.transaction.msg.title      = title;
    tx.transaction.msg.content    = content;
    tx.transaction.msg.link       = link;

    tx = this.app.wallet.signTransaction(tx);

    return tx;
 
  }

  async receivePostTransaction(tx) {

    if (this.app.BROWSER == 1) { return; }

    let txmsg = tx.returnMessage();
    let post_id = tx.transaction.sig;
    if (tx.transaction.msg.post_id != "") { post_id = tx.transaction.msg.post_id; }

    let check_sql = "SELECT id FROM posts where post_id = $post_id";
    let check_params = { $post_id : tx.transaction.sig }
    let rows = await this.app.storage.queryDatabase(check_sql, check_params, "forum"); 
    if (rows) { if (rows.length > 0) { return;} }

    let sql = "INSERT INTO posts (post_id, comment_id, parent_id, forum, title, content, tx, link, unixtime, rank, votes, comments) VALUES ($post_id, $comment_id, $parent_id, $forum, $title, $content, $tx, $link, $unixtime, $rank, $votes, $comments)";
    let params = {
      $post_id 		: post_id,
      $comment_id 	: txmsg.comment_id,
      $parent_id 	: txmsg.parent_id,
      $forum 		: txmsg.forum,
      $title		: txmsg.title,
      $content		: txmsg.content,
      $tx		: JSON.stringify(tx.transaction),
      $link		: txmsg.link,
      $unixtime		: tx.transaction.ts,
      $rank             : tx.transaction.ts,
      $votes		: 0,
      $comments		: 0,
    }
    await this.app.storage.executeDatabase(sql, params, "forum");


    if (txmsg.parent_id != "") {
      let sql2 = "UPDATE posts SET comments = comments+1 WHERE post_id = $post_id";
      let params2 = { $post_id 	: txmsg.parent_id }
      await this.app.storage.executeDatabase(sql2, params2, "forum");
    }


    if (txmsg.link != "") {
      this.downloadThumbnailImage(tx.transactiobn.sig, txmsg.link);
    }

  }


  downloadThumbnailImage(filename, link) {

    if (this.app.BROWSER == 1) { return; }

    let snapshot_width     = 100;
    let snapshot_height    = 100;
    let snapshot_target    = link;
    let snapshot_localfile = filename + ".png";
    let snapshot_dir       = __dirname + "/web/img/thumbnails/";
    let snapshot_filepath  = snapshot_dir + "/" + snapshot_localfile;

    const ImageResolver = require('image-resolver');
    const Jimp = require('jimp');

    var resolver = new ImageResolver();
        resolver.register(new ImageResolver.FileExtension());
        resolver.register(new ImageResolver.MimeType());
        resolver.register(new ImageResolver.Opengraph());
        resolver.register(new ImageResolver.Webpage());

    try {
/*
      resolver.resolve(snapshot_target, (result) => {
        if ( result ) {
          snapshot_target = result.image;
          request.head(snapshot_target, (err, res, body) => {
            if (!err) {
              request(snapshot_target).pipe(fs.createWriteStream(snapshot_filepath)).on('close', async () => {
                let image;
                try {
                  image = await Jimp.read(snapshot_filepath);
                } catch(error1) {
                  let temp = await new Promise(resolve => setTimeout(resolve, 600));
                  try {
                    image = await Jimp.read(snapshot_filepath);
                    debug('Success reading file on second attempt!');
                  } catch (error2) {
                    console.log(error2)
                    return;
                  }
                }
                image.resize(snapshot_width, snapshot_height).quality(60).write(snapshot_filepath); 
              });
            } else {
            }
          });
        } else {
        }
      });
*/  
    } catch(err) {
    }
  }




  createVoteTransaction(post_id, vote) {

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();

    //
    // arcade will listen, but we need game engine to receive to start initialization
    //
    tx.transaction.msg.module     = "Forum";
    tx.transaction.msg.type       = vote;
    tx.transaction.msg.post_id    = post_id;

    tx = this.app.wallet.signTransaction(tx);

    return tx;
 
  }

  async receiveVoteTransaction(tx) {
    if (this.app.BROWSER == 1) { return; }

    let txmsg = tx.returnMessage();

    let already_voted = 0;
    let vote_type = "";

    let sql = "";
    let params = {};

    let check_sql = "SELECT type FROM votes where post_id = $post_id AND publickey = $publickey";
    let check_params = {
      $post_id : tx.transaction.msg.post_id ,
      $publickey : tx.transaction.from[0].add
    }
    let rows = await this.app.storage.queryDatabase(check_sql, check_params, "forum"); 
    if (rows) { if (rows.length > 0) { already_voted = 1; vote_type = rows[0].type; } }

    //
    // we have an existing vote
    //
    if (already_voted == 1) {

      if (tx.transaction.msg.type == vote_type) { return; }
      vote_type = tx.transaction.msg.type;
      sql = "UPDATE votes SET type = $type WHERE publickey = $publickey AND post_id = $post_id";
      params = {
        $type : tx.transaction.msg.type ,
        $publickey : tx.transaction.from[0].add ,
        $post_id : tx.transaction.msg.post_id
      }
      await this.app.storage.executeDatabase(sql, params, "forum");

      sql = "UPDATE posts SET votes = votes+1 WHERE post_id = $post_id";
      if (vote_type == "downvote") {
        sql = "UPDATE posts SET votes = votes-1 WHERE post_id = $post_id";
      }
      params = { 
        $post_id : tx.transaction.msg.post_id
      } 
      await this.app.storage.executeDatabase(sql, params, "forum");

    } else {
      vote_type = tx.transaction.msg.type;
      sql = "INSERT INTO votes (type, publickey, post_id) VALUES ($type, $publickey, $post_id)";
      params = {
        $type : tx.transaction.msg.type ,
        $publickey : tx.transaction.from[0].add ,
        $post_id : tx.transaction.msg.post_id
      }
      await this.app.storage.executeDatabase(sql, params, "forum");

      sql = "UPDATE posts SET votes = votes+1 WHERE post_id = $post_id";
      if (vote_type == "downvote") {
        sql = "UPDATE posts SET votes = votes-1 WHERE post_id = $post_id";
      }
      params = { 
        $post_id : tx.transaction.msg.post_id
      }
      await this.app.storage.executeDatabase(sql, params, "forum");

    }


    let current_time = new Date().getTime();
    let vote_bonus   = 1000000;
    let sql_rank = "UPDATE posts SET rank = cast((rank + ($vote_bonus * (2000000/($current_time-unixtime)))) as INTEGER) WHERE post_id = $pid";
    let params_rank = { $pid : tx.transaction.msg.post_id , $vote_bonus : vote_bonus , $current_time : current_time };

    if (vote_type == "downvote") {
      sql_rank = "UPDATE posts SET rank = cast((rank - ($vote_bonus * (2000000/($current_time-unixtime)))) as INTEGER) WHERE post_id = $pid";
    }
console.log("UPDATING RANK: " + sql_rank);
    await this.app.storage.executeDatabase(sql_rank, params_rank, "forum");

  }






  onPeerHandshakeComplete(app, peer) {

    if (this.browser_active == 0) { return; }

    let forum_self = this;

    let loading = "main";

    //
    // load teasers from server
    //
    where_clause = "";
    if (this.view_forum != 'main') { 
      where_clause = 'forum = "'+this.view_forum+'" AND parent_id = ""';
      loading = "forum";
    } else {
      where_clause = 'parent_id = ""';
      loading = "main";
    }

    if (this.view_post_id != "") {
      where_clause = 'post_id = "'+this.view_post_id+'" OR parent_id = "'+this.view_post_id+'"';
      loading = "post";
    }

    this.sendPeerDatabaseRequest("forum", "teasers", "*", where_clause, null, (res, data) => {
      if (res.rows) {
 
        let post_ids = [];

        res.rows.forEach(row => {

          let tx = new saito.transaction(row.tx);
	  post_ids.push(tx.transaction.sig);

	  if (loading == "main" || loading == "forum") {
	    try {
              forum_self.forum.teasers.push(tx);
            } catch (err) {
	      console.log("Error fetching posts!: " + err);
	    }
	  }


	  if (loading == "post") {
	    try {
	      if (tx.transaction.msg.parent_id == "") {
                forum_self.forum.post = tx;
	      } else {
                forum_self.forum.comments.push(tx);
	      }
            } catch (err) {
	      console.log("Error fetching posts!: " + err);
	    }
	  }

        });

	data = {};
	data.forum = forum_self;

        ForumMain.render(this.app, data);
        ForumMain.attachEvents(this.app, data);


	//
	// fetch upvotes
	//
        where_clause = "publickey = '"+app.wallet.returnPublicKey()+"' AND post_id IN (";
        for (let i = 0; i < post_ids.length; i++) {
	  where_clause += '"'+post_ids[i]+'"';
	  if (i < post_ids.length-1) { where_clause += ","; } else { where_clause += ") "; }
        }
        this.sendPeerDatabaseRequest("forum", "votes", "*", where_clause, null, (res, data) => {
          if (res.rows) {

	    for (let i = 0; i < res.rows.length; i++) {

	      let this_post_id = res.rows[i].post_id;
	      let this_vote_type = res.rows[i].type;

console.log(this_post_id + " -- " + this_vote_type);

	      //
	      // upvotes
	      //
              if (this_vote_type == "upvote") {
	        Array.from(document.getElementsByClassName('post_upvote')).forEach(upvote => {
	          let post_id = upvote.getAttribute("id");
	          if (post_id == this_post_id) {
console.log("A");
  		    upvote.getElementsByClassName("post_upvote_arrow")[0].style.color = "#ff8235";
	  	  }
	        });
	      }

	      //
	      // downvotes
	      //
              if (this_vote_type == "downvote") {
	        Array.from(document.getElementsByClassName('post_downvote')).forEach(upvote => {
	          let post_id = upvote.getAttribute("id");
	          if (post_id == this_post_id) {
console.log("B");
  		    upvote.getElementsByClassName("post_downvote_arrow")[0].style.color = "#ff8235";
	  	  }
	        });
	      }


	    }
	  }
	});


      }
    });
  }



  render(app, data) {

    data = {};
    data.forum = this;

    ForumMain.render(this.app, data);
    ForumMain.attachEvents(this.app, data);

    ForumRightSidebar.render(this.app, data);
    ForumRightSidebar.attachEvents(this.app, data);

    ForumLeftSidebar.render(this.app, data);
    ForumLeftSidebar.attachEvents(this.app, data);


  }


  initialize(app) {

    if (this.browser_active == 0) { return; }

    // left-panel chat
    //
    let x = this.app.modules.respondTo("email-chat");
    for (let i = 0; i < x.length; i++) {
      this.mods.push(x[i]);
    }

  }

  initializeHTML(app) {
  
    Header.render(app, data);
    Header.attachEvents(app, data);

    let data = {};
        data.forum = this;

    this.render(this.app, data);

    if (post_id != "POST_ID") {
      this.view_post_id = post_id;
    }
    if (subforum != "SUBFORUM") {
      this.view_forum = subforum;
    }
    if (offset != "OFFSET") {
      this.view_offset = offset;
    }


  }





  webServer(app, expressapp, express) {

    super.webServer(app, expressapp, express);

    let forum_self = this;

    expressapp.get('/forum/:subforum', async (req, res) => {

      let subforum = "";

      if (req.params.subforum) { subforum = req.params.subforum; }

      let data = fs.readFileSync(__dirname + '/web/index.html', 'utf8', (err, data) => {});
          if (subforum != "") { data = data.replace('SUBFORUM', subforum); }
          data = data.replace('"OFFSET"', 0);
      res.setHeader('Content-type', 'text/html');
      res.charset = 'UTF-8';
      res.write(data);
      res.end();
      return;
    });

    expressapp.get('/forum/:subforum/:post_id', async (req, res) => {

      let subforum = "";
      let post_id = "";

      if (req.params.subforum) { subforum = req.params.subforum; }
      if (req.params.post_id) { post_id = req.params.post_id; }

      let data = fs.readFileSync(__dirname + '/web/index.html', 'utf8', (err, data) => {});
          if (post_id != "") { data = data.replace('POST_ID', post_id); }
          if (subforum != "") { data = data.replace('SUBFORUM', subforum); }
          data = data.replace('"OFFSET"', 0);
      res.setHeader('Content-type', 'text/html');
      res.charset = 'UTF-8';
      res.write(data);
      res.end();
      return;
    });

  }





  async handlePeerRequest(app, msg, peer, mycallback) {

    if (msg.request === "forum load votes") {

      let res = {};
	  res.err = "";
	  res.rows = [];

      let select              = msg.data.select;
      let dbname              = msg.data.dbname;
      let tablename           = msg.data.tablename;
      let where_clause        = 1;
      let query_type          = "main";
      let limit               = 30;

      //
      // TODO improve sanitization
      //
      if (where_clause.toString().indexOf(';') > -1) { return; }
      if (where_clause.toString().indexOf('`') > -1) { return; }
      if (where_clause.toString().indexOf('INDEX') > -1) { return; }
      if (where_clause.toString().indexOf('DELETE') > -1) { return; }

      let sql = "SELECT post_id , type FROM votes WHERE " + where_clause + " ORDER BY id DESC LIMIT 100";
      let rows2 = await this.app.storage.queryDatabase(sql, {}, 'forum'); 

      if (rows2) {
	for (let i = 0; i < rows2.length; i++) {
	  res.rows.push({ post_id : rows2[i].post_id , type : rows2[i].type });
        }
      }
      mycallback(res);
      return;

    }




    if (msg.request === "forum load teasers") {

      let res = {};
	  res.err = "";
	  res.rows = [];

      let select              = msg.data.select;
      let dbname              = msg.data.dbname;
      let tablename           = msg.data.tablename;
      let where_clause        = 1;
      let query_type          = "main";
      let limit               = 30;

      if (where_clause.toString().indexOf("post_id") > 0) { query_type = "post"; }
      if (msg.data.where !== "") { where_clause = msg.data.where; }

      //
      // TODO improve sanitization
      //
      if (where_clause.toString().indexOf(';') > -1) { return; }
      if (where_clause.toString().indexOf('`') > -1) { return; }
      if (where_clause.toString().indexOf('INDEX') > -1) { return; }
      if (where_clause.toString().indexOf('DELETE') > -1) { return; }

      let sql = "SELECT tx, votes, comments FROM posts WHERE " + where_clause + " ORDER BY rank DESC LIMIT 100";

console.log(sql);

      let rows2 = await this.app.storage.queryDatabase(sql, {}, 'forum'); 

      if (rows2) {
	for (let i = 0; i < rows2.length; i++) {

          let txobj = JSON.parse(rows2[i].tx);
	  let newtx = new saito.transaction(txobj);
	  let thisurl = newtx.transaction.msg.link;
	  if (thisurl.indexOf("ttp") == -1) { thisurl = "http://" + thisurl; }
	  try {
  	    let linkurl = new URL(thisurl);
	    newtx.transaction.domain = linkurl.hostname;
	  } catch (err) {
	    newtx.transaction.domain = "";
	  }

	  newtx.transaction.votes = rows2[i].votes;
	  newtx.transaction.comments = rows2[i].comments;
	  res.rows.push({ tx : newtx.transaction });
        }
      }
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

        if (tx.transaction.msg.type == "post") {
	  forum_self.receivePostTransaction(tx); 
	}

        if (tx.transaction.msg.type == "upvote") {
	  forum_self.receiveVoteTransaction(tx); 
	}

        if (tx.transaction.msg.type == "downvote") {
	  forum_self.receiveVoteTransaction(tx); 
	}

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













