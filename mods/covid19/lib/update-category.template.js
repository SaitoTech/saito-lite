module.exports = UpdateCategoryTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="category-template modal-form-wrapper">
    
  <h2>Add New Category</h2>
  <div class="modal-form grid-2"></div>
  <div class="modal-form-buttons">
    <button id='cancel-category' class='cancel-category'>  Cancel</button>
    <button id='add-category' class='add-category'><i class="fas fa-add"></i>  Add/Update</button>
  </div>
</div>


  `;

  return html;

}