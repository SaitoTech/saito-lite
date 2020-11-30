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
      let modInterface = app.wallet.getCryptoModuleInterfaceByName(subPage);
      let preferredCrpytoName = app.wallet.getPreferredCryptoName(); 
      document.querySelector(".email-body").innerHTML = EmailCryptoAppspaceTemplate(modInterface, preferredCrpytoName);  
      loadBalance(modInterface);
      loadPubkey(modInterface);  

      document.querySelector(`.crypto-container .sendbutton`).onclick = () => {
        let howMuch = document.querySelector(`.crypto-container .howmuch`).value;
        let toAddress = document.querySelector(`.crypto-container .pubkeyto`).value;
        modInterface.transfer(howMuch, toAddress);
      }
      document.querySelectorAll(`.crypto-container .fa-star`).forEach((elem, i) => {
        elem.onclick = (event) => {
          if (event.currentTarget.classList.contains("fa")) {
            event.currentTarget.classList.remove('fa');
            app.wallet.setPreferredCrypto("SaitoCrypto");
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
