module.exports = RegistryModalTemplate = () => {
  return `
    <div id="registry-modal" class="modal" style="font-family: visuelt-medium;">
      <div id="registry-modal-content" class="modal-content" style="max-width: 600px;">
        <div style="display: grid; grid-gap: 1em">
          <div style="display: grid; grid-template-columns: auto 1em">
            <h1 style="color: black; margin: 0">Register Username</h1>
            <i id="modal-close" class="close fas fa-times" style="justify-self: end;"></i>
          </div>
          <div style="display: grid;grid-gap: 1em;">
            <div style="display: flex">
              <input style="text-align: right; color: black" id="registry-input" type="text" placeholder="Username">
              <h3 style="color: black; margin-left: 5px">@saito</h3>
            </div>
            <div style="display: flex;align-items: center;">
              <button id="registry-add-button">SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}