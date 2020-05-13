module.exports = ItemManagerTemplate = () => {

  let html = '';

  html = `
  <div class="item-information">
    <hr />
    <p>
    <h2>Items</h2>
    </p>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we load the items. 
      </p>

    </div>

    <div id="item-table" class="item-table" style="display:none"></div>

    <p><hr /></p>

    <div class="form-section-buttons">
       <div class="new-item-btn button">Add Item</div>
       <i class="items-refresh fas fa-sync-alt"></i>
       <div>|</div>
       <div class="create-product-btn button">Create New Product</div>
    </div>
    
  </div>
  `;

  return html;

}
