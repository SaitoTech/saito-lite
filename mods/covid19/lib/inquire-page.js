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
        var html = "<tr>";

        Object.entries(res.rows[0]).forEach(field => {
          html += `<td class="inq-product-name">${field[0]}</td>`;
        });
        html += "</tr>";

        res.rows.forEach(row => {
          html += "<tr>";
          Object.entries(row).forEach(field => {
            html += `<td class="inq-product-id">${field[1]}</td>`;
          });
          html += "</tr>";
        });
        document.querySelector('.inq-grid').innerHTML = html;
      }
    });

  },

  attachEvents(app, data) {

    document.getElementById('keep-shopping').addEventListener('click', () => {
      data.covid19.renderPage("customer", app, data);
    });
    data.covid19.pdfCapture(document.getElementById('copy-product-list'),document.getElementById('inq-grid'),100,200,'inquiry.pdf')
  }
}

