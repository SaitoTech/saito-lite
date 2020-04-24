module.exports = UpdateFileTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="file-template modal-form-wrapper">
    
  <h2>Attach File</h2>
  <div class="modal-form grid-2"></div>
  <div class="modal-form-buttons">
    <button id='cancel-file' class='cancel-file'>  Cancel</button>
    <button id='attach-file' class='attach-file'><i class="fas fa-link"></i>  Attach File</button>
  </div>
</div>


  `;

  return html;

}
