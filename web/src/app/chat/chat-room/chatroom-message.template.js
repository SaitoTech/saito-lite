export const ChatRoomMessageTemplate = (sig, msg, author, ts, type) => {
  let datetime = new Date(ts);
  return `
    <div id="${sig}" class="chat-room-message chat-room-message-${type}">
      <p>${msg}</p>
      <div class="chat-message-header">
          <p class="chat-message-author">${author.substring(0, 20)}</p>
          <p class="chat-message-timestamp">${datetime.getHours()}:${datetime.getMinutes()}</p>
      </div>
    </div>
  `
}