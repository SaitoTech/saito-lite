const ArcadeLeftSidebarTemplate 	= require('./arcade-left-sidebar.template.js');

module.exports = ArcadeLeftSidebar = {

    render(app, data) {

      document.querySelector(".arcade-left-sidebar").innerHTML = ArcadeLeftSidebarTemplate();

      for (let i = 0; i < data.mods.length; i++) {
        if (data.mods[i].respondTo('email-chat') != null) {
          data.mods[i].respondTo('email-chat').render(app, data);
    ***REMOVED***
  ***REMOVED***

***REMOVED***,

    attachEvents(app, data) {
***REMOVED***

***REMOVED***



