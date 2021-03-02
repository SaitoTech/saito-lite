module.exports = GameCryptoTransferManagerReceive = (sobj) => {

  return `  
  <div class="game-crypto-transfer-manager-container" style="min-width:400px;min-height:400px;padding:10px;text-align:center;background-color:whitesmoke">
    
    <h2>Waiting to Receive</h2>

    <p></p>

    <div class="amount">${sobj.amount}</div>

    <div class="from_address">${sobj.from}</div>

    <div class="">to</div>

    <div class="to_address">${sobj.to}</div>

    <div class="button crypto_transfer_btn" id="crypto_transfer_btn">or skip...</div>

  </div>
  `;

}

