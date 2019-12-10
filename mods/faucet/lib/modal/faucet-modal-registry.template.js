module.exports = FaucetModalRegistryTemplate = (tokens_sent=true) => {
  let are_tokens_sent = tokens_sent ? `<p>The tokens are on their way!</p>` : '';
  return `
    <div>
      ${are_tokens_sent}
      <p>You'll want a username on Saito so people know who you are.</p>
    </div>
    <div style="display: grid; grid-template-columns: 2fr 1fr;">
      <div style="display: flex">
          <input style="text-align: right; color: black; font-size: 1em;" id="registry-input" type="text" placeholder="Username">
          <h3 style="color: black; margin-left: 5px;align-self: center;">@saito</h3>
      </div>
      <div style="display: flex;align-items: center;justify-content: flex-end;">
        <button id="registry-add-button">SUBMIT</button>
      </div>
    </div>
    <div class="tutorial-skip" style="
      align-self: end;
      font-size: 0.65em;
      color:gray;
      text-decoration: underline;
      text-align: right;
      cursor: pointer">No thanks</div>
  `;
}