const InquirePageTemplate = require('./inquire-page.template');

module.exports = InquirePage = {

  render(app, data) {

    var ids = localStorage.cart.replace("|", "('").replace(/\|/g, "', '") + "')";

    document.querySelector(".main").innerHTML = ProductPageTemplate();

    let cart = JSON.parse(localStorage.cart);

    var html = `
    <tr>
      <td class="inq-product-name">Category</td>
      <td class="inq-product-name">Budget</td>
      <td class="inq-product-name">Quantity</td>
      <td class="inq-product-name">Requirements</td>
      <td class="inq-product-name"></td>
      </td>
      `;

    cart.products.forEach(product, () => {
      html += "<tr>";
        html += `
        <td class="inq-product-id">${product.category}</td>
        <td class="inq-product-id">${product.budget}</td>
        <td class="inq-product-id">${product.quantity}</td>
        <td class="inq-product-id">${product.requirements}</td>
        <td class="inq-product-id">
        <td class="grid-buttons ${product.id}">
          <div class="grid-action edit" data-id="${product.id}">Edit</div>
          <div class="grid-action delete" data-id="${product.id}">Delete</div>
        </td>
        </tr>`;
        document.querySelector('.inq-grid').innerHTML = html;
    });
    
    


  },

  attachEvents(app, data) {

    document.getElementById('keep-shopping').addEventListener('click', () => {
      data.covid19.renderPage("customer", app, data);
    });
    data.covid19.pdfCapture(document.getElementById('copy-product-list'),document.getElementById('inq-grid'),100,200,'inquiry.pdf')
  }
}

