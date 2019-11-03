module.exports = HospitalMakeAppointmentRowTemplate = (dbrow) => {

  return `
  <div class="hospital" id="hospital">
    <div class="hospital-name">${dbrow.name}</div>
    <div class="available-appointments">
      <select name="appointment-time-select" id="appointment-time-select-${dbrow.id}">
        <option class="appointment-slot" value="730">7:30</option>
        <option class="appointment-slot" value="1020">10:20</option>
        <option class="appointment-slot" value="1340">13:40</option>
        <option class="appointment-slot" value="1505">15:05</option>
      </select>
      <button class="book-appointment-slot-btn" id="${dbrow.id}">book appointment</button>
    </div>      
  </div>
  `
};
