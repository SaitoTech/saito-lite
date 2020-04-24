const UpdateSuccessTemplate = require('./update-success.template');



module.exports = UpdateSuccess = {

  render(app, data) {

    document.querySelector(".main").innerHTML = UpdateSuccessTemplate(app, data);
    document.querySelector(".navigation").innerHTML = "";

    setTimeout(window.location = window.location, 1000);

  },

  attachEvents(app, data) {

  }

}

