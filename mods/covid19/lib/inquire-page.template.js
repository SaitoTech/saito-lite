module.exports = ProductPageTemplate = () => {

  let html = '';

  html = `

<div class="inq-form">

  <h3>Product Inquiry</h3>

  <p>

  DHB is a concierge service - contact us at kevin@dhb.global and we will wil be right with you.

  Let us know you are interested in:

  <table class="inq-grid" id="inq-grid"></table>


  <div id="copy-product-list"><i class="far fa-copy"></i> Copy</div>

  <hr />

  <h4>Contact</h4>

  <div class="contact-grid grid-2-columns">
    <div><i class="far fa-envelope"></i> Email:</div><div>kevin@dhb.global</div>
    <!--div><i class="fas fa-phone-alt"></i> Phone:</div><div>+123 4567 8910</div-->
  </div>

  <button id="keep-shopping">Find More Goods</button>

</div>
  `;

  return html;

}