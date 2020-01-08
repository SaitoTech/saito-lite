module.exports = ChatListRowTemplate = ({name, id, messages=[], identicon}, helpers) => {

  let ts = new Date().getTime();
  let msg = '';
  let message = messages[messages.length - 1];

  if (message) {
    ts = message.timestamp;
    msg = message.message.substring(0, 48);
  }

  let {datetime_formatter} = helpers;
  let datetime = datetime_formatter(ts);

  return `
    <div id="${id}" class="chat-row">
      <img class="chat-row-image" src="${identicon}">
      <div class="chat-content">
          <div class="chat-group-name">${name}</div>
          <div class="chat-last-message">${msg}</div>
      </div>
      <div style="disaply; grid;">
        <div class="chat-last-message-timestamp">${datetime.hours}:${datetime.minutes}</div>
      </div>
    </div>
  `;
}
