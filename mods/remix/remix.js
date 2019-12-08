const saito = require('../../lib/saito/saito.js');
const ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


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
        $(".remix-publish").show();
      });

      $('.remix-create-module-btn').hide();

      alert("Loading template for: " + remix_self.module_name);

    });




    $('.remix-publish').off();
    $('.remix-publish').on('click', function() {
alert("Publishing this application!");
    });

  }



}

module.exports = Remix;

