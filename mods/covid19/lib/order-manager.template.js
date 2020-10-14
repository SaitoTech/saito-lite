module.exports = OrderManagerTemplate = () => {

  let html = '';

  html = `
  <div class="order-information">

    <h2>Orders</h2>

    <p><hr /></p>

    <div class="loading">

      <p>
        Please be patient while we load the orders. 
      </p>

    </div>

    <div id="order-table" class="order-table" style="display:none"></div>

    <p><hr /></p>

    <div class="flex-around">
       <div class="new-order-btn button">New Order</div>
    </div>
    
  </div>
  `;

  return html;

}
