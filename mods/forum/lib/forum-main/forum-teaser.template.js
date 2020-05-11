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
  if(tx.transaction.img) {
    if(tx.transaction.img.length > 0) {thumbnail = tx.transaction.img}
  }

  if (tx.transaction.msg.forum) { subforum = "/forum/"+tx.transaction.msg.forum; }
  if (link == "") { link = subforum+"/"+tx.transaction.sig; }
  let discussion_link = subforum + "/" + tx.transaction.sig;

  let html = `
      <div class="teaser teaser_${tx.transaction.sig}" id="${tx.transaction.sig}">

        
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

        <div class="teaser-thumbnail"  style="background-image: url('${thumbnail}');"></div>
        <div class="teaser-head-details">
            <div class="teaser-content">
              <div class="teaser-content-title"><a href="${discussion_link}">${tx.transaction.msg.title}</a></div>
  `;
   if (domain != "") {
     html += `<div class="teaser-site" alt="${subforum}"><a href="${link}"><i class="fas fa-external-link-square-alt"></i> ${domain}</a></div>`;
   } else {
     html += `<div class="teaser-site">(<a href="${subforum}"><i class="fas fa-external-link-square-alt"></i> ${subforum}</a>)</div>`;
   }
   html += `
    
    
            <div class="teaser-content-details">submitted by <span class="post_author_clickable" id="post_author_clickable_${tx.transaction.sig}">${author}</span></div>
            <div class="teaser-content-links">
              <div class="teaser-content-links-comments"><a href="${discussion_link}">${comments_text}</a></div>
  `;
  if (app.wallet.returnPublicKey() == tx.transaction.from[0].add) {
    html += `<div class="teaser-content-links-edit">edit</div>`;
    html += `<div class="teaser-content-links-delete" id="${tx.transaction.sig}">delete</div>`;
  }
  html += `
            <div class="teaser-content-links-report" id="${tx.transaction.sig}">report</div>
          
          </div>
        </div>
        </div>
      </div>
  `;

  return html;
}
