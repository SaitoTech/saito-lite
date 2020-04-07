const InquirePageTemplate = require('./inquire-page.template');


module.exports = InquirePage = {

  render(app, data) {

    var ids = localStorage.cart.replace("|", "('").replace(/\|/g, "', '") + "')";

    document.querySelector(".main").innerHTML = ProductPageTemplate();

    let fields = `
        product_specification as 'Product', \
        id as 'Product ID'
      `;

    data.covid19.sendPeerDatabaseRequest("covid19", "products", fields, "id in " + ids, null, function (res) {

      if (res.rows.length > 0) {
        var html = "";

        Object.entries(res.rows[0]).forEach(field => {
          html += `<div class="inq-product-name">${field[0]}</div>`;
        });
        res.rows.forEach(row => {
          Object.entries(row).forEach(field => {
            html += `<div class="inq-product-id">${field[1]}</div>`;
          });
        });
        document.querySelector('.inq-grid').innerHTML = html;
      }
    });

  },

  attachEvents(app, data) { }

}