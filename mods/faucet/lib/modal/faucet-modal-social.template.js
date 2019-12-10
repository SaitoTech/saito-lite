module.exports = FaucetModalSocialTemplate = () => {
  return `
    <p>As a thanks, have 50 SAITO on us.
    Check out some of the modules on the system to get more SAITO.</p>
    <ul style="margin-left: 1em">
      <a href="/email"><li>Email</li></a>
      <a href="/arcade"><li>Arcade</li></a>
      <a href="/faucet"><li>Faucet</li></a>
    </ul>
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
        <a href="https://discord.gg/2KbHYrX" target="_blank">
        <i class="fab fa-discord" style="color: black; font-size: 2em"></i>
        </a>
    </div>
    <div id="registry-succes-telegram">
        <a href="https://t.me/joinchat/HqTpD0_BR8HYmPg20G8IBw" target="_blank">
        <i class="fab fa-telegram" style="color: black; font-size: 2em"></i>
        </a>
    </div>
    </div>
  `;
***REMOVED***