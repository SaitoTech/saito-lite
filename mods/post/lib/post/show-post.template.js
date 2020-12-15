module.exports = ShowPostTemplate = (app, data, row) => {

  if (row.author == app.wallet.returnPublicKey()) {
    return `
    <div class="show-post-wrapper">
      <div class="show-post-form">
        <textarea class="show-post-content">${row.content}</textarea>
        <button class="show-post-update-btn">Update</button>
      </div>
    </div>
    <div class="post-comments"></div>
    `;
  } else {
    return `
    <div class="show-post-wrapper">
      <div class="show-post-form">
        <div class="show-post-content">${row.content}</div>
      </div>
    </div>
    <div class="post-comments"></div>
    `;
  }
}