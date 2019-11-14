const TestingAppspaceTemplate 	= require('./testing-appspace.template.js');


module.exports = TestingAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = TestingAppspaceTemplate();
***REMOVED***,

    attachEvents(app, data) {

      document.querySelector('.testing-btn')
        .addEventListener('click', (e) => {


	let x = app.modules.returnModule("Relay");
	if (x == null) { alert("x is null!"); ***REMOVED***
        if (x != null) {
alert("Testing Button Clicked");

console.log(app.keys.returnIdenticon(app.wallet.returnPublicKey()));
	document.querySelector('.testdiv').innerHTML = app.keys.returnIdenticon(app.wallet.returnPublicKey());

	  //x.sendRelayMessage(app.network.peers[0].peer.publickey, "relay test alert", "alert message here");
//alert("Testing Button Clicked 2");
	***REMOVED***
  ***REMOVED***);
***REMOVED***,

***REMOVED***
