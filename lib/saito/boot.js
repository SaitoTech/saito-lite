
//
// This file is not part of the normal Saito application. It is a pre-loader
// that can be appended to the compiled webpack version of Saito that will 
// check to see if the user has a preferred online repository for their 
// Saito application, and fetch THAT javascript.
//

let mySource = document.currentScript.src;
let sscript = document.getElementById("saito");

document.body.removeChild(sscript);

let sscript2 = document.createElement('script');
sscript2.onload = function () {
  alert("loaded 2!");
***REMOVED***;

sscript2.src = "/saito/saito2.js";
document.body.appendChild(sscript2);

throw new Error('Exiting before we load bad javascript...!');
