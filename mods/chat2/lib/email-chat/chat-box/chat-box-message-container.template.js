const ChatRoomMessageTemplate = require('../../chat-main/chat-room/chat-room-message.template');

module.exports = ChatBoxMessageContainerTemplate = ({
  message,
  keyHTML,
  timestamp,
  identicon,
  identicon_color,
  sig,
  type
}, data) => {

  let { datetime_formatter } = data.chat.helpers;
  let datetime = datetime_formatter(timestamp);

  // if (document.getElementById(sig)) { return ""; } 

  return `
    <div class="chat-message-set chat-message-set-${type}">
      <img src="${identicon}" class="chat-room-message-identicon"/>
      <div class="chat-message-set-content chat-message-set-content-${type}">
        <div class="chat-message-header">
                <p class="chat-message-author">${keyHTML}</p>
                <p class="chat-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
        </div>
        <div class="chat-box-message-container chat-box-message-container-${type}" id="chat-box-message-container-${sig}" style="border-color:${identicon_color};">
          ${ChatRoomMessageTemplate({ message, sig, type }, data)}
        </div>
      </div>
    </div>
  `;
}


