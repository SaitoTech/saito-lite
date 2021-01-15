module.exports = EmailFormTemplate = (address, title, msg) => {
  return `
  <div class="email-compose">
  <div class="grid-2" style="grid-template-columns:6em 1fr">
    <div>From:</div>
    <div>
      <input id="email-from-address" class="email-address" type="text" readonly>
    </div>
    <div>To:</div>
    <div>
      <input id="email-to-address" class="email-address" type="text" placeholder="Address" value="${address}">
    </div>
    <div class="email-payment-row" style="display:none;grid-column-start: 1;grid-column-end:span 2">
      <div class="amount-label tip">
        SAITO:
        <div class="tiptext" style="font-family: " visuelt-light",="" "microsoft="" yahei",="" "hiragino="" sans="" gb";"=""> Optional.</div>
      </div>
      <div class="amount-value">
        <input class="email-amount" type="number" placeholder="0.0">
      </div>  
    </div>
  </div>
  
  <div id="email-form-options" class="tip">
    <!--i class="icon-med fas fa-paperclip"></i>
    <i class="icon-med fas fa-image"></i>
    <i class="icon-small fas fa-dollar-sign"></i>
    <div class="tiptext tip-left">
      <div>
        <i class="icon-small fas fa-dollar-sign"></i>Send Saito
      </div>
    </div-->
  </div>
  <div>
      <input class="email-title" type="text" placeholder="Subject" value="${title}">
  </div>
  <div id="email-text" class="email-text markdown" placeholder="Message">${msg}</div>
  </div>
  <div>
    <div class="email-payment-btn">include payment</div>
    <button class="email-submit">Send</button>
  </div>
  `
};
