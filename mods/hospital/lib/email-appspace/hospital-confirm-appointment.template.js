module.exports = HospitalConfirmAppointmentTemplate = () => {
  return `
  <link rel="stylesheet" href="/hospital/css/email-appspace.css">

  <h3>Confirm Appointment</h3>
<div class="confirm-appointment-box">
  
  <ul class="hospital-appointments-box confirm-appointments">
    <li class="appointment">
        <div class="hospital-name">Sister of Mercy Childrens' Hospital</div>
        <div class="hospital-address">Silversmith Road,Petaluma,CA 58-403-2938</div>
        <div class="hospital-appointment-time">9:30 AM - Wednesday, January 2 (2019)</div>
    </li>
  </ul>

  <h4>Please confirm your 

  N.B.: Clicking submit makes the booking request into the system. If you have
  used this system before, bookings are usually automatic -- you will receive
  confirmation within a few minutes.</h4>

  <h4>Is this information correct?</h4>
  
  <div class="confirm-btn-box">
    <button class="reselect sub"><i class="fas fa-redo"></i>Reselect</button>
    <button class="confirm sub" id="confirm-btn"><i class="far fa-calendar-check"></i>Confirm</button>
   </div>
      
</div>
  
    `;
}
