module.exports = ProductPageTemplate = () => {

  let html = '';

  html = `

  <h3>Product Inquiry</h3>

  <p>

  DHB is a concierge service - more message here.

  Let us know you are interested in:

  <div class="inq-grid grid-2-columns" id="inq-grid"></div>

  <h4>Contact Methods</h4>

  <div class="contact-grid grid-2-columns">
    <div><i class="far fa-envelope"></i> Email:</div><div>dangerD@theDouggPound.com</div>
    <div><i class="fas fa-phone-alt"></i> Phone:</div><div>+123 4567 8910</div>
  </div>

  <button id="keep-shopping">Go back to list</button>
  `;

  return html;

}