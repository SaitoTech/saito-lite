module.exports = NewsletterTemplate = () => {
  
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Sign up for the Newsletter</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Please provide an email:</div>
          <form name="newsletter_form" id="newsletter_form">
            <div style="display:flex;">
              <input style="width:100%; color:black; font-size:1em; background:white;margin:0 1em 0 0;" id="registry-input" type="text" placeholder="email@domain.com">
              <input style="display: var(--saito-wu);" id="name" name="name" type="text"></input>
              <button id="newsletter-modal-button" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;background:#efefef;border:1px solid var(--saito-red);color: var(--saito-cyber-black);">SIGN UP</button>
            </div>
          </form>
          <div id="empty_form_data" class="hidden"></div>
        </div>
        <div class="welcome-modal-info">
            <div class="tip">
              <b>How does this work? <i class="fas fa-info-circle"></i></b>
              <div class="tiptext">You will recieve periodic updates on important network news.</div>
            </div>
          </div>
      </div>
    </div>
  
    <div class="welcome-modal-exit tutorial-skip">
      <p>
          I know about the newsletter, will think about it later.
      </p>
      <i class="fas fa-arrow-right"></i>
    </div>
  
  </div>

  `;
}
