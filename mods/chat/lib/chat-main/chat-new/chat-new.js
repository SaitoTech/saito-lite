const ChatNewTemplate = require('./chat-new.template');

module.exports = ChatNew = {
  render(app, data) {
    document.querySelector('.main').innerHTML = ChatNewTemplate();
  },

  attachEvents(app, data) {
    document.getElementById('back-button')
            .onclick = () => {
              data.chat.active = 'chat_list';
              data.chat.main.render(app, data);
            }

    let search_bar = document.getElementById('chat-new-search');
    search_bar.onkeydown = (e) => {
      console.log(search_bar.value);
    }
  },
}