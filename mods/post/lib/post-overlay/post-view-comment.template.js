
module.exports = PostViewCommentTemplate = (app, mod, tx) => {

  const txmsg = tx.returnMessage();

  const time =  datetimeRelative(tx.transaction.ts);
  const avatar = app.keys.returnIdenticon(tx.transaction.from[0].add);
  const username = app.keys.returnUsername(tx.transaction.from[0].add);


  let html = `
  <div id="post-view-comment" class="post-view-comment">
    <div id="post-view-comment-sublinks" class="post-view-comment-sublinks">
      <div class="post-header">
        <div class="post-user-avatar"><img src="${avatar}" class="post-view-user-identicon" /></div>
        <div class="post-details">
          <div id="post-view-user" class="post-view-user">${username}</div>
          <div id="post-view-ts" class="post-view-ts"> ${time}</div>
        </div>
      </div>
      <div data-id="${tx.originalSig}" id="post-view-comment-text" class="post-view-comment-text">${txmsg.comment}</div>
      <div class="post-view-actions">
  `;

  if (tx.transaction.from[0].add === app.wallet.returnPublicKey()) {
    html += `
        <div data-id="${tx.originalSig}" id="post-view-comment-edit" class="post-view-comment-edit"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
      </svg> edit</div>
    `;
  }

  html += `
        <div data-id="${tx.originalSig}" id="post-view-report" class="post-view-report"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg> report</div>
      </div>
    </div>
  </div>
  `;

  return html;

}


