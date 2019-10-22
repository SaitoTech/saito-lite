module.exports = ChatListRowTemplate = ({name, group_id}, {message, timestamp}) => {
  let datetime = new Date(timestamp);
  let minutes = datetime.getMinutes();
  minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;
  return `
    <div id="${group_id}" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name}</div>
          <div class="chat-last-message">${message.substring(0, 72)}</div>
      </div>
      <div class="chat-last-message-timestamp">${datetime.getHours()}:${minutes}</div>
    </div>
  `;
}