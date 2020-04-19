module.exports = SplashPageTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>COVID-19 Medical Procurement Hub:</h2>

    <p>

    This platform connects suppliers of COVID-19 response equipment with governments and large enterprise procurers. Its emphasis is on ensuring goods continue to meet required medical standards. Strong cryptographic tools and blockchain technology is used to reinforce transparency on who is producing supplies under what production standards.

    </p>
    <p>

    The resulting data offers a real-time view into the supply and price and quality of COVID-19 response equipment. Our team is working around the clock to keep this information up-to-date. All information on product availability, production capacity and supplier certifications are cryptographically-signed and publicly viewable.

    </p>

    <div class="summary-section">

      <h3>Product Availability</h3>

      <hr />

      <div class="product-summary">
        Loading...
      </div>

      <hr />
  
    </div>
    
    <h3>Who are the people behind this datahub?</h3>

    <p>

    DHB Global is a healthcare consulting firm that bridges leading pharma technologies between China and the world. Our team has 15+ years experience and has worked with leading multinational companies to bring new cancer treatments and R&D projects into China. We work with 100+ hospitals and research institutions in America as well as 150+ across Europe. 

    </p>
    <p>

    As COVID began to take hold, we were asked to join a task force at WEF and have since been working with 14 national governments and Ministries of Health to source COVID response equipment. 

    </p>
    <p>

    We have access to all major personal protection equipments, including face shields, goggles, masks (N94/N95/Surgical). All of the factories we source from directly have verified certifications and test results. We are working hard to make this information transparent and help bring additional production capacity online as possible.

    </p>

    <p>

    <div class="flex-around">
      <button id="customer-search-btn" class="button">For Purchasers</button>
      <button id="supplier-portal-btn" class="button">For Suppliers</button>
    </div>

    </p>


  </div>
  `;

  return html;

}
