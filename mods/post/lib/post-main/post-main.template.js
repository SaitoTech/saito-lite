module.exports = PostMainTemplate = (app, mod) => {
  return `
  <div id="post-container" class="post-container">
    <div id="post-sidebar" class="post-sidebar">
      <button class="post-sidebar-create-btn"><i class="fas fa-plus-circle"></i> New Post</button>
      <div id="email-chat" class="email_chat"></div>
    </div>
    <div id="post-main" class="post-main">
      <div id="post-headers" class="post-headers"></div>
      <div id="post-posts" class="post-posts"></div>
    </div>
  </div>
    `;
}

