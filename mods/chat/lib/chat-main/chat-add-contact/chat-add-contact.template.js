module.exports = ChatAddContactTemplate = () => {
  return `
    <div
      style="
        display: grid;
        grid-gap: 1em;
        justify-items: center;
        align-items: center;
        padding: 1em;
        height: 20vh;
      ">
      <div style="display:grid; grid-template-columns: 5.2em auto 5.2e; width:100%">
        <i id="back-button" class="icon-med fas fa-arrow-left"></i>
        <h1 style="justify-self: center">Add Contact</h1>
      </div>
      <input id="add-contact-publickey" type="text" placeholder="Publickey">
      <button style="margin: 0; padding: 1em; width: 100%;" id="chat-add-contact-button">ADD</button>
    </div>
    <button id="chat-add" class="create-button" onclick="location.href = '/qrscanner'">
      <i class="icon-med fas fa-qrcode"></i>
    </button>
  `;
***REMOVED***