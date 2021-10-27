module.exports = EmailCryptoAppspaceTemplate = (app, cryptomod) => {

  let preferredCryptoMod = app.wallet.returnPreferredCrypto();
  let is_preferred = "not-preferred";
  if (preferredCryptoMod === cryptomod) { is_preferred = "preferred"; }

  return `
    <div class="email-appspace email-appspace-${cryptomod.ticker}">
      <div class="crypto-container">
        <h1 class="ticker">${cryptomod.ticker}</h1>
        <div class="crypto-title">${cryptomod.information}</div>
        <div class="crypto-info">${cryptomod.warning}</div>
        
        <div class="grid-2 info" style="margin-top:20px">
          <div>Address:</div>
          <div class="address">loading...</div>
          <div>Balance:</div>
          <div class="balance">activate ${cryptomod.ticker} module</div>
          <div>Private Key:</div>
          <div id="private-key" class="private-key password">${cryptomod.returnPrivateKey()}<i style="margin-left:5px" class="see-password fas fa-eye" id="see-password"></i></div>
        </div>
<!----
        <button class="set-preferred ${is_preferred}"></button>
--->

        <hr />

        <h2>Withdraw ${cryptomod.ticker}</h2>
        <div class="withdrawal-warning">Saito is not intended as a commercial wallet for use of third-party cryptocurrencies unless otherwise indicated. If you would like to withdraw tokens associated with this address please ensure your withdrawal address and withdrawal amount are correct before clicking "Send"</div>
        <div class="grid-2 transfer">
          <div>Amount:</div>
          <div><input class="howmuch" type="text"></input></div>
          <div>To:</div>
          <div><input class="pubkeyto" type="text"></input></div>
        </div>
        <button class="sendbutton">Send</button>
      </div>
    </div>
  `;
};

