let mySource = document.currentScript.src;
let sscript = document.getElementById("saito");

let data = null;
let options = null;
let bundle = null;

if (typeof(Storage) !== "undefined") {

console.log("storage is not undefined");

  data = localStorage.getItem("options");
  if (data) { options = JSON.parse(data); }
  if (options) { bundle = options.bundle; }

  console.log("BUNDLE: " + bundle);

  if (bundle != null) {

    document.body.removeChild(sscript);

    let sscript2 = document.createElement('script');
    sscript2.onload = function () { };
    sscript2.src = bundle;
    document.body.appendChild(sscript2);

    throw new Error('Exiting before we load bad javascript...!');
  }
}

