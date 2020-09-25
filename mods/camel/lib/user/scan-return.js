const ScanReturnTemplate = require('./scan-return.template');

module.exports = ScanReturn = {

  async render(app, data) {

    var content = await this.checkId(app, data);

    return ScanReturnTemplate(content);
  },

  async checkId(app, data) {
    try {
      var payload = {};
      let scans = {};

      if (data.query.uuid) {
        payload.uuid = data.query.uuid;
      } else {
        return `<h2>Item Not Found</h2>`;
      }


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

      var html = `<h2>Scan Result</h2>`;

      params = {};
      let rows = await app.storage.queryDatabase(sql, params, "camel");

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

        sqlp = `
        select 
          *
        from 
          products
        where
          uuid = '${scans.product_id}';
    `;

        let prows = await app.storage.queryDatabase(sqlp, params, "camel");
        if (prows.length > 0) {
          product = prows[0];

          if (product.product_name) {
            html += `
          <div class="scan-check-product grid-2">
            <div class="table-head">Name</div>
            <div>${product.product_name}</div>
            <div class="table-head">Product Image</div>
            <div><img style='max-width:200px;max-height:200px' src='${product.product_photo}'/></div>
          </div>
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

      }


      // update database


      let fields = [];
      let values = [];

      fields[0] = {
        name: 'product_id',
        value: scans.product_id
      }
      fields[1] = {
        name: 'target_id',
        value: payload.uuid
      }
      fields[2] = {
        name: 'scan_type',
        value: 'client'
      }
      fields[3] = {
        name: 'scan_time',
        value: new Date().getTime()
      }

      fields.forEach(field => {
        let val = {}
        val.dbname = "camel";
        val.table = "scans";
        val.column = field.name,
        val.value = field.value;
        values.push(val);
      });

      //this.app.modules.returnModule('Camel').submitValues(values);
      data.mod.submitValues(values);

      return html;

    } catch (err) {
      console.log(err);
    }

  }


}
