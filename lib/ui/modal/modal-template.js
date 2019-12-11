module.exports = ModalTemplate = ({ id, title, content }) => {
  return `
    <div id="${id}-modal" class="modal" style="font-family: visuelt-medium;">
      <div id="${id}-modal-content" class="modal-content modal-med-size">
        <div style="display: grid; grid-gap: 1em">
          <div style="display: grid; grid-template-columns: auto 1em;">
            <h1 style="color: black; margin: 0">${title}</h1>
            <i id="modal-close" class="close fas fa-times" style="justify-self: end;"></i>
          </div>
          <div style="display: grid;grid-gap: 1em;color: black;">
            ${content}
          </div>
        </div>
      </div>
    </div>
  `;
}