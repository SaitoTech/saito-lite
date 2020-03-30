const UpdateSuccessTemplate = require('./update-success.template');



module.exports = UpdateSuccess = {

  render(app, data) {

    document.querySelector(".main").innerHTML = UpdateSuccessTemplate(app, data);

  },



  attachEvents(app, data) {

  }

}

