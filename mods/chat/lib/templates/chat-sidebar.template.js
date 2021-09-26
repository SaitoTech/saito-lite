module.exports = ChatSidebarTemplate = () => {
  return `
      <div class="chat-header">
        <h2>Chat</h2>
        <div id="online-count" class="online-count"></div>
        <i id="email-chat-add-contact" class="icon-med fas fa-plus"></i>
      </div>
      <div id="chat-list" class="chat-list"></div>
  `;
}
