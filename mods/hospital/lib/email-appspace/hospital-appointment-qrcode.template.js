module.exports = HospitalAppointmentProfileTemplate = () => {
  return `
<link rel="stylesheet" href="/hospital/css/email-appspace.css">
    <div class="qrcode-appointment">
    <div id="qrcode"></div>
     
    <div id="qrcode-appointment-info">
        <div class="appointment-hospital-name">Sister of Mercy Childrens Hospital </div>
        <div class="appointment-hospital-address">Silversmith Road,Petaluma,CA 58-403-2938</div>
        <div class="appointment-hospital-time">9:30 AM - Wednesday, January 2 (2019)</div>
    </div>

    </div>


        `;
}

