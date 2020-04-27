module.exports = ProductPageTemplate = () => {

  let html = '';

  html = `

<div class="inq-form">

  <h3>Product Inquiry</h3>

  <p>

  DHB is a concierge service - contact us at kevin@dhb.global and we will wil be right with you.

  Let us know you are interested in:

  <table class="inq-grid" id="inq-grid"></table>

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