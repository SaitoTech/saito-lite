const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const PostMain = require('./lib/post-main/post-main');
const PostSidebar = require('./lib/post-sidebar/post-sidebar');
const ArcadePosts = require('./lib/arcade-posts/arcade-posts');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');


class Post extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Post";

    this.header = new SaitoHeader(app, this);
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
      obj.render = this.renderArcade;;
      obj.attachEvents = function() {};
      return obj;
    }

    if (type == "header-dropdown") {
      return {};
    }

    return null;

  }


  returnServices() {
    let services = [];
    services.push({ service: "post" });
    return services;
  }

  initializeHTML(app) {

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

	if (tx.msg.module === "Post") {

          let post_self = app.modules.returnModule("Post");

          if (tx.msg.type == "post") {
            post_self.receivePostTransaction(tx);
          }
          if (tx.msg.type == "comment") {
            post_self.receiveCommentTransaction(tx);
          }
          if (tx.msg.type == "edit") {
            post_self.receiveEditTransaction(tx);
          }
          if (tx.msg.type == "report") {
            post_self.receiveReportTransaction(tx);
          }
/*
          if (tx.msg.type == "delete") {
            post_self.deletePostTransaction(tx);
            post_self.deleteCommentCountPostTransaction(tx);
          }
*/
        }
      }
    }
  }


  onPeerHandshakeComplete(app, peer) {

    //
    // fetch posts from server
    //
    let sql = `SELECT id, children, img, tx FROM posts WHERE parent_id = "" ORDER BY ts DESC`;
    this.sendPeerDatabaseRequestWithFilter(

        "Post" ,

        sql ,

        (res) => {
          if (res) {
            if (res.rows) {
              for (let i = 0; i < res.rows.length; i++) {
		this.posts.push(new saito.transaction(JSON.parse(res.rows[i].tx)));
		this.posts[this.posts.length-1].children = res.rows[i].children;
		this.posts[this.posts.length-1].img = res.rows[i].img;
              }
            }
          }

	  this.render();

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
		$ptx ,
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
	$ptx		: JSON.stringify(tx.transaction) ,
	$pts		: tx.transaction.ts ,
	$pchildren	: 0 ,
	$pflagged 	: 0 ,
	$pdeleted	: 0 ,
    };

    await this.app.storage.executeDatabase(sql, params, "post");

    //
    // fetch image if needed
    //
    if (txmsg.link != "") { this.grabImage(txmsg.link, tx.transaction.sig); }

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

    //
    // check if permitted to edit
    //
    let sql = `SELECT publickey FROM posts WHERE id = $id`;
    let params = { $id : txmsg.sig }
    let rows = await this.app.storage.queryDatabase(sql, params, 'post');
    if (rows) {
      if (rows.length > 0) {
	if (rows[0].publickey === tx.transaction.from[0].add) {

          sql = `UPDATE posts SET text = $text, tx = $tx WHERE publickey = $author AND id = $id`;
          params = {
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

    let txmsg = tx.returnMessage();
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
	$ptx		: JSON.stringify(tx.transaction) ,
	$pts		: tx.transaction.ts ,
	$pchildren	: 0 ,
	$pflagged 	: 0 ,
	$pdeleted	: 0 ,
    };

    await this.app.storage.executeDatabase(sql, params, "post");

  }



  createReportTransaction(post_id, comment) {

      let newtx = this.app.wallet.createUnsignedTransaction();

      newtx.msg.module = "Post";
      newtx.msg.type = "report";
      newtx.msg.post_id = post_id;

      return this.app.wallet.signTransaction(newtx);
      
  }

  async receiveReportTransaction(tx) {

    let txmsg = tx.returnMessage();
    let sql = `
        UPDATE posts SET flagged = 1 WHERE id = $pid
    `;
    let params = {
	$pid 		: txmsg.post_id 
    };

    await this.app.storage.executeDatabase(sql, params, "post");

  }
















  async updatePostTransaction(tx) {

    let txmsg = tx.returnMessage();

    let sql = `
        UPDATE 
          posts
        SET
          content = '${txmsg.content}'
        WHERE
          id = '${txmsg.parent_id};
      `;
  }

  async deletePostTransaction(tx) {

    let txmsg = tx.returnMessage();

    let sql = `
        UPDATE 
          posts
        SET
          deleted = 1
        WHERE
          id = '${txmsg.parent_id};
      `;
  }

  async reportPostTransaction(tx) {

    let txmsg = tx.returnMessage();

    let sql = `
        UPDATE 
          posts
        SET
          ts = ${tx.transaction.ts}
        WHERE
          id = '${txmsg.parent_id};
      `;
  }

  returnPosts(count) { }


}
module.exports = Post

