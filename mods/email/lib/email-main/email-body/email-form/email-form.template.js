module.exports = EmailFormTemplate = () => {
  return `
  <div class="email-compose">
  <div class="grid-2" style="grid-template-columns:6em 1fr">
    <div>From:</div>
    <div>
      <input id="email-from-address" class="email-address" type="text" readonly>
    </div>
    <div>To:</div>
    <div>
      <input id="email-to-address" class="email-address" type="text" placeholder="Address">
    </div>
    <div class="amount-label tip">
      SAITO:
      <div class="tiptext" style="font-family: 'visuelt-light';"> Optional.</div>
    </div>
    <div class="amount-value">
      <input class="email-amount" type="number" placeholder="0.0">
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
      <input class="email-title" type="text" placeholder="Subject">
  </div>
  <div id="email-text" class="email-text markdown" placeholder="Message"></div>
  </div>
  <div>
    <button class="email-submit">Send</button>
  </div>
  `
};