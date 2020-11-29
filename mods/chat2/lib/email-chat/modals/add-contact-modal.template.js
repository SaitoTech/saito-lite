module.exports = AddContactModalTemplate = () => {
  return `
    <div id="add-contact-modal" class="modal">
      <div id="add-contact-modal-content" class="modal-content" style="display: grid; grid-gap: 1em">
        <div class="add-contact-modal-title" style="display: grid; grid-template-columns: auto 1em">
          <h1 style="margin: 0">Add Contact</h1>
          <i class="close fas fa-times" style="justify-self: end;"></i>
        </div>
        <div class="add-contact-modal-body" style="display: grid; grid-gap: 1em">
        </div>
      </div>
    </div>
  `;
}