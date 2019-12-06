module.exports = ScheduleAppspaceTemplate = () => {
  return `

    <div id="schedule-calendar-sidebar" class="schedule-calendar-sidebar">
       <select name="schedule-calendar-sidebar" id="schedule-calendar-sidebar-select" class="schedule-calendar-sidebar-select">
           <option value="A">A</option>
           <option value="B">B</option>
           <option value="C">C</option>
           <option value="D">D</option>
        </select>
        <button type="button" class="add_btn" id="add_btn">add</button>
        <button type="button" class="edit_btn" id="edit_btn">edit</button>
    </div>
    <div id="schedule-calendar" class="schedule-calendar"></div>

  `;
***REMOVED***
