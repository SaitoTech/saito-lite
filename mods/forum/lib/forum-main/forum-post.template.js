module.exports = ForumPostTemplate = (app, data, tx) => {

  let pauthor = data.forum.formatAuthor(tx.transaction.from[0].add);
  let link = tx.transaction.msg.link;
  let domain = tx.transaction.domain || "";
  let subforum = "/forum/main";
  let post_id = tx.transaction.msg.post_id || tx.transaction.sig;
  let comments_text = "read comments";
  let votes = tx.transaction.votes || 0;
  let comments = tx.transaction.comments || 0;
  if (comments > 0) {
    if (comments == 1) {
      comments_text = "1 comment";
    } else {
      comments_text = comments + " comments";
    }
  }
  let thumbnail = "/forum/img/forum-logo.png";
  if(tx.transaction.img) {
    if(tx.transaction.img.length > 0) {thumbnail = tx.transaction.img}
  }

  if (tx.transaction.msg.forum) { subforum = "/forum/"+tx.transaction.msg.forum; }
  if (link == "") { link = subforum+"/"+tx.transaction.sig; }
  let discussion_link = subforum + "/" + tx.transaction.sig;

  let html = `
      <div class="post_bk" style="background-image: url('${thumbnail}');">
      
      <div class="post" id="${tx.transaction.sig}" >
        <div class="post-head">
          <div class="teaser-votes">
            <div class="post_upvote post_upvote_${tx.transaction.sig} upvote-wrapper" id="${tx.transaction.sig}" >
              <i class="fa fa-arrow-up upvote post_upvote_arrow post_upvote_arrow_${tx.transaction.sig}" aria-hidden="true"></i>
            </div>
            <div class="votes-total" id="votes-total-${tx.transaction.sig}">${tx.transaction.votes}</div>
            <div class="post_downvote post_downvote_${tx.transaction.sig} downvote-wrapper" id="${tx.transaction.sig}" >
              <i class="fa fa-arrow-down downvote post_downvote_arrow post_downvote_arrow_${tx.transaction.sig}" aria-hidden="true"></i>
            </div>
          </div>

          <div class="teaser-thumbnail" style="background-image: url('${thumbnail}');"></div>

          <div class="teaser-content">
            <div class="teaser-content-title"><a href="${link}">${tx.transaction.msg.title}</a></div>
  `;
   if (domain != "") {
     html += `<div class="teaser-site"><a href="${link}">${domain}</a></div>`;
   }
   html += `
          

          <div class="teaser-content-details">submitted by <span class="post_author_clickable" id="post_author_clickable_${tx.transaction.sig}">${pauthor}</span> to <a href="${subforum}">${subforum}</a><span class="post_author_address" id="${tx.transaction.from[0].add}" style="display:none"></span></div>
        </div>

      </div>

      <div class="post-content">${tx.transaction.msg.content}</div>

      <div class="post-add-comment" id="post-add-comment">
  <!--textarea class="post-add-comment-textarea" id="post-add-comment-textarea"></textarea-->
  <div id="post-add-comment-textarea" class="post-add-comment-textarea markdown" placeholder="Your post..."></div>
	<button class="post-add-comment-btn">comment</button>

	<input type="hidden" class="post-parent-id" id="post-parent-id" value="${tx.transaction.sig}" />
	<input type="hidden" class="post-post-id" id="post-post-id" value="${post_id}" />
	<input type="hidden" class="post-forum" id="post-forum" value="${tx.transaction.msg.forum}" />

      </div>
      </div>
  `;

  return html;
}
