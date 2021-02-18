module.exports = ModalAddUserTemplate = () => {

  return `  
  <div class="welcome-modal-wrapper confirm-modal-wrapper">
    You and your friend are now negotiating a shared secret via Saito's blockchain. This requires two blocks to be mined. Once the process is complete your friend will be added to your chat list and you will be able to chat through the encrypted channel.
    <div id="confirm-box" class="welcome-invite-box"><div>OK</div></div>
  </div>
  <style>
    .confirm-modal-wrapper {
      font-size: 1.5em;
      padding: 1.5em;
      color: white;
      font-weight: bold;
    }
  </style>
  `;

}

