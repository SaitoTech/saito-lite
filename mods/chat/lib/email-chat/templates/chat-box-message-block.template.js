const ChatBoxMessageTemplate = require('./chat-box-message.template');
const emoji = require('node-emoji');

module.exports = ChatBoxMessageBlockTemplate = (app, mod, group, message_blocks) => {

  //
  // the message_block is just an array of transactions that have
  // arrived for us for chat... so we need to extract the information
  // we want to add to the HTML here and then display it.
  //
  let identicon = "";
  let identicon_color = "";

cahat_self.message_blocks.forEach(message_block => {
          if (!document.getElementById(message_block.sig)) { 
            message_block = Object.assign({}, message_block, {
              type: app.wallet.returnPublicKey() == message_block.publickey ? 'myself' : 'others'
            }); 
            if (new_html != "") {
              chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(message_block, mod);
            }
          }
        });
        


  let { identicon, identicon_color, messages, publickey, keyHTML, last_message_timestamp, type } = message_block;

  let datetime = mod.app.browser.formatDate(last_message_timestamp);

  let messages_unknown = 0;
  let messages_html = "";
  let sigs = [];
  messages.forEach(message => {
    if (!sigs.includes(message.sig) && !document.getElementById(message.sig)) {
      sigs.push(message.sig);
      messages_html += ChatBoxMessageTemplate(message, mod);
      messages_unknown++;
    }
  });

  if (messages_html === "") { return ''; }

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

