const TestingAppspaceTemplate 	= require('./testing-appspace.template.js');


module.exports = TestingAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = TestingAppspaceTemplate();
    },

    attachEvents(app, data) {

      document.querySelector('.testing-btn')
        .addEventListener('click', (e) => {


	let x = app.modules.returnModule("Relay");
	if (x == null) { alert("x is null!"); }
        if (x != null) {
alert("Testing Button Clicked");
let publickey = app.network.peers[0].peer.publickey;
	  x.sendRelayMessage(publickey, "relay test alert", "alert message here");
alert("Testing Button Clicked 2");
	}
      });
    },

}
