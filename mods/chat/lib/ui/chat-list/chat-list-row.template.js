export const ChatListRowTemplate = ({name, room_id}, {message, timestamp}) => {
  let datetime = new Date(timestamp);
  return `
    <div id="${room_id}" class="chat-row">
      <img src="logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name}</div>
          <div class="chat-last-message">${message.substring(0, 72)}</div>
      </div>
      <div class="chat-last-message-timestamp">${datetime.getHours()}:${datetime.getMinutes()}</div>
    </div>
  `;
}