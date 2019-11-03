module.exports = HospitalConfirmAppointmentTemplate = () => {
  return `
  <link rel="stylesheet" href="/hospital/css/email-appspace.css">

  <h3>Waiting for Confirmation</h3>

  <div class="appointment-info">

    You will be notified via SMS message when your booking is complete.

    <p></p>

    If you need to cancel or change this appointment, visit the "View Appointments" 
    section of this app. This contains a QRCode you will need to show for 
    admittance and treatment.

    <p></p>

    <button class="return-to-mainpage">return to mainpage</button>

  </div>

    `;
***REMOVED***
