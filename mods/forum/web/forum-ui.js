import { ForumList } from './forum-list/forum-list.js';
import { ForumDetailCommentTemplate } from './forum-detail/forum-detail-comment.template.js';

export default class ForumUI {
    constructor(app) {
        this.app = app;
        this.forum = app.saito.modules.returnModule('Forum');
        this.bindDOMFunctionsToModule();
    }

    initialize() {
        let msg = {};
        msg.data = {};
        msg.request = 'forum request all';

        setTimeout(() => {
            this.app.saito.network.sendRequest(msg.request, msg.data);
        }, 1000);
    }

    render() {
        ForumList.render(this);
    }

    bindDOMFunctionsToModule() {
        this.forum.renderForumPostList = this.renderForumPostList.bind(this.forum);
        this.forum.renderForumComments = this.renderForumComments.bind(this.forum);
        this.forum.renderChildComments = this.renderChildComments.bind(this.forum);
    }

    renderForumPostList() {
        // ForumList.render(this);
    }

    renderForumComments(comments) {
        comments.forEach(comment => this.renderChildComments(comment, 0));
    }

    renderChildComments(comment, margin) {
        let comment_content = comment.data;
        document.getElementById('forum-comments-table').innerHTML += ForumDetailCommentTemplate(comment_content, margin);

        if (comment.children.length == 0) { margin = 0; return}

        comment.children.forEach(comment => {
            this.renderChildComments(comment, margin + 20);
        });
    }
}
