
module.exports = DebugAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = JSON.stringify(app.options, null, 4);
    },

    attachEvents(app, data) {
    }

}
