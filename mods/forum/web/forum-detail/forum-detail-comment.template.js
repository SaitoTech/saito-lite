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

export const ForumDetailCommentTemplate = ({author, publickey, text, votes, sig***REMOVED***, margin) => {
  return `
    <div id="${sig***REMOVED***" class="forum-comment" style="margin-left: ${margin***REMOVED***px">
      <div class="forum-comment-content">
        <div id="forum-comment-author">
          ${publickey.substring(0,16)***REMOVED***
        </div>
        <p id="forum-comment-text">
          ${text***REMOVED***
        </p>
        <div id="${sig***REMOVED***" class="forum-comment-buttons">
          <i id="${sig***REMOVED***" class="icon-small fas fa-comment"></i> Reply
        </div>
      </div>
      <div class="forum-voting">
        <i class="icon-small fas fa-arrow-up"></i>
          <div class="forum-score">${votes***REMOVED***</div>
        <i class="icon-small fas fa-arrow-down"></i>
      </div>
    </div>
  `;
***REMOVED***