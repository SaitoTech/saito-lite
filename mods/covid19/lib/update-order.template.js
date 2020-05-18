module.exports = UpdateOrderTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="order-template">
    
  <h2>Add Order</h2>
  <div class="main-form grid-2"></div>


  <div class="main-form-buttons">
    <button id='save-order' class='save-order'><i class="fas fa-link"></i>  Add/Update Order</button>
  </div>
  
  <div class="order-items"></div>

  
</div>


  `;

  return html;

}
