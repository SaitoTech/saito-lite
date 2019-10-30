module.exports = ChatBoxTemplate = (name="", group_id="") => {
  return `
    <div class="chat-box" id="chat-box-${group_id}">
      <div class="chat-box-header" id="chat-box-header">
        <span>Chat - ${name}</span>
        <span id="chat-box-close" style="justify-self:end">&#x2715</span>
      </div>
      <div class="chat-box-main" id="chat-box-main-${group_id}"></div>
      <div class="chat-box-input" id="chat-box-input">
        <textarea class="chat-box-new-message-input" id="chat-box-new-message-input"></textarea>
        <div class="chat-room-submit-button"><i class="icon-small fas fa-arrow-right"></i></div>
      </div>
    </div>
  `;
}

