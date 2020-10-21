const onlineTemplate = require('./side-online.template');


module.exports = onlineSidebar = {


  render(app, data) {
    document.body.innerHTML += `<link rel="stylesheet" type="text/css" href="/online/style.css" />`;
    document.querySelector(".arcade-left-sidebar").prepend(app.browser.htmlToElement(onlineTemplate(app)));
    //document.querySelector(".arcade-left-sidebar").innerHTML = onlineTemplate(app);
  },

  attachEvents(app, data) {

  },


}

