module.exports = DebugAppspaceTemplate = () => {
  return `
  <link rel="stylesheet" type="text/css" href="/saito/lib/jsonTree/jsonTree.css" /> 
  <h3>Wallet Configuration:</h3> 
  <div style="clear:both;padding-top:10px;padding-bottom:10px;" id="email-appspace-debug" class="email-appspace-debug"></div>
  <div class="send-wallet-info tip">
    <button class="sent-wallet">Send the Saito Team Your Wallet for Debug</button>
    <i class="fas fa-info-circle"></i>
    <div class="tiptext">This is a debug-only feature and sends your whole wallet including PRIVATE KEY.</div>
  </div>
  <p>
    <textarea class="debug-message" placeholder="Please tell us who you are and why you sent this wallet."></textarea>
  </p>
    <hr />
  `;
}
