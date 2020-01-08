module.exports = ChatListRowTemplate = ({name, group_id, message, timestamp, is_encrypted}, helpers) => {
  let {datetime_formatter} = helpers;
  let datetime = datetime_formatter(timestamp);
  let lock_icon_html = is_encrypted ? '<div style="justify-self: center;"><i class="fas fa-lock" style="color: black;"></i></div>' : '';

  return `
    <div id="chat-row-${group_id}" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
          <div class="chat-group-name">${name}</div>
          <div class="chat-last-message">${message.substring(0, 72)}</div>
      </div>
      <div style="display: grid;">
        <div class="chat-last-message-timestamp">${datetime.hours}:${datetime.minutes}</div>
        ${lock_icon_html}
      </div>
    </div>
  `;
}