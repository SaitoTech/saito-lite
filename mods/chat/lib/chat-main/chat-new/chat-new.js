const ChatNewTemplate = require('./chat-new.template');

module.exports = ChatNew = {
  render(app, data) {
    document.querySelector('.main').innerHTML = ChatNewTemplate();
  ***REMOVED***,

  attachEvents(app, data) {
    document.getElementById('back-button')
            .onclick = () => {
              data.chat.active = 'chat_list';
              data.chat.main.render(app, data);
        ***REMOVED***

    let search_bar = document.getElementById('chat-new-search');
    search_bar.onkeydown = (e) => {
      console.log(search_bar.value);
***REMOVED***
  ***REMOVED***,
***REMOVED***