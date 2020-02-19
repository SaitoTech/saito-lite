module.exports = ForumTeaserTemplate = (tx) => {

  return `
      <div class="post" id="${tx.transaction.sig}">

        <div class="post-author">david</div>

        <div class="post-votes">
          <div class="upvote-wrapper"></div>
          <div class="votes-total">12</div>
          <div class="downvote-wrapper"></div>
        </div>

        <div class="post-thumbnail"></div>

        <div class="post-content">
          <div class="post-content-title">Team Saito working from Thailand -- update!</div>
          <div class="post-content-details">submitted by david</div>
          <div class="post-content-links">
            <div class="post-content-links-comments">2 comments</div>
            <div class="post-content-links-edit">edit</div>
            <div class="post-content-links-report">report</div>
          </div>
        </div>

      </div>
  `;
}
