var ModTemplate = require('../../lib/templates/modtemplate');

class Matomo extends ModTemplate {

  constructor(app) {
    super(app);
    this.name            = "Matomo";
    this.description     = "Saito tracking tag";
    this.categories      = "Marketing";
    
    //this.browserize(this);
    this.alreadyAdded = false;
    return this;
  }

  initialize(app) {
    console.log("matomo initialize")
    super.initialize(app);
    // This module should only be installed on the client, but let's not break
    // things in case someone installs it on the server.
    if (app.BROWSER) {
      // It shouldnt' be necessary to track alreadyAdded but let's do it anyway
      // just to be 100% sure the tracking isn't inserted multiple times.
      if(!this.alreadyAdded) {
        this.alreadyAdded = true;
        app.browser.prependElementToDom(`
        <!-- Matomo Tag Manager -->
        <script type="text/javascript">
        var _mtm = window._mtm = window._mtm || [];
        _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.src='https://cdn.matomo.cloud/saitotech.matomo.cloud/container_uN6KE9K7.js'; s.parentNode.insertBefore(g,s);
        </script>
        <!-- End Matomo Tag Manager -->
        `, document.head);
      }  
    }
    
  }
}
module.exports = Matomo;
