module.exports = HospitalProfileTemplate = () => {
  return `

  <h3>Available Appointments</h3>

  <div class="calendar">
    <input type="date" id="appointment-date" class="appointment-date" name="appointment-date" />
  </div>

  <div class="appointments">
  </div>

    `;
}
