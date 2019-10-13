import { ForumDetailTemplate } from './forum-detail.template.js';
import { ForumDetailCommentTemplate } from './forum-detail-comment.template.js';

export const ForumDetail = {
  // Use this for comments
  parent_id: "",

  render(mod, post, comments) {
    document.querySelector('.main').innerHTML = ForumDetailTemplate(post);

    // request comments for each post
    mod.app.saito.network.sendRequest('forum request comments', { post_id: post.post_id });

    this.renderComments(comments);
    this.attachEvents(mod, post, comments);

    this.bindDOMFunctionsToModule(mod);
  },

  attachEvents(mod, post, comments) {
    document.getElementById('forum-submit-comment').addEventListener('click', (e) => {
      // set the comment parent_id;
      this.parent_id = "";

      let text = document.getElementById('forum-comment-text-input').value
      if (!text) { alert("Can't post a blank comment"); return; }

      // fetch data from tx
      var msg = {};
      msg.module      = "Forum";
      msg.type        = "comment";
      msg.text        = text;
      msg.post_id     = post.post_id;
      msg.parent_id   = this.parent_id;
      msg.post_author = post.author;
      msg.link        = "";

      // TODO: needs to be changed to channel
      msg.subreddit   = post.subreddit;
      // msg.identifier  = mod.app.saito.wallet.returnIdentifier();

      var amount = 0.0;
      var fee    = 1.0000;

      // send post across network
      let publickey = mod.app.saito.network.peers[0].peer.publickey;
      var newtx = mod.app.saito.wallet.createUnsignedTransaction(publickey, amount, fee);
      if (newtx == null) { alert("Unable to send TX"); return; }
      newtx.transaction.msg = msg;
      newtx = mod.app.saito.wallet.signTransaction(newtx);
      mod.app.saito.network.propagateTransaction(newtx);

      alert("Your comment has been posted!");
      document.getElementById('forum-comment-text-input').innerHTML = "";

      // append new comment to our comment tree and re-render the table
      // TODO:
      //let post_comments = mod.forum.comments[post.post_id];
      let new_comment = {
        data: Object.assign(
          msg,
          {
            sig: newtx.transaction.sig,
            author: msg.post_author,
            publickey: msg.post_author,
            votes: 0
          }
        ),
        children: []
      };

      let comments = mod.forum.comments[post.post_id]
      comments.unshift(new_comment);

      // maybe we should cache these values?
      this.renderComments(comments);
      mod.forum.forumDetailAttachEvents(post.post_id);
    });

    // TODO: turn ForumRow it's own component
    let row = document.querySelector('.forum-row');
    let votes = row.children[2];

    votes.children[0].addEventListener('click', (e) => {
      mod.app.saito.network.sendRequest('forum vote', {vote: 1, type: 'post', id: post.post_id});
      votes.children[1].innerHTML = parseInt(votes.children[1].innerHTML) + 1;
      post.votes += 1;
    });

    votes.children[2].addEventListener('click', (e) => {
      mod.app.saito.network.sendRequest('forum vote', {vote: -1, type: 'post', id: post.post_id});
      votes.children[1].innerHTML = parseInt(votes.children[1].innerHTML) - 1;
      post.votes -= 1;
    });
  },


  ////////////////////////////
  /**
   * MODULE BOUND FUNCTIONS //
   */
  ////////////////////////////

  // IS BINDING NECESSARY, OR JUST SETTING THINGS?

  // IF WE DON'T NEED EXCLUSIVE USE OF this, then probably not

  bindDOMFunctionsToModule(mod) {
    mod.forum.forumDetailAttachEvents = this.commentsAttachEvents.bind(mod.forum);
    mod.forum.renderComments = this.renderComments.bind(mod.forum);
    mod.forum.renderChildComments = this.renderChildComments.bind(mod.forum);
  },

  commentsAttachEvents(post_id) {
    Array.from(document.getElementsByClassName('forum-comment')).forEach(comment => {
      let votes = comment.children[1];

      votes.children[0].addEventListener('click', (e) => {
        this.app.network.sendRequest('forum vote', {vote: 1, type: 'comment', id: comment.id});
        votes.children[1].innerHTML = parseInt(votes.children[1].innerHTML) + 1;
        let comment_content = this.findComment(Object.values(this.comments)[0], comment.id);
        comment_content.data.votes += 1;
      });

      votes.children[2].addEventListener('click', (e) => {
        this.app.network.sendRequest('forum vote', {vote: -1, type: 'comment', id: comment.id});
        votes.children[1].innerHTML = parseInt(votes.children[1].innerHTML) - 1;
        let comment_content = this.findComment(Object.values(this.comments)[0], comment.id);
        comment_content.data.votes += 1;
      });
    });

    Array.from(document.getElementsByClassName('forum-comment-buttons'))
         .forEach(comment_button => comment_button.addEventListener('click', (e) => {
            // remove existing reply elements
            Array.from(document.getElementsByClassName('forum-comment')).forEach(comment => {
              let removed_elements = Array.from(comment.childNodes).filter(node => {
                return node.nodeName == "TEXTAREA" || node.nodeName == "BUTTON"
              });
              Array.from(removed_elements).forEach(node => comment.removeChild(node));
            });

            let parent_comment_id = e.currentTarget.id;
            //let parent_comment = document.querySelector(`#${parent_comment_id}.forum-comment`);
            let parent_comment = document.getElementById(`${parent_comment_id}`);

            let reply_input = document.createElement("TEXTAREA")
            reply_input.placeholder = "Post a reply...";
            parent_comment.appendChild(reply_input);

            let reply_button = document.createElement("BUTTON");
            reply_button.addEventListener('click', (e) => {
              // set the parent_id of where we're commenting
              let parent_id = parent_comment_id;
              let text = reply_input.value;


              // post the comment to the network
              // TODO:
              var msg = {};
              msg.module      = "Forum";
              msg.type        = "comment";
              msg.text        = text;
              msg.post_id     = post_id;
              msg.parent_id   = parent_id;
              msg.post_author = this.app.wallet.returnPublicKey();
              msg.link        = "";

              // TODO: needs to be changed to channel
              msg.subreddit   = "";
              // msg.identifier  = mod.app.saito.wallet.returnIdentifier();

              var amount = 0.0;
              var fee    = 1.0000;

              // send post across network
              let publickey = this.app.network.peers[0].peer.publickey;
              var newtx = this.app.wallet.createUnsignedTransaction(publickey, amount, fee);
              if (newtx == null) { alert("Unable to send TX"); return; }

              newtx.transaction.msg = msg;
              newtx = this.app.wallet.signTransaction(newtx);
              this.app.network.propagateTransaction(newtx);

              alert("Your comment has been posted!");

              // remove our reply elements
              parent_comment.removeChild(reply_input);
              parent_comment.removeChild(reply_button);

              // append the new comment to the dom
              let parent_comment_content = this.findComment(this.comments[post_id], parent_comment_id);
              let new_comment = {
                data: Object.assign(
                  msg,
                  {
                    sig: newtx.transaction.sig,
                    author: msg.post_author,
                    publickey: msg.post_author,
                    votes: 0
                  }
                ),
                children: []
              };
              parent_comment_content.children.unshift(new_comment);
              this.renderComments(this.comments[post_id]);
              this.forumDetailAttachEvents(post_id);
            });

            reply_button.appendChild(document.createTextNode("POST"));
            parent_comment.appendChild(reply_button);

            parent_comment.scrollIntoView(false);
         })
    );
  },

  renderComments(comments) {
    document.getElementById('forum-comments-table').innerHTML = '';
    comments.forEach(comment => this.renderChildComments(comment, 0));
  },

  renderChildComments(comment, margin) {
    let comment_content = comment.data;
    document.getElementById('forum-comments-table').innerHTML += ForumDetailCommentTemplate(comment_content, margin);

    if (comment.children.length == 0) { margin = 0; return}

    comment.children.forEach(comment => {
      this.renderChildComments(comment, margin + 20);
    });
  },
}