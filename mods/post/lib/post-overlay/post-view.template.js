
module.exports = PostViewTemplate = (app, mod, sig) => {

  let tx = null;
  for (let i = 0; i < mod.posts.length; i++) {
    if (sig === mod.posts[i].transaction.sig) { tx = mod.posts[i]; }
  }
  if (tx == null) { return; }

  let ts = datetimeFormatter(tx.transaction.ts);

  let html = `
  <div id="post-view-container" class="post-view-container">
    <div id="post-view-overview" class="post-view-overview">
      <div id="post-view-thumbnail" class="post-view-thumbnail" style="background-image: url('/post/img/post-logo.png');"></div>
      <div id="post-view-title" class="post-view-title">${tx.msg.title}</div>
      <div id="post-view-sublinks" class="post-view-sublinks">
        <div id="post-view-posted-by" class="post-view-posted-by">posted by </div>
        <div id="post-view-user" class="post-view-user">${app.keys.returnUsername(tx.transaction.from[0].add)}</div>
        <div id="post-view-ts" class="post-view-ts"> (${ts.years}/${ts.months}/${ts.days} - ${ts.hours}:${ts.minutes})</div>
  `;
  if (tx.msg.link != "") {
    html = `<div id="post-view-container" class="post-view-container">
    <div id="post-view-overview" class="post-view-overview">
      <div id="post-view-thumbnail" class="post-view-thumbnail" style="background-image: url('/post/img/post-logo.png');"></div>
      <div id="post-view-title" class="post-view-title">${tx.msg.title}</div>
      <div id="post-view-url" class="post-view-url">(<a target="_blank" href="${tx.msg.link}">${tx.msg.link}</a>)</div>
      <div id="post-view-sublinks" class="post-view-sublinks">
        <div id="post-view-posted-by" class="post-view-posted-by">posted by </div>
        <div id="post-view-user" class="post-view-user">${app.keys.returnUsername(tx.transaction.from[0].add)}</div>
        <div id="post-view-ts" class="post-view-ts"> (${ts.years}/${ts.months}/${ts.days} - ${ts.hours}:${ts.minutes})</div>
    `;
  }

  if (tx.transaction.from[0].add === app.wallet.returnPublicKey()) {
    html += `<div data-id="${sig}" id="post-view-edit" class="post-view-edit">edit</div>`;
  }

  let comment_filler = '<div class="post-loader-spinner loader" id="post-loader-spinner"></div>';
  if (tx.msg.comment) { comment_filler = tx.msg.comment; }

  html += `
        <div data-id="${sig}" id="post-view-report" class="post-view-report">report</div>
      </div>
      <div data-id="${sig}" id="post-view-parent-comment" class="post-view-parent-comment">${comment_filler}</div>
    </div>
  `;


    if (tx.msg.images.length > 0) {
      html += '<div id="post-view-gallery" class="post-view-gallery">';
      for (let i = 0; i < tx.msg.images.length; i++) {
	html += `<img class="post-view-gallery-image" src="${tx.msg.images[i]}" />`;
      }
      html += '</div>';
    } else {
      html += '<div id="post-view-gallery" style="display:none" class="post-view-gallery"></div>';
    }

  html += `
    <div id="post-view-comments" class="post-view-comments">
    </div>
    <div id="post-view-leave-comment" class="post-view-leave-comment">
      <div>Leave a comment: </div>
      <div id="comment-create" class="post-view-textarea markdown medium-editor-element" placeholder="Your post..." contenteditable="true" spellcheck="true" data-medium-editor-element="true" role="textbox" aria-multiline="true" data-medium-editor-editor-index="1" medium-editor-index="37877e4c-7415-e298-1409-7dca41eed3b8"></div>
      <button class="post-submit-btn">Submit</button>
    </div>
  </div>
  `;

  return html;
}

