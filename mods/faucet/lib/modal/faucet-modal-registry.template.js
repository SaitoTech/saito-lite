module.exports = FaucetModalRegistryTemplate = () => {
  return `
    <p>The tokens are on their way! In the meantime, you'll want a username so people know who you are.</p>
    <div style="display: grid; grid-template-columns: 2fr 1fr;">
      <div style="display: flex">
          <input style="text-align: right; color: black" id="registry-input" type="text" placeholder="Username">
          <h3 style="color: black; margin-left: 5px">@saito</h3>
      </div>
      <div style="display: flex;align-items: center;justify-content: flex-end;">
          <button id="registry-add-button">SUBMIT</button>
      </div>
    </div>
  `;
}