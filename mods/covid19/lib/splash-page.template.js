module.exports = SplashPageTemplate = () => {

  let html = '';

  html = `
  <div class="splash-introduction">

    <h2>COVID-19 Medical Procurement Hub:</h2>

    <p>

    This platform connects purchasers of COVID-19 response equipment with suppliers to streamline the procurement of supplies for governments and large enterprises. It puts an emphasis on ensuring the quality of goods continue to meet required medical standards. 

    </p>
    <p>

    The data here offers a real-time view into the market supply and price and quality of COVID-19 response equipment. Our team is working around the clock to provide this up-to-date information. We track real-time information on product availability, production capacity and lead times and keep records of supplier production certifications and more.

    </p>
    <p>

    <div class="flex-around">
      <button id="customer-search-btn" class="button">For Purchasers</button>
      <button id="supplier-portal-btn" class="button">For Suppliers</button>
    </div>

    </p>
    
    
    <h3>Who are the people behind this site?</h3>

    <p>

    DHB Global is a healthcare consulting firm that bridges leading pharma technologies between China and the world. Our team has 15+ years experience and has worked with leading multinational companies to bring new cancer treatments and R&D projects into China. We work with 100+ hospitals and research institutions in America as well as 150+ across Europe. 

    </p>
    <p>

    As COVID began to take hold, we were asked to join a task force at WEF and have since been working with 14 national governments and Ministries of Health to source COVID response equipment. 

    </p>
    <p>

    We have access to all major personal protection equipments, including face shields, goggles, masks (N94/N95/Surgical). All of the factories we source from directly have verified certifications and test results. We are working hard to make this information transparent and help bring additional production capacity online as possible.

    </p>


  </div>
  `;

  return html;

}
