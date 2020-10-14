module.exports = ForumCommentTemplate = (app, data, tx) => {

  let cauthor = data.forum.formatAuthor(tx.transaction.from[0].add);
  let post_id = tx.msg.post_id || tx.transaction.sig;

  return `
    <div class="comment" style="margin-left: ${data.forum.forum.comment_indent}px">


      <div class="comment-votes teaser-votes">
        <div class="post_upvote post_upvote_${tx.transaction.sig} upvote-wrapper" id="${tx.transaction.sig}" >
          <i class="fa fa-arrow-up upvote post_upvote_arrow post_upvote_arrow_${tx.transaction.sig}" aria-hidden="true"></i>
        </div>
        <div class="votes-total" id="votes-total-${tx.transaction.sig}">${tx.transaction.votes}</div>
        <div class="post_downvote post_downvote_${tx.transaction.sig} downvote-wrapper" id="${tx.transaction.sig}" >
          <i class="fa fa-arrow-down downvote post_downvote_arrow post_downvote_arrow_${tx.transaction.sig}" aria-hidden="true"></i>
        </div>
      </div>


      <div class="comment-author">posted by <span class="comment-author">${cauthor}</span></div>
      <div class="comment-text">${tx.msg.content}</div>

      <div class="comment-add-comment comment-add-comment-${tx.transaction.sig}" id="comment-add-comment">
        <textarea class="comment-add-comment-textarea-${tx.transaction.sig}" id="comment-add-comment-textarea"></textarea>
        <button class="comment-add-comment-btn comment-add-comment-btn-${tx.transaction.sig}">comment</button>

        <input type="hidden" class="comment-parent-id-${tx.transaction.sig}" value="${tx.transaction.sig}" />
        <input type="hidden" class="comment-post-id-${tx.transaction.sig}" value="${post_id}" />
      </div>

      <div class="comment-links">
	<div class="comment-links-reply" id="${tx.transaction.sig}">reply</div>
	<div class="comment-links-report">report</div>
      </div>
    </div>
  `;
}
