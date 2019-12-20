module.exports = AppStoreAppBoxTemplate = (app, approw) => {

  // let tx = JSON.parse(approw.tx);

  let base64msg = app.crypto.stringToBase64(JSON.stringify({ name : approw.name , version : approw.version ***REMOVED***));
  let appimg = '/saito/img/dreamscape.png';

  return `
      <div id="appstore-app-item-${approw.version***REMOVED***" class="appstore-app-item">
        <div class="appstore-app-item-image"><img src="${appimg***REMOVED***"></div>
        <div class="appstore-app-list-details">
          <div class="appstore-app-item-name">${approw.name***REMOVED***</div>
          <div class="appstore-app-item-description">${approw.description***REMOVED***</div>
          <div class="appstore-app-item-publisher">${approw.publickey***REMOVED***</div>
          <button class="appstore-app-install-btn" id="${base64msg***REMOVED***">install</button>
        </div>
      </div>
  `;
***REMOVED***
