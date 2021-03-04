// Wanted to serve this to a static html page for marketing redirects but didn't want to import the entire saito.js just for this one function.
// This module just holds the function and can be imported into saito.js or just imported into the browser using type="module".
export function addToDOM() {
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
  }
  _paq.push(['enableJSErrorTracking']);
}

export function logToMatomo(category, action, name, value = 0) {
  if(value && typeof value != Number) {
    console.log("matomo value field must be a number");
    return;
  }
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

export function pushFunctionToMatomo(callback) {
  _paq.push([callback]);
}

//module.exports = addToDOM;