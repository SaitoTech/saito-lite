const ForumMainTemplate = require('./forum-main.template');

module.exports = ForumMain = {


  render(app, data) {

    let forum_main = document.querySelector(".forum-main");
    if (!forum_main) { return; }
    forum_main.innerHTML = ForumMainTemplate();


    //
    // create fake post
    //
    let newtx = app.wallet.createUnsignedTransaction();
        newtx.transaction.msg.post_id = "1";
        newtx.transaction.msg.title = "This is our title";
        newtx.transaction.msg.content = "This is our content";
    newtx = app.wallet.signTransaction(newtx);

    data.forum.addPost(newtx);

  },



  attachEvents(app, data) {

    console.log("Add Events!");

  },

}
