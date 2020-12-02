module.exports = ChatSidebarContactTemplate = (app, group) => {

  let ts = new Date().getTime();
  let msg = '';
  let message = '';

  if (group.messages.length == 0) {
    message = "New Chat Room Created";
  } else {
    message = group.messages[group.messages.length-1];
  }

console.log("A 1");

  if (message) {
    if (message.message) {
      ts = message.timestamp;
      msg = app.crypto.base64ToString(message.message);
      let tmp = document.createElement("DIV");
      tmp.innerHTML = msg;
      msg = tmp.innerText;
      msg = msg.substring(0, 48);
    } else {
      msg = "New Chat Room Created";
    }
  }

console.log("A 2");

  let datetime = app.browser.formatDate(ts);

console.log("A 3");

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

