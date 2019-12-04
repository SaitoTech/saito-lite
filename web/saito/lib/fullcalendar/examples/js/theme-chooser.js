
function initThemeChooser(settings) {
  var isInitialized = false;
  var currentThemeSystem; // don't set this directly. use setThemeSystem
  var currentStylesheetEl;
  var loadingEl = document.getElementById('loading');
  var systemSelectEl = document.querySelector('#theme-system-selector select');
  var themeSelectWrapEls = Array.prototype.slice.call( // convert to real array
    document.querySelectorAll('.selector[data-theme-system]')
  );

  systemSelectEl.addEventListener('change', function() {
    setThemeSystem(this.value);
  ***REMOVED***);

  setThemeSystem(systemSelectEl.value);

  themeSelectWrapEls.forEach(function(themeSelectWrapEl) {
    var themeSelectEl = themeSelectWrapEl.querySelector('select');

    themeSelectWrapEl.addEventListener('change', function() {
      setTheme(
        currentThemeSystem,
        themeSelectEl.options[themeSelectEl.selectedIndex].value
      );
***REMOVED***);
  ***REMOVED***);


  function setThemeSystem(themeSystem) {
    var selectedTheme;

    currentThemeSystem = themeSystem;

    themeSelectWrapEls.forEach(function(themeSelectWrapEl) {
      var themeSelectEl = themeSelectWrapEl.querySelector('select');

      if (themeSelectWrapEl.getAttribute('data-theme-system') === themeSystem) {
        selectedTheme = themeSelectEl.options[themeSelectEl.selectedIndex].value;
        themeSelectWrapEl.style.display = 'inline-block';
  ***REMOVED*** else {
        themeSelectWrapEl.style.display = 'none';
  ***REMOVED***
***REMOVED***);

    setTheme(themeSystem, selectedTheme);
  ***REMOVED***


  function setTheme(themeSystem, themeName) {
    var stylesheetUrl = generateStylesheetUrl(themeSystem, themeName);
    var stylesheetEl;

    function done() {
      if (!isInitialized) {
        isInitialized = true;
        settings.init(themeSystem);
  ***REMOVED***
      else {
        settings.change(themeSystem);
  ***REMOVED***

      showCredits(themeSystem, themeName);
***REMOVED***

    if (stylesheetUrl) {
      stylesheetEl = document.createElement('link');
      stylesheetEl.setAttribute('rel', 'stylesheet');
      stylesheetEl.setAttribute('href', stylesheetUrl);
      document.querySelector('head').appendChild(stylesheetEl);

      loadingEl.style.display = 'inline';

      whenStylesheetLoaded(stylesheetEl, function() {
        if (currentStylesheetEl) {
          currentStylesheetEl.parentNode.removeChild(currentStylesheetEl);
    ***REMOVED***
        currentStylesheetEl = stylesheetEl;
        loadingEl.style.display = 'none';
        done();
  ***REMOVED***);
***REMOVED*** else {
      if (currentStylesheetEl) {
        currentStylesheetEl.parentNode.removeChild(currentStylesheetEl);
        currentStylesheetEl = null
  ***REMOVED***
      done();
***REMOVED***
  ***REMOVED***


  function generateStylesheetUrl(themeSystem, themeName) {
    if (themeSystem === 'bootstrap') {
      if (themeName) {
        return 'https://bootswatch.com/4/' + themeName + '/bootstrap.min.css';
  ***REMOVED***
      else { // the default bootstrap theme
        return 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';
  ***REMOVED***
***REMOVED***
  ***REMOVED***


  function showCredits(themeSystem, themeName) {
    var creditId;

    if (themeSystem.match('bootstrap')) {
      if (themeName) {
        creditId = 'bootstrap-custom';
  ***REMOVED***
      else {
        creditId = 'bootstrap-standard';
  ***REMOVED***
***REMOVED***

    Array.prototype.slice.call( // convert to real array
      document.querySelectorAll('.credits')
    ).forEach(function(creditEl) {
      if (creditEl.getAttribute('data-credit-id') === creditId) {
        creditEl.style.display = 'block';
  ***REMOVED*** else {
        creditEl.style.display = 'none';
  ***REMOVED***
***REMOVED***)
  ***REMOVED***


  function whenStylesheetLoaded(linkNode, callback) {
    var isReady = false;

    function ready() {
      if (!isReady) { // avoid double-call
        isReady = true;
        callback();
  ***REMOVED***
***REMOVED***

    linkNode.onload = ready; // does not work cross-browser
    setTimeout(ready, 2000); // max wait. also handles browsers that don't support onload
  ***REMOVED***
***REMOVED***
