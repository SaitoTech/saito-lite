module.exports = ChatRoomMessageTemplate = ({ message, publickey, timestamp }, sig, type) => {
  let datetime = new Date(timestamp);
  return `
    <div id="${sig}" class="chat-room-message chat-room-message-${type}">
      <p>${message}</p>
      <div class="chat-message-header">
          <p class="chat-message-author">${publickey.substring(0, 20)}</p>
          <p class="chat-message-timestamp">${datetime.getHours()}:${datetime.getMinutes()}</p>
      </div>
    </div>
  `
}