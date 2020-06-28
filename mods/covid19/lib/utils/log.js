const LogTemplate = require('./log.template');
const AddLog = require('./add-log');
const AddLogImage = require('./add-log-image');
//const Photograph = require('../../../photograph/photograph');

module.exports = Log = {


  render(app, data, el) {

    var _this = this;

    el.innerHTML = LogTemplate();
    //
    // load products
    //

    var sql = `
      select * 
      from 
        log
      where
        log.deleted <> 1 AND
        log.order_id = ${data.order_id}
      order by ts asc;
`;
    var html = "";

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      res.rows.forEach((row, index) => {
        let payload = "";
        switch (row.type) {
          case 'image':
            payload = `<div class="product-image">
                    <img src="${row.body}">
                    </div> `;
            break;
          case 'update':
            var update = JSON.parse(row.body);
            payload = `
                    <div class="log-update">
                      <div class="log-update-field">${update.field_name}</div>
                      <div class="log-update-value">${update.from_value}&nbsp;&nbsp;
                      <i class="fas fa-caret-right"></i>&nbsp;&nbsp; ${update.to_value}</div>
                    </div>
                    `;
            break;
          default:
            payload = `<div class="log-message-text">${row.body}</div>`;
        }
        html += `
        <div class="log-block" log_id="${row.id}">
          <div class="log-time">
            <p>
              <span><i class="far fa-clock"></i></span>
              <span>${new Date(row.ts).toLocaleDateString('zh-CN', { dateStyle: 'short', timeStyle: 'short', hour12: false })}</span>
            </p>
          </div>
          <div class="log-message">
            ${payload}
          </div>
        </div>
      `;
      });
      html += `<div class="log-bottom"></div>`;

      document.querySelector('.log-messages').innerHTML += html;
      document.querySelector('.log-bottom').scrollIntoView();
      document.querySelector('.log-messages').querySelectorAll('img').forEach(img => { imgPop(img) });
      app.connection.emit('log_render_complete');
    });
  },

  attachEvents(app, data) {
    app.connection.on('log_render_complete', (app, data) => {
      //console.log(document.querySelectorAll('.log-message'));
    });
    document.querySelector('.fa-align-left').addEventListener('click', () => {
      AddLog.render(app, data);
      AddLog.attachEvents(app, data);
    });
    document.querySelector('.fa-image').addEventListener('click', () => {
      AddLogImage.render(app, data);
      AddLogImage.attachEvents(app, data);
    });

    if (app.modules.returnModule("Photograph")) {
      document.querySelector('.fa-camera').classList.remove('hidden');
      document.querySelector('.fa-camera').addEventListener('click', function() {
        var camera = app.modules.returnModule('Photograph');
        camera.takePhotograph(
          function(image) {
            console.log('snap, snap');
            console.log(image);
          }
          ,
          function() {
            console.log('camera close action');
          }
        );
      });
    }
  }
}