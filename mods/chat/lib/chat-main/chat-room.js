const ChatRoomTemplate = require('./templates/chat-room.template');
const ChatMessageTemplate = require('./templates/chat-message-container.template');

var marked = require('marked');
var sanitizeHtml = require('sanitize-html');
const linkifyHtml = require('markdown-linkify');

module.exports = ChatRoom = {

    render(app, mod, group) {

      document.getElementById("chat-main").innerHTML = "";
      app.browser.addElementToDom(ChatRoomTemplate(group), "chat-main");

      let message_input = document.querySelector('#input.chat-room-input');
      let msg = message_input == null ? '' : message_input.value;

      this.room_message_blocks = this.createRoomMessageBlocks(app, mod, group.messages);
      this.room_message_blocks.forEach(message_block => {
        message_block = Object.assign({}, message_block, {
          type : app.wallet.returnPublicKey() == message_block.publickey ? 'myself' : 'others'
        });
        document.querySelector('.chat-room-content').innerHTML += ChatMessageContainerTemplate(message_block, group);
      });

      this.scrollToBottom();

    },

    attachEvents(app, mod) {

    },



    createRoomMessageBlocks(app, mod, messages) {

        let idx = 0;
        let room_message_blocks = [];
        
        while (idx < messages.length) {

            let message = Object.assign({}, messages[idx], {
                keyHTML: app.browser.returnAddressHTML(messages[idx].publickey),
                identicon : app.keys.returnIdenticon(messages[idx].publickey),
                identicon_color : app.keys.returnIdenticonColor(messages[idx].publickey),
            }); 

            //message.message = app.crypto.base64ToString(message.message);

            if (idx == 0) {
                let new_message_block = Object.assign({}, {
                    publickey: message.publickey,
                    group_id: message.group_id,
                    last_message_timestamp: message.timestamp,
                    last_message_sig: message.sig,
                    keyHTML: message.keyHTML,
                    identicon : message.identicon,
                    identicon_color : message.identicon_color,
                    messages: [message]
                }); 
                room_message_blocks.push(new_message_block);
            } else {
                if (messages[idx - 1].publickey == message.publickey) {
                    let latest_message_block = room_message_blocks[room_message_blocks.length - 1];
                    let updated_message_block = Object.assign({}, latest_message_block, {
                        last_message_timestamp: message.timestamp,
                        last_message_sig: message.sig,
                        messages: [...latest_message_block.messages, message],
                    }); 
                    room_message_blocks[room_message_blocks.length - 1] = updated_message_block;
                } else {
                    let new_message_block = Object.assign({}, {
                        publickey: message.publickey,
                        group_id: message.group_id,
                        last_message_timestamp: message.timestamp,
                        last_message_sig: message.sig,
                        keyHTML: message.keyHTML,
                        identicon : message.identicon,
                        identicon_color : message.identicon_color,
                        messages: [message]
                    }); 
                    room_message_blocks.push(new_message_block);
                }   
            }   
            idx++;
        }   
        return room_message_blocks;
    },  





}





