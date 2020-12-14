module.exports = PhoneAppTemplate = (content) => {

    var html = `
    
    <div class="phone_body">
     <img src="img/splashlogo.png" class="splashlogo" />
     <div class="homelogo"></div>
     <div class="homebody">
       <p>
         Click the QR Code Icon <i class="fas fa-qrcode"></i> to scan.
       </p>
     </div>   

    </div>
    
    
  `;
     return html;
  }