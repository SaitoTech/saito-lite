module.exports = ModalAddUserTemplate = () => {

  return `  
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Invite Friends</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">How would you like to add a contact to Saito:</div>
          <div style="">
            <div class="welcome-invite-box address-link-box"><i class="fas fa-key"></i><div>Add by Saito address</div></div>
            <div class="welcome-invite-box scanqr-link-box"><i class="fas fa-qrcode"></i><div>Scan QR Code</div></div>
            <div class="welcome-invite-box generate-link-box"><i class="fas fa-link"></i><div>Share Bundle</div></div>
          </div>
          <div class="welcome-modal-info">
            <div style="margin-top:20px" class="welcome-modal-explanation">
              <div class="tip">
                <div><b>What happens when I invite someone to Saito? <i class="fas fa-info-circle"></i></b></div>
                <div class="tiptext">Your browser will create an encrypted communication channel with the users you invite, and they will show up on your contact list in the future.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welcome-modal-exit tutorial-skip">
      <p>
          Thanks, but...
      </p>
      <p>
          Maybe later.
      </p>
      <i class="fas fa-arrow-right"></i>
    </div>
  </div>
  `;

}

