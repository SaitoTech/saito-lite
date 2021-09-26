module.exports = PostSidebarTemplate = (app, mod) => {
  return `
    <div id="post-sidebar" class="post-sidebar">
      <button class="post-sidebar-create-btn"><i class="fas fa-plus-circle"></i> New Post</button>
      <div id="email-chat" class="email_chat"></div>
    </div>
    `;
}

