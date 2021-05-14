module.exports = GameCryptoTransferManagerSendTemplate = (app, sobj) => {

  return `  
  <div class="game-crypto-transfer-manager-container">
    
    <h2 class="auth_title">Authorize Crypto Transfer</h2>

    <div class="amount">${sobj.amount} ${sobj.ticker}</div>

    <div class="send_to">to</div>

    <div class="to_address">${sobj.to}</div>

    <div class="button crypto_transfer_btn" id="crypto_transfer_btn">authorize</div>

  </div>
  `;

}

