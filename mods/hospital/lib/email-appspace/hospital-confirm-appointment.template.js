module.exports = HospitalConfirmAppointmentTemplate = () => {
  return `
  <link rel="stylesheet" href="/hospital/css/email-appspace.css">

  <h3>Confirm Appointment</h3>
  <div class= "appointment-info-box">
   <div class="appointment-info">
    <p></p>
    <p><strong>Hospital:</strong>&nbsp;Sister of Mercy Childrens' Hospital</p>
    <p><strong>Time:</strong>&nbsp;9:30 AM on Wednesday, </p>
    <p><strong>Date:</strong>&nbsp;10th January 2019</p>
    <p><strong>Location:</strong>&nbsp;5729 Silversmith Road, Petaluma, CA581-403-2938</p>
    <p><strong>Note:</strong>&nbsp;drink a plenty of water before blood check,Please</p>
    </div>
  </div>

    <h4 class=confirmInfo>Please confirm your 
    N.B.: Clicking submit makes the booking request into the system. If you have
    used this system before, bookings are usually automatic -- you will receive
    confirmation within a few minutes.

    <b>Is this information correct?</by>  
    </h4>  
    <button class="hospital-btn reselect">resel</button>
    <button class="confirm-btn super" id="confirm-btn">confirm</button>
  
    `
***REMOVED***
