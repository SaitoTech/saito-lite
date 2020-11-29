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
    
    // let page = mod.parseHash(window.location.hash).page;
    console.log("EmailCryptoAppspace render");
    console.log(this);
    try {
      let subPage = app.browser.parseHash(window.location.hash).subpage;
      let cryptoMod = app.modules.returnModule(subPage);
      let modInterface = cryptoMod.requestInterface("is_cryptocurrency");
      document.querySelector(".email-body").innerHTML = EmailCryptoAppspaceTemplate(modInterface);  
      loadBalance(modInterface);
      loadPubkey(modInterface);  

      document.querySelector(`.crypto-container .sendbutton`).onclick = () => {
        let howMuch = document.querySelector(`.crypto-container .howmuch`).value;
        let toAddress = document.querySelector(`.crypto-container .pubkeyto`).value;
        modInterface.transfer(howMuch, toAddress);
      }
      document.querySelector(`.crypto-container .fa-star`).onclick = (event) => {
        console.log("clickity~");
        console.log(event.currentTarget.getAttribute('aria-hidden'));
        event.currentTarget.setAttribute('aria-hidden','true');
      }
    } catch(error) {
      mod.locationErrorFallback(`Error loading Crypto Module.<br/>${error}`, error)
    }
    
  },
}
