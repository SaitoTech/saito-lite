module.exports = HospitalConfirmAppointmentTemplate = () => {
  return `
  <link rel="stylesheet" href="/hospital/css/email-appspace.css">

  <h3>Confirm Appointment</h3>

  <div class="appointment-info">
    You have selected an appointment at:

    <p></p>

    Sister of Mercy Childrens' Hospital
    9:30 AM on Wednesday, January 2nd (tomorrow)
    5729 Silversmith Road, Petaluma, CA

    581-403-2938

    <h4>Please confirm your 


    N.B.: Clicking submit makes the booking request into the system. If you have
    used this system before, bookings are usually automatic -- you will receive
    confirmation within a few minutes.


    <b>Is this information correct?</by>    

    <button class="reselect">resel</button>
    <button class="confirm super">confirm</button>

  </div>

    `;
}
