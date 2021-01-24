
module.exports = PostViewCommentTemplate = (app, mod, tx) => {

  let txmsg = tx.returnMessage();
  let ts = datetimeFormatter(tx.transaction.ts);

  let html = `
  <div id="post-view-comment" class="post-view-comment">
    <div id="post-view-comment-sublinks" class="post-view-comment-sublinks">
      <div id="post-view-posted-by" class="post-view-posted-by"><img src="${app.keys.returnIdenticon(tx.transaction.from[0].add)}" class="post-view-user-identicon" /></div>
      <div id="post-view-user" class="post-view-user">${app.keys.returnUsername(tx.transaction.from[0].add)}</div>
      <div id="post-view-ts" class="post-view-ts"> (${ts.years}/${ts.months}/${ts.days} - ${ts.hours}:${ts.minutes})</div>
  `;

  if (tx.transaction.from[0].add === app.wallet.returnPublicKey()) {
    html += `
      <div data-id="${tx.originalSig}" id="post-view-comment-edit" class="post-view-comment-edit">edit</div>
    `;
  }

  html += `
      <div id="post-view-report" class="post-view-report">report</div>
    </div>
    <div data-id="${tx.originalSig}" id="post-view-comment-text" class="post-view-comment-text">${txmsg.comment}</div>
  </div>
  `;

  return html;

}


