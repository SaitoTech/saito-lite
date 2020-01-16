module.exports = ChatRoomMessageTemplate = ({ message, publickey, timestamp, identicon }, sig, type, data) => {
  

  return `
    <div id="${sig}" class="chat-room-message chat-room-message-${type}">
      <div class="chat-message-text">${message}</div>
    </div>
  `
}