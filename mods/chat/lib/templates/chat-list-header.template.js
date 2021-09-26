module.exports = ChatListHeaderTemplate = (group, last_message="", formatted_ts="") => {
  let html = `
    <div data-id="${group.id}" id="chat-row-${group.id}" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
        <div class="chat-group-name">${group.name}</div>
        <div id="chat-last-message-${group.id}" class="chat-last-message">${last_message}</div>
      </div>
      <div style="display: grid;">
        <div id="chat-last-message-timestamp-${group.id}" class="chat-last-message-timestamp">${formatted_ts}</div>
      </div>
    </div>
  `;

  return html;

}

