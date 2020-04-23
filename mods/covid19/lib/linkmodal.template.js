module.exports = LinkModalTemplate = () => {

  let html = '';

  html = `
  <div class="certification">
   <div class="object-link-form-wrapper">
      <div id="form" class="object-link-form"></div>  
      <button id='cancel-certification' class='cancel-certification'>  Cancel</button>
      <button id='save-certification' class='save-certification'><i class="fas fa-link"></i>  Add/Update Certification</button>
    </div>
  </div>
  `;

  return html;

}