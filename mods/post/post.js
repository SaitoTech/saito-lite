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
          if (tx.msg.type == "update") {
            post_self.updatePostTransaction(tx);
          }
          if (tx.msg.type == "delete") {
            post_self.deletePostTransaction(tx);
            post_self.deleteCommentCountPostTransaction(tx);
          }
          //if (tx.msg.type == "report") {
          //  post_self.receiveReportTransaction(tx);
          //}
        }
      }
    }
  }


  onPeerHandshakeComplete(app, peer) {

    //
    // fetch posts from server
    //
    let sql = "SELECT id, children, tx FROM posts ORDER BY ts DESC";
    this.sendPeerDatabaseRequestWithFilter(

        "Post" ,

        sql ,

        (res) => {
          if (res) {
            if (res.rows) {
              for (let i = 0; i < res.rows.length; i++) {
		this.posts.push(new saito.transaction(JSON.parse(res.rows[i].tx)));
		this.posts[this.posts.length-1].children = res.rows[i].children;
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

