module.exports = ModalBlankTemplate = ({ id, title, content }) => {
    return `
      <div id="${id}-modal" class="modal">
        <div id="${id}-modal-content" class="modal-content-blank">
        ${content}
        </div>
      </div>
    `;
  }