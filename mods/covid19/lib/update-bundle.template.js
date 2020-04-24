module.exports = UpdateBundleTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="bundle-template modal-form-wrapper">
    
  <h2>Add Bundle</h2>
  <div class="modal-form grid-2"></div>
  <div class="modal-form-buttons">
    <button id='cancel-bundle' class='cancel-bundle'>  Cancel</button>
    <button id='save-bundle' class='save-bundle'><i class="fas fa-link"></i>  Add/Update Bundle</button>
  </div>
</div>


  `;

  return html;

}
