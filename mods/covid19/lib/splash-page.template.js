module.exports = SplashPageTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>Covid19 On-Chain Medical Procurement Hub:</h2>

    <p></p>

    This datahub connects organizational purchasers of coronavirus-related medical equipment with suppliers. It exists to streamline the production of essential medical equipment for government and large organizations while ensuring supplied materials continue to meet required medical standards.

    <p></p>

    In order to protect all participants, cryptographic signatures are used to authenticate buyers and sellers. Factory prices, capacity and product safety information is cryptographically signed, uploaded and available for review. Our team strives to ensure the accuracy of all information. We invite participation from others to create an open review and verification system.

    <p></p>

    <div style="float:left"><button id="customer-search-btn" class="button">I want to purchase medical supplies</button></div>
    <div style="float:left;margin-left:30px"><button id="supplier-portal-btn" class="button">I can provide medical supplies</button></div>
  </div>
  `;

  return html;

}
