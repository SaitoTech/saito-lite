const datetimeFormatter = require('../../../../../../lib/helpers/datetime_formatter');

module.exports = AlauniusDetailTemplate = (app, data) => {
  let { selected_alaunius, addrController ***REMOVED***  = data.parentmod;

  let from  	= selected_alaunius.transaction.from[0].add;
  let to  	= selected_alaunius.transaction.to[0].add;
  let ts  	= selected_alaunius.transaction.ts;
  let message	= selected_alaunius.returnMessage();

  let hr_from = addrController.returnAddressHTML(from, app.keys.returnIdentifierByPublicKey(from));
  let hr_to   = addrController.returnAddressHTML(to, app.keys.returnIdentifierByPublicKey(to));

  if (hr_from != "") { from = hr_from; ***REMOVED***
  if (hr_to != "")   { to   = hr_to; ***REMOVED***

  let datetime = datetimeFormatter(ts);

  return `
    <div>
      <div class="alaunius-detail-addresses">
        <div class="alaunius-detail-address-row">
          <p>FROM:</p>
          <p class="alaunius-detail-address-id">${from***REMOVED***</p>
        </div>
        <div class="alaunius-detail-address-row">
          <p>TO:</p>
          <p class="alaunius-detail-address-id">${to***REMOVED***</p>
        </div>
      </div>
      <div class="alaunius-detail-message">
        <p class="alaunius-detail-timestamp">${datetime.hours***REMOVED***:${datetime.minutes***REMOVED***</p>
        <p>${message.message***REMOVED***</p>
      </div>
    </div>
  `;

***REMOVED***
