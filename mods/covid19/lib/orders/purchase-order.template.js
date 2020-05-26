module.exports = PurchaseOrderTemplate = () => {

  let html = '';

  html = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Purchase Order</title>
      <style>
        body {}
        td   {font-size: 14px;}
        span {color: #555;}
      </style>
    </head>
    <body>
     <h1>Purchase Order</h1>
     <h3 id="sub-title"></h3>
     <table width="100%">
       <tr>
       <td>
         <p>
           <b>To: DHB Global Hong Kong</b><br />
           Attn: Mr Douglas Corley<br />
           Email: d.corley@dhb.global
         </p>
       </td>
       <td>
         <span>[ENTER BUYER DETAILS HERE]</span>
       </td>
       </tr>
     </table>
     <hr />
     <h4>Request to Purchase</h4>
     <div id="brief-description" style="text-decoration-underline"></div>
     <div id="details">
       <div>Details:</div>
       <table width="100%" id="requirements-grid"></table>
       <div id="quote-terms"></div>
     </div>
     <hr />
     <div id="payment-terms">
       <h4>Payment Terms</h4>
       <p>
         <span>[ENTER PAYMENT TERMS]</span>
       </p>
     </div>
     <hr />
     <div id="conditions">
       <h4>Conditions</h4>
       <p>
         <span>[ENTER OTHER CONDITIONS]</span>
       </p>
     </div>
    </body>
    </html>
  `;

  return html;

}

