module.exports = PostMainTemplate = (app, mod) => {
  return `
    <div id="post-main" class="post-main">
      <h1 class="forum-title">Forum</h1>
      <div id="post-headers" class="post-headers"></div>
      <div id="post-posts" class="post-posts"></div>
    </div>
    `;
}

