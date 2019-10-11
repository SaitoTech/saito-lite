import { ForumAddTemplate } from './forum-add.template.js';
import { ForumList } from '../forum-list/forum-list.js';

export const ForumAdd = {
  render(mod) {
    document.querySelector('.main').innerHTML = ForumAddTemplate();
    this.attachEvents(mod);
  },

  attachEvents(mod) {
    document.getElementById('forum-submit').addEventListener('click', (e) => {
      this.submitPost(mod, e);
      alert("Your post has been submitted!");
      ForumList.render(mod);
    });
  },

  submitPost(mod, e) {
    var msg = {};
    msg.module    = "Forum";
    msg.type      = "post";
    msg.title     = document.getElementById('forum-title').value;
    msg.link      = document.getElementById('forum-url').value;
    msg.text      = document.getElementById('forum-discussion').value;
    msg.subreddit = document.getElementById('forum-channel').value;

    // verify that we have all necessary information
    if (!this.postParamsCheck(msg)) { return; }

    // send post across network
    let publickey = mod.app.saito.network.peers[0].peer.publickey;
    var newtx = mod.app.saito.wallet.createUnsignedTransactionWithDefaultFee(publickey, 0.0);

    if (newtx == null) { alert("Unable to send TX"); return; }
    newtx.transaction.msg = msg;
    newtx = mod.app.saito.wallet.signTransaction(newtx);
    mod.app.saito.network.propagateTransaction(newtx);

    // add it to our posts
    mod.forum.posts.unshift({
      id: mod.forum.posts.length + 1,
      tx: newtx,
      author: "Me",
      title: msg.title,
      link: msg.link,
      text: msg.text,
      subreddit: msg.subreddit,
      post_id: newtx.transaction.sig,
      unixtime: new Date().getTime(),
      comments: 0,
      votes: 0,
    });
  },

  postParamsCheck(msg) {
    var regex=/^[0-9A-Za-z]+$/;

    // check OK
    if (regex.test(msg.subreddit)) {} else {
      if (msg.subreddit != "") {
        alert("Only alphanumeric characters permitted in sub-reddit name");
        return false;
      } else {
        msg.subreddit = "main";
      }
    }

    if (msg.title == "") {
      alert("You cannot submit an empty post");
      return false;
    }

    return true;
  }
}