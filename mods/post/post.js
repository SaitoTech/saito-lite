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
    


    onConfirmation(blk, tx, conf, app) {

        if (app.BROWSER == 0) {
    
          if (conf == 0) {
    
            let post_self = app.modules.returnModule("Post");
    
            if (tx.msg.type == "post") {
              post_self.receivePostTransaction(tx);
            }
            if (tx.msg.type == "update") {
              post_self.receiveVoteTransaction(tx);
            }
            if (tx.msg.type == "comment") {
              post_self.receiveVoteTransaction(tx);
            }
            if (tx.msg.type == "delete") {
              post_self.receiveDeleteTransaction(tx);
            }
            if (tx.msg.type == "report") {
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

        if (this.app.BROWSER == 1) { return; }

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
                ts
                ) 
            VALUES (
                '${tx.transaction.sig}',
                '${txmsg.thread_id}',
                '${txmsg.parent_id}', 
                '${txmsg.type}',
                '${tx.transaction.from[0].add}', 
                '${txmsg.content}', 
                '${JSON.stringify(tx.transaction)}', 
                ${tx.transaction.ts}
                );
        `;
        var params = {};

        await this.app.storage.executeDatabase(sql, params, "post");
    }


}
module.exports = Post

