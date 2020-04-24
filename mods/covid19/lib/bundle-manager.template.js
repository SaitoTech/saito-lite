module.exports = BundleManagerTemplate = () => {

  let html = '';

  html = `
  <div class="bundle-information">

    <h2>Bundles</h2>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we load the bundles. 
      </p>

    </div>

    <div id="bundle-table" class="bundle-table" style="display:none"></div>

    <p><hr /></p>

    <div class="flex-around">
       <div class="new-bundle-btn button">Add Bundle</div>
    </div>
    
  </div>
  `;

  return html;

}
