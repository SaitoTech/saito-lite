module.exports = CalendarAppspaceTemplate = () => {
  return `
    
    <link href='/saito/lib/fullcalendar/packages/core/main.css' rel='stylesheet' />
    <link href='/saito/lib/fullcalendar/packages/daygrid/main.css' rel='stylesheet' />
    <link href='/saito/lib/fullcalendar/packages/list/main.css' rel='stylesheet' />
    <script src='/saito/lib/fullcalendar/packages/core/main.js'></script>
    <script src='/saito/lib/fullcalendar/packages/daygrid/main.js'></script>
    <script src='/saito/lib/fullcalendar/packages/list/main.js'></script>

    <div id="calendar-sidebar" class="calendar-sidebar">
    </div>
    <div id="calendar-main" class="calendar-main">
    </div>
  `;
}
