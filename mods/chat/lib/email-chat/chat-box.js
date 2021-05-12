const ChatBoxTemplate = require('./../templates/chat-box.template');
const ChatBoxMessageBlockTemplate = require('./../templates/chat-box-message-block.template');

var marked = require('marked');
var sanitizeHtml = require('sanitize-html');
const linkifyHtml = require('markdown-linkify');
module.exports = ChatBox = {

    render(app, mod) {

      let chat_self = this;

      document.querySelectorAll(".chat-box").forEach(box => {    

        let group_id = box.getAttribute("data-id");

        let idx = -1;
        let chat_box_main = document.getElementById(`chat-box-main-${group_id}`);

        for (let i = 0; i < mod.groups.length; i++) { if (mod.groups[i].id == group_id) { idx = i; } }
        if (idx == -1) { alert("could not find chat group..."); return; }

        if (mod.groups[idx].txs.length == 0) {
          chat_box_main.innerHTML = `<p id="chat-box-default-message-${group_id}" style="text-align:center">No messages in this group :(</p>`;
       }

        //
        // how many messages -- max 100 in community chat
        //
        while (mod.groups[idx].txs.length > 100) {
          mod.groups[idx].txs.shift();
        }


        let message_blocks = mod.createMessageBlocks(mod.groups[idx]);
        let first_comment_sig = "";

              for (let i = 0; i < message_blocks.length; i++) {

          let html = ChatBoxMessageBlockTemplate(app, mod, mod.groups[idx], message_blocks[i]);

          if (i == message_blocks.length-1) {

            let first_comment_sig = "first_comment_sig";
            if (message_blocks[i].length > 0) { first_comment_sig = app.crypto.hash(message_blocks[i][0].transaction.sig); }

            // recreate html after destroying so existing entries are output (template checks to avoid dupes)
            try {document.getElementById(`chat-message-set-${first_comment_sig}`).destroy();}catch(err){};
            html = ChatBoxMessageBlockTemplate(app, mod, mod.groups[idx], message_blocks[i]);
            chat_box_main.innerHTML += html;

          } else {

            chat_box_main.innerHTML += html;

          }

  }
        document.querySelectorAll('img.img-prev').forEach(img => {
          img.addEventListener('click', window.imgPop(img));
        });
        chat_self.scrollToBottom(group_id);
     });

    },

    attachDragAndDropEvents(id, app, mod) {

      //
      // drag and drop images into chat window
      //
      document.querySelectorAll(`#${id}`).forEach(el => {
        app.browser.addDragAndDropFileUploadToElement(el.id, function(filesrc) {
          
          let group_id = el.id.split('chat-box-main-')[1];
          let img = document.createElement('img');
          img.classList.add('img-prev');
          img.src = filesrc;
          let msg = img.outerHTML;
          if (msg.length > mod.max_msg_size) {
            salert("Image too large: 220kb max");
          } else {
            let newtx = mod.createMessage(group_id, img.outerHTML);
            mod.sendMessage(app, newtx);
            mod.receiveMessage(app, newtx);
          }
       }, false); // false = no drag-and-drop image click
     });
    },
    attachEvents(app, mod) {

      let chat_self = this;

      //
      // foreach chat box
      //
      document.querySelectorAll(".chat-box").forEach(box => {    

        let group_id = box.getAttribute("data-id");
        let group = null;
        let msg_input = document.getElementById(`chat-box-new-message-input-${group_id}`);

        //
        // paste image into comment-box
        //
        // window.handlePasteImage(msg_input, (img) => {
        //   let newtx = mod.createMessage(group_id, img);
        //   app.modules.returnModule("Chat").sendMessage(app, newtx);
        //   chat_self.addMessage(app, mod, newtx);
        // });

        //
        // submit on enter
        //
        msg_input.addEventListener("keypress", (e) => {
          if ((e.which == 13 || e.keyCode == 13) && !e.shiftKey) {
            e.preventDefault();
            if (msg_input.value == '') { return; }
            app.browser.logMatomoEvent("Chat", "ArcadeChatSendMessage", "PressedEnter");
            let newtx = mod.createMessage(group_id, msg_input.value);
            mod.sendMessage(app, newtx);
            mod.receiveMessage(app, newtx);
            //chat_self.addMessage(app, mod, newtx);
            msg_input.value = '';
          }
        });
      });


      //
      // send messages
      //
      document.querySelectorAll(".chat-room-submit-button").forEach(btn => {
        btn.ontouch = (e) => {

	  let group_id = e.currentTarget.id.split('chat-room-submit-button-')[1];
          let msg_input = document.getElementById(`chat-box-new-message-input-${group_id}`);

          if (msg_input.value == '') { return; }

          let newtx = mod.createMessage(group_id, msg_input.value);
          app.modules.returnModule("Chat").sendMessage(app, newtx);
          app.modules.returnModule("Chat").receiveMessage(app, newtx);

	  // alert("sending chat message!");
          ///chat_self.addMessage(app, mod, newtx);
          msg_input.value = '';

	};
        btn.onclick = (e) => {

	  let group_id = e.currentTarget.id.split('chat-room-submit-button-')[1];
          let msg_input = document.getElementById(`chat-box-new-message-input-${group_id}`);

          if (msg_input.value == '') { return; }

          let newtx = mod.createMessage(group_id, msg_input.value);
          app.modules.returnModule("Chat").sendMessage(app, newtx);
          app.modules.returnModule("Chat").receiveMessage(app, newtx);

	  // alert("sending chat message!");
          //chat_self.addMessage(app, mod, newtx);
          msg_input.value = '';

	};
      });


      //
      // toggle chat window height
      //
      document.querySelectorAll(".chat-box-header").forEach(hdr => {
        hdr.ontouch = (e) => {

	  let group_id = e.currentTarget.id.split('chat-box-header-')[1];
          let chat_box = document.getElementById(`chat-box-${group_id}`);
          let chat_box_header = document.getElementById(`chat-box-header-${group_id}`);

	  //
	  // don't minimize if moved
	  //
	  if (chat_box.style.left != 0 || chat_box.style.top != 0) {
	    chat_box_header.style.cursor = "unset";
	    // ... unless already minimized 
	    if (!chat_box.classList.contains("min-chat")) {
	      return;
	    }
	  }

          chat_box.classList.toggle('chat-box-hide');
          chat_box.classList.toggle('min-chat');

	  if (chat_box.classList.contains("min-chat")) {
	    chat_box.style.bottom = 0;
	  } else {
	    chat_box.style.bottom = 0;
	  }

	  e.stopPropagation();
	  e.preventDefault();
	  return;

        };
        hdr.onclick = (e) => {

	  let group_id = e.currentTarget.id.split('chat-box-header-')[1];
          let chat_box = document.getElementById(`chat-box-${group_id}`);
          let chat_box_header = document.getElementById(`chat-box-header-${group_id}`);

	  //
	  // don't minimize if moved
	  //
	  if (chat_box.style.left != 0 || chat_box.style.top != 0) {
	    chat_box_header.style.cursor = "unset";
	    // ... unless already minimized 
	    if (!chat_box.classList.contains("min-chat")) {
	      return;
	    }
	  }

          chat_box.classList.toggle('chat-box-hide');
          chat_box.classList.toggle('min-chat');

	  if (chat_box.classList.contains("min-chat")) {
	    chat_box.style.bottom = 0;
	  } else {
	    chat_box.style.bottom = 0;
	  }

	  e.stopPropagation();
	  e.preventDefault();
	  return;

        };
      });


      //
      // close chat window
      //
      document.querySelectorAll(".chat-box-close").forEach(btn => {
        let cgroup = mod.returnCommunityChat();
        btn.ontouch = (e) => {
          let group_id = e.currentTarget.id.split('chat-box-close-')[1];
          if (group_id == cgroup.id) { 
            mod.mute_community_chat = 1;
          }
          e.stopPropagation();
          let chat_box = document.getElementById(`chat-box-${group_id}`);
          chat_box.parentNode.removeChild(chat_box);
        };
        btn.onclick = (e) => {
          let group_id = e.currentTarget.id.split('chat-box-close-')[1];
          if (group_id == cgroup.id) { 
            mod.mute_community_chat = 1;
          }
          e.stopPropagation();
          let chat_box = document.getElementById(`chat-box-${group_id}`);
          chat_box.parentNode.removeChild(chat_box);
        };
      });







      //
      // chat windows draggable
      //
      document.querySelectorAll(".chat-box").forEach(el => {
	let group_id = el.id.split('chat-box-')[1];
        app.browser.makeDraggable(el.id, `chat-box-header-${group_id}`, function() {

return;
	  // toggle height -- DRAG triggers click too
          let chat_box = document.getElementById(`chat-box-${group_id}`);
//	  if (chat_box.classList.contains("chat-box-hide")) {
            chat_box.classList.toggle('chat-box-hide');
//	  }
//	  if (chat_box.parentNode.classList.contains("min-chat")) {
            chat_box.parentNode.classList.toggle('min-chat');
//	  }

	})
      });
    },


    showChatBox(app, mod, group) {

      let chatboxen_open = 0;
      let pixen_consumed = 0;
      let width_of_boxen = 0;

      for (let i = 0; i < mod.groups.length; i++) {
        if (document.getElementById(`chat-box-${mod.groups[i].id}`)) { 
          chatboxen_open++;
          pixen_consumed += document.getElementById(`chat-box-${mod.groups[i].id}`).getBoundingClientRect().width;
        }
      }

      if (chatboxen_open == 0) {
        if (!document.querySelector('.chat-box')) {
          app.browser.addElementToDom(ChatBoxTemplate(group));
          this.attachDragAndDropEvents(`chat-box-main-${group.id}`, app, mod);
        } 
      } else {
        let boxel = document.getElementById(`chat-box-${group.id}`);
        if (!boxel) {
          app.browser.addElementToDom(ChatBoxTemplate(group));
          this.attachDragAndDropEvents(`chat-box-main-${group.id}`, app, mod);
        }
        let newchatbox = document.getElementById(`chat-box-${group.id}`);
        newchatbox.style.right = pixen_consumed + (20*chatboxen_open) + "px";
      }

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
          keyHTML: app.browser.returnAddressHTML(msg.publickey),
          identicon: app.keys.returnIdenticon(msg.publickey),
          identicon_color: app.keys.returnIdenticonColor(msg.publickey),
        });

        let chat_box_main = document.getElementById(`chat-box-main-${message.group_id}`);

console.log("MBL: " + this.message_blocks.length);

	if (this.message_blocks.length > 0) {

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
	} else {

console.log("Here!");

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
        document.querySelectorAll('.img-prev').forEach(img => {
          img.addEventListener('click', window.imgPop(img));
        });
        this.scrollToBottom(message.group_id);
      } catch (err) {
        console.log('Error @ chat-box.js | addMessageToDOM\n ERROR: ' + err);
      }
    },



    createMessageBlocks(app, mod, group) {

      let idx = 0;
      let blocks = [];
      let block = [];
      let txs = group.txs;
      let last_message_sender = "";

      while (idx < txs.length) {
	if (blocks.length == 0) {
	  if (txs[idx].transaction.from[0].add != last_message_sender && last_message_sender != "") {
	    blocks.push(block);
	  }
	  block.push(txs[idx]);
	  last_message_sender = txs[idx].transaction.from[0].add;
	} else {
	  if (txs[idx].transaction.from[0].add == last_message_sender) {
	    block.push(txs[idx]);
	  } else {
	    blocks.push(block);
	    block = [];
            block.push(txs[idx]);
            last_message_sender = txs[idx].transaction.from[0].add;
	  }
	}
	idx++;
      }

      blocks.push(block);

      return blocks;

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
