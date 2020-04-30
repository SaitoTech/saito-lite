module.exports = CategoryManagerTemplate = () => {

  let html = '';

  html = `
  <div class="category-information">

    <h2>Categories and Pricing</h2>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we load the categorys. 
      </p>

    </div>

    <div id="category-table" class="category-table" style="display:none"></div>

    <p><hr /></p>

    <div class="flex-around">
       <div class="new-category-btn button">Add Category</div>
    </div>
    
  </div>
  `;

  return html;

}