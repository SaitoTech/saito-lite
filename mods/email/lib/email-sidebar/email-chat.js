module.exports = EmailChat = {

    render(app, data) {
      let mods = app.modules.respondTo('email-chat');
      for (let i = 0; i < mods.length; i++) {
	mods[i].render(app, data);
      }
    },

    attachEvents(app, data) {
      let mods = app.modules.respondTo('email-chat');
      for (let i = 0; i < mods.length; i++) {
	mods[i].attachEvents(app, data);
      }
    },

}
