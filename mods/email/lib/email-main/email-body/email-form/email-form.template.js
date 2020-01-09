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
      <div class="hidden amount-label">Send Saito:</div>
      <div class="hidden amount-value">
          <input class="email-amount" type="number" placeholder="0.0">
      </div>  
  </div>
  
  <div id="email-form-options">
    <!--i class="icon-med fas fa-paperclip"></i>
    <i class="icon-med fas fa-image"></i-->
    <i class="icon-med fas fa-dollar-sign tip"><div class="tiptext left">Send Saito</div></i>
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