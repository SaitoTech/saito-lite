module.exports = EmailChat = {

    render(app, data) {

      for (let i = 0; i < data.mods.length; i++) {
        if (data.mods[i].respondTo('email-chat') != null) {
	  data.mods[i].respondTo('email-chat').render(app, data);
    ***REMOVED***
  ***REMOVED***

***REMOVED***,

    attachEvents(app, data) {
      for (let i = 0; i < data.mods.length; i++) {
        if (data.mods[i].respondTo('email-chat') != null) {
	  data.mods[i].respondTo('email-chat').attachEvents(app, data);
    ***REMOVED***
  ***REMOVED***
***REMOVED***,

***REMOVED***
