module.exports = AddContactTemplate = ({ publickey }) => {
  return `
    <div class="header"></div>
    <div
      style="
        display: grid;
        grid-gap: 1em;
        justify-items: center;
        align-items: center;
        padding: 1em;
        margin-top: 5em;
      ">
      <div style="display:grid; grid-template-columns: 5.2em auto 5.2e; width:100%">
        <i id="back-button" class="icon-med fas fa-arrow-left"></i>
        <h1 style="justify-self: center">Add Contact</h1>
      </div>
      <input id="add-contact-publickey" type="text" placeholder="Publickey" value="${publickey}">
      <button style="margin: 0; padding: 1em; width: 100%;" id="add-contact-add-button">ADD</button>
    </div>
  `;
};