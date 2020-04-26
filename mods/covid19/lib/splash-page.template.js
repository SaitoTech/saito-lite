module.exports = SplashPageTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>COVID-19 Equipment Available:</h2>

    <p>

    The table below contains the real-cost of COVID-19 response equipment from certified factories in Asia. Our team is working around the clock to compile and publish this data. Purchasers should note that prices are indicative only as they change daily. If you are a purchaser contact us - we can usually get you a quote that is good for 48 hours.

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


    <h3>Who is behind this?</h3>

    <p>

    DHB Global is a healthcare firm based in Asia. Our team has 15+ years experience working with leading multinational companies in China along with 100+ hospitals and research institutions in America and 150+ more across Europe. As COVID began to take hold, we were asked to join a task force at WEF and have since been working with 14 national governments and Ministries of Health to source COVID response equipment. We have never supplied non-compliant equipment.

    </p>
    <p>

    Right now we have access to all major personal protection equipment, including face shields, goggles, and masks (N94/N95/surgical). All of the factories included in our database have verified certifications and test results. Our priority is streamlining large and mid-sized equipment purchases while ensuring goods meet required medical standards and preventing theft or tampering during shipping. We use cryptographic tools and blockchain technology to reinforce transparency on suppliers and document all steps in the shipping process.

    </p>

    <p>

    For questions or purchase inquiries, please contact us at <a href="mailto:kevin@dhb.global">kevin@dhb.global</a>.

    </p>

    <hr />


  </div>
  `;

  return html;

}