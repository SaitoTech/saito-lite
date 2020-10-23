const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');

const ArcadeSidebar = require('./lib/arcade-sidebar/post-sidebar');

const AddressController = require('../../lib/ui/menu/address-controller');

class Post extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Post";

    this.post = {};
    this.post.domain = "saito";

    this.icon_fa = "fa fa-map-signs";
    this.description = `Post or reply to short messages.`;
    this.categories = "Social Messaging";
    this.alwaysRun = 1;
  }

  returnServices() {
    let services = [];
    services.push({ service: "post" });
    return services;
  }

  initialize(app) {

    super.initialize(app);

    if (this.browser_active == 0) { return; }

  }

  respondTo(type = "") {
    if (type == "arcade-sidebar") {
      let obj = {};
      obj.render = this.renderArcadeSidebar;
      obj.attachEvents = this.attachEventsArcadeSidebar;
      return obj;
    }
    return null;
  }

  renderArcadeSidebar(app, data) {
    data.post = app.modules.returnModule("Post");
    ArcadeSidebar.render(app, data);
  }
  attachEventsArcadeSidebar(app, data) {
    data.post = app.modules.returnModule("Post");
    ArcadeSidebar.attachEvents(app, data);
  }


  onPeerHandshakeComplete(app, data) {
    data.post = app.modules.returnModule("Post");
    ArcadeSidebar.addPosts(app, data);
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
        if (tx.msg.type == "stick") {
          post_self.receiveReportTransaction(tx);
        }
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

