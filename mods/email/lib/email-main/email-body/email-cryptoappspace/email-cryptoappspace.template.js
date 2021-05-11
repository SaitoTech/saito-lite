module.exports = EmailCryptoAppspaceTemplate = (responseInterface, preferredCrpytoName) => {
  let infoHtml = responseInterface.info ? responseInterface.info : "";
  let starClasses = responseInterface.name === preferredCrpytoName ? "preferred" : "not-preferred";
  // <i class="${starClasses} fa-star"></i> 
  return `
    <div class="email-appspace">
      <div class="crypto-container">
        <h1 class="ticker">${responseInterface.ticker}</h1>
        <div class="crypto-title">${responseInterface.description}</div>
        <div class="crypto-info">${infoHtml}</div>
        
        <div class="grid-2 info">
          <div>Address:</div>
          <div class="address">loading...</div>
          <div>Balance:</div>
          <div class="balance">loading...</div>
        </div>
        <button class="set-preferred ${starClasses}"></button>

        <hr />

        <h2>Transfer ${responseInterface.ticker}</h2>
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

