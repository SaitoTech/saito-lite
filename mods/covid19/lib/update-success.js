const UpdateSuccessTemplate = require('./update-success.template');



module.exports = UpdateSuccess = {

  render(app, data) {

    document.querySelector(".main").innerHTML = UpdateSuccessTemplate(app, data);
    document.querySelector(".navigation").innerHTML = "";

    var location = "";
    if(data.location) {
      location = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + data.location;
    } else {
      location = window.location;
    }
    setTimeout(window.location = location, 1000);

  },

  attachEvents(app, data) {

  }

}

