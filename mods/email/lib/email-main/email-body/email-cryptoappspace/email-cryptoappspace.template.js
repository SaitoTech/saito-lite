module.exports = EmailCryptoAppspaceTemplate = (responseInterface) => {
  let infoHtml = ''
  if (responseInterface.info) {
    infoHtml = `<div class="crypto-info">${responseInterface.info}</div>`;
  }
  //<i class="far fa-star"></i>
  return `
    <div class="email-appspace">
      <div class="crypto-container">
        <div class="ticker">
          <i class="far fa-star"></i>${responseInterface.ticker}
        </div>
        <div class="crypto-title">${responseInterface.description}</div>
        ${infoHtml}
        
        <div>
          Address: <span class="address">loading...</span>
        </div>
        <div>
          Balance: <span class="balance">loading...</span>
        </div>
        <div>
          Amount: <input class="howmuch" type="text"></input>
        </div>
        <div>
          To: <input class="pubkeyto" type="text"></input>
        </div>
        <input class="sendbutton" type="button" value="send"></input>
      </div>
    </div>
  `;
};

