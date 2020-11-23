const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const PostMain = require('./lib/post-main/post-main');
const PostSidebar = require('./lib/post-sidebar/post-sidebar');
const SaitoHeader = require('../../lib/saito/ui/saito-header/saito-header');


class Post extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Post";

    this.header = new SaitoHeader(app, this);
    this.events = ['chat-render-request'];

    this.post = {};
    this.post.domain = "saito";


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

        let post_self = app.modules.returnModule("Post");

        if (tx.msg.type == "post") {
          post_self.receivePostTransaction(tx);
        }
        if (tx.msg.type == "update") {
          post_self.updatePostTransaction(tx);
        }
        if (tx.msg.type == "comment") {
          post_self.receiveVoteTransaction(tx);
          post_self.updateCommentCountPostTransaction(tx);
        }
        if (tx.msg.type == "delete") {
          post_self.deletePostTransaction(tx);
          post_self.deleteCommentCountPostTransaction(tx);
        }
        //if (tx.msg.type == "stick") {
        //  post_self.receiveReportTransaction(tx);
        //}
      }
    }

  }

  createPostTransaction(content, type = "post", thread_id = "", parent_id = "") {

    let tx = this.app.wallet.createUnsignedTransactionWithDefaultFee();

    //
    // broadcast post tx generator
    //
    tx.msg.module = "Post";
    tx.msg.type = "post";

    tx.msg.content = content;
    tx.msg.thread_id = thread_id;
    tx.msg.parent_id = parent_id;
    tx.msg.type = type;

    tx = this.app.wallet.signTransaction(tx);

    return tx;

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
                author, 
                content, 
                post_transaction, 
                ts,
                children,
                deleted
                ) 
            VALUES (
                '${tx.transaction.sig}',
                '${txmsg.thread_id}',
                '${txmsg.parent_id}', 
                '${txmsg.type}',
                '${tx.transaction.from[0].add}', 
                '${txmsg.content}', 
                '${JSON.stringify(tx.transaction)}', 
                ${tx.transaction.ts},
                0,
                0
                );
        `;
    var params = {};

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

  async stickPostTransaction(tx) {

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

  async updateCommentCountPostTransaction(tx) {

    let txmsg = tx.returnMessage();

    let sql = `
        UPDATE 
          posts
        SET
          children = children + 1
        WHERE
          id = '${txmsg.parent_id};
      `;
  }

  async deleteCommentCountPostTransaction(tx) {

    let txmsg = tx.returnMessage();

    let sql = `
        UPDATE 
          posts
        SET
          children = children - 1
        WHERE
          id = '${txmsg.parent_id};
      `;
  }

  returnPosts(count) { }


}
module.exports = Post

