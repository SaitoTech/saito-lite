const AlauniusAppspaceTemplate = require('./alaunius-appspace.template.js');

module.exports = AlauniusAppspace = {

    render(app, data) {

        document.querySelector(".alaunius-body").innerHTML = AlauniusAppspaceTemplate();

        if (data.parentmod.appspace_mod == null) { return; ***REMOVED***
	let modobj = data.parentmod.appspace_mod.respondTo("alaunius-appspace");
	if (modobj == null) { return; ***REMOVED***
	modobj.render(app, data);

***REMOVED***,

    attachEvents(app, data) {

      if (data.parentmod.appspace_mod == null) { return; ***REMOVED***
      let modobj = data.parentmod.appspace_mod.respondTo("alaunius-appspace");
      if (modobj == null) { return; ***REMOVED***
      modobj.attachEvents(app, data);

***REMOVED***,

***REMOVED***
