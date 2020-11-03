module.exports = ChatContactTemplate = (app, group) => {

console.log("GROUP: " + JSON.stringify(group));

  let ts = new Date().getTime();
  let msg = '';
  let message = group.messages[group.messages.length-1];

  if (message) {
    ts = message.timestamp;
    msg = app.crypto.base64ToString(message.message);
    let tmp = document.createElement("DIV");
    tmp.innerHTML = msg;
    msg = tmp.innerText;
    msg = msg.substring(0, 48);
  }

/***
  let {datetime_formatter} = helpers;
  let datetime = datetime_formatter(ts);
***/

  return `
    <div id="${group.id}" class="chat-row">
      <img class="chat-row-image" src="${group.identicon}">
      <div class="chat-content">
          <div class="chat-group-name">${group.name}</div>
          <div class="chat-last-message">${msg}</div>
      </div>
      <div style="disaply; grid;">
      </div>
    </div>
  `;
}
        //<div class="chat-last-message-timestamp">${datetime.hours}:${datetime.minutes}</div>

