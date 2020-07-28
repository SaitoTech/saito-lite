const LogTemplate = require('./log.template');
const AddLog = require('./add-log');
const AddLogImage = require('./add-log-image');
const AddLogPhoto = require('./add-log-photo');
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
            try {
              var update = JSON.parse(row.body);
              payload = `
                      <div class="log-update">
                        <div class="log-update-field">${update.field_name}</div>
                        <div class="log-update-value">${update.from_value}&nbsp;&nbsp;
                        <i class="fas fa-caret-right"></i>&nbsp;&nbsp; ${update.to_value}</div>
                      </div>
                      `;
            } catch (e) {
              console.log(e);
            }
            break;
          case 'photo':
            try {
              var update = JSON.parse(row.body);
              payload = `<div class="product-image">
                    <img src="${update.image}">
                    </div> `;
            } catch (e) {
              console.log(e);
            }
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

    /*
    document.querySelector('.fa-compass').addEventListener('click', () => {
      AddLogPhoto.render(app, data);
      AddLogPhoto.attachEvents(app, data);
    }); 
    */
    var el = document.createElement('input');
    var supported = el.capture != undefined;
    if (supported) {
      document.querySelector('.fa-camera').classList.remove('hidden');
      document.querySelector('.fa-camera').addEventListener('click', function () {
        AddLogPhoto.render(app, data);
        AddLogPhoto.attachEvents(app, data);
      });
    } else {
      if (app.modules.returnModule("Photograph")) {
        document.querySelector('.fa-camera').classList.remove('hidden');
        document.querySelector('.fa-camera').addEventListener('click', function () {
          var camera = app.modules.returnModule('Photograph');
          camera.takePhotograph(
            function (image) {
              console.log('snap, snap');
              console.log(image);
              var log_table = "log";
              var values = [];
              var update = {
                image: image,
                location: ""
              }
              let obj = {};
              obj.dbname = 'covid19';
              obj.table = log_table;
              obj.column = "order_id";
              obj.value = data.order_id;
              values.push(obj);
              let tm = {};
              tm.dbname = 'covid19';
              tm.table = log_table;
              tm.column = "ts";
              tm.value = new Date().getTime();
              values.push(tm);
              let type = {};
              type.dbname = 'covid19';
              type.table = log_table;
              type.column = "type";
              type.value = "photo";
              values.push(type);
              let body = {};
              body.dbname = 'covid19';
              body.table = log_table;
              body.column = "body";
              body.value = JSON.stringify(update);
              values.push(body);

              if (values.length > 0) {
                data.covid19.submitValues(values);
              }

              if (data.location) {
                location = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + data.location;
              } else {
                location = window.location;
              }
            }
            ,
            function () {
              console.log('camera close action');
              if (data.location) {
                location = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + data.location;
              } else {
                location = window.location;
              }
            }
          );
        });
      }

    }
  }
}