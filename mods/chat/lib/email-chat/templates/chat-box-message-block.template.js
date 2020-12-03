const ChatBoxMessageTemplate = require('./chat-box-message.template');
const emoji = require('node-emoji');

module.exports = ChatBoxMessageBlockTemplate = (app, mod, group, message_block) => {

  //
  // the message_block is just an array of transactions that have
  // arrived for us for chat... so we need to extract the information
  // we want to add to the HTML here and then display it.
  //
  let address = "";
  let identicon = "";
  let identicon_color = "";
  let type = "others";
  let last_message_timestamp = new Date().getTime();

  //
  // key data
  //
  if (group.members.length == 2) {
    address = group.members[0] != this.app.wallet.returnPublicKey() ? group.members[0] : group.members[1];
  } else {
    address = "Group " + id.substring(0, 10);
  }
  identicon = app.keys.returnIdenticon(address);
  identicon_color = app.keys.returnIdenticonColor(address),
  keyHTML = app.browser.returnAddressHTML(address);

  //
  // generate internal messages
  //
  for (let i = 0; i < message_block.length; i++) {
    let tx = message_block[i];
    if (type == "others") {
      if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) {
	type = "myself";
      }
    }
    let txmsg = tx.returnMessage();
    messages_html += ChatBoxMessageTemplate(app, mod, txmsg.msg);
    last_message_timestamp = tx.transaction.ts;
  }
  let datetime = mod.app.browser.formatDate(last_message_timestamp);

  return `
    <div class="chat-message-set chat-message-set-${type}" id="chat-message-set-${publickey}-${last_message_timestamp}">
      <img src="${identicon}" class="chat-room-message-identicon"/>
      <div class="chat-message-set-content chat-message-set-content-${type}">
        <div class="chat-message-header">
              <p class="chat-message-author">${keyHTML}</p>
              <p class="chat-message-timestamp">${datetime.hours}:${datetime.minutes}</p>
        </div>
        <div class="chat-box-message-container chat-box-message-container-${type}" style="border-color:${identicon_color};">
          ${emoji.emojify(messages_html)}
        </div>
      </div>
    </div>
  `;
}

