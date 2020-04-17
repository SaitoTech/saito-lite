const onlineTemplate = require('./side-online.template');


module.exports = onlineSidebar = {


  render(app, data) {
    document.querySelector(".arcade-sidebar-online").innerHTML = onlineTemplate(app);

   

  },

  attachEvents(app, data) {

  },


}

