module.exports = RegisterUsernameTemplate = () => {
  
  return `
  <div class="welcome-modal-wrapper">
    <div class="welcome-modal-action">
      <div class="welcome-modal-left">
        <div class="welcome-modal-header">Register a Username</h1></div>
        <div class="welcome-modal-main">
          <div style="margin:1em 0">Please register a Saito username before doing this: - which username you would prefer?</div>
          <div style="display:flex;">
      <input style="width:60%; color:black; font-size:1em; background:#efefef;" id="registry-input" type="text" placeholder="username"><b style="margin: 1em 1em 1em 0;">@saito</b>
      <input style="display: var(--saito-wu);" id="name" name="name" type="text"></input>
      <button id="registry-modal-button" style="clear:both; margin:unset; margin-left:0px; min-width:6em; font-size:0.7em;background:#efefef;border:1px solid var(--saito-red);color: var(--saito-cyber-black);">REGISTER USERNAME</button>
          </div>
        </div>
        <div class="welcome-modal-info">
          <fieldset style="margin-top:20px" class="welcome-modal-explanation">
            <div><b>What is a Saito username?</b></div>
            <div>Having a Saito username lets you send and receive messages using that instead of your publickey. It takes about a minute to register an address. You should do it as some applications need usernames to help keep the network spam-free.</div>
          </fieldset>
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

  `;
}
