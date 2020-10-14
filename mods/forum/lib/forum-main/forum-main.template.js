module.exports = ForumMainTemplate = () => {
  return `
    <div class="mobile-nav">
      <i class="forum-mobile-back fas fa-arrow-circle-left"></i>
      <i class="forum-mobile-new fas fa-plus-circle"></i>
    </div>
    <div class="post-container"></div>
    <div class="comments"></div>
    <div class="teasers"></div>
  `;
}
