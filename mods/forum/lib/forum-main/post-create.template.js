module.exports = PostCreateTemplate = () => {
  return `
    <div class="post-create-container">

      <div class="post-create-label">Title:</div>
      <input type="text" class="post-create-title" name="post-create-title" placeholder="Post Title" />

      <div class="post-create-label">URL: <i>(optional)</i></div>
      <input type="text" class="post-create-link" name="post-create-link" placeholder="link from post" />

      <div class="post-create-label">Discussion:</div>
      <!--textarea class="post-create-textarea"></textarea-->
      <div id="post-create" class="post-create-textarea markdown" placeholder="Your post..."></div>

      <div class="post-create-label">Community:</div>
      <input type="text" class="post-create-forum" name="post-create-forum" placeholder="Group to post to, think 'subreddit'"/>

      <button class="post-submit-btn">Post</button>
    </div>
  `;
}
