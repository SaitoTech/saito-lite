module.exports = CalendarSidebarTemplate = (app) => {
  return `
       <select name="calendar-sidebar" id="calendar-sidebar-select" class="calendar-sidebar-select">
           <option value="view-all">all appointments</option>
           <option value="B">B</option>
           <option value="C">C</option>
           <option value="D">D</option>
       </select>
       <button name="calendar-sidebar-new-appointment-button" id="calendar-sidebar-new-appointment-button" class="calendar-sidebar-new-appointment-button">Add Event</button>
       <div id="calendar-sidebar-add-appointment" class="calendar-sidebar-add-appointment">

       </div>
  `;
}
