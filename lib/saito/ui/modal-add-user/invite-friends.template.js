module.exports = InviteFriendsTemplate = () => {
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Invite Friends</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">How would you like to add a contact to Saito:</div>
          <div style="">
            <div class="welcome-invite-box generate-link-box"><i class="fas fa-link"></i><div>Generate Link</div></div>
            <div class="welcome-invite-box scanqr-link-box"><i class="fas fa-qrcode"></i><div>Scan QR Code</div></div>
            <div class="welcome-invite-box address-link-box"><i class="fas fa-key"></i><div>Add by Saito address</div></div>
          </div>
          <div class="welcome-modal-info">
            <div style="margin-top:20px" class="welcome-modal-explanation">
            <div class="tip">
              <div><b>What happens when I invite someone to Saito? <i class="fas fa-info-circle"></i></b></div>
              <div class="tiptext">Users you invite will be given a copy of your javascript bundle (so they are running the same applications). The Saito rewards module will give both you and your friends a bonus in Saito tokens for helping spread work.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welcome-modal-exit tutorial-skip">
      <p>
          Hmmm...
      </p>
      <p>
          Maybe later.
      </p>
      <i class="fas fa-arrow-right"></i>
    </div>
  </div>

<style>

.welcome-modal-info {
  clear: both;
  font-size: 1.2em;
}

.welcome-invite-box {
  float: left;
  width: 250px;
  border: none;
  cursor: pointer;
}

.welcome-invite-box div {
  text-align: center;
  font-weight: bold;
}

.welcome-invite-box i {
  display: block;
  text-align: center;
  margin: 0 0 15px 0;
  font-size: 2em;
}

.welcome-invite-box:hover {
  text-shadow: 2px 2px 2px #333;
}

</style>

  `;
}
