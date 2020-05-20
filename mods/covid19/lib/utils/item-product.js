const ItemProductTemplate = require('./item-product.template');

module.exports = ItemProduct = {


  render(app, data, el) {

    var this_item_product = this;

    //el.innerHTML = ItemProductTemplate();
    //
    // load products
    //

    var sql = `
      select 
        products.product_specification,
        suppliers.address,
        products.product_photo,
        products.production_daily_capacity,
        products.id
      from 
        products_items
      join 
        products ON products.id = products_items.product_id
      join
        suppliers on suppliers.id = products.supplier_id
      where
        products_items.deleted <> 1 AND
        products_items.item_id = ${data.item_id};
`;
    var html = "";

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {
        html += `
        <div class="item-product-block" data-product_id="${row.id}">
          <div class="item-product-title">
            <h3>Sourced Product </h3><i data-product_id="${row.id}" class="remove far fa-times-circle"></i>
          </div>
          <div class="item-product-block-grid">
            <div class="item-product-details grid-2-columns">
              <div class="label">Specifiction:</div><div>${row.product_specification}</div>
              <div class="label">Location:</div><div>${row.address}</div>
              <div class="label">Daily Capacity:</div><div>${s2Number(row.production_daily_capacity)}</div>
            </div>
            <div class="product-image">
             <img src="${row.product_photo}">
            </div>
            <div class="item-product-certificates" data-product_id ="${row.id}"></div>
        </div>
      </div>
      `;

        el.innerHTML += html;
        el.querySelectorAll('img').forEach(img => { imgPop(img) });
        el.querySelectorAll('.item-product-certificates').forEach(product_row => {
          data.covid19.renderDocs(product_row.dataset.product_id, product_row);
        });

      });

      //treat buttons

        document.querySelectorAll('.remove').forEach(el => {
        el.addEventListener('click', (e) => {

          data.item_product_id = e.target.dataset.id;
          data.covid19.sendPeerDatabaseRequest("covid19", "products-items", "uuid", "products_items.id = " + data.item_product_id, null, async (res) => {

            let c = confirm("Are you sure you want to remove this item-product?");
            if (c) {

              let values = [];
              values[0] = {};
              values[0].dbname = "covid19";
              values[0].table = "products_items";
              values[0].column = "uuid";
              values[0].value = res.rows[0].uuid;

              data.covid19.deleteDatabase(values);

              await salert("Delete Requested - please reload in 30 seconds");

            }
          });
        });
      });
    });

  },

  attachEvents(app, data) {
  }
}