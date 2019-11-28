const AlauniusAppspaceTemplate = require('./alaunius-appspace.template.js');

module.exports = AlauniusAppspace = {

    render(app, data) {

        document.querySelector(".alaunius-body").innerHTML = AlauniusAppspaceTemplate();

        if (data.parentmod.appspace_mod == null) { return; }
	let modobj = data.parentmod.appspace_mod.respondTo("alaunius-appspace");
	if (modobj == null) { return; }
	modobj.render(app, data);

    },

    attachEvents(app, data) {

      if (data.parentmod.appspace_mod == null) { return; }
      let modobj = data.parentmod.appspace_mod.respondTo("alaunius-appspace");
      if (modobj == null) { return; }
      modobj.attachEvents(app, data);

    },

}
