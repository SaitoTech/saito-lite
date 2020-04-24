module.exports = CertificationTemplate = () => {

  let html = '';

  html = `
  <div class="certification modal-form-wrapper">
    
    <h2>Add Certification</h2>
    <div class="modal-form grid-2"></div>
    <div class="modal-form-buttons">
      <button id='cancel-certification' class='cancel-certification'>  Cancel</button>
      <button id='save-certification' class='save-certification'><i class="fas fa-link"></i>  Add/Update Certification</button>
    </div>
  </div>
  `;

  return html;

}