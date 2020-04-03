const AttachmentTemplate = require('./attachment.template');

module.exports = Attachment = {

  render(app, data) {

    document.body.innerHTML += AttachmentTemplate();

    var select = document.getElementById('attachments-list');

    data.covid19.sendPeerDatabaseRequest("covid19", "attachments", "*", "", null, function (res) {
      if (res.rows.length > 0) {
        res.rows.forEach(row => {
          var option = document.createElement("option");
          option.text = row.id;
          option.value = row.name;
          select.add(option);
        });
        var option = document.createElement("option");
        option.text = 'new';
        option.value = 'new';
        select.add(option);
      }
    });

    document.getElementById('attachment-id').value = data.id;

  },

  attachEvents(app, date) {
    document.getElementById('save-attachment').addEventListener('click', (e) => {
      document.querySelector('.attachment').destroy();
    });

  }



}