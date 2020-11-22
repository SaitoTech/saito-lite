module.exports = PostMainTemplate = (app, mod) => {
  return `
  <div id="post-container" class="post-container">
    <div id="post-sidebar" class="post-sidebar">
      <div id="email-chat" class="email_chat"></div>
    </div>
    <div id="post-main" class="post-main">
      <div id="post-details" class="post-details"></div>
      <div id="post-add-comment" class="post-add-comment"></div>
      <div id="post-comments" class="post-comments"></div>
    </div>
  </div>
    `;
}

