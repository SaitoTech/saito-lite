const ChatBox = require('../chat-box/chat-box');

module.exports = ChatManager = {
  initialize(app, data) {
    const render_manager_listner = () => {
      this.render(app, data);
      this.attachEvents(app, data);
    }

    const receive_msg_listener = (msg) => this.addMessageToDOM(app, data, msg);

    app.connection.removeAllListeners("chat-render-box-request");
    app.connection.on("chat-render-box-request", render_manager_listner);

    app.connection.removeAllListeners('chat_receive_message');
    app.connection.on('chat_receive_message', receive_msg_listener);
  },

  render(app, data) {
    if( typeof window != "undefined") {
      if (!document.querySelector('.chat-manager')) {
        let {el_parser} = data.chat.helpers;
        let parent_ids = ['content', 'container', 'main'];
        let parent_elem;

        parent_ids.forEach(id => {
          if (document.getElementById(id)) {
            parent_elem = document.getElementById(id);
          }
        });

        if (!parent_elem) return;
        parent_elem.append(el_parser('<div class="chat-manager"></div>'));
      }
      if (data.chat.active_groups == 0 && data.chat.groups.length > 0) data.chat.active_groups = [data.chat.groups[0]];
      data.chat.active_groups.forEach(group => this.addChatBox(app, data, group));
    }
  },

  attachEvents(app, data) {},

  addChatBox(app, data, group) {
    ChatBox.render(app, data, group);
    ChatBox.attachEvents(app, data, group);
  },

  openChatBox(app, data, selected_group,) {
    this.addChatBox(app, data, selected_group);
    data.chat.active_groups.push(selected_group);

    // select textarea
    let chat_box_input = document.getElementById(`chat-box-new-message-input-${selected_group.id}`);
    chat_box_input.focus();
    chat_box_input.select();
  },

  addMessageToDOM(app, data, msg) {
    ChatBox.addMessageToDOM(app, data, msg);
  },
}
