module.exports = AddContactModalTemplate = ({selected_key=''}) => {
  return `
    <div class="add-contact-text" style="display: grid; grid-gap: 1em;">
      <input id="add-contact-input" type="text" placeholder="Publickey" value=${selected_key}>
      <div style="display: flex;align-items: center;">
        <button id="add-contact-add-button" style="width:100%;">ADD</button>
      </div>
    </div>
  `;
}