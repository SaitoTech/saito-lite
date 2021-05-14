module.exports = GameCryptoTransferManagerSendTemplate = (app, sobj) => {

  return `  
  <div class="game-crypto-transfer-manager-container">
    
    <h2 class="auth_title">Checking ${sobj.ticker} Balance</h2>

    <div class="to_address">${sobj.address}</div>

    <img style="margin-top: 20px" class="spinner" src="/website/img/spinner.svg" />

  </div>
  `;

}

