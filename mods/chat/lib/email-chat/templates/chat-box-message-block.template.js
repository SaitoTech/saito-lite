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
  let last_message_timestamp = new Date().getTime();
  let type = "others";
  let first_comment_sig = "";
  let comments_to_add = 0;

  //
  // key data
  //
  if (group.members.length == 2) {
    address = group.members[0] != app.wallet.returnPublicKey() ? group.members[0] : group.members[1];
    publickey = address;
  } else {
    address = group.id;
    publickey = group.members[0];
  }

  identicon = app.keys.returnIdenticon(address);
  identicon_color = app.keys.returnIdenticonColor(address),
  keyHTML = app.browser.returnAddressHTML(address);

  //
  // duck out if no messages
  //
  if (message_block.length == 0) {
    return '';
  }


  //
  // generate internal messages
  //
  let sigs = [];
  let messages_html = "";
  for (let i = 0; i < message_block.length; i++) {
    let tx = message_block[i];
    if (i == 0) {
      first_comment_sig = app.crypto.hash(tx.transaction.sig);
    }
    if (type == "others") {
      if (tx.transaction.from[0].add == app.wallet.returnPublicKey()) {
	type = "myself";
      }
    }
    let txmsg = tx.returnMessage();

    if (!document.getElementById(tx.transaction.sig) && !sigs.includes(tx.transaction.sig)) {
      messages_html += ChatBoxMessageTemplate(app, mod, txmsg.message, tx.transaction.sig, type);
      last_message_timestamp = tx.transaction.ts;
      publickey = tx.transaction.from[0].add;
      identicon = app.keys.returnIdenticon(publickey);
      identicon_color = app.keys.returnIdenticonColor(publickey),
      keyHTML = app.browser.returnAddressHTML(publickey);
      sigs.push(tx.transaction.sig);
      comments_to_add++;
    }
  }

  let datetime = mod.app.browser.formatDate(last_message_timestamp);

  if (comments_to_add == 0) { return ''; }


  return `
    <div class="chat-message-set chat-message-set-${type} chat-message-set-${first_comment_sig}" id="chat-message-set-${first_comment_sig}">
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

