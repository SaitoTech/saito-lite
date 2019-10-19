const EmailChatTemplate = require('./email-chat.template.js');

module.exports = EmailChat = {
    render(app, data) {
      document.querySelector(".email-sidebar").innerHTML += EmailChatTemplate();
      this.attachEvents(app);
***REMOVED***,
    attachEvents(app) {***REMOVED***
***REMOVED***
