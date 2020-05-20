module.exports = ItemManagerTemplate = () => {

  let html = '';

  html = `
  <div class="item-information">
    <hr />
    <p>
    <h2>Required Items</h2>
    </p>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we load the items. 
      </p>

    </div>

    <div id="item-table" class="item-table" style="display:none"></div>

    <div class="form-section-buttons">
       <div class="new-item-btn button"><i class="fas fa-file-medical"></i> Add Item</div>
       <div class="create-product-btn button"><i class="fas fa-plus-circle"></i> Create New Product</div>
       <div class="download-all-btn button"><i id="downloader" class="fas fa-download"></i> Download all Files/Certs</div>
       <i class="items-refresh fas fa-sync-alt"></i>
       </div>
    
  </div>
  `;

  return html;

}
