module.exports = ForumTeaserTemplate = (app, data, tx) => {

  let author = data.forum.formatAuthor(tx.transaction.from[0].add);
  let link = tx.transaction.msg.link;
  let domain = tx.transaction.domain || "";
  let subforum = "/forum/main";
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

  if (tx.transaction.msg.forum) { subforum = "/forum/"+tx.transaction.msg.forum; }
  if (link == "") { link = subforum+"/"+tx.transaction.sig; }
  let discussion_link = subforum + "/" + tx.transaction.sig;

  let html = `
      <div class="teaser" id="${tx.transaction.sig}">

        <div class="teaser-author">${data.forum.formatAuthor(tx.transaction.from[0].add)}</div>

        <div class="teaser-votes">
          <div class="post_upvote post_upvote_${tx.transaction.sig} upvote-wrapper" id="${tx.transaction.sig}" >
            <i class="fa fa-arrow-up upvote post_upvote_arrow post_upvote_arrow_${tx.transaction.sig}" aria-hidden="true"></i>
          </div>
          <div class="votes-total" id="votes-total-${tx.transaction.sig}">${tx.transaction.votes}</div>
          <div class="post_downvote post_downvote_${tx.transaction.sig} downvote-wrapper" id="${tx.transaction.sig}" >
            <i class="fa fa-arrow-down downvote post_downvote_arrow post_downvote_arrow_${tx.transaction.sig}" aria-hidden="true"></i>
	  </div>
        </div>

        <div class="teaser-thumbnail"><img src="${thumbnail}" class="teaser-thumbnail-image" /></div>

        <div class="teaser-content">
          <div class="teaser-content-title"><a href="${link}">${tx.transaction.msg.title}</a> 
  `;
   if (domain != "") {
     html += `<div class="teaser-site">(<a href="${link}">${domain}</a>)</div>`;
   }
   html += `
	  </div>
          <div class="teaser-content-details">submitted by <span class="post_author_clickable" id="post_author_clickable_${tx.transaction.sig}">${author}</span> to <a href="${subforum}">${subforum}</a><span class="post_author_address" id="${tx.transaction.from[0].add}" style="display:none"></span></div>
          <div class="teaser-content-links">
            <div class="teaser-content-links-comments"><a href="${discussion_link}">${comments_text}</a></div>
  `;
  if (app.wallet.returnPublicKey() == tx.transaction.from[0].add) {
    html += `<div class="teaser-content-links-edit">edit</div>`;
    html += `<div class="teaser-content-links-delete" id="${tx.transaction.sig}">delete</div>`;
  }
  html += `
            <div class="teaser-content-links-report">report</div>
          </div>
        </div>

      </div>
  `;

  return html;
}
