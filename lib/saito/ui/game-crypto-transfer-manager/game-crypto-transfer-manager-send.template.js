module.exports = GameCryptoTransferManagerSendTemplate = (app, sobj) => {

  return `  
  <div class="game-crypto-transfer-manager-container" style="min-width:400px;min-height:400px;padding:10px;text-align:center;background-color:whitesmoke">
    
    <h2 class="auth_title">Authorize Crypto Transfer</h2>

    <p></p>

    <div class="amount">${sobj.amount} ${sobj.ticker}</div>

    <div class="from_address">${sobj.from}</div>

    <div class="send_to">to</div>

    <div class="to_address">${app.keys.returnUsername(sobj.to)}</div>

    <div class="button crypto_transfer_btn" id="crypto_transfer_btn">authorize</div>

  </div>
  <style type="text/css">
    .auth_title {
      font-size:1.7em;
    }
    .game-crypto-transfer-manager-container {
      min-width:400px;
      min-height:auto;
      padding:10px;
      text-align:center;
      background-color:whitesmoke
      border-radius: 8px;
    }
    .crypto_transfer_btn {
      margin-left: auto;
      margin-right: auto;
      width: 380px;
      position: relative;
      bottom: 0px;
      margin-top: 25px;
      font-size: 2em;
      text-transform: uppercase;
    }
    .amount {
      font-size: 4em;
      margin-top: 30px;
    }
    .send_to {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .from_address {
      display: none;
    }
    .to_address {
      font-size: 1.6em;
    }
  </style>
  `;

}

