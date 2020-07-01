module.exports = OrderTrackerTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="order-template">
    
  <h2>DHB Order Tracking</h2>

  <div class="order-head grid-2-columns">
    <div class="main-form grid-2"></div>
    <div class="order-log"></div>
  </div>

 
</div>


  `;

  return html;

}