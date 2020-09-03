const ChatBoxTemplate = require('./chat-box.template.js');
const ChatBoxMessageBlockTemplate = require('./chat-box-message-block.template.js');

var marked = require('marked');
var sanitizeHtml = require('sanitize-html');
const linkifyHtml = require('markdown-linkify');
//const emoji = require('node-emoji');

module.exports = ChatBox = {

  group: {},

  render(app, data, group = null) {

    if (!group) { return; }

    let active_group_name = "";
    active_group_name = group.name;

    if (!document.getElementById(`chat-box-${group.id}`)) {
      let { el_parser } = data.chat.helpers;
      document.querySelector('.chat-manager').append(el_parser(ChatBoxTemplate(active_group_name, group.id)));
    }

    let chat_box_main = document.getElementById(`chat-box-main-${group.id}`);

    this.message_blocks = this.createMessageBlocks(app, data, group.messages);
    if (this.message_blocks.length == 0) {
      chat_box_main.innerHTML =
        `<p id="chat-box-default-message-${group.id}" style="text-align:center">
              No messages in this group :(
            </p>`;
    } else {
      this.removeDefaultMessage(group.id);
      //this is a cludge that should be removed in a rewrite of the arcade page.
      if (chat_box_main.querySelectorAll('.chat-message-set').length > 0) {
        chat_box_main.innerHTML = "";
      }
    }

    this.message_blocks.forEach(message_block => {
      message_block = Object.assign({}, message_block, {
        type: app.wallet.returnPublicKey() == message_block.publickey ? 'myself' : 'others'
      });
      chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(message_block, data);
    });

    this.scrollToBottom(group.id);
  },

  attachEvents(app, data, group) {
    let msg_input = document.getElementById(`chat-box-new-message-input-${group.id}`);

    window.handlePasteImage(msg_input, (img) => {

      let msg_data = {
        message: img,
        group_id: group.id,
        publickey: app.wallet.returnPublicKey(),
        timestamp: new Date().getTime()
      };

      let newtx = this.createMessage(app, data, msg_data);
      app.modules.returnModule("Chat").sendMessage(app, newtx);

      this.addMessage(app, data, newtx);

    });

    msg_input.addEventListener("keypress", (e) => {
      if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
        e.preventDefault();
        if (msg_input.value == '') { return; }

        let msg_data = {
          message: msg_input.value,
          group_id: group.id,
          publickey: app.wallet.returnPublicKey(),
          timestamp: new Date().getTime()
        };

        let newtx = this.createMessage(app, data, msg_data);
        app.modules.returnModule("Chat")
          .sendMessage(app, newtx);

        this.addMessage(app, data, newtx);
        msg_input.value = '';
      }
    });

    document.querySelector('.chat-room-submit-button').addEventListener('click', () => {
      if (msg_input.value == '') { return; }
      let msg_data = {
        message: msg_input.value,
        group_id: group.id,
        publickey: app.wallet.returnPublicKey(),
        timestamp: new Date().getTime()
      };

      let newtx = this.createMessage(app, data, msg_data);
      app.modules.returnModule("Chat")
        .sendMessage(app, newtx);

      this.addMessage(app, data, newtx);
      msg_input.value = '';
    });

    let chat_box_header = document.getElementById(`chat-box-header-${group.id}`);
    chat_box_header.onclick = () => {
      let chat_box = document.getElementById(`chat-box-${group.id}`);
      chat_box.classList.toggle('chat-box-hide');
      chat_box.parentNode.classList.toggle('min-chat');
    };

    document.getElementById(`chat-box-close-${group.id}`)
      .onclick = (e) => {
        e.stopPropagation();

        let group_id = e.currentTarget.id.split('-')[3];
        data.chat.active_groups = data.chat.active_groups.filter(group => group.id != group_id);

        // let chat_manager = document.querySelector('.chat-manager');
        let chat_box_to_delete = document.getElementById(`chat-box-${group_id}`);
        chat_box_to_delete.parentNode.removeChild(chat_box_to_delete);
      };

  },

  addMessage(app, data, tx) {
    app.modules.returnModule("Chat").receiveMessage(app, tx);
    this.addTXToDOM(app, data, tx);
  },

  addTXToDOM(app, data, tx) {
    let message = Object.assign({}, tx.returnMessage(), { type: 'myself' });
    this.addMessageToDOM(app, data, message);
  },

  addMessageToDOM(app, data, msg) {
    try {
      if (document.getElementById(msg.sig)) {console.log('we have this message alread'); return};
      let message = Object.assign({}, msg, {
        keyHTML: data.chat.addrController.returnAddressHTML(msg.publickey),
        identicon: app.keys.returnIdenticon(msg.publickey),
        identicon_color: app.keys.returnIdenticonColor(msg.publickey),
      });
      //remove safety base64 encoding.
      message.message = app.crypto.base64ToString(message.message);

      let chat_box_main = document.getElementById(`chat-box-main-${message.group_id}`);

      let last_message_block = Object.assign({ messages: [] }, this.message_blocks[this.message_blocks.length - 1]);
      let last_message = Object.assign({}, last_message_block.messages[last_message_block.messages.length - 1]);

      if (last_message.publickey == message.publickey) {
        last_message_block = Object.assign({}, last_message_block, {
          last_message_timestamp: message.timestamp,
          last_message_sig: message.sig,
          messages: [...last_message_block.messages, message],
          type: app.wallet.returnPublicKey() == message.publickey ? 'myself' : 'others',
        });
        chat_box_main.removeChild(chat_box_main.lastElementChild);
        chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(last_message_block, data);
        this.message_blocks[this.message_blocks.length - 1] = last_message_block;
      } else {
        let new_message_block = Object.assign({}, {
          publickey: message.publickey,
          group_id: message.group_id,
          last_message_timestamp: message.timestamp,
          last_message_sig: message.sig,
          keyHTML: message.keyHTML,
          identicon: message.identicon,
          identicon_color: message.identicon_color,
          type: app.wallet.returnPublicKey() == message.publickey ? 'myself' : 'others',
          messages: [message]
        });
        this.message_blocks.push(new_message_block);
        chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(new_message_block, data);
      }
      // add window.imgPoP to all images in chat_box_main ...

      document.querySelectorAll('.chat-box-main .img-prev').forEach(img => {
        img.addEventListener('click', window.imgPop(img));
      });
      this.scrollToBottom(message.group_id);
    } catch (err) { }
  },

  createMessage(app, data, msg_data) {

    let publickey = app.network.peers[0].peer.publickey;
    let identicon = app.keys.returnIdenticon(msg_data.publickey);
    let newtx = app.wallet.createUnsignedTransaction(publickey, 0.0, 0.0);
    if (newtx == null) { return; }
    // format
    msg_data.message = this.formatMessage(msg_data.message);
    // encode to base64
    msg_data.message = app.crypto.stringToBase64(msg_data.message);
    newtx.msg = {
      module: "Chat",
      request: "chat message",
      publickey: msg_data.publickey,
      //identicon: identicon,
      group_id: msg_data.group_id,
      message: msg_data.message,

      //
      // will possibly encrypt
      // this.saito.keys.encryptMessage(this.saito.wallet.returnPublicKey(), msg),
      //
      timestamp: msg_data.timestamp,
    };

    newtx.msg.sig = app.wallet.signMessage(JSON.stringify(newtx.msg));
    newtx = app.wallet.signTransaction(newtx);
    return newtx;
  },

  removeDefaultMessage(group_id) {
    let default_message = document.getElementById(`chat-box-default-message-${group_id}`)
    if (default_message) default_message.parentNode.removeChild(default_message);
  },

  scrollToBottom(group_id) {
    let chat_box_main = document.getElementById(`chat-box-main-${group_id}`);
    if (chat_box_main) {
      chat_box_main.scrollTop = chat_box_main.scrollHeight;
    }
  },

  createMessageBlocks(app, data, messages) {
    let idx = 0;
    let message_blocks = [];

    while (idx < messages.length) {
      let message = Object.assign({}, messages[idx], {
        keyHTML: data.chat.addrController.returnAddressHTML(messages[idx].publickey),
        identicon: app.keys.returnIdenticon(messages[idx].publickey),
        identicon_color: app.keys.returnIdenticonColor(messages[idx].publickey),
      });
      // decode
      message.message = app.crypto.base64ToString(message.message);
      // message.message = this.formatMessage(message.message);
      if (idx == 0) {
        let new_message_block = Object.assign({}, {
          publickey: message.publickey,
          group_id: message.group_id,
          last_message_timestamp: message.timestamp,
          last_message_sig: message.sig,
          keyHTML: message.keyHTML,
          identicon: message.identicon,
          identicon_color: message.identicon_color,
          messages: [message]
        });
        message_blocks.push(new_message_block);
      } else {
        if (messages[idx - 1].publickey == message.publickey) {
          let latest_message_block = message_blocks[message_blocks.length - 1];
          let updated_message_block = Object.assign({}, latest_message_block, {
            last_message_timestamp: message.timestamp,
            last_message_sig: message.sig,
            messages: [...latest_message_block.messages, message],
          });
          message_blocks[message_blocks.length - 1] = updated_message_block;
        } else {
          let new_message_block = Object.assign({}, {
            publickey: message.publickey,
            group_id: message.group_id,
            last_message_timestamp: message.timestamp,
            last_message_sig: message.sig,
            keyHTML: message.keyHTML,
            identicon: message.identicon,
            identicon_color: message.identicon_color,
            messages: [message]
          });
          message_blocks.push(new_message_block);
        }
      }
      idx++;
    }
    return message_blocks;
  },

  formatMessage(msg) {
    msg = linkifyHtml(msg, { target: { url: '_self' } });
    msg = marked(msg);
    msg = sanitizeHtml(msg, {
      allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'marquee', 'pre'
      ],
      allowedAttributes: {
        div: ['class', 'id'],
        a: ['href', 'name', 'target', 'class', 'id'],
        img: ['src', 'class']
      },
      selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
      allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
      allowedSchemesByTag: {},
      allowedSchemesAppliedToAttributes: ['href', 'cite'],
      allowProtocolRelative: true,
      transformTags: {
        'a': sanitizeHtml.simpleTransform('a', { target: '_blank' })
      }
    });
    //msg = emoji.emojify(msg);

    return msg;
  }

  /*
  
  'img': function(tagName, attribs) {
              attribs.class = 'chat-message-markdown';
              return {
                tagName: 'img',
                attribs
              };
            },
  
  */


}

