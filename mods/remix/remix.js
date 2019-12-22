const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');
const AdmZip = require('adm-zip');


class Remix extends ModTemplate {

  constructor(app) {

    super(app);

    this.name = "Remix";

  }




  respondTo(type) {
    if (type == 'email-appspace') {
      return {
	render : function(app, data) { 
	  document.querySelector(".email-appspace").innerHTML = "MY APPLICATION!";
	} ,
        attachEvents : function(app, data) {
	  alert("Attaching Events!");
	} ,
      }
    }
    return null;
  }




  attachEvents(app) {

    let remix_self = this;

    $('.remix-create-module-btn').off();
    $('.remix-create-module-btn').on('click', function() {

      remix_self.module_name = prompt("Please name this module:", "NewModule");

      // load templates
      $.get( "/remix/template.js", function(data) {

        remix_self.module_name = remix_self.module_name.replace(/\W/g, '_');
        data = data.replace(/RemixTemplate/g, remix_self.module_name);
        $(".remix-code-textarea").val(data);
        $(".remix-code-textarea").focus();
        $(".remix-code-textarea").show();
        $(".remix-code").show();
        $(".remix-publish-module-btn").show();
      });

      $('.remix-create-module-btn').hide();

      alert("Loading template for: " + remix_self.module_name);

    });




    $('.remix-publish-module-btn').off();
    $('.remix-publish-module-btn').on('click', function() {
alert("Publishing this application!");


   
      // creating archives
      var zip = new AdmZip();
    
      // add file directly
      let content = "inner content of the file";
      zip.addFile("test.txt", Buffer.alloc(content.length, content), "inner content comment here");
      // add local file
      //zip.addLocalFile("/home/me/some_picture.png");
      // get everything as a buffer
      var willSendthis = zip.toBuffer();
      // or write everything to disk
      //zip.writeZip(/*target file name*/"/home/me/files.zip");


      content    = app.crypto.stringToBase64("Binary data of zip file");
      var pom = document.createElement('a');
      pom.setAttribute('type', "hidden");
      ////pom.setAttribute('href', 'data:application/zip;base64,' + willSendthiscontent);
      pom.setAttribute('href', 'data:application/zip;base64,' + willSendthis.toString('base64'));
      pom.setAttribute('download', "mynewmodule");
      document.body.appendChild(pom);
      pom.click();
      pom.remove();

    });
  }
}

module.exports = Remix;

