const PhoneScanReturnTemplate = require('./phone-scan-return.template');
const UserApp = require('./phone-app');

module.exports = PhoneScanReturn = {

  render(app, data) {

    document.querySelector('.main').innerHTML = PhoneScanReturnTemplate();
    //data.product_uuid
    var scans = [];
    var rows = [];
    var prows = [];
    var html = "";

    var payload = data.query;

    var sql = `
        select 
          count(*) as 'scans', 
          min(scan_time) as 'first', 
          max(scan_time) as 'last', 
          scan_type as 'type',
          product_id
        from 
          scans 
        where 
          target_id = '${payload.uuid}'
        group by 
          scan_type 
        order by 
          scan_type desc;
      `;

    var html = ``;

    data.mod.sendPeerDatabaseRequestRaw("camel", sql, function (res) {
      rows = res.rows;
      if (rows.length == 0) {
        html += `
                  <div>
                    <h2>We cannot locate this id.</h2>
                    <p>Please contact us to report this.</p>
                  </div>
                  <div class="scan-result badscan">
                       <i class="fas fa-times-circle"></i>
                    </div>
                  <div><hr /></div>`;
      } else {

        rows.forEach(row => {
          scans[row.type] = row.scans;
          scans[row.type + "_latest"] = new Date(row.last).toLocaleDateString('zh-CN', { dateStyle: 'short', hour12: false });
          scans.product_id = row.product_id;
        });

        if (!scans.scan_in) {
          console.log("Suspicious Scan");
          html += `
                    <div>
                      <h2>We cannot locate this Product.</h2>
                      <p>Please contact us to report this.</p>
                    </div>
                    <div class="scan-result badscan">
                         <i class="fas fa-times-circle"></i>
                    </div>
                    <div><hr /></div>`;
        }
      }


      sqlp = `
          select 
            *
          from 
            products
          where
            uuid = '${scans.product_id}';
      `;

      data.mod.sendPeerDatabaseRequestRaw("camel", sqlp, function (res) {
        prows = res.rows;
        if (prows.length > 0) {
          product = prows[0];

          if (product.product_name) {
            html += `
              <div><h1>${product.product_name}</h1></div>
              <div><img style='max-width:200px;max-height:150px' src='${product.product_photo}'/></div>
            `;
          } else {
            html += `<h3>Unknown Product</h3>
                  <div class="scan-result badscan">
                  <i class="fas fa-times-circle"></i>
               </div>`;
          }

          if (rows.length > 0) {
            html += `
              <div class="scan-history grid-2-columns">
                <div class="table-head">Type</div>
                <div class="table-head">Date</div>
          `;
            rows.forEach(row => {
              html += `
              <div>${row.type.replace("_", " ").toUpperCase()}</div>
              <div>${new Date(row.last).toLocaleDateString('zh-CN', { dateStyle: 'short', hour12: false })}</div>
            `;
            });
            html += `
                  </div>
                  <div class="scan-result goodscan">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  `;
          } else {
            html += `<h3>No records found.</h3>
              <div class="scan-result badscan">
                  <i class="fas fa-times-circle"></i>
               </div>`;
          }
        }

        //alert(document.querySelector('.user-scan-result').innerHTML);
        document.querySelector('.user-scan-result').innerHTML = html;

      });

    });

  },

  attachEvents(app, data) {
    document.querySelector('.summary-exit').addEventListener('click', function() {
      UserApp.render(app, data);
      UserApp.attachEvents(app, data);
    });
  }
}