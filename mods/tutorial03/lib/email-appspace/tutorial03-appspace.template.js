module.exports = Tutorial03AppspaceTemplate = (app) => {

  let html = `

    <div class="intro">This module allows you to send tokens from your default / preferred crypto to an external address via the Saito network. It exists to showcase basic methods of sending and receiving payments across blockchains:</div>
    <p></p>

    <div class="label">your address:</div>
    <div id="my_address" class="my_address" name="my_address" />${app.wallet.returnPreferredCrypto().returnAddress()}</div>

    <div class="label">recipient:</div>
    <div><input type=text" id="payment_address" class="payment_address" name="payment_address" /></div>

    <p></p>

    <div class="label">amount:</div>
    <div><input type=text" id="payment_amount" class="payment_amount" name="payment_amount" /></div>

    <p></p>

    <div class="button payment_btn" id="payment_btn" style="">Send Payment</div>
    <div class="button balance_btn" id="balance_btn" style="">Check Balance</div>

<style>
.intro {
  margin-top: 10px;
  margin-bottom: 20px;
}
.my_address {
  font-size: 1.2em;
}
.payment_address {
  width: 400px;
  font-size: 1.5em;
  padding: 5px;
  clear: both;
}
.payment_amount {
  width: 100px;
  font-size: 1.5em;
  padding: 5px;
  clear: both;
  margin-bottom: 20px;
}
.label {
  font-weight: bold;
  font-size: 1.4em;
  margin-top: 15px;
  margin-bottom: 5px;
}
.payment_btn {
  clear: left;
  float: left;
  padding: 20px;
  font-size: 1.2em;
}
.balance_btn {
  margin-left: 20px;
  float: left;
  padding: 20px;
  font-size: 1.2em;
}

</style>

  `;

  return html;

}



