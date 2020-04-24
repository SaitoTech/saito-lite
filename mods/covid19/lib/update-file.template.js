module.exports = UpdateFileTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="file-template form-modal">
    
  <h2>Add File</h2>
  <div class="modal-form grid-2"></div>
  <div class="modal-form-buttons">
    <button id='cancel-file' class='cancel-file'>  Cancel</button>
    <button id='save-file' class='save-file'><i class="fas fa-link"></i>  Add/Update File</button>
  </div>
</div>


  `;

  return html;

}
