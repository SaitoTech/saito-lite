// Set the current environment to true in the env object
let currentEnv = 'PROD';
let rewardsPubkey =  "zYCCXRZt2DyPD9UmxRfwFgLTNAqCd5VE8RuNneg4aNMK";
let devPubkey = "";
process.argv.forEach(function (val, index, array) {
  if(val.startsWith("env=")) {
    currentEnv = val.split("=")[1];
    if(currentEnv != "DEV" && currentEnv != "QA") {
      currentEnv = "PROD";
    }
  } else if(val.startsWith("rewardspubkey=")) {
    devPubkey = val.split("=")[1];
  }
});

if(currentEnv != "PROD" && currentEnv != "QA" && currentEnv != "DEV") {
  throw "env must be PROD, QA, or DEV!!!!!!";
}
if (currentEnv == "DEV" && devPubkey != "") {
  rewardsPubkey = devPubkey;
}
exports.currentEnv = currentEnv;
exports.rewardsPubkey = rewardsPubkey;