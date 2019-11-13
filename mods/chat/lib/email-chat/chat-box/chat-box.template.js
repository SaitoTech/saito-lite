module.exports = ChatBoxTemplate = (name="", group_id="") => {
  return `
    <div class="chat-box" id="chat-box-${group_id***REMOVED***">
      <div class="chat-box-header" id="chat-box-header-${group_id***REMOVED***">
        <span>Chat - ${name***REMOVED***</span>
        <span class="chat-box-close" id="chat-box-close-${group_id***REMOVED***" style="justify-self:end">&#x2715</span>
      </div>
      <div class="chat-box-main" id="chat-box-main-${group_id***REMOVED***"></div>
      <div class="chat-box-input" id="chat-box-input-${group_id***REMOVED***">
        <textarea class="chat-box-new-message-input" id="chat-box-new-message-input-${group_id***REMOVED***"></textarea>
        <div class="chat-room-submit-button" id="chat-room-submit-button-${group_id***REMOVED***"><i class="icon-small fas fa-arrow-right"></i></div>
      </div>
    </div>
  `;
***REMOVED***

