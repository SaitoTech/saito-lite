import {pushFunctionToMatomo, logToMatomo, addToDOM} from '/l/matomohelpers.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(window.location.search);
let urlTokens = window.location.pathname.split("/")
addToDOM();
logToMatomo(urlTokens[2], urlTokens[3], urlTokens[4]);
pushFunctionToMatomo(() => {
  if(urlParams.get("r")) {
    window.location.href = urlParams.get("r");
  } else {
    window.location.href = "/";
  }
}, 2000);
