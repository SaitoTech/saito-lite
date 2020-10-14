const  RequestPhotoTemplate = require('./request-photo.template');
const  RequestPhotoDeniedTemplate = require('./request-photo-denied.template');
const  AddLog = require('../utils/add-log');
const  AddLogPhoto = require('../utils/add-log-photo');
const  Log = require('../utils/log');


module.exports =  RequestPhoto = {

  async render(app, data) {

    var token = "";

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) {
      token = urlParams.get('token');
    } else {
      document.querySelector('.main').innerHTML =  RequestPhotoDeniedTemplate();
      return;
    }

    document.querySelector('.main').innerHTML =  RequestPhotoTemplate();

    var html = "";

    var sql = `
    select 
      o.id as 'order_id'
    from 
      orders as o 
    where 
      o.deleted <> 1 and 
      substr(o.uuid, 15, 15) = '${token}';
    `;

    data.covid19.sendPeerDatabaseRequestRaw("covid19", sql, function (res) {
      if(res.rows.length > 0){
        data.order_id = res.rows[0].order_id;
      } else {
        document.querySelector('.main').innerHTML =  RequestPhotoDeniedTemplate();
      }
    });
    app.connection.on('log_photo_render_complete', (app, data) => {
      document.querySelector('.product-image-holder').click();
    });
  },

  attachEvents(app, data) {
    document.querySelector('.request-photo-photo').addEventListener('click', function () {
      AddLogPhoto.render(app, data);
      AddLogPhoto.attachEvents(app, data);
      document.querySelector('.product-image-holder').click();
    });
  
    document.querySelector('.request-photo-note').addEventListener('click', () => {
      AddLog.render(app, data);
      AddLog.attachEvents(app, data);
    });

  }
}
