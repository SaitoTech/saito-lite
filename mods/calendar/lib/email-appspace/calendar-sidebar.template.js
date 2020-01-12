module.exports = CalendarSidebarTemplate = (app) => {

  html = `
       <select name="calendar-sidebar" id="calendar-sidebar-select" class="calendar-sidebar-select">
           <option value="all">all appointments</option>
  `;
  let mods = app.modules.respondTo("calendar-event");
  for (let i = 0; i < mods.length; i++) {
    let modobj = mods[i].respondsTo("calendar-event");
    html += `<option value="${modobj.type}">${modobj.name}</option>`;
  }
  html += `
       </select>
       <button name="calendar-sidebar-new-appointment-button" id="calendar-sidebar-new-appointment-button" class="calendar-sidebar-new-appointment-button">Add Event</button>
       <div id="calendar-sidebar-add-appointment" class="calendar-sidebar-add-appointment">

       </div>
  `;
  return html;
}
