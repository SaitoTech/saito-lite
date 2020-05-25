const PurchaseOrderTemplate = require('./purchase-order.template');

module.exports = PurchaseOrder = {

  render(app, data, mycallback=null) {

    var doc = document.implementation.createHTMLDocument('Purchase Order');
    doc.documentElement.innerHTML += PurchaseOrderTemplate();

    var sql = `
    select 
      categories.name as 'category',
      categories.id as 'category_id',
      statuses.status_name as 'status',
      items.id as 'item_id',
      *
    from 
      items 
    JOIN 
      categories ON categories.id = items.category_id
    JOIN 
      statuses ON statuses.id = items.status_id

    where
      items.deleted <> 1 AND
      items.order_id = ${data.order_id};
      (
        (admin = "${app.wallet.returnPublicKey()}"
      OR
        "${app.wallet.returnPublicKey()}" = "${data.covid19.admin_pkey}") 
      )
`;
  var html = `
    <tr>
      <th width="10%">No.</td>
      <th width="55%">Item Name</th>
      <th width="10%">Units</th>
      <th width="10%">Unit Cost</th>
      <th width="15%">Total</th>
    </tr>
  `;

  var count = 1;
  var total = 0;

  data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
    res.rows.forEach(row => {

      html += `
      <tr>
        <td>${count}</td>
        <td>${row.category}</td>
        <td style="text-align:right;">${s2Number(row.quantity)}</td>
        <td style="text-align:right;">${s2Number(row.price)}</td>
        <td style="text-align:right;">${s2Number(row.price * row.quantity)}</td>
      </tr>
      `;
      count ++;
      total += (row.price * row.quantity);
    });
    html += `
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td style="text-align:right;"><b>TOTAL:</b></td>
        <td style="text-align:right;"><b>${s2Number(total)}</b></td>
      </tr>
    `;
    doc.getElementById('requirements-grid').innerHTML = html;
    doc.getElementById('sub-title').innerHTML = data.sub_title;
    doc.getElementById('brief-description').innerHTML = data.brief_description;
    doc.getElementById('quote-terms').innerHTML = `Shipping: All prices quoted as ${data.pricing_mode}.`;
        
    if(mycallback) {
      if(data.fetch == "document") {
        mycallback(doc.documentElement.innerHTML);
      } else {
        mycallback(doc.querySelector(data.fetch).innerHTML);
      }
    }

  });

  },

  attachEvents(app, data) {}
}