module.exports = ForumCommentTemplate = (app, data, tx) => {

  let cauthor = data.forum.formatAuthor(tx.transaction.from[0].add);

  return `
    <div class="comment">


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
      <div class="comment-text">${tx.transaction.msg.content}</div>
      <div class="comment-links">
	<div class="comment-links-reply">reply</div>
	<div class="comment-links-report">report</div>
      </div>
    </div>
  `;
}
