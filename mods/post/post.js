const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const PostMain = require('./lib/post-main/post-main');
const PostSidebar = require('./lib/post-sidebar/post-sidebar');
const ArcadePosts = require('./lib/arcade-posts/arcade-posts');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');
const Base58            = require("base-58");

class Post extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Post";

    this.header = null;
    this.events = ['chat-render-request'];
    this.renderMethod = "none";

    this.post = {};
    this.post.domain = "saito";
    this.posts = [];
    this.comments = [];

    this.icon_fa = "fa fa-map-signs";
    this.description = `Simple forum for persistent posts and discussions`;
    this.categories = "Social Messaging";
  }

  receiveEvent(type, data) {
    if (type == 'chat-render-request') {
      if (this.browser_active) {
        PostSidebar.render(this.app, this);
        PostSidebar.attachEvents(this.app, this);
      }
    }
  }



  //
  // manually announce arcade banner support
  //
  respondTo(type) {

    if (super.respondTo(type) != null) {
      return super.respondTo(type);
    }

    if (type == "arcade-posts") {
      let obj = {};
      obj.render = this.renderArcade;
      obj.attachEvents = function() {};
      return obj;
    }

    if (type == "header-dropdown") {
      return {
        name: this.appname ? this.appname : this.name,
        icon_fa: this.icon_fa,
        browser_active: this.browser_active,
        slug: this.returnSlug()
      };
    }

    return null;

  }

  returnServices() {
    let services = [];
    services.push({ service: "post" });
    return services;
  }

  initializeHTML(app) {

    if (this.header == null) {
      this.header = new SaitoHeader(app, this);
    }
    this.header.render(app, this);
    this.header.attachEvents(app, this);

    PostSidebar.render(this.app, this);
    PostSidebar.attachEvents(this.app, this);

    PostMain.render(app, this);
    PostMain.attachEvents(app, this);
  }


  onConfirmation(blk, tx, conf, app) {
    if (app.BROWSER == 0) {
      if (conf == 0) {

        let txmsg = tx.returnMessage();

        if (txmsg.module === "Post") {

          let post_self = app.modules.returnModule("Post");

          if (txmsg.type == "post") {
            post_self.receivePostTransaction(tx);
            this.render();
          }
          if (txmsg.type == "comment") {
            post_self.receiveCommentTransaction(tx);
            this.render();
          }
          if (txmsg.type == "edit") {
            post_self.receiveEditTransaction(tx);
            this.render();
          }
          if (txmsg.type == "editpost") {
            post_self.receiveEditPostTransaction(tx);
            this.render();
          }
          if (txmsg.type == "report") {
            post_self.receiveReportTransaction(tx);
            this.render();
          }
          if (txmsg.type == "delete") {
            post_self.receiveDeleteTransaction(tx);
            this.render();
          }
        }
      }
    }
  }


  onPeerHandshakeComplete(app, peer) {

    if (this.renderMethod == "none") { return; }

    //
    // fetch posts from server
    //
    let sql = `SELECT id, children, img, lite_tx FROM posts WHERE parent_id = "" AND deleted = 0 ORDER BY ts DESC LIMIT 12`;
    this.sendPeerDatabaseRequestWithFilter(

        "Post" ,

        sql ,

        (res) => {
          if (res) {
            if (res.rows) {
              for (let i = 0; i < res.rows.length; i++) {
                this.posts.push(new saito.transaction(JSON.parse(res.rows[i].lite_tx)));
                this.posts[this.posts.length-1].children = res.rows[i].children;
                this.posts[this.posts.length-1].img = res.rows[i].img;
              }
            }
          }

          this.render();

        }, 


        (p) => {
          if (p.peer.services) {
            for (let i = 0; i < p.peer.services.length; i++) {
              let s = p.peer.services[i];
              if (s.service === "post") { return 1; }
            }
          }
          return 0;
        }


    );
  }


  render() {
    if (this.renderMethod === "main") {
      PostMain.render(this.app, this);
      PostMain.attachEvents(this.app, this);
    }

    if (this.renderMethod === "arcade") {
      ArcadePosts.render(this.app, this);
      ArcadePosts.attachEvents(this.app, this);
    }

  }

  renderArcade(app, mod) {
    mod.renderMethod = "arcade";
    mod.render(app, mod);
  }



  grabImage(link, post_sig) {

    const ImageResolver = require('image-resolver');
    var resolver = new ImageResolver();

    resolver.register(new ImageResolver.FileExtension());
    resolver.register(new ImageResolver.MimeType());
    resolver.register(new ImageResolver.Opengraph());
    resolver.register(new ImageResolver.Webpage());

    resolver.resolve(link, (result) => {
      if (result) {
        let sql = "UPDATE posts SET img = $img WHERE id = $id;"
        let params = { $img : result.image , $id : post_sig };
        this.app.storage.executeDatabase(sql, params, "post");
      } else {
        console.log("No image found");
      }
    });

  }





  createPostTransaction(title, comment, link, forum, images) {

      let newtx = this.app.wallet.createUnsignedTransaction();

      newtx.msg.module = "Post";
      newtx.msg.type = "post";
      newtx.msg.title = title;
      newtx.msg.comment = comment;
      newtx.msg.link = link;
      newtx.msg.forum = forum;
      newtx.msg.images = images;
      
      return this.app.wallet.signTransaction(newtx);
      
  }
  async receivePostTransaction(tx) {

    let txmsg = tx.returnMessage();
    let pfulltx = JSON.stringify(tx.transaction);
    let plitetx = new saito.transaction(JSON.parse(JSON.stringify(tx.transaction)));
	plitetx.msg.comment = "";
	plitetx.msg.images = [];
        plitetx = this.app.wallet.signTransaction(plitetx);
        plitetx = JSON.stringify(plitetx.transaction);

    if (txmsg.title == "") { return; }

    let sql = `
        INSERT INTO 
            posts (
                id,
                thread_id,
                parent_id, 
                type,
		publickey,
                title,
                img,
                text,
		forum,
		link,
                tx, 
                lite_tx, 
                ts,
                children,
                flagged,
                deleted
                ) 
            VALUES (
                $pid ,
	        $pthread_id ,
                $pparent_id ,
                $ptype ,
		$ppublickey ,
		$ptitle ,
		$pimg ,
		$ptext ,
		$pforum ,
		$plink ,
		$pfulltx ,
		$plitetx ,
		$pts ,
		$pchildren ,
		$pflagged ,
		$pdeleted
            );
        `;
    let params = {
	$pid 		: tx.transaction.sig ,
	$pthread_id 	: tx.transaction.sig ,
	$pparent_id	: '' ,
	$ptype		: 'post' ,
	$ppublickey	: tx.transaction.from[0].add ,
	$ptitle		: txmsg.title ,
	$pimg		: "" ,
	$ptext		: txmsg.comment ,
	$pforum		: txmsg.forum ,
	$plink		: txmsg.link ,
	$pfulltx	: pfulltx ,
	$plitetx	: plitetx ,
	$pts		: tx.transaction.ts ,
	$pchildren	: 0 ,
	$pflagged 	: 0 ,
	$pdeleted	: 0 ,
    };

    await this.app.storage.executeDatabase(sql, params, "post");


    //
    // save a lite version without the content
    //


    //
    // fetch image if needed
    //
    if (txmsg.link != "") { this.grabImage(txmsg.link, tx.transaction.sig); }

  }


  createEditPostTransaction(title, comment, link, forum, images, post_id) {

      let newtx = this.app.wallet.createUnsignedTransaction();

      newtx.msg.module = "Post";
      newtx.msg.type = "editpost";
      newtx.msg.title = title;
      newtx.msg.comment = comment;
      newtx.msg.link = link;
      newtx.msg.forum = forum;
      newtx.msg.images = images;
      newtx.msg.post_id = post_id;
      
      return this.app.wallet.signTransaction(newtx);
      
  }
  async receiveEditPostTransaction(tx) {

    let txmsg = tx.returnMessage();
    let pfulltx = JSON.stringify(tx.transaction);   
    let plitetx = new saito.transaction(JSON.parse(JSON.stringify(tx.transaction)));
	plitetx.msg.comment = "";
	plitetx.msg.images = [];
        plitetx = this.app.wallet.signTransaction(plitetx);
        plitetx = JSON.stringify(plitetx.transaction);

    if (txmsg.title == "") { return; }

    let is_parent_id = 0;
    let sql = `SELECT parent_id FROM posts WHERE id = $id`;
    let params = { $id : txmsg.post_id }
    let rows = await this.app.storage.queryDatabase(sql, params, 'post');
    if (rows) {
      if (rows.length > 0) {
        if (rows[0].parent_id === "") { 
          is_parent_id = 1;
        }
      }
    }


    //
    // check if permitted to edit
    //
    sql = `SELECT publickey, children, flagged, deleted FROM posts WHERE id = $id`;
    params = { $id : txmsg.post_id }
    rows = await this.app.storage.queryDatabase(sql, params, 'post');
    if (rows) {
      if (rows.length > 0) {
        let children = rows[0].children
        if (rows[0].publickey === tx.transaction.from[0].add) {
          sql = `DELETE FROM posts WHERE publickey = $author AND id = $id`;
          params = {
            $author	: tx.transaction.from[0].add ,
            $id		: txmsg.post_id
          };

          await this.app.storage.executeDatabase(sql, params, "post");


        sql = `
        INSERT INTO 
            posts (
                id,
                thread_id,
                parent_id, 
                type,
		publickey,
                title,
                img,
                text,
		forum,
		link,
                tx, 
                lite_tx, 
                ts,
                children,
                flagged,
                deleted
                ) 
            VALUES (
                $pid ,
	        $pthread_id ,
                $pparent_id ,
                $ptype ,
		$ppublickey ,
		$ptitle ,
		$pimg ,
		$ptext ,
		$pforum ,
		$plink ,
		$pfulltx ,
		$plitetx ,
		$pts ,
		$pchildren ,
		$pflagged ,
		$pdeleted
            );
        `;
     params = {
	$pid 		: tx.transaction.sig ,
	$pthread_id 	: tx.transaction.sig ,
	$pparent_id	: '' ,
	$ptype		: 'post' ,
	$ppublickey	: tx.transaction.from[0].add ,
	$ptitle		: txmsg.title ,
	$pimg		: "" ,
	$ptext		: txmsg.comment ,
	$pforum		: txmsg.forum ,
	$plink		: txmsg.link ,
	$pfulltx	: pfulltx ,
	$plitetx	: plitetx ,
	$pts		: tx.transaction.ts ,
	$pchildren	: rows[0].children ,
	$pflagged 	: rows[0].flagged ,
	$pdeleted	: rows[0].deleted ,
    };

    await this.app.storage.executeDatabase(sql, params, "post");

    //
    // fetch image if needed
    //
    if (txmsg.link != "") { this.grabImage(txmsg.link, tx.transaction.sig); }

      sql = `UPDATE posts SET parent_id = $new_parent_id WHERE parent_id = $old_parent_id`;
      params = {
        $new_parent_id	: tx.transaction.sig ,
        $old_parent_id	: txmsg.post_id
      };
      await this.app.storage.executeDatabase(sql, params, "post");

      if (is_parent_id == 1) {
            sql = `UPDATE posts SET thread_id = $new_parent_id WHERE thread_id = $old_parent_id`;
            params = {
              $new_parent_id	: tx.transaction.sig ,
              $old_parent_id	: txmsg.post_id
            };
            await this.app.storage.executeDatabase(sql, params, "post");
          }
        }
      }
    }
  }


  createEditTransaction(sig, comment) {

      let newtx = this.app.wallet.createUnsignedTransaction();

      newtx.msg.module = "Post";
      newtx.msg.type = "edit";
      newtx.msg.sig = sig;
      newtx.msg.comment = comment;
      
      return this.app.wallet.signTransaction(newtx);
      
  }
  async receiveEditTransaction(tx) {
    let txmsg = tx.returnMessage();
    let is_parent_id = 0;
    let sql = `SELECT parent_id FROM posts WHERE id = $id`;
    let params = { $id : txmsg.sig }
    let rows = await this.app.storage.queryDatabase(sql, params, 'post');
    if (rows) {
      if (rows.length > 0) {
        if (rows[0].parent_id === "") { 
          is_parent_id = 1;
        }
      }
    }

    //
    // check if permitted to edit
    //
    sql = `SELECT publickey FROM posts WHERE id = $id`;
    params = { $id : txmsg.sig }
    rows = await this.app.storage.queryDatabase(sql, params, 'post');
    if (rows) {
      if (rows.length > 0) {
        if (rows[0].publickey === tx.transaction.from[0].add) {

          sql = `UPDATE posts SET id = $newid, text = $text, tx = $tx WHERE publickey = $author AND id = $id`;
          params = {
            $id		: txmsg.sig,
            $text	: txmsg.comment ,
            $tx		: JSON.stringify(tx.transaction) ,
            $author	: tx.transaction.from[0].add ,
            $id		: txmsg.sig
          };
          await this.app.storage.executeDatabase(sql, params, "post");

          sql = `UPDATE posts SET parent_id = $new_parent_id WHERE parent_id = $old_parent_id`;
          params = {
            $new_parent_id	: tx.transaction.sig ,
            $old_parent_id	: txmsg.sig
          };
          await this.app.storage.executeDatabase(sql, params, "post");


          if (is_parent_id == 1) {
            sql = `UPDATE posts SET thread_id = $new_parent_id WHERE thread_id = $old_parent_id`;
            params = {
              $new_parent_id	: tx.transaction.sig ,
              $old_parent_id	: txmsg.sig
            };
            await this.app.storage.executeDatabase(sql, params, "post");
          }

        }
      }
    }
  }



  createCommentTransaction(parent_id, comment) {

      let newtx = this.app.wallet.createUnsignedTransaction();

      newtx.msg.module = "Post";
      newtx.msg.type = "comment";
      newtx.msg.parent_id = parent_id;
      newtx.msg.thread_id = parent_id;
      newtx.msg.title = "";
      newtx.msg.comment = comment;
      newtx.msg.link = "";
      newtx.msg.forum = "";
      newtx.msg.images = [];      

      return this.app.wallet.signTransaction(newtx);
      
  }
  async receiveCommentTransaction(tx) {

    //
    // lite removes comment (content) and images. for lite-weight
    // protocol compliance for things like displaying headers. 
    // it is signed by the node storing it in the database.
    //
    let txmsg = tx.returnMessage();
    let pfulltx = JSON.stringify(tx.transaction);   
    let plitetx = new saito.transaction(JSON.parse(JSON.stringify(tx.transaction)));
	plitetx.msg.comment = "";
	plitetx.msg.images = [];
        plitetx = this.app.wallet.signTransaction(plitetx);
        plitetx = JSON.stringify(plitetx.transaction);


    let sql = `
        INSERT INTO 
            posts (
                id,
                thread_id,
                parent_id, 
                type,
                publickey,
                title,
                text,
                forum,
                link,
                img,
                tx, 
                lite_tx, 
                ts,
                children,
                flagged,
                deleted
                ) 
            VALUES (
                $pid ,
                $pthread_id ,
                $pparent_id ,
                $ptype ,
                $ppublickey ,
                $ptitle ,
                $ptext ,
                $pforum ,
                $pimg ,
                $plink ,
                $ptx ,
                $plite_tx ,
                $pts ,
                $pchildren ,
                $pflagged ,
                $pdeleted
            );
        `;
    let params = {
      $pid 		: tx.transaction.sig ,
      $pthread_id 	: txmsg.thread_id ,
      $pparent_id	: txmsg.parent_id ,
      $ptype		: 'comment' ,
      $ppublickey	: tx.transaction.from[0].add ,
      $ptitle		: '' ,
      $ptext		: txmsg.comment ,
      $pforum		: '' ,
      $pimg		: '' ,
      $plink		: '' ,
      $ptx		: pfulltx ,
      $plite_tx		: plitetx ,
      $pts		: tx.transaction.ts ,
      $pchildren	: 0 ,
      $pflagged 	: 0 ,
      $pdeleted	: 0 ,
    };

    await this.app.storage.executeDatabase(sql, params, "post");

    sql = "UPDATE posts SET children = children+1 WHERE id = $pid";
    params = { $pid : txmsg.thread_id }
    await this.app.storage.executeDatabase(sql, params, "post");

  }



  createReportTransaction(post_id, title, text, comment) {

      let newtx = this.app.wallet.createUnsignedTransaction();

      newtx.msg.module = "Post";
      newtx.msg.type = "report";
      newtx.msg.post_id = post_id;
      newtx.msg.title = title;
      newtx.msg.text = text;

      return this.app.wallet.signTransaction(newtx);
      
  }

  /*  TODO: 
      idea: send to admin email instead of flagging database
  */
  async receiveReportTransaction(tx) {

    let txmsg = tx.returnMessage();
    let sql = `
        UPDATE posts SET flagged = 1 WHERE id = $pid
    `;
    let params = {
      $pid 		: txmsg.post_id
    };
    await this.app.storage.executeDatabase(sql, params, "post");

    let delete_tx = this.createDeleteTransaction(txmsg.post_id);
    let base_58_tx = Base58.encode(Buffer.from(JSON.stringify(delete_tx)));

    console.log(`POSTS MODERATION https://saito.io/post/delete/${base_58_tx}`);
    console.log(JSON.stringify(txmsg)); // lets see who is this guy

    this.app.network.sendRequest('send email', {
      from: 'network@saito.tech',
      to: 'moderators@saito.tech', 
      subject: `Saito.io - Post #${txmsg.post_id} was reported.`,
      ishtml: true,
      body: `
        <b>Post #${txmsg.title} was reported.<br/></b>
        Post ID ${txmsg.post_id}<br/><br/>
        <a href="https://saito.io/post/delete/${base_58_tx}">Delete Post</a><hr/>.
      `
    });
  }

  createDeleteTransaction(post_id) {

      let newtx = this.app.wallet.createUnsignedTransaction();

      newtx.msg.module = "Post";
      newtx.msg.type = "delete";
      newtx.msg.post_id = post_id;

      return this.app.wallet.signTransaction(newtx);
      
  }

  async receiveDeleteTransaction(tx) {
    
    if (this.app.crypto.verifyMessage(tx.returnSignatureSource(this.app), tx.transaction.sig, tx.transaction.from[0].add)) {
      let txmsg = tx.returnMessage();
      console.log(txmsg);
      let sql = `
          UPDATE 
            posts
          SET
            deleted = 1
          WHERE
            id = $post_id
        `;
      let params = { $post_id : txmsg.post_id };
      await this.app.storage.executeDatabase(sql, params, "post");
    } else {
      console.log("Delete Post Transaction signature is not valid");
    }
  }

  webServer(app, expressapp, express) {
    super.webServer(app, expressapp, express);
    expressapp.get('/post/delete/:serialized_tx', async (req, res) => {
      try {
        let decoded_tx = JSON.parse(Buffer.from(Base58.decode(req.params.serialized_tx)).toString("utf-8"));
        this.receiveDeleteTransaction(new saito.transaction(decoded_tx));
        res.setHeader('Content-type', 'text/javascript');
        res.write("OK");
        res.charset = 'UTF-8';
        res.end();
      } catch (err) {
        console.log("error trying to decode moderation transaction");
        console.log(err);
      }
    });
  }
}
module.exports = Post

