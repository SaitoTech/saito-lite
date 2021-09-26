module.exports = NewPostTemplate = (app, data) => {
    return `
    
    <div class="new-post-wrapper">
      <div class="new-post-form">
      <div class="post-close"></div>
      <textarea class="new-post-content" placeholder"Write your post here"></textarea>
        <button class="new-post-btn">Post</button>
      </div>
    </div>

    `;

}