var saito = require('../../lib/saito/saito');
var ModTemplate = require('../../lib/templates/modtemplate');
const Header = require('../../lib/ui/header/header');


class Website extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Website";

    return this;
  }


  initializeHTML(app) {

    super.initializeHTML(app);

    Header.render(app, this.uidata);
    Header.attachEvents(app, this.uidata);

/****
    HeaderMenu.render(app);

    // Use for Carousel
   importGlide = async () => {
     const Glide = await import('../../lib/helpers/glide.min.js');
     this.glide = new Glide.default('.glide', {
        type: 'carousel',
        autoplay: 3000,
        perView,
      });
      this.glide.mount();
    } 
    importGlide();
****/
  }

}


module.exports = Website;
