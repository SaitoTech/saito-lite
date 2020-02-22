module.exports = ForumCommentTemplate = (tx) => {
  return `
    <div class="comment">
      <div class="comment-author">posted by <span class="comment-author">${tx.transaction.from[0].add}</span></div>
      <div class="comment-text">${tx.transaction.msg.content}</div>
      <div class="comment-links">
	<div class="comment-links-reply">reply</div>
	<div class="comment-links-report">report</div>
      </div>
    </div>
  `;
}
