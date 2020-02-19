module.exports = PostCreateTemplate = () => {
  return `
    <div class="post-create-container">

      <div class="post-create-label">title:</div>
      <input type="text" class="post-create-title" name="post-create-title" />

      <div class="post-create-label">url: <i>(optional)</i></div>
      <input type="text" class="post-create-link" name="post-create-link" />

      <div class="post-create-label">discussion:</div>
      <textarea class="post-create-textarea"></textarea>

      <div class="post-create-label">community:</div>
      <input type="text" class="post-create-forum" name="post-create-forum" />

      <button class="post-submit-btn">Post</button>
    </div>
  `;
}
