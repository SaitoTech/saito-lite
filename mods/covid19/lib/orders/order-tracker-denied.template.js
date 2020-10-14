module.exports = OrderTrackerDeniedTemplate = (app, data) => {

  let html = '';

  html = `
  <div class="order-template">
    
    <h2>Order Not Found</h2>

    <div class="denied-message">
      Tracking Number Cannot be Found.
    </div>
  
  </div>


  `;

  return html;

}