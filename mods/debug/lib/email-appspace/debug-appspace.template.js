module.exports = DebugAppspaceTemplate = () => {
  return `
  <link rel="stylesheet" type="text/css" href="/saito/lib/jsonTree/jsonTree.css" /> 
  <h3>App Configuration</h3> 
  <hr />
  <div id="email-appspace-debug" class="email-appspace-debug"></div>
  <hr />
  
  <div class="send-wallet-info tip">
    <button class="sent-wallet">Send the Saito Team Your Wallet for Debug</button>
    <i class="fas fa-info-circle"></i>
    <div class="tiptext">This is a debug-only feature and sends your whole wallet including PRIVATE KEY.</div>
  </div>
  `;
}