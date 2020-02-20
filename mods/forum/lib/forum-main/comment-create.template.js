module.exports = CommentCreateTemplate = () => {
  return `
    <div class="comment-create-container">
      <textarea class="comment-create-textarea"></textarea>
      <input type="button" class="comment-create-btn" value="comment" />
    </div>
  `;
}
