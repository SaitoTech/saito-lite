const AttachProductTemplate = require('./attach-product.template');

module.exports = AttachProduct = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += AttachProductTemplate();

    //load products

    var sql = `
      select 
        products.id,
        suppliers.name,
        products.product_specification,
        products.product_photo
      from 
        products
      join 
        suppliers on products.supplier_id = suppliers.id
      where
        products.deleted <> 1 
      and
        products.category_id = ${data.category_id};
    `;

    var html = `
          <div class="table-head">Supplier</div>
          <div class="table-head">Specifictation</div>
          <div class="table-head">Photo</div>
          <div class="table-head"></div>
        `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach(row => {

        html += `<div>${row.name}</div>`;
        html += `<div>${row.product_specification}</div>`;
        html += `<div><img style="max-width:200px;max-height:200px" src="${row.product_photo}"/></div>`;
        html += `
            <div class="grid-buttons-narrow ${row.id}">
              <div class="grid-action attach" data-id="${row.id}">Attach</div>
            </div>`;
      });
      document.querySelector('.modal-form').innerHTML += html;

      document.querySelectorAll('.grid-action.attach').forEach(el => {
        el.addEventListener('click', (e) => {

          let fields = [];
          let values = [];
          fields[0] = {
            name: 'product_id',
            value: e.target.dataset.id
          }
          fields[1] = {
            name: 'item_id',
            value: data.item_id
          }

          fields.forEach(field => {
            let val = {}
            val.dbname = "covid19";
            val.table = "products_items";
            val.column = field.name,
            val.value = field.value;
            values.push(val)
          });

          data.covid19.submitValues(values);
          document.querySelector('.product-template').destroy();
  
        });
      });
    });

  },

  attachEvents(app, data) {
    var this_module = data.covid19;

    let supplier_publickey = app.wallet.returnPublicKey();

    try {
      let pkeyobj = document.querySelector(".supplier_publickey");
      if (pkeyobj) {
        supplier_publickey = pkeyobj.value;
      }
    } catch (err) { }

    document.getElementById('cancel-product').addEventListener('click', (e) => {
      //document.querySelector('.Product').style.display = "none";
      data.product_id = "";
      document.querySelector('.product-template').destroy();
    });

  }
}
