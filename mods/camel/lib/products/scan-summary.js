const ScanSummaryTemplate = require('./scan-summary.template');
const UpdateSuccess = require('../utils/update-success');


module.exports = ScanSummary = {

  async render(app, data) {

    document.querySelector('.main').innerHTML = ScanSummaryTemplate();
    //data.product_uuid
    var html = "";
  
    var sql = `
      select 
        count(*) as 'scans', 
        min(scan_time) as 'first', 
        max(scan_time) as 'last', 
        scan_type as 'type' 
      from 
        scans 
      group by 
        scan_type 
      order by 
        scan_type desc;
    `;

    html = `
      <div class="table-head">Type</div>
      <div class="table-head">No.</div>
      <div class="table-head">Earliest</div>
      <div class="table-head">Latest</div>
      `;
  
    data.mod.sendPeerDatabaseRequestRaw("camel", sql, function (res) {
      res.rows.forEach(row => {
      html += `
        <div>${row.type}</div>
        <div>${row.scans}</div>
        <div>${new Date(row.first).toLocaleDateString('zh-CN', { dateStyle: 'short', hour12: false })}</div>
        <div>${new Date(row.last).toLocaleDateString('zh-CN', { dateStyle: 'short', hour12: false })}</div>
      `;
      });
      document.querySelector('.summary-grid').innerHTML = html;
    });


  },

  attachEvents(app, data) {

    document.getElementById('summary-exit').addEventListener('click', (e) => {
      data.mod.setRoute(app, data);
    });

  }
}
