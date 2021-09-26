
module.exports = PostTeaserTemplate = (app, mod, tx) => {

  let cmt = "0 comments";
  if (tx.children == 1) { cmt = "1 comment"; }
  if (tx.children > 1) { cmt = (tx.children+" comments"); }

  let img = tx.img;
  if (img == undefined) { img = '/post/img/post-logo.png'; }
  if (img == "")        { img = '/post/img/post-logo.png'; }

  return `
    <div data-id="${tx.transaction.sig}" id="post-teaser" class="post-teaser">
      <div class="post-teaser-front">
        <div id="post-teaser-thumbnail" class="post-teaser-thumbnail" style="background-image: url('${img}')"></div>
      </div>
      <div class="post-teaser-back">
        <div  data-id="${tx.transaction.sig}" id="post-teaser-title" class="post-teaser-title">${tx.msg.title}</div>
        <div id="post-teaser-sublinks"  class="post-teaser-sublinks">
	  <div id="post-teaser-posted-by" class="post-teaser-posted-by">posted by </div>
	  <div id="post-teaser-user" class="post-teaser-user">${app.keys.returnUsername(tx.transaction.from[0].add)}</div>
	  <div data-id="${tx.transaction.sig}" id="post-teaser-comments" class="post-teaser-comments">${cmt}</div>
        </div>
      </div>
    </div>

  `;
}

