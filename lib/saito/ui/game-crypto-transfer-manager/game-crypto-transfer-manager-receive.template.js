module.exports = GameCryptoTransferManagerReceive = (app, sobj) => {

  return `  
  <div class="game-crypto-transfer-manager-container" style="min-width:400px;min-height:400px;padding:10px;text-align:center;background-color:whitesmoke">
    
    <h2>Waiting for Settlement</h2>

    <p></p>

    <div class="amount">${sobj.amount}</div>

    <div class="from_address">${app.keys.returnUsername(sobj.from)}</div>

    <div class="">to</div>

    <div class="to_address">${app.keys.returnUsername(sobj.to)}</div>

  </div>
  `;

}

