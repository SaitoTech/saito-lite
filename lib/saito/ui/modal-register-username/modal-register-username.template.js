module.exports = ModalRegisterUsernameTemplate = () => {

  return `  
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Register a Username</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Please register a Saito username:</div>
          <div style="display:flex;">
      <input style="width:60%; color:black; background:#efefef;" class="username-registry-input" id="registry-input" type="text" placeholder="username"><b style="margin: 1em 1em 1em 10px;">@saito</b>
      <input style="display: var(--saito-wu);" id="name" name="name" type="text"></input>
      <button id="registry-modal-button" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;background:#efefef;border:1px solid var(--saito-red);color: var(--saito-cyber-black);">REGISTER USERNAME</button>
          </div>
        </div>
        <div class="welcome-modal-info">
            <div class="tip"><b>What is a Saito username? <i class="fas fa-info-circle"></i></b>
            <div class="tiptext">Saito usernames can be used to send and receive messages. Some applications require Saito usernames to help prevent robots/spam. It takes a minute to register an address. You should get one!</div>
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

