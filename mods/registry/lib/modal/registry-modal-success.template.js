module.exports = RegistrySuccessModalTemplate = () => {
  return `
    <!-- <div id="registry-modal" class="modal" style="font-family: visuelt-medium;"> -->
      <div id="registry-modal-content" class="modal-content" style="max-width: 800px;">
        <div style="display: grid; grid-gap: 1em; color: black">
          <div style="display: grid; grid-template-columns: auto 1em">
            <h1 style="color: black; margin: 0">Registry Success!</h1>
            <i id="modal-close" class="close fas fa-times" style="justify-self: end;"></i>
          </div>
          <div style="display: grid;grid-gap: 1em; color: black">
            <p>As a thanks, have 50 SAITO on us.</p>
            <p>To get more SAITO, provide us an email or join us on Discord and Telegram</p>
            <div style="
              display: grid;
              grid-template-columns: 6fr 1fr 1fr;
              justify-items: right;
              align-items: center;
              ">
              <div class="registry-succes-email" style="display: flex;width: 100%;">
                <input style="color: black" id="registry-input" type="text" placeholder="Email">
                <button id="registry-email-button" style="margin: unset;margin-left: 10px;">SUBMIT</button>
              </div>
              <div id="registry-succes-discord">
                <a href="https://discord.gg/HjTFh9Tfec" target="_blank">
                  <i class="fab fa-discord" style="color: black; font-size: 2em"></i>
                </a>
              </div>
              <div id="registry-succes-telegram">
                <a href="https://t.me/SaitoIO" target="_blank">
                  <i class="fab fa-telegram" style="color: black; font-size: 2em"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- </div> -->
  `;
}