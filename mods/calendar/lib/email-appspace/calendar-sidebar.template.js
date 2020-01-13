module.exports = CalendarSidebarTemplate = (app) => {
  let mods = app.modules.respondTo("calendar-event");
  if (mods.length == 0) { return ''; }

  html = `
       <select name="calendar-sidebar" id="calendar-sidebar-select" class="calendar-sidebar-select">
           <option value="all">select event type</option>
  `;
  for (let i = 0; i < mods.length; i++) {
    let modobj = mods[i].respondTo("calendar-event");
    html += `<option value="${modobj.type}">${modobj.name}</option>`;
  }
  html += `
       </select>
       <div id="calendar-sidebar-add-appointment" class="calendar-sidebar-add-appointment">
       </div>
  `;
  return html;
}
