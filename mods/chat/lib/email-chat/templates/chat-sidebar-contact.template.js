module.exports = ChatSidebarContactTemplate = (app, group) => {

  let ts = new Date().getTime();
  let msg = '';
  let message = '';

  if (group.messages.length == 0) {
    message = "New Chat Room Created";
  } else {
    message = group.messages[group.messages.length-1];
  }

  if (message) {
    if (message.message) {
      ts = message.timestamp;
      msg = message.message;
      let tmp = document.createElement("DIV");
      tmp.innerHTML = msg;
      msg = tmp.innerText;
      msg = msg.substring(0, 48);
    } else {
      msg = "New Chat Room Created";
    }
  }

  let datetime = app.browser.formatDate(ts);

  return `
    <div id="${group.id}" class="chat-row">
      <img class="chat-row-image" src="${group.identicon}">
      <div class="chat-content">
          <div class="chat-group-name">${group.name}</div>
          <div class="chat-last-message">${msg}</div>
      </div>
      <div style="disaply; grid;">
        <div class="chat-last-message-timestamp">${datetime.hours}:${datetime.minutes}</div>
      </div>
    </div>
  `;
}
