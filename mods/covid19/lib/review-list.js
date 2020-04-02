const ReviewListTemplate = require('./customer-portal.template.js');

module.exports = ReviewList = {

  render(app, data) {
    document.querySelector(".main").innerHTML = ReviewListTemplate();
  },


  attachEvents(app, data) {

  }

}

