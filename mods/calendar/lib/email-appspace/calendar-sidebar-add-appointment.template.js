module.exports = CalendarSidebarAddAppointmentTemplate = (app) => {
  return `
    <div class="grid-2">

      <div>Title:</div>
      <div><input type="text" name="add-appointment-title" id="add-appointment-title" class="add-appointment-title" /></div>

      <div>Start:</div>
      <div><input type="text" name="add-appointment-start" id="add-appointment-start" class="add-appointment-start" /></div>

      <div>End:</div>
      <div><input type="text" name="add-appointment-end" id="add-appointment-end" class="add-appointment-end" /></div>

      <div>Details:</div>
      <div><input type="text" name="add-appointment-text" id="add-appointment-text" class="add-appointment-text" /></div>

    </div>
    <input type="hidden" id="add-appointment-type" class="add-appointment-type" name="add-appointment-type" value="" />
    <button name="calendar-sidebar-submit-new-appointment-button" id="calendar-sidebar-submit-new-appointment-button" class="calendar-sidebar-submit-new-appointment-button">Add Event</button>
  `;
}
