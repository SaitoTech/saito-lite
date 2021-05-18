var ModTemplate = require('../../lib/templates/modtemplate');

//
// Saito supports the use of a special class of Cryptocurrency Modules which 
// allow users to send and receive tokens in third-party cryptocurrencies, 
// such as DOT. Anyone can develop and deploy modules that provide this kind
// of integration.
//
// this application demonstrates how to interact with these cryptocurrency
// modules. it installs a menu option to the Saito Wallet. users who install 
// it will be able to click on this menu to see a text input for an address, 
// a text input for an amount, and a send button. clicking this button will
// send a DOT payment from the 
//
class Tutorial03 extends ModTemplate {

  //
  // CONSTRUCTOR
  //
  constructor(app) {

    super(app);

    this.name            = "Tutorial03";
    this.description     = "Example of simple Polkadot Integration";
    this.categories      = "Saito Tutorials";

    return this;

  }



  //
  // RESPOND_TO
  //
  // add a module to the Wallet by responding to "email-appspace"
  //
  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};

          obj.render = function(app, mod) {
	    document.querySelector('.email-appspace').innerHTML = `

	      Send Polkadot to Which Address:

	      <p></p>

	      <label for="address">Recipient</label>
	      <input type=text" id="payment_address" class="payment_address" name="payment_address" />

	      <p></p>

	      <label for="amount">Amount</label>
	      <input type=text" id="payment_amount" class="payment_amount" name="payment_amount" />

	      <p></p>

	      <div class="button tutorial-btn" id="tutorial-btn" style="margin-top: 30px; width: 120px; text-align: center;">Click me!</div>';

	    `;
	  }


          obj.attachEvents = function(app, mod) {

    	    document.querySelector('.tutorial-btn').addEventListener('click', async function(e) {

	      let payment_address = document.getElementById("payment_address").value;
	      let payment_amount = document.getElementById("payment_amount").value;
	      let cryptomod = app.wallet.returnCryptoModuleByTicker("DOT");

	      //
	      // the important functions for making cryptocurrency applications are:
	      //
	      // sendPayment
	      // receivePayment
	      // returnPreferredCryptoBalances
	      //
	      // details on how to use these functions can be found in /lib/saito/wallet.js
	      //
	      try {
		await app.wallet.sendPayment(
		  [ cryptomod.returnAddress() ],
		  [ payment_address ],
		  [ payment_amount ] ,
		  (new Date().getTime()) ,
		  function() {
		    console.log("Optional Callback when Payment Sent!");
		  },
		  "DOT"
	        );
	      } catch (err) {
		alert("ERROR: " + err);
	      }

    	    });

	  };

      return obj;
    }
    return null;
  }

}

module.exports = Tutorial03;

