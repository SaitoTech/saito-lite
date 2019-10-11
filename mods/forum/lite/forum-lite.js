const ModTemplate = require('../../../lib/templates/modtemplate.js');

class ForumLite extends ModTemplate {
  constructor(app) {
    super(app);

    this.app = app;
    this.name = "Forum";

    this.posts = [];
    this.comments = {***REMOVED***;
  ***REMOVED***

  handlePeerRequest(app, msg, peer, mycallback) {
    switch (msg.request) {
      case 'forum response payload':
        this.posts = msg.data.map(post => {
          post.author = post.tx.from[0].add;
          return post;
    ***REMOVED***);
        this.renderForumPostList();
        break;
      case 'forum response comments':
        this.comments[msg.data.post_id] = msg.data.comments;
        this.renderForumComments(this.comments[msg.data.post_id]);
        this.forumDetailAttachEvents(msg.data.post_id);
        break;
      default:
        break;
***REMOVED***
  ***REMOVED***

  findComment(comments, comment_id) {
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].data.sig == comment_id) {
        return comments[i];
  ***REMOVED*** else {
        return this.findComment(comments[i].children, comment_id)
  ***REMOVED***
***REMOVED***

    // couldn't find anything, return null
    return null;
  ***REMOVED***

  renderForumPostList() {***REMOVED***
  renderForumComments() {***REMOVED***
  forumDetailAttachEvents() {***REMOVED***
***REMOVED***

module.exports = ForumLite;