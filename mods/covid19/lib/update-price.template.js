module.exports = UpdatePriceTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="price-template modal-form-wrapper">
    
  <h2>Add New Price</h2>
  <div class="modal-form grid-2"></div>
  <div class="modal-form-buttons">
    <button id='cancel-price' class='cancel-price'>  Cancel</button>
    <button id='add-price' class='add-price'><i class="fas fa-add"></i>  Add</button>
  </div>
</div>


  `;

  return html;

}