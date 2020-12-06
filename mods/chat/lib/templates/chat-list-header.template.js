module.exports = ChatListHeaderTemplate = (group) => {

  let html = `
    <div data-id="${group.id}" id="chat-row-${group.id}" class="chat-row">
      <img src="/saito/img/logo-color.svg">
      <div class="chat-content">
        <div class="chat-group-name">Saito Community Server</div>
        <div class="chat-last-message">o7 recc</div>
      </div>
      <div style="display: grid;">
        <div class="chat-last-message-timestamp">4:52</div>
      </div>
    </div>
  `;

  return html;

}

