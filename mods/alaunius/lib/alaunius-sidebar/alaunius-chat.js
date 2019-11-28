module.exports = AlauniusChat = {

    render(app, data) {

      for (let i = 0; i < data.mods.length; i++) {
        if (data.mods[i].respondTo('alaunius-chat') != null) {
	  data.mods[i].respondTo('alaunius-chat').render(app, data);
        }
      }

    },

    attachEvents(app, data) {
      for (let i = 0; i < data.mods.length; i++) {
        if (data.mods[i].respondTo('alaunius-chat') != null) {
	  data.mods[i].respondTo('alaunius-chat').attachEvents(app, data);
        }
      }
    },

}
