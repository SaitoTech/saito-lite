module.exports = FaucetModalSocialTemplate = (tokens_sent=true) => {
  let are_tokens_sent = tokens_sent ? `<p>You successfully registered your username! As a thanks, have 50 SAITO on us.</p>` : '';
  return `
    <div>
      ${are_tokens_sent***REMOVED***
      <p>You should back up your wallet now that you have some tokens</p>
    </div>
    <button id="registry-backup-wallet">BACKUP</button>
    <p style="font-size: 0.9em;color: var(--saito-cyber-black-cut);">
      Want to learn more about Saito? Subscribe to our email newsletter or join us on Discord and Telegram
    </p>
    <div style="
    display: grid;
    grid-template-columns: 6fr 1fr 1fr;
    justify-items: right;
    align-items: center;
    ">
    <div class="registry-succes-email" style="display: flex;width: 100%;">
        <input style="color: black;font-size: 1em;background: white;" id="registry-input" type="text" placeholder="Email">
        <button id="registry-email-button" style="margin: unset;margin-left: 10px;min-width: 6em;font-size: 0.7em;">SUBMIT</button>
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