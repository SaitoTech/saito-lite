const screenfull = require('screenfull');

class Browser {

  constructor(app) {

    this.app = app || {};
    this.browser_active = 0;
    this.drag_callback = null;
    this.urlParams = {};

    //
    // tells us the browser window is visible, as opposed to
    // browser_active which is used to figure out which applications
    // users are interacting with in the browser.
    //
    this.active_tab = 1; 
  }

  async initialize(app) {

    try {

      this.active_tab = 1;

      //
      // Ralph took the conch from where it lay on the polished seat and held it 
      // to his lips; but then he hesitated and did not blow. He held the shell 
      // up instead and showed it to them and they understood.
      //
/****
      try {

        const channel = new BroadcastChannel('saito');

        channel.onmessage = function(e) {
          if (!document.hidden) {
            channel.postMessage({ active : 1 });
            this.active_tab = 1;
          } else {
            this.active_tab = 0;
          }
        };

	document.addEventListener("visibilitychange", () => {
  	  if (document.hidden) {
            channel.postMessage({ active : 0 });
	  } else  {
	    this.active_tab = 1;
            channel.postMessage({ active : 1 });
	  }
	}, false);

        channel.postMessage({ connected : 1 });

        window.addEventListener('storage', (e) => {
          if (this.active_tab == 0) {
          this.loadOptions();
        };
      });

    } catch (err) {}
***/



      //
      // try and figure out what module is running
      // This code will error in a node.js environment - that's ok.
      // Abercrombie's rule.
      //
      if (typeof window == "undefined") {
        console.log("Initializing Saito Node");
        return;
      } else {
        console.info("Initializing Saito Light Client");
      }
      let current_url = window.location;
      let myurl = new URL(current_url);
      let myurlpath = myurl.pathname.split("/");
      let active_module = myurlpath[1] ? myurlpath[1].toLowerCase() : "";
      if (active_module == "") {
        active_module = "website";
      }



      //
      // query strings
      //
      this.urlParams = new URLSearchParams(window.location.search);
      var entries = this.urlParams.entries();
      for (pair of entries) {

	//
	// if crypto is provided switch over
	//
	if (pair[0] === "crypto") {
	  let preferred_crypto_found = 0;
	  let ac = this.app.wallet.returnAvailableCryptos();
          for (let i = 0; i < ac.length; i++) {
	    if (ac[i].ticker) {
	      if (ac[i].ticker.toLowerCase() === pair[1].toLowerCase()) {
	        preferred_crypto_found = 1;
	        this.app.wallet.setPreferredCrypto(ac[i].ticker);           
	      }
	    }
	  }

	  if (preferred_crypto_found == 0) {
	    salert(`Your compile does not contain a ${pair[1].toUpperCase()} module. Visit the AppStore or contact us about getting one built!`);
	  }
        }

      }



      //
      // tell that module it is active
      //
      for (let i = 0; i < this.app.modules.mods.length; i++) {
        if (this.app.modules.mods[i].returnSlug() == active_module) {

          this.app.modules.mods[i].browser_active = 1;
          this.app.modules.mods[i].alerts = 0;

          //
          // if urlParams exist, hand them to the module
          //
          let urlParams = new URLSearchParams(location.search);

          this.app.modules.mods[i].handleUrlParams(urlParams);
        }
      }



      //
      // check if we are already open in another tab -
      // gracefully return out after warning user.
      //
      this.checkForMultipleWindows();
      //this.isFirstVisit();

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then(function () { });
      }

      this.browser_active = 1;

    } catch (err) {
      console.log("non-browser detected: " + err);
    }

    if (this.app.BROWSER == 1) {

      this.app.connection.on('connection_up', function (peer) {
        siteMessage('Websocket Connection Established', 1000);
      });

      this.app.connection.on('connection_down', function (peer) {
        siteMessage('Websocket Connection Lost');
      });
    }

  }



  returnURLParameter(name) {
    var entries = this.urlParams.entries();
    for (pair of entries) {
      if (pair[0] == name) { return pair[1]; }
    }
    return "";
  }


  isMobileBrowser(user_agent) {

    var check = false;
    (function (user_agent) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(user_agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(user_agent.substr(0, 4))) check = true; })(user_agent);
    return check;

  }




  sendNotification(title, message, event) {

    if (this.app.BROWSER == 0) { return; }

    if (!this.isMobileBrowser(navigator.userAgent)) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        notify = new Notification(title, {
          body: message,
          iconURL: "/saito/img/touch/pwa-192x192.png",
          icon: "/saito/img/touch/pwa-192x192.png"
        });
      }
    } else {
      Notification.requestPermission()
        .then(function (result) {
          if (result === 'granted' || result === 'default') {
            navigator.serviceWorker.ready.then(function (registration) {
              registration.showNotification(title, {
                body: message,
                icon: '/saito/img/touch/pwa-192x192.png',
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: event
              });
            });
          }
        });
    }
  }



  checkForMultipleWindows() {


    //Add a check to local storage that we are open in a tab.
    localStorage.openpages = Date.now();

    browser_self = this;

    var onLocalStorageEvent = function (e) {
      if (e.key == "openpages") {
        // Listen if anybody else opening the same page!
        localStorage.page_available = Date.now();
      }
      if (e.key == "page_available" && !browser_self.isMobileBrowser(navigator.userAgent)) {
        console.log(e.key);
        console.log(navigator.userAgent);
        //alert("One more page already open");
        //window.location.href = "/tabs.html";
      }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);


  }


  returnInviteObject(email = "") {

    //
    // this informaton is in the email link provided by the user
    // to their friends.
    //
    let obj = {};
    obj.publickey = this.app.wallet.returnPublicKey();
    obj.bundle = "";
    obj.email = email;
    if (this.app.options.bundle != "") { obj.bundle = this.app.options.bundle; }

    return obj;

  }

  returnInviteLink(email = "") {
    let { protocol, host, port } = this.app.options.peers[0];
    let url_payload = encodeURIComponent(this.app.crypto.stringToBase64(JSON.stringify(this.returnInviteObject(email))));
    return `${protocol}://${host}:${port}/r?i=${url_payload}`;
  }



  //////////////////////////////////
  // Browser and Helper Functions //
  //////////////////////////////////


  // https://github.com/sindresorhus/screenfull.js
  requestFullscreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  }

  addElementToDom(html, id = null) {
    let el = document.createElement('div');
    if (id == null) {
      document.body.appendChild(el);
    } else {
      if (!document.getElementById(id)) {
        document.body.appendChild(el);
      } else {
        document.getElementById(id).appendChild(el);
      }
    }
    el.outerHTML = html;
  }

  prependElementToDom(html, elemWhere = document.body) {
    let elem = document.createElement('div');
    elemWhere.insertAdjacentElement('afterbegin', elem);
    elem.outerHTML = html;
  }

  addElementToElement(html, elem = document.body) {
    let el = document.createElement('div');
    elem.appendChild(el);
    el.outerHTML = html;
  }

  makeElement(elemType, elemId, elemClass) {
    let headerDiv = document.createElement(elemType);
    headerDiv.id = elemId;
    headerDiv.class = elemClass;
    return headerDiv;
  }

  htmlToElement(domstring) {
    let html = new DOMParser().parseFromString(domstring, 'text/html');
    return html.body.firstChild;
  }

  formatDate(timestamp) {
    let datetime = new Date(timestamp);
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes();
    let months = [12];
        months[0] = "January";
        months[1] = "February";
        months[2] = "March";
        months[3] = "April";
        months[4] = "May";
        months[5] = "June";
        months[6] = "July";
        months[7] = "August";
        months[8] = "September";
        months[9] = "October";
        months[10] = "November";
        months[11] = "December";
    let month = months[datetime.getMonth()];

    let day = datetime.getDay();
    let year = datetime.getFullYear();

    minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;
    return { year, month, day, hours, minutes };
  }

  addDragAndDropFileUploadToElement(id, handleFileDrop=null, click_to_upload=true) {

    let browser_self = this;

    let hidden_upload_form = `
      <form class="my-form" style="display:none">
        <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
        <input type="file" id="hidden_file_element_${id}" multiple accept="*">
        <label class="button" for="fileElem">Select some files</label>
      </form>
    `;

    if (!document.getElementById(`hidden_file_element_${id}`)) {

      this.addElementToDom(hidden_upload_form, id);
      let dropArea = document.getElementById(id);
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, browser_self.preventDefaults, false)
      });
      ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, browser_self.highlight, false)
      })
        ;['dragleave', 'drop'].forEach(eventName => {
          dropArea.addEventListener(eventName, browser_self.unhighlight, false)
        })
      dropArea.addEventListener('drop', function (e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        ([...files]).forEach(function (file) {
          let reader = new FileReader();
          reader.addEventListener('load', (event) => {
            handleFileDrop(event.target.result);
          });
          reader.readAsDataURL(file);
        });
      }, false);
      dropArea.parentNode.parentNode.addEventListener('paste', function (e) {
        let files = e.clipboardData.files;
        ([...files]).forEach(function (file) {
          let reader = new FileReader();
          reader.addEventListener('load', (event) => {
            handleFileDrop(event.target.result);
          });
          reader.readAsDataURL(file);
        });
      }, false);
      let input = document.getElementById(`hidden_file_element_${id}`);
      if (click_to_upload == true) {
        dropArea.addEventListener('click', function (e) {
          input.click();
        });
      }
      input.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 0) {
          let files = this.files;
          ([...files]).forEach(function (file) {
            let reader = new FileReader(); 
            reader.addEventListener('load', (event) => {
              handleFileDrop(event.target.result);
            });
            reader.readAsDataURL(file);
          });
        }
      }, false);
      dropArea.focus();
    }
  }

  highlight(e) {
    document.getElementById(e.currentTarget.id).style.opacity = 0.8;
  }

  unhighlight(e) {
    document.getElementById(e.currentTarget.id).style.opacity = 1;
  }

  preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  makeDraggable(id_to_move, id_to_drag = "", mycallback = null) {

    try {

      let browser_self = this;
      let element_to_move = document.getElementById(id_to_move);
      let element_to_drag = element_to_move;
      if (id_to_drag != "") { element_to_drag = document.getElementById(id_to_drag); }

      let element_moved = 0;

      var mouse_down_left = 0;
      var mouse_down_top = 0;
      var mouse_current_left = 0;
      var mouse_current_top = 0;
      var element_start_left = 0;
      var element_start_top = 0;

      element_to_drag.onmousedown = function (e) {

        if ((e.currentTarget.id != id_to_move && e.currentTarget.id != id_to_drag) || e.currentTarget.id === undefined) {
	  document.ontouchend = null;
	  document.ontouchmove = null;
	  document.onmouseup = null;
	  document.onmousemove = null;
	  return;
	}


        e = e || window.event;

        //e.preventDefault();
        //if (e.stopPropagation) { e.stopPropagation(); }
        //if (e.preventDefault) { e.preventDefault(); }
        //e.cancelBubble = true;
        //e.returnValue = false;

        let rect = element_to_move.getBoundingClientRect();
        element_start_left = rect.left;
        element_start_top = rect.top;
        mouse_down_left = e.clientX;
        mouse_down_top = e.clientY;
        mouse_current_left = mouse_down_left;
        mouse_current_top = mouse_down_top;

        //console.log("Element Start Left: " + element_start_left);
        //console.log("Element Start Top: " + element_start_top);
        //console.log("Mouse Down Left: " + mouse_down_left);
        //console.log("Mouse Down Top: " + mouse_down_top);

        document.onmouseup = function (e) {

	  document.ontouchend = null;
	  document.ontouchmove = null;
	  document.onmouseup = null;
	  document.onmousemove = null;

          if (mycallback != null) { if (element_moved == 1) { mycallback(); } }
        };

        document.onmousemove = function (e) {

          e = e || window.event;
          //e.preventDefault();

          mouse_current_left = e.clientX;
          mouse_current_top = e.clientY;
          let adjustmentX = mouse_current_left - mouse_down_left;
          let adjustmentY = mouse_current_top - mouse_down_top;

          if (adjustmentX > 0) { element_moved = 1; }
          if (adjustmentY > 0) { element_moved = 1; }

          // set the element's new position:
          element_to_move.style.left = (element_start_left + adjustmentX) + "px";
          element_to_move.style.top = (element_start_top + adjustmentY) + "px";

        };
      };



      element_to_drag.ontouchstart = function (e) {

        if ((e.currentTarget.id != id_to_move && e.currentTarget.id != id_to_drag) || e.currentTarget.id === undefined) {
	  document.ontouchend = null;
	  document.ontouchmove = null;
	  document.onmouseup = null;
	  document.onmousemove = null;
	  return;
	}

        e = e || window.event;
        //e.preventDefault();
        //if (e.stopPropagation) { e.stopPropagation(); }
        //if (e.preventDefault) { e.preventDefault(); }
        //e.cancelBubble = true;
        //e.returnValue = false;

        let rect = element_to_move.getBoundingClientRect();
        element_start_left = rect.left;
        element_start_top = rect.top;
        mouse_down_left = (e.targetTouches[0] ? e.targetTouches[0].pageX : e.changedTouches[e.changedTouches.length-1].pageX);
        mouse_down_top = (e.targetTouches[0] ? event.targetTouches[0].pageY : e.changedTouches[e.changedTouches.length-1].pageY);
        mouse_current_left = mouse_down_left;
        mouse_current_top = mouse_down_top;

        document.ontouchend = function (e) {
	  document.ontouchend = null;
	  document.ontouchmove = null;
	  document.onmouseup = null;
	  document.onmousemove = null;
          if (mycallback != null) { if (element_moved == 1) { mycallback(); } }
        };

        document.ontouchmove = function (e) {

          e = e || window.event;
          //e.preventDefault();

          mouse_current_left = (e.targetTouches[0] ? e.targetTouches[0].pageX : e.changedTouches[e.changedTouches.length-1].pageX);
          mouse_current_top = (e.targetTouches[0] ? event.targetTouches[0].pageY : e.changedTouches[e.changedTouches.length-1].pageY);
          let adjustmentX = mouse_current_left - mouse_down_left;
          let adjustmentY = mouse_current_top - mouse_down_top;

          if (adjustmentX > 0) { element_moved = 1; }
          if (adjustmentY > 0) { element_moved = 1; }

          // set the element's new position:
          element_to_move.style.left = element_start_left + adjustmentX + "px";
          element_to_move.style.top = element_start_top + adjustmentY + "px";

        };
      };



    } catch (err) {
      console.log("error: " + err);
    }
  }


  /**
   * Fetchs identifiers from a set of keys
   *
   * @param {Array} keys
   */
  async addIdentifiersToDom(keys=[]) {

    if (keys.length == 0) {
      let addresses = document.getElementsByClassName(`saito-address`);
      Array.from(addresses).forEach(add => {
        let pubkey = add.getAttribute("data-id");
	if (pubkey) {
	  keys.push(pubkey);
	}
      });
    }

    try {
      let answer = await this.app.keys.fetchManyIdentifiersPromise(keys);
      Object.entries(answer).forEach(([key, value]) => this.updateAddressHTML(key, value));
    } catch(err) {
      console.error(err);
    }

  }

  returnAddressHTML(key) {
    let identifier = this.app.keys.returnIdentifierByPublicKey(key);
    let id = !identifier ? key : identifier
    return `<span data-id="${key}" class="saito-address saito-address-${key}">${id}</span>`
  }

  async returnAddressHTMLPromise(key) {
    let identifier = await this.returnIdentifier(key);
    let id = !identifier ? key : identifier
    return `<span class="saito-address saito-address-${key}">${id}</span>`
  }

  updateAddressHTML(key, id) {
    if (!id) { return; }
    try {
      let addresses = document.getElementsByClassName(`saito-address-${key}`);
      Array.from(addresses).forEach(add => add.innerHTML = id);
    } catch (err) {}
  }






  //////////////////////////////////////////////////////////////////////////////
  /////////////////////// url-hash helper functions ////////////////////////////
  //////////////////////////////////////////////////////////////////////////////
  // TODO: Add a function which alphabetizes keys so that noop url changes will
  // always act correctly... .e.g. someFunction("#bar=1&foo=2") should never
  // return "#foo=1&bar=2". Some other way of preserving order may be better...
  //////////////////////////////////////////////////////////////////////////////
  //
  // Parse a url-hash string into an object.
  // usage: parseHash("#foo=1&bar=2") --> {foo: 1, bar: 2}
  parseHash(hash) {
    if (hash === "") { return {} ;}
    return hash.substr(1).split('&').reduce(function (result, item) {
      var parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
    }, {});
  }
  // Build a url-hash string from an object.
  // usage: buildHash({foo: 1, bar: 2}) --> "#foo=1&bar=2"
  buildHash(hashObj) {
    let hashString = Object.keys(hashObj).reduce((output, key) => {
      let val = hashObj[key];
      return output + `&${key}=${hashObj[key]}`;
    }, "");
    return "#" + hashString.substr(1);
  }
  // Make a new hash and mix in keys from another hash.
  // usage: buildHashAndPreserve("#foo=1&bar=2","#foo=3&bar=4&baz=5","baz") --> "#foo=1&bar=2&baz=5"
  buildHashAndPreserve(newHash, oldHash, ...preservedKeys) {
    return this.buildHash(Object.assign(this.getSubsetOfHash(oldHash, preservedKeys), this.parseHash(newHash)));
  }
  // Get a subset of key-value pairs from a url-hash string as an object.
  // usage: getSubsetOfHash("#foo=1&bar=2","bar") --> {bar: 2}
  getSubsetOfHash(hash, ...keys) {
    let hashObj = this.parseHash(hash);
    return keys.reduce(function (o, k) { o[k] = hashObj[k]; return o; }, {});
  }
  // Remove a subset of key-value pairs from a url-hash string.
  // usage: removeFromHash("#foo=1&bar=2","bar") --> "#foo=1"
  removeFromHash(hash, ...keys) {
    let hashObj = this.parseHash(hash);
    keys.forEach((key, i) => {
      delete hashObj[key]
    });
    return this.buildHash(hashObj);
  }
  // Add new key-value pairs to the hash.
  // usage: modifyHash("#foo=1",{bar: 2}) --> "#foo=1&bar=2"
  modifyHash(oldHash, newHashValues) {
    return this.buildHash(Object.assign(this.parseHash(oldHash), newHashValues));
  }
  // Override defaults with other values. Useful to initialize a page.
  // usage: modifyHash("#foo=1&bar=2","#foo=3") --> "#foo=3&bar=2"
  defaultHashTo(defaultHash, newHash) {
    return this.buildHash(Object.assign(this.parseHash(defaultHash), this.parseHash(newHash)));
  }
  // Initialize a hash on page load.
  // Typically some values need a setting but can be overridden by a "deep link".
  // Other values must take certain values on page load, e.g. ready=false these
  // go in the forcedHashValues
  // 
  // usage: 
  // let currentHash = window.location.hash; // (e.g."#page=2&ready=1")
  // initializeHash("#page=1", currentHash, {ready: 0}) --> #page=2&ready=0
  initializeHash(defaultHash, deepLinkHash, forcedHashValues) {
    return this.modifyHash(this.defaultHashTo(defaultHash, deepLinkHash), forcedHashValues);
  }
  // TODO: implement htis function
  getValueFromHashAsBoolean() {

  }
  getValueFromHashAsNumber(hash, key) {
    try {
    let subsetHashObj = this.getSubsetOfHash(hash, key);
    if (subsetHashObj[key]) {
      return Number(subsetHashObj[key]);
    } else {
      throw "key not found in hash";
    }
    } catch (err) {
      return Number(0);
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  /////////////////////// end url-hash helper functions ////////////////////////
  //////////////////////////////////////////////////////////////////////////////


}

module.exports = Browser;


