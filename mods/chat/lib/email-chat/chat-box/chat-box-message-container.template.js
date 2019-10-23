module.exports = ChatBoxMessageContainerTemplate = (msg_id, msg_author, msg_text, msg_ts) => {
  return `
  <div class="chat-box-message-container">
    <pre id="${msg_id***REMOVED***" class="chat-message"><i class="chat-message-author" style="color: #87afc5;">${msg_author***REMOVED***</i>: <p>${msg_text***REMOVED***</p>
    </pre>
    <p class="chat-timestamp">${msg_ts***REMOVED***</p>
  </div>
  `;
***REMOVED***

