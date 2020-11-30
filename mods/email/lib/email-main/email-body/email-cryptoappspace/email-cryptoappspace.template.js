module.exports = EmailCryptoAppspaceTemplate = (responseInterface, preferredCrpytoName) => {
  let infoHtml = responseInterface.info ? responseInterface.info : "";
  let starClasses = responseInterface.name === preferredCrpytoName ? "fa far" : "far";
  return `
    <div class="email-appspace">
      <div class="crypto-container">
        <div class="ticker">
          <i class="${starClasses} fa-star"></i>${responseInterface.ticker}
        </div>
        <div class="crypto-title">${responseInterface.description}</div>
        <div class="crypto-info">${infoHtml}</div>
        
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

