module.exports = UpdateItemTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="item-template modal-form-wrapper">
    
  <h2>Add Item</h2>
  <div class="modal-form grid-2"></div>
  <div class="modal-form-buttons">
    <button id='cancel-item' class='cancel-item'>  Cancel</button>
    <button id='save-item' class='save-item'><i class="fas fa-link"></i>  Add/Update Item</button>
  </div>
</div>


  `;

  return html;

}
