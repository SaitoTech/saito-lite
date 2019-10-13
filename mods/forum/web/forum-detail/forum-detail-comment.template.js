// id: id,
// text: text,
// author: identifier,
// publickey: tx.from[0].add,
// votes: votes,
// unixtime: unixtime,
// post_id: post_id,
// parent_id: parent_id.toString(),
// subreddit: subreddit,
// sig: tx.sig,
// tx

export const ForumDetailCommentTemplate = ({author, publickey, text, votes, sig}, margin) => {
  return `
    <div id="${sig}" class="forum-comment" style="margin-left: ${margin}px">
      <div class="forum-comment-content">
        <div id="forum-comment-author">
          ${publickey.substring(0,16)}
        </div>
        <p id="forum-comment-text">
          ${text}
        </p>
        <div id="${sig}" class="forum-comment-buttons">
          <i id="${sig}" class="icon-small fas fa-comment"></i> Reply
        </div>
      </div>
      <div class="forum-voting">
        <i class="icon-small fas fa-arrow-up"></i>
          <div class="forum-score">${votes}</div>
        <i class="icon-small fas fa-arrow-down"></i>
      </div>
    </div>
  `;
}