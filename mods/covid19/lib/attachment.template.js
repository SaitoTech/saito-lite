module.exports = AttachmentTemplate = () => {

  let html = '';

  html = `
  <div class="attachment">
    <input id="attachment-id" type="hidden" />
    <h2>Add/Edit Attachment</h2>
    <div class="grid-2">
      <div>Attachment Name</div>
      <div class="attachments">
        <select id="attachments-list"></select>
      </div>
      <div></div>
      <div><input type="text" placeholder="Add new attachment" /></div>
      <div></div>
      <button id='save-attachment' class='save-attachment'>Save Attachment</button>
      </div>
  </div>
  `;

  return html;

}