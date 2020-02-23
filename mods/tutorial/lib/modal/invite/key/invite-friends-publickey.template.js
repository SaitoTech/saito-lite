module.exports = InviteFriendsPublickeyTemplate = (app) => {
  return `
    <div class="welcome-modal-header">
      <h1>Add Contact using Network Address:</h1>
    </div>
    <div class="welcome-modal-main">
      <div style="margin:1em 0">You can add contacts by providing their Saito username or publickey (address):</div>
      <div style="display:flex">
        <input style="width:100%; color:black; font-size:1em; background:white;margin:0 1em 0 0;" id="add-contact-input" type="text" placeholder="david@saito">
        <button id="add-contact-btn" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;">ADD CONTACT</button>
      </div>
      <div class="welcome-modal-info">
        <div style="margin-top:20px" class="welcome-modal-explanation tip">
          <div><b>What happens when I do this?</b></div>
          <div class="tiptext">Your computer will send a request to connect over the blockchain. This will result in your two computers creating a secure encryption key and both of your accounts showing up in the account list (chat-box, etc.) of the other user.</div>
        </div>
      </div>
    </div>
  `;
}
