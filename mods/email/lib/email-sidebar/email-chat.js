module.exports = EmailChat = {

    render(app, mod) {
      let mods = app.modules.respondTo('email-chat');
      for (let i = 0; i < mods.length; i++) {
	mods[i].render(app, mod);
      }
    },

    attachEvents(app, mod) {
      let mods = app.modules.respondTo('email-chat');
      for (let i = 0; i < mods.length; i++) {
	mods[i].attachEvents(app, mod);
      }
    },

}
