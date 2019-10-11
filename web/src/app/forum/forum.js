import { ForumTemplate ***REMOVED*** from './forum.template.js';
import { ForumList ***REMOVED*** from './forum-list/forum-list.js';
import { ForumDetailCommentTemplate ***REMOVED*** from './forum-detail/forum-detail-comment.template.js';

export default class Forum {
***REMOVED***
        this.app = app;
        this.forum = app.saito.modules.returnModule('Forum');
        this.bindDOMFunctionsToModule();
***REMOVED***

    initialize() {
        let msg = {***REMOVED***;
        msg.data = {***REMOVED***;
        msg.request = 'forum request all';

        setTimeout(() => {
            this.app.saito.network.sendRequest(msg.request, msg.data);
    ***REMOVED***, 1000);
***REMOVED***

    render() {
        ForumList.render(this);
***REMOVED***

    bindDOMFunctionsToModule() {
        this.forum.renderForumPostList = this.renderForumPostList.bind(this.forum);
        this.forum.renderForumComments = this.renderForumComments.bind(this.forum);
        this.forum.renderChildComments = this.renderChildComments.bind(this.forum);
***REMOVED***

    renderForumPostList() {
***REMOVED*** ForumList.render(this);
***REMOVED***

    renderForumComments(comments) {
        comments.forEach(comment => this.renderChildComments(comment, 0));
***REMOVED***

    renderChildComments(comment, margin) {
        let comment_content = comment.data;
        document.getElementById('forum-comments-table').innerHTML += ForumDetailCommentTemplate(comment_content, margin);

        if (comment.children.length == 0) { margin = 0; return***REMOVED***

        comment.children.forEach(comment => {
            this.renderChildComments(comment, margin + 20);
    ***REMOVED***);
***REMOVED***
***REMOVED***
