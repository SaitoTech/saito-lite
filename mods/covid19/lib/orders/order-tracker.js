const OrderTrackerTemplate = require('./order-tracker.template');
const OrderTrackerDeniedTemplate = require('./order-tracker-denied.template');
const Log = require('../utils/log');


module.exports = OrderTracker = {

  async render(app, data) {

    var token = "";

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) {
      token = urlParams.get('token');
    } else {
      document.querySelector('.main').innerHTML = OrderTrackerDeniedTemplate();
      return;
    }

    document.querySelector('.main').innerHTML = OrderTrackerTemplate();

    var html = "";

    var sql = `
    select 
      o.id,
      o.order_number, 
      substr(o.uuid, 0, 14) as 'created', 
      s.status_name as 'status' 
    from 
      orders as o, 
      statuses as s 
    where 
      o.order_status = s.id and 
      o.deleted <> 1 and 
      substr(o.uuid, 15, 15) = '${token}';
    `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      
      if(res.rows.length > 0){
        res.rows.forEach(row => {
          html += `
          <div class="grid-title">Order No:</div>
          <div class="grid-value">${row.order_number}</div>
          <div class="grid-title">Status:</div>
          <div class="grid-value order-status">${row.status}</div>

          <div class="grid-title">Created:</div>
          <div class="grid-value">
            <span><i class="far fa-clock"></i></span>
            <span>${new Date(parseInt(row.created)).toLocaleDateString('zh-CN', { dateStyle: 'short', hour12: false })}</span>
          </div>
          <div class="grid-title">Last Update:</div>
          <div class="grid-value last-update"></div>          
          `;
          data.order_id = row.id;

          Log.render(app, data, document.querySelector('.order-log'));
          Log.attachEvents(app, data);

        });
        document.querySelector('.main-form').innerHTML = html;

      } else {
        document.querySelector('.main').innerHTML = OrderTrackerDeniedTemplate();
      }
      
    });


  },

  attachEvents(app, data) {
    app.connection.on('log_render_complete', (app, data) => {
     document.querySelector('.last-update').innerHTML = document.querySelectorAll('.log-time p')[document.querySelectorAll('.log-time').length-1].innerHTML;
     document.querySelector('.new-log-message').classList.add('hidden');
  });
  
  }
}
