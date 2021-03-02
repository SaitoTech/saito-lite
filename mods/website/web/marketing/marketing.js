import {addToDOM} from '/l/matomohelpers.js';
const queryString = window.location.search;console.log(addToDOM);
const urlParams = new URLSearchParams(window.location.search);

console.log(window.location.pathname);

// logToMatomo("")
// ?product=shirt&color=blue&newuser&size=m
addToDOM();
//logToMatomo("Tracking", "Redirect")
// if(urlParams.get("r")) {
//   window.location.href = urlParams.get("r");
// } else {
//   window.location.href = "/";
// }

