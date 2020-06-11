const LogTemplate = require('./log.template');
const AddLog = require('./add-log');
const AddLogImage = require('./add-log-image');

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
                if (row.type == "image") {
                    payload = `<div class="product-image">
                    <img src="${row.body}">
                    </div> `
                } else {
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
            console.log(document.querySelectorAll('.log-message'));
        });
        document.querySelector('.fa-align-left').addEventListener('click', () => {
            AddLog.render(app, data);
            AddLog.attachEvents(app, data);
        });
        document.querySelector('.fa-image').addEventListener('click', () => {
            AddLogImage.render(app, data);
            AddLogImage.attachEvents(app, data);
        });
    }
}