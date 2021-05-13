module.exports = PostMainTemplate = (app, mod) => {
  return `
    <div id="post-main" class="post-main">
      <div class="page-header">
        <h1 class="page-title">Posts</h1>
      </div>
      <div id="post-headers" class="post-headers"></div>
      <div id="post-posts" class="post-posts"></div>
    </div>
    `;
}

