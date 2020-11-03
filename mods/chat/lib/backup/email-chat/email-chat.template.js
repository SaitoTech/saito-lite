module.exports = EmailChatTemplate = () => {
  return `
      <div class="chat-header" style="display: flex; align-items: center; justify-content: space-between;">
        <h2>Chat</h2>
        <div class="online-count"></div>
        <i id="email-chat-add-contact" class="icon-med fas fa-plus"></i>
      </div>
      <div class="chat-list"></div>
  `;
}
