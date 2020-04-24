module.exports = AttachmentsTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="file-template modal-form-wrapper">
    
  <h2>Attachments</h2>
  <p><hr /></p>
  <div class="attachments-grid" id="attachments-grid"></div>
  <p><hr /></p>
  <div class="modal-form-buttons">
    <button id='cancel-attachments' class='cancel-attachments'>  Close</button>
    <button id='attach-download' class='attach-download'><i class="fas fa-download"></i>  Download Files</button>
  </div>
</div>


  `;

  return html;

}
