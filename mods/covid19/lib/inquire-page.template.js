module.exports = ProductPageTemplate = () => {

  let html = '';

  html = `

<div class="inq-form">

  <h3>Product Inquiry</h3>

  <p>

  Fill in the following form to keep track of the products in which you are interested. You can submit the form by email (click below) or by downloading it as a PDF and contact us at kevin@dhb.global.
  </p>

  <p>

  This form will auto-save as you change it. To add new items just click on the "Find More Goods" button. Your existing list will be available here the next time you return to this page.

  </p>

  <table class="inq-grid" id="inq-grid"></table>
  <hr />
  <div class="contact-grid grid-3-columns">
    <div id="copy-product-list"><i class="fas fa-print"></i> Download as PDF</div>
    <div id="clear-product-list"><i class="fas fa-backspace"></i> Clear List</div>
    <div id="send-product-list"><i class="far fa-envelope"></i> Email Enquiry</div>
  </div>

  <hr />

  <h4>Contact</h4>

  <div class="contact-grid grid-2-columns">
    <div><i class="far fa-envelope"></i> Email: kevin@dhb.global</div>
    <!--div><i class="fas fa-phone-alt"></i> Phone:</div><div>+123 4567 8910</div-->
  </div>

  <div class="contact-grid grid-2-columns">
  <button id="keep-shopping">Find More Goods</button>
  </div>

</div>
  `;

  return html;

}
