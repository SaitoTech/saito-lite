var ModTemplate = require('../../lib/templates/modtemplate');

class Matomo extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Matomo";
    this.description     = "Saito tracking tag";
    this.categories      = "Dark Arts";
    
    //this.browserize(this);
    this.alreadyAdded = false;
    return this;
  }

  initialize(app) {
    console.log("Matomo initializeHTML")
    super.initialize(app);
  }

  initializeHTML(app) {
    console.log("Matomo initializeHTML")
    if(!this.alreadyAdded) {
      this.alreadyAdded = true;
      document.head.insertAdjacentHTML('afterbegin',`
      <!-- Matomo Tag Manager -->
      <meta property="og:type" content="article" />
      <!-- End Matomo Tag Manager -->
      `);
      // document.head.insertAdjacentHTML('afterbegin',`
      // <!-- Matomo Tag Manager -->
      // <script type="text/javascript">
      // var _mtm = window._mtm = window._mtm || [];
      // _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      // var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      // g.type='text/javascript'; g.async=true; g.src='https://cdn.matomo.cloud/saitotech.matomo.cloud/container_uN6KE9K7.js'; s.parentNode.insertBefore(g,s);
      // </script>
      // <!-- End Matomo Tag Manager -->
      // `);      
    } else {
      console.log("already added")
    }
  }
}
module.exports = Matomo;
