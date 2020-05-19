const InquirePageTemplate = require('./inquire-page.template');

module.exports = InquirePage = {

  render(app, data) {

    document.querySelector(".main").innerHTML = ProductPageTemplate();


    if (typeof localStorage.cart == 'undefined') {
      localStorage.cart = JSON.stringify({ "products": [] });
    }
    let cart = JSON.parse(localStorage.cart);

    var html = `
    <tr>
    <td class="inq-product-name" style="width:15%">Product</td>
    <td class="inq-product-name" style="width:20%">Budget/item</td>
    <td class="inq-product-name" style="width:20%">Quantity</td>
    <td class="inq-product-name" style="width:43%">Requirements</td>
    <td class="inq-product-name" style="width:2%"></td>
    </tr>
      `;

    cart.products.forEach(product => {
      html += `
      <tr class="data-row" data-id="${product.id}" id="row-${product.id}">
        <td class="inq-product-id"><div data-column="Category">${product.category}</div></td>
        <td class="inq-product-id"><div class="editable" data-column="budget" contenteditable="true">${product.budget}</div></td>
        <td class="inq-product-id"><div class="editable" data-column="quantity" contenteditable="true">${product.quantity}</div></td>
        <td class="inq-product-id"><div class="editable" data-column="requirements" contenteditable="true">${product.requirements}</div></td>
        <td class="grid-buttons ${product.id}">
         <div class="grid-go delete" data-id="${product.id}"><i class="far fa-times-circle"></i></div>
        </td>
        </tr>`;
      document.querySelector('.inq-grid').innerHTML = html;
    });




  },

  attachEvents(app, data) {

    var this_page = this;

    document.getElementById('keep-shopping').addEventListener('click', () => {
      data.covid19.renderPage("home", app, data);
    });

    document.getElementById('clear-product-list').addEventListener('click', () => {
      localStorage.cart = JSON.stringify({ "products": [] });
      data.covid19.renderPage("home", app, data);
    });

    document.getElementById('send-product-list').addEventListener('click', () => {
      document.querySelector('.footer').innerHTML = this_page.emailRender(app, data);
      this_page.emailAttachEvents(app, data, this_page);
    });

    document.querySelectorAll('div.grid-go.delete i').forEach(el => {
      el.addEventListener('click', (e) => {
        document.getElementById('row-' + e.target.parentNode.dataset.id).destroy();
        this_page.saveCart();
      });
    });

    document.getElementById('copy-product-list').addEventListener('click', (e) => {
      data.covid19.pdfCap(this_page.returnPrintHTML(), 'DHB-Request-For-Offer-' + new Date().toISOString().split('T')[0].replace(/-/g,'') + '.pdf');
    });

    document.querySelectorAll('.inq-product-id div.editable').forEach(el => {
      el.addEventListener('blur', function () {
        this_page.saveCart();
      });
    });


  },


  saveCart() {
    let cart = { products: [] };
    document.getElementById('inq-grid').querySelectorAll('tr.data-row').forEach(row => {
      var items = row.querySelectorAll('div');
      let product = {
        category: items[0].innerText,
        budget: items[1].innerText,
        quantity: items[2].innerText,
        requirements: items[3].innerText,
        id: row.dataset.id
      }
      cart.products.push(product);
    });
    localStorage.cart = JSON.stringify(cart);
  },

  returnPrintHTML() {
    var pdfHTML = `
    <div style="padding: 15px; background: linear-gradient(-45deg, #369 50%, #036 100%);">
      <img class="logo major-logo" src="/covid19/dhbgloballogo.png">
    </div>
    <p><h2>Request for Proposal</h2></p>
    <hr />
  `;

    let cart = JSON.parse(localStorage.cart);

    pdfHTML += "<table style='width:100%' cellspacing='10'>";
    pdfHTML += `
    <tr>
      <td class="inq-product-name" style="width:15%">Category</td>
      <td class="inq-product-name" style="width:20%">Budget/item</td>
      <td class="inq-product-name" style="width:20%">Quantity</td>
      <td class="inq-product-name" style="width:45%">Requirements</td>
    </tr>
      `;
    cart.products.forEach(product => {
      pdfHTML += `
     
        <tr class="print-row" data-id="${product.id}" id="row-${product.id}">
          <td class="inq-product-id"><div class="printable" data-column="Category">${product.category}</div></td>
          <td class="inq-product-id"><div class="printable" data-column="budget" contenteditable="true">${product.budget}</div></td>
          <td class="inq-product-id"><div class="printable" data-column="quantity" contenteditable="true">${product.quantity}</div></td>
          <td class="inq-product-id"><div class="printable" data-column="requirements" contenteditable="true">${product.requirements}</div></td>
        </tr>
        `;
    });
    pdfHTML += "</table>";

    pdfHTML += `
      <hr />
      <h4>Contact</h4>
      <div class="contact-grid grid-2-columns">
        <div><i class="far fa-envelope"></i> Email:</div><div>e.yeung@dhb.global</div>
      </div>
      <hr />
     `;

    return pdfHTML;
  },

  emailRender() {
    var html = `
    <div class="bundle-template modal-form-wrapper">
    
    <h2>Email Inquiry</h2>
    <div class="modal-form grid-2">
     <div>Your Name, Title</div>
     <div><input id="email-name" type="text"/></div>
     <div>Your Email Address</div>
     <div><input id="email-email" type="text"/></div>
     <div>Additional Information<br />Contact Details</div>
     <div><textarea id="email-more"></textarea></div>    
    </div>
    <div class="modal-form-buttons">
      <button id='cancel-email' class='cancel-email'>  Cancel</button>
      <button id='send-email' class='cancel-email'>  Send</button>
    </div>
  </div>
    `;
    return html;
  },

  emailAttachEvents(app, data, this_page) {
    document.getElementById('cancel-email').addEventListener('click', () => {
      document.querySelector('.modal-form-wrapper').destroy();
    });

    document.getElementById('send-email').addEventListener('click', () => {

      //todo - send saito mail
      /*
      let tx = app.wallet.createUnsignedTransaction();
      tx.transaction.msg.module = "Email";
      tx.transaction.msg.title = "Customer Enquiry";
      tx.transaction.msg.message = this_page.returnPrintHTML();
      
      tx = app.wallet.signTransaction(tx);
      let emailmod = app.modules.returnModule("Email");
      emailmod.addEmail(tx);
      app.storage.saveTransaction(tx);
      */  
      
      /* send legacy email */
      let message = {};
      message.to = 'richard@saito.tech';
      message.from = document.getElementById('email-email').value;
      message.cc = document.getElementById('email-email').value;
      message.bcc = "richard@saito.tech";
      message.subject = 'Expression of Interest from: ' + document.getElementById('email-name').value;
      message.body = document.getElementById('email-more').value;
      
      message.body += "<hr />" + this_page.returnPrintHTML();
      
      message.ishtml = true;
      
      app.network.sendRequest('send email', message);
      siteMessage("Email Sent", 1000);
      document.querySelector('.modal-form-wrapper').destroy();

    });

  }




}





