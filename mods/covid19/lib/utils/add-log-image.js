const AddLogImageTemplate = require('./add-log-image.template');

module.exports = AddLogImage = {

  async render(app, data) {

    document.querySelector('.footer').innerHTML += AddLogImageTemplate();

    data.covid19.returnFormFromPragma("covid19", "log", function(res) {
      document.querySelector('.modal-form').innerHTML = res;

      //data.covid19.treatHide(document.getElementById('object_table'));
      //document.getElementById('object_table').value = data.target_object;
      //data.covid19.treatHide(document.getElementById('object_id'));
      document.getElementById('ts').value = new Date().getTime();
      data.covid19.treatHide(document.getElementById('ts'));
      
      document.getElementById('author').value = app.wallet.returnPublicKey();
      data.covid19.treatHide(document.getElementById('author'));
      
      document.getElementById('order_id').value = data.order_id;
      data.covid19.treatHide(document.getElementById('order_id'));
      
      data.covid19.treatBoolean(document.getElementById('public'));
      
      document.getElementById('type').value = 'image';
      data.covid19.treatHide(document.getElementById('type'));
      
      data.covid19.treatPhoto(document.getElementById('body'));
      document.getElementById('body').parentElement.previousElementSibling.innerHTML = "Image";
      
    });
    
   
  },

  attachEvents(app, data) {
       
    document.getElementById('add-log').addEventListener('click', (e) => {
      data.covid19.submitForm(document.querySelector('.modal-form'));
      document.querySelector('.log-template').destroy();
      UpdateSuccess.render(app, data);
      UpdateSuccess.attachEvents(app, data);

    });

    document.getElementById('cancel-log').addEventListener('click', (e) => {
     //document.querySelector('.file').style.display = "none";
     document.querySelector('.log-template').destroy();
    });

  }
}