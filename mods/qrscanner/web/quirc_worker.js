// These will be set when the first image is passed in
var image=null;
var width, height;
var counted;

var Module = {};

// This is used to load the wasm file from an alternate
// location.  For instance, if using the Rails asset
// pipeline:
//
// fetch('<%= asset_path('quirc.wasm') %>')
//   .then(function(response) {
//     return response.arrayBuffer();
//   }).then(function(wasm_file) {
//     Module['wasmBinary'] = wasm_file;
//     importScripts('<%= asset_path('quirc.js') %>');
//   });

importScripts('/qrscanner/quirc.js');

self.onmessage = function(msg) {
  quirc_process_image_data(msg.data);
  postMessage('done');
}

// Receives a bunch of raw data from the decoder,
// posts the message back to listeners.  Note that
// the payload is turned into a string here.
self.decoded = function(i, version, ecc_level, mask, data_type, payload, payload_len) {
  console.log("decoded something");
  var payload_string = String.fromCharCode.apply(null, new Uint8Array(Module.HEAPU8.buffer, payload, payload_len));
  postMessage({ i: i, version: version, ecc_level: ecc_level, mask: mask, data_type: data_type, payload: payload, payload_len: payload_len, payload_string: payload_string });
}

// Receives a simple string with an error
self.decode_error = function(errstr) {
  console.log("decode error: " + errstr);
}

function quirc_process_image_data(img_data) {

console.log("in quirc_process_image_data...");

  if (!image) {
    width = img_data.width;
    height = img_data.height;
    try {
      image = Module._xsetup(width, height);
    } catch (err) {
      console.log("skipping... looks like not ready yet...");
      return;
    }
  }

  var data = img_data.data;

  for (var i=0, j=0; i < data.length; i+=4, j++) {
    // Got this from another decoder - turns RGB into grayscale with a
    // weighting making green heaviest, followed by red and blue.
    // Yury Delendik may have written it.
    Module.HEAPU8[image + j] = (data[i] * 66 + data[i + 1] * 129 + data[i + 2] * 25 + 4096) >> 8;
    //Module.HEAPU8[image + j] = data[i];
  }

  // Note that "decoded" and/or "decode_error" will be called from within
  var a = Module._xprocess();
}
