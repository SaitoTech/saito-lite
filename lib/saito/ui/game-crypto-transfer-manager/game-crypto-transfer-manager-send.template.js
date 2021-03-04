module.exports = GameCryptoTransferManagerSendTemplate = (app, sobj) => {

  return `  
  <div class="game-crypto-transfer-manager-container" style="min-width:400px;min-height:400px;padding:10px;text-align:center;background-color:whitesmoke">
    
    <h2>Authorize Crypto Transfer</h2>

    <p></p>

    <div class="amount">${sobj.amount} ${sobj.ticker}</div>

    <div class="from_address">${sobj.from}</div>

    <div class="send_to">to</div>

    <div class="to_address">${app.keys.returnUsername(sobj.to)}</div>

    <div class="button crypto_transfer_btn" id="crypto_transfer_btn">authorize</div>

  </div>
  <style type="text/css">
    .crypto_transfer_btn {
      margin-left: auto;
      margin-right: auto;
      width: 380px;
      position: relative;
      bottom: 0px;
      margin-top: 25px;
      margin-bottom: 15px;
      font-size: 2em;
      text-transform: uppercase;
    }
    .amount {
      font-size: 4em;
      margin-top: 50px;
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

