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
    super.initialize(app);
    // This module should only be installed on the client, but let's not break
    // things in case someone installs it on the server.
    if (app.BROWSER) {
      // It shouldnt' be necessary to track alreadyAdded but let's do it anyway
      // just to be 100% sure the tracking isn't inserted multiple times.
      if(!this.alreadyAdded) {
        this.alreadyAdded = true;
        if (window.location.hostname === "localhost") {
          // Tracking for website localhost. This is for dev/testing purposes.
          // This will load on all locations that are not saito.io but will only track if the domain looks like 'localhost'(this is configured on matomo)
          // Note that this will also be blocked by adblockers so you'll need to disable them if you want to test locally.
          var _paq = window._paq = window._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="https://saitotech.matomo.cloud/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '3']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.src='//cdn.matomo.cloud/saitotech.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
          })();
          // Manually Add javascript error tracking
          _paq.push(['enableJSErrorTracking']);
        } else {
          // tracking for website saito.io
          var _paq = window._paq = window._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          _paq.push(['enableJSErrorTracking']);
          (function() {
            var u="https://saitotech.matomo.cloud/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '2']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.type='text/javascript'; g.async=true; g.src='//cdn.matomo.cloud/saitotech.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
          })();
          // Manually Add javascript error tracking
          _paq.push(['enableJSErrorTracking']);
        }
      }
    }
  }
  
  respondTo(type) {
    if (type == "matomo_event_push") {
      let obj = {};
      obj.push = (category, action, name = null, value = null) => {
        if(_paq) {
          if(value) {
            // sending null or empty name here is fine.
            _paq.push(['trackEvent', category, action, name, value]);
          } else if(name) {
            _paq.push(['trackEvent', category, action, name]);  
          } else {
            _paq.push(['trackEvent', category, action]);
          }
        }
      }
      return obj;
    }
    return null;
  }
}
module.exports = Matomo;
