module.exports = SplashPageTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

  <h2>DHB COVID Response PPE Procurement Portal</h2>

  The table below contains the latest prices, daily capacity and certifications of COVID-19 response equipment from our certified factories in Asia. Please note that pricing is changing daily. If you are procuring PPE, please contact us.

    </p>

    <div class="summary-section" id="summary-section">

      <hr />

      <div class="product-summary" id="product-summary">
        Loading...
      </div>

      <p>
        * Prices are indicative from previous purchases.
      </P>
      <hr />


  
    </div>

    <div class="splash-actions">
      <button id="customer-search-btn" class="button">View Products by Category</button>
      <button id="list2pdf-btn" class="button">Download List as PDF</button>
    </div>


    <h3>About Us</h3>

    <p>

    DHB Global is a healthcare consultancy based in Hong Kong and Beijing. Our team has 15+ years experience working with leading multinational companies in China along with 100+ hospitals and research institutions in America and 150+ more across Europe. As COVID began to take hold, we were asked to join a task force at WEF and have since been working with 14 national governments and Ministries of Health to source COVID response equipment.

    </p>
    <p>

    We have direct access to all major personal protection equipment. All of the factories included in our database have verified certifications and test results. Our priority is streamlining large and mid-sized equipment purchases while ensuring goods meet required medical standards and preventing theft or tampering during shipping. We use cryptographic tools and blockchain technology to reinforce transparency on suppliers and document all steps in the shipping process.

    </p>

    <p>
    For questions or purchase inquiries, please contact us at e.yeung@dhb.global.
    </p>

    <hr />


  </div>
  `;

  return html;

}
