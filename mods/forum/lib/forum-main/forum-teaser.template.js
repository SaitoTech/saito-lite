module.exports = ForumTeaserTemplate = (app, tx) => {

  let link = tx.transaction.msg.link;
  let subforum = "/f/main";
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

  if (tx.transaction.msg.forum) { subforum = "/f/"+tx.transaction.msg.forum; }
  if (link == "") { link = subforum+"/"+tx.transaction.sig; }


  let html = `
      <div class="teaser" id="${tx.transaction.sig}">

        <div class="teaser-author">david</div>

        <div class="teaser-votes">
          <div class="upvote-wrapper" id="post_upvote_${tx.transaction.sig}" >
            <i class="fa fa-arrow-up upvote post_upvote" aria-hidden="true"></i>
          </div>
          <div class="votes-total">${tx.transaction.votes}</div>
          <div class="downvote-wrapper" id="post_downvote_${tx.transaction.sig}" >
            <i class="fa fa-arrow-down downvote post_downvote" aria-hidden="true"></i>
	  </div>
        </div>

        <div class="teaser-thumbnail"><img src="${thumbnail}" class="teaser-thumbnail-image" /></div>

        <div class="teaser-content">
          <div class="teaser-content-title"><a href="${link}">${tx.transaction.msg.title}</a> 
	    <div class="teaser-site">(<a href="">heavy.com</a>)</div>
	  </div>
          <div class="teaser-content-details">submitted by <span class="post_author_clickable" id="post_author_clickable_${tx.transaction.sig}">david</span> to <a href="${subforum}">${subforum}</a><span class="post_author_address" id="${tx.transaction.from[0].add}" style="display:none"></span></div>
          <div class="teaser-content-links">
            <div class="teaser-content-links-comments">${comments_text}</div>
  `;
  if (app.wallet.returnPublicKey() == tx.transaction.from[0].add) {
    html += `<div class="teaser-content-links-edit">edit</div>`;
  }
  html += `
            <div class="teaser-content-links-report">report</div>
          </div>
        </div>

      </div>
  `;

  return html;
}
