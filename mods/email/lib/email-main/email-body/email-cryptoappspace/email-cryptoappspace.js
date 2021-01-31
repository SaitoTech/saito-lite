const EmailCryptoAppspaceTemplate = require('./email-cryptoappspace.template.js');
module.exports = EmailCryptoAppspace = {
  render(app, mod) {
    let loadBalance = async(responseInterface) => {
      let balance = await responseInterface.getBalance();
      document.querySelector(`.crypto-container .balance`).innerHTML = balance;
    }
    let loadPubkey = async(responseInterface) => {
      let address = await responseInterface.getAddress();
      document.querySelector(`.crypto-container .address`).innerHTML = address;
    }

    try {
      let subPage = app.browser.parseHash(window.location.hash).subpage;
      let modInterface = app.wallet.returnCryptoModuleByName(subPage);
      let preferredCryptoMod = app.wallet.returnPreferredCrypto();
      document.querySelector(".email-body").innerHTML = EmailCryptoAppspaceTemplate(modInterface, preferredCryptoMod.name);
      loadBalance(modInterface);
      loadPubkey(modInterface);
      document.querySelector(`.crypto-container .sendbutton`).onclick = () => {
        let howMuch = document.querySelector(`.crypto-container .howmuch`).value;
        let toAddress = document.querySelector(`.crypto-container .pubkeyto`).value;
        try {
          modInterface.transfer(howMuch, toAddress);
          salert("Sent!");
          document.querySelector(`.crypto-container .howmuch`).value = "";
          document.querySelector(`.crypto-container .pubkeyto`).value = "";
        } catch(error) {
          salert(`Error sending transaction.\n{error}`);
          //Transaction is temporarily banned
        }
      }
      document.querySelectorAll(`.crypto-container .fa-star`).forEach((elem, i) => {
        elem.onclick = (event) => {
          if (event.currentTarget.classList.contains("fa")) {
            event.currentTarget.classList.remove('fa');
            app.wallet.setPreferredCrypto("Saito");
          } else {
            event.currentTarget.classList.add('fa');
            app.wallet.setPreferredCrypto(modInterface.name);
          }
        }
      });
    } catch(error) {
      mod.locationErrorFallback(`Error loading Crypto Module.<br/>${error}`, error)
    }
    
  },
}
