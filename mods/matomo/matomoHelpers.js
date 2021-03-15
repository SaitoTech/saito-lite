// Wanted to serve this to a static html page for marketing redirects but didn't want to import the entire saito.js just for this one function.
// This module just holds the function and can be imported into saito.js or just imported into the browser using type="module".
function injectMatomo(siteId) {
  // tracking for website saito.io
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  // Manually Add javascript error tracking
  _paq.push(['enableJSErrorTracking']);
  (function() {
    var u="https://saitotech.matomo.cloud/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '2']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.type='text/javascript'; g.async=true; g.src='//cdn.matomo.cloud/saitotech.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
  })();
}
export function addToDOM() {
  if (window.location.hostname === "localhost") {
    // Tracking for website localhost. This is for dev/testing purposes.
    // This will load on all locations that are not saito.io but will only track if the domain looks like 'localhost'(this is configured on matomo)
    // Note that this will also be blocked by adblockers so you'll need to disable them if you want to test locally.
    injectMatomo('3');
  } else {
    injectMatomo('2');
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
// We want to push the function into matomo's _paq stack so that it can do what
// it needs to do before the function fires. However, sometimes the client has
// an adblocker or matomo doesn't load for some other reason, if a waitTime has 
// passed and matomo is still not loaded, we bail and fire it anyway.
export function pushFunctionToMatomo(callback, waitTime = -1) {
  if(waitTime >= 0) {
    setTimeout(() => {
      const matomo = window['Matomo'];
      const matomoProbablyNotLoaded = typeof matomo !== 'object' || matomo.initialized !== true || !matomo.trigger;
      if(matomoProbablyNotLoaded){
        callback();
      } else {
        _paq.push([callback]); 
      }
    }, waitTime);  
  } else {
    _paq.push([callback]); 
  }
}

//module.exports = addToDOM;