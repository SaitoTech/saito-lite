const { call } = require("file-loader");

if (typeof window !== "undefined") {

  var mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        treatElements(mutation.addedNodes);
      }
    });
  });

  mutationObserver.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true
  });

  window.salert = function (message) {
    if (document.getElementById('alert-wrapper')) { return; }
    var wrapper = document.createElement('div');
    wrapper.id = 'alert-wrapper';
    var html = '<div id="alert-shim">';
    html += '<div id="alert-box">';
    html += '<p class="alert-message">' + message + '</p>'
    html += '<div id="alert-buttons"><button id="alert-ok">OK</button>'
    html += '</div></div></div>';
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    setTimeout(() => {
      document.querySelector('#alert-box').style.top = "0";
    }, 100);
    document.querySelector('#alert-ok').focus();
    document.querySelector('#alert-shim').addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.querySelector('#alert-ok').click();
      }
    });
    document.querySelector('#alert-ok').addEventListener("click", function () {
      wrapper.remove();
    }, false);
  };

  window.sconfirm = function (message) {
    if (document.getElementById('alert-wrapper')) { return; }
    return new Promise((resolve, reject) => {
      var wrapper = document.createElement('div');
      wrapper.id = 'alert-wrapper';
      var html = '<div id="alert-shim">';
      html += '<div id="alert-box">';
      html += '<p class="alert-message">' + message + '</p>'
      html += '<div id="alert-buttons"><button id="alert-cancel">Cancel</button><button id="alert-ok">OK</button>'
      html += '</div></div></div>';
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
      setTimeout(() => {
        document.getElementById('alert-box').style.top = "0";
      }, 100);
      document.getElementById('alert-ok').focus();
      document.getElementById('alert-shim').onclick = (event) => {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById('alert-ok').click();
        }
      };
      document.getElementById('alert-ok').onclick = () => {
        wrapper.remove();
        resolve(true);
      }
      document.getElementById('alert-cancel').onclick = () => {
        wrapper.remove();
        resolve(false);
      }
    });
  };

  window.sprompt = function (message) {
    if (document.getElementById('alert-wrapper')) { return; }
    return new Promise((resolve, reject) => {
      var wrapper = document.createElement('div');
      wrapper.id = 'alert-wrapper';
      var html = '<div id="alert-shim">';
      html += '<div id="alert-box">';
      html += '<p class="alert-message">' + message + '</p>'
      html += '<div class="alert-prompt"><input type="text" id="promptval" class="promptval" /></div>';
      html += '<div id="alert-buttons"><button id="alert-cancel">Cancel</button><button id="alert-ok">OK</button>'
      html += '</div></div></div>';
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
      document.querySelector('#promptval').focus();
      document.querySelector('#promptval').select();
      setTimeout(() => {
        document.querySelector('#alert-box').style.top = "0";
      }, 100);
      document.querySelector('#alert-shim').addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.querySelector('#alert-ok').click();
        }
      });
      document.querySelector('#alert-ok').addEventListener("click", function () {
        var val = document.querySelector('#promptval').value;
        wrapper.remove();
        resolve(val);
      }, false);
      document.querySelector('#alert-cancel').addEventListener("click", function () {
        wrapper.remove();
        resolve(false);
      }, false);
    });
  };

  window.siteMessage = function (message, killtime = 9999999) {
    if (document.getElementById('message-wrapper')) {
      document.getElementById('message-wrapper').remove();
    }
    var wrapper = document.createElement('div');
    wrapper.id = 'message-wrapper';
    var html = '<div id="message-box">';
    html += '<p class="message-message">' + message + '</p>'
    html += '</div>';
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    setTimeout(() => {
      wrapper.remove();
    }, killtime);
    document.querySelector('#message-wrapper').addEventListener("click", function () {
      wrapper.remove();
    }, false);
  }

  window.imgPop = function imgPop(img) {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      var wrapper = document.createElement('div');
      wrapper.id = 'alert-wrapper';
      var html = '<div id="alert-shim">';
      html += `<img class="imgpop" src="${img.src}" />`;
      html += `</div>`;
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);
      wrapper.addEventListener('click', (e) => {
        document.getElementById('alert-wrapper').remove();
      });
    });

  }

  window.scopy = function scopy(html) {

    var container = document.createElement('div');
    container.innerHTML = html;

    // Hide element
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.opacity = 0;

    // Detect all style sheets of the page
    var activeSheets = Array.prototype.slice.call(document.styleSheets)
      .filter(function (sheet) {
        return !sheet.disabled
      });

    // Mount the iframe to the DOM to make `contentWindow` available
    document.body.appendChild(container);

    // Copy to clipboard
    window.getSelection().removeAllRanges();

    var range = document.createRange();
    range.selectNode(container);
    window.getSelection().addRange(range);

    document.execCommand('copy');
    for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = true;
    document.execCommand('copy');
    for (var i = 0; i < activeSheets.length; i++) activeSheets[i].disabled = false;

    // Remove the iframe
    document.body.removeChild(container);
  }

  //  window.sWord = function sWord(el, filename, prehtml="", posthtml=""){
  window.sWord = function sWord(html, filename) {

    var blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Create a link to the file
      downloadLink.href = url;

      // Setting the file name
      downloadLink.download = filename;

      //triggering the function
      downloadLink.click();
    }

    document.body.removeChild(downloadLink);

  }






  function treatElements(nodeList) {
    for (var i = 0; i < nodeList.length; i++) {
      if (nodeList[i].files) {
        treatFiles(nodeList[i]);
      }
      if (nodeList[i].tagName === 'SELECT') {
        if (!nodeList[i].classList.contains('saito-slct')) {
          treatSelect(nodeList[i]);
        }
      }
      if (nodeList[i].childNodes.length >= 1) {
        treatElements(nodeList[i].childNodes);
      }
    }
  }

  function treatFiles(input) {
    if (input.classList.contains('treated')) {
      return;
    } else {
      input.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 1) {
          fileName = this.files.length + ' files selected.';
        } else {
          fileName = e.target.value.split("\\").pop();
        }
        if (fileName) {
          filelabel.style.border = "none";
          filelabel.innerHTML = fileName;
        } else {
          filelabel.innerHTML = labelVal;
        }
      });
      input.classList.add('treated');
      var filelabel = document.createElement('label');
      filelabel.classList.add('treated');
      filelabel.innerHTML = "Choose File";
      filelabel.htmlFor = input.id;
      filelabel.id = input.id + "-label";
      var parent = input.parentNode;
      parent.appendChild(filelabel);
    }
  }

  window.s2Number = function (x) {
    if (typeof x != "undefined") {
      x = x.toString().replace(/,/g, '');
      if (typeof Number(x) != 'number') {
        return x;
      } else {
        return Number(x).toLocaleString();
      }
    }
  }

  function treatSelect(el) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('saito-select')
    el.classList.add('saito-slct');
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  };

  window.addStyleSheet = function (fileName) {
    var head = document.head;
    var link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = fileName;

    head.appendChild(link);
  }

  HTMLElement.prototype.toggleClass = function toggleClass(className) {
    if (this.classList.contains(className)) {
      this.classList.remove(className);
    } else {
      this.classList.add(className);
    }
  };

  HTMLElement.prototype.destroy = function destroy() {
    try {
      this.parentNode.removeChild(this);
    } catch (err) {
      console.log(err);
    }
  }


  window.setPreference = function (key, value) {
    if (typeof this.localStorage.profile == 'undefined') {
      this.localStorage.profile = JSON.stringify({});
    }
    var profile = JSON.parse(localStorage.profile);

    profile[key] = value;

    localStorage.profile = JSON.stringify(profile);
  }

  window.getPreference = function (key) {
    if (typeof this.localStorage.profile != 'undefined') {
      profile = JSON.parse(localStorage.profile);
      if (typeof profile[key] != 'undefined') {
        return profile[key];
      }
    }
    return;
  }


  window.handlePasteImage = function (element, callback) {
    //add the event to element
    element.onpaste = function (event) {
      // use event.originalEvent.clipboard for newer chrome versions
      var items = (event.clipboardData || event.originalEvent.clipboardData).items;
      console.log(JSON.stringify(items)); // will give you the mime types
      // find pasted image among pasted items
      var blob = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === 0) {
          blob = items[i].getAsFile();
        }
      }
      // load image if there is a pasted image
      if (blob !== null) {
        //just nope out if we somehow have an alert open.
        if (document.getElementById('alert-wrapper')) { return; }
        return new Promise((resolve, reject) => {
          //create the alert
          var wrapper = document.createElement('div');
          wrapper.id = 'alert-wrapper';
          var html = '<div id="alert-shim">';
          html += '<div id="alert-box">';
          html += '<p class="alert-message"><img class="img-prev" src="" /></p>'
          html += '<div id="alert-buttons"><button id="alert-cancel">Cancel</button><button id="alert-ok">OK</button>'
          html += '</div></div></div>';
          wrapper.innerHTML = html;
          document.body.appendChild(wrapper);
          setTimeout(() => {
            document.getElementById('alert-box').style.top = "0";
          }, 100);
          document.getElementById('alert-ok').focus();
          //add a file reader to grab the encoded image content, and resize it to a sane size.
          var reader = new FileReader();
          reader.onload = function (event) {
            //console.log(event.target.result); // data url!
            var original = new Image();
            original.onload = function () {

              var type = original.src.split(";")[0].split(":")[1];
              var w = 0;
              var h = 0;
              var r = 1;

              var canvas = document.createElement('canvas');

              if (original.width > 1000) {
                r = 1000 / original.width;
              } if (r * original.height > 1000) {
                r = 1000 / original.height;
              }
              w = original.width * r;
              h = original.height * r;

              canvas.width = w;
              canvas.height = h;
              canvas.getContext('2d').drawImage(original, 0, 0, w, h);

              var quality = 1;
              var result = canvas.toDataURL(type, quality);

              console.log(result.length);

              if (result.length > 250000) {
                result = canvas.toDataURL("image/jpeg", 1);
                if (result.length > 250000) {
                  quality = Math.pow(250000 / result.length, 1.33);
                  result = canvas.toDataURL("image/jpeg", quality);
                }
              }
              console.log(result.length);
              document.querySelector(".alert-message img").src = result;

            }
            //now trigger the function we just created.
            original.src = event.target.result;
          };
          reader.readAsDataURL(blob);

          //'ok' on enter
          document.getElementById('alert-shim').onclick = (event) => {
            if (event.keyCode === 13) {
              event.preventDefault();
              document.getElementById('alert-ok').click();
            }
          };
          //do what the callback says with the image as an html sting.
          document.getElementById('alert-ok').onclick = () => {
            callback(document.querySelector(".alert-message").innerHTML);
            wrapper.remove();
            resolve(true);
            // }, false;
          }
          //cancel
          document.getElementById('alert-cancel').onclick = () => {
            wrapper.remove();
            resolve(false);
            // }, false);
          }
        });

      }
    }


  };

};
