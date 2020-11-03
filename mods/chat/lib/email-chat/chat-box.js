const ChatBoxTemplate = require('./chat-box.template');
const ChatBoxMessageBlockTemplate = require('./chat-box-message-block.template');

var marked = require('marked');
var sanitizeHtml = require('sanitize-html');
const linkifyHtml = require('markdown-linkify');

module.exports = ChatBox = {

    render(app, mod) {

      let chat_self = this;

      document.querySelectorAll(".chat-box").forEach(box => {    

        let group_id = box.id.split('chat-box-')[1];
        let group = null;

        for (let i = 0; i < mod.groups.length; i++) {
  	  if (mod.groups[i].id == group_id) {
	    group = mod.groups[i];
	  }
        }

        if (!group) {
  	  alert("could not find chat group...");
	  return;
        }

        let chat_box_main = document.getElementById(`chat-box-main-${group_id}`);

        chat_self.message_blocks = chat_self.createMessageBlocks(app, mod, group.messages);
        if (chat_self.message_blocks.length == 0) {
          chat_box_main.innerHTML = 
            `<p id="chat-box-default-message-${group.id}" style="text-align:center">
               No messages in this group :(
             </p>`;
        } else {
          chat_self.removeDefaultMessage(group.id);
        }

        chat_self.message_blocks.forEach(message_block => {
          message_block = Object.assign({}, message_block, {
            type: app.wallet.returnPublicKey() == message_block.publickey ? 'myself' : 'others'
          });
          chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(message_block, mod);
        });

        chat_self.scrollToBottom(group.id);

     });

    },


    attachEvents(app, mod) {

      //
      // send messages
      //
      document.querySelectorAll(".chat-room-submit-button").forEach(btn => {
        btn.onclick = (e) => {

	  let group_id = e.currentTarget.id.split('chat-room-submit-button-')[1];
          let msg_input = document.getElementById(`chat-box-new-message-input-${group_id}`);

          if (msg_input.value == '') { return; }
          let msg_data = {
            message: msg_input.value,
            group_id: group_id,
            publickey: app.wallet.returnPublicKey(),
            timestamp: new Date().getTime()
          };

          let newtx = this.createMessage(app, mod, msg_data);
          app.modules.returnModule("Chat").sendMessage(app, newtx);

	  alert("sending chat message!");
          this.addMessage(app, mod, newtx);
          msg_input.value = '';

	};
      });


      //
      // toggle chat window height
      //
      document.querySelectorAll(".chat-box-header").forEach(hdr => {
        hdr.onclick = (e) => {
	  let group_id = e.currentTarget.id.split('chat-box-header-')[1];
          let chat_box = document.getElementById(`chat-box-${group_id}`);
          chat_box.classList.toggle('chat-box-hide');
          chat_box.parentNode.classList.toggle('min-chat');
        };
      });


      //
      // close chat window
      //
      document.querySelectorAll(".chat-box-close").forEach(btn => {
        btn.onclick = (e) => {
	  let group_id = e.currentTarget.id.split('chat-box-close-')[1];
          e.stopPropagation();
          let chat_box = document.getElementById(`chat-box-${group_id}`);
          chat_box.parentNode.removeChild(chat_box);
        };
      });


    },

    showChatBox(app, mod, group) {
      if (!document.querySelector('.chat-box')) { app.browser.addElementToDom(ChatBoxTemplate(group)); } 
      this.attachEvents(app, mod);
    },



    addMessage(app, mod, tx) {
      app.modules.returnModule("Chat").receiveMessage(app, tx);
      this.addTXToDOM(app, mod, tx);
    },

    addTXToDOM(app, mod, tx) {
      let message = Object.assign({}, tx.returnMessage(), { type: 'myself' });
      this.addMessageToDOM(app, mod, message);
    },

    addMessageToDOM(app, mod, msg) {
      try {
        if (document.getElementById(msg.sig)) { return };
        let message = Object.assign({}, msg, {
          keyHTML: mod.addrController.returnAddressHTML(msg.publickey),
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
          chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(last_message_block, mod);
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
          chat_box_main.innerHTML += ChatBoxMessageBlockTemplate(new_message_block, mod);
        }
        // add window.imgPoP to all images in chat_box_main ...

        document.querySelectorAll('.chat-box-main .img-prev').forEach(img => {
          img.addEventListener('click', window.imgPop(img));
        });
        this.scrollToBottom(message.group_id);
      } catch (err) { }
    },


    createMessage(app, mod, msg_data) {

      let publickey = app.network.peers[0].peer.publickey;
      let identicon = app.keys.returnIdenticon(msg_data.publickey);
      let newtx = app.wallet.createUnsignedTransaction(publickey, 0.0, 0.0);
      if (newtx == null) { return; }
      msg_data.message = this.formatMessage(msg_data.message);
      msg_data.message = app.crypto.stringToBase64(msg_data.message);
      newtx.msg = {
          module: "Chat",
          request: "chat message",
          publickey: msg_data.publickey,
          group_id: msg_data.group_id,
          message: msg_data.message,
          //
          // in future will possibly encrypt
          // this.saito.keys.encryptMessage(this.saito.wallet.returnPublicKey(), msg),
          //
          timestamp: msg_data.timestamp,
      };
      newtx.msg.sig = app.wallet.signMessage(JSON.stringify(newtx.msg));
      newtx = app.wallet.signTransaction(newtx);
      return newtx;

    },

    createMessageBlocks(app, mod, messages) {

      let idx = 0;
      let message_blocks = [];


      while (idx < messages.length) {
        let message = Object.assign({}, messages[idx], {
          keyHTML: mod.addrController.returnAddressHTML(messages[idx].publickey),
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
    },

    removeDefaultMessage(group_id) {
      let default_message = document.getElementById(`chat-box-default-message-${group_id}`)
      if (default_message) default_message.parentNode.removeChild(default_message);
    },


    scrollToBottom(group_id) {
      let chat_box_main = document.getElementById(`chat-box-main-${group_id}`);
      if (chat_box_main) { chat_box_main.scrollTop = chat_box_main.scrollHeight; }
    },

}
