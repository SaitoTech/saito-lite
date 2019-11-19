const EscrowAppspaceTemplate 	= require('./escrow-appspace.template.js');
const EscrowCryptoBalanceTemplate 	= require('./escrow-crypto-balance.template.js');
const EscrowHistoryEntryTemplate 	= require('./escrow-history-entry.template.js');


module.exports = EscrowAppspace = {

    render(app, data) {
      document.querySelector(".email-appspace").innerHTML = EscrowAppspaceTemplate(data.escrow.escrow);
   },

    attachEvents(app, data) {

      let create_btn = document.querySelector('.escrow-create-btn');
      if (create_btn != null) {
        create_btn.addEventListener('click', (e) => {
	  if (data.escrow.registerAccount() == 1) {
	    document.querySelector(".email-appspace").innerHTML = "Requesting deposit address... please be patient. This process usually takes about 2 minutes to complete.";
	  } else {
	    document.querySelector(".email-appspace").innerHTML = "There was an issue registering an account... your account is missing tokens or unable to create a transaction requesting this account registration";
	  }
        });
      }

    }

}
