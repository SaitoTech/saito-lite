const ChatRoomMessageTemplate = require('../../chat-main/chat-room/chat-room-message.template');

module.exports = ChatBoxMessageContainerTemplate = ({ message, publickey, timestamp, identicon }, sig, type, data) => {

  let { datetime_formatter } = data.helpers;
  let datetime = datetime_formatter(timestamp);

  let line_color = data.chat.app.crypto.base64ToString(identicon.split(",")[1]).split("fill:")[1].split(";")[0];


  return `
    <div class="chat-message-set chat-message-set-${type}">
      <img src="${identicon}" class="chat-room-message-identicon"/>
      <div class="chat-message-set-content chat-message-set-content-${type}">
        <div class="chat-message-header">
                <p class="chat-message-author">${publickey.substring(0, 16)}</p>
                <p class="chat-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
        </div>
        <div class="chat-box-message-container chat-box-message-container-${type}" id="chat-box-message-container-${sig}" style="border-color:${line_color};">
          ${ChatRoomMessageTemplate({ message, publickey, timestamp, identicon }, sig, type, data)}
        </div>
      </div>
    </div>
  `;
}