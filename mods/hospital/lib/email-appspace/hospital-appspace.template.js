module.exports = HospitalAppspaceTemplate = () => {
  return `
  <link rel="stylesheet" href="/hospital/css/email-appspace.css">
  <div class="grid-2-columns">
  <h3 class="hospital-title">Administracion de Reservas Hospitalarias</h3>
    <div class="hospital-splash-image-container">
      <img src="/hospital/img/splash.jpg" class="hospital-splash-image" />
    </div>
    <div class="hospital-btn-box">
      <div><button id="hospital-make-appointment-btn" class="hospital-button">Make Appointment</button></div>
      <div><button id="hospital-view-appointments-btn" class="hospital-button">View Appointment</button></div>
    </div>
  </div>
  `;
}
