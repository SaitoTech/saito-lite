const CertificationTemplate = require('./certification.template');

module.exports = Certification = {

  render(app, data) {

    document.body.innerHTML += CertificationTemplate();

    var select = document.getElementById('certifications-list');

    data.covid19.sendPeerDatabaseRequest("covid19", "certifications", "*", "", null, function (res) {
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

    document.getElementById('certification-id').value = data.id;

  },

  attachEvents(app, date) {
    document.getElementById('save-certification').addEventListener('click', (e) => {
      document.querySelector('.certification').destroy();
    });

  }



}