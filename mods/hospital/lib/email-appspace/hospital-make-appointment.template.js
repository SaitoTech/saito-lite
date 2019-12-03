module.exports = HospitalMakeAppointmentTemplate = () => {
  return `
  <link rel="stylesheet" href="/hospital/css/email-appspace.css">

  <div class="appointment-select-category">
    <select class="appointment-select-category-select" name="appointment-select-category-select">>
      <option value="selectl" selected>Select Appointment Category</option>
      <option value="general">General Medicine</option>
      <option value="pediatrics">Pediatrics</option>
      <option value="dentistry">Dentistry</option>
      <option value="cardiology">Cardiology</option>
      <option value="Endocrinology">Endocrinology</option>
    </select>
  </div>


  <div class="appointment-select-appointment">

    Date Selected: <input type="date" id="appointment-date" class="appointment-date" name="appointment-date" />

    <div class="appointments">
    </div>

  </div>



    `;
}
