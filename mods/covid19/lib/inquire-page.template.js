module.exports = ProductPageTemplate = () => {

  let html = '';

  html = `

<div class="inq-form">

  <h3>Product Inquiry</h3>

  <p>

  Please let us know which product you are looking for and your budget per item, target quantity and requirement. Contact us at e.yeung@dhb.global and we will get back to you.” Instead of “DHB is a concierge service - contact us at kevin@dhb.global and we will wil be right with you. Let us know you are interested in::

  <table class="inq-grid" id="inq-grid"></table>
  <hr />
  <div class="contact-grid grid-4-columns">
    <button id="copy-product-list"><i class="fas fa-print"></i> Download as PDF</button>
    <button id="send-product-list"><i class="far fa-envelope"></i> Email Enquiry</button>
    <div></div>
    <button id="clear-product-list"><i class="fas fa-backspace"></i> Clear List</button>
  </div>

  <hr />

  <h4>Contact</h4>

  <div class="contact-grid grid-2-columns">
    <div><i class="far fa-envelope"></i> Email: e.yeung@dhb.global</div>
    <!--div><i class="fas fa-phone-alt"></i> Phone:</div><div>+123 4567 8910</div-->
  </div>

  <div class="contact-grid grid-2-columns">
  <button id="keep-shopping"><i class="fas fa-cart-plus"></i> Add Items</button>
  </div>

</div>
  `;

  return html;

}