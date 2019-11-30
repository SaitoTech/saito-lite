module.exports = AppStoreAppBoxTemplate = (app, approw) => {

  let tx = JSON.parse(approw.tx);

  let base64msg = app.crypto.stringToBase64(JSON.stringify({ name : approw.name , version : approw.version }));


  return `
      <div id="appstore-app-item-${approw.version}" class="appstore-app-item">
        <div class="appstore-app-item-image"></div>
        <div class="appstore-app-item-name">${approw.name}</div>
        <div class="appstore-app-item-description">${approw.description}</div>
        <div class="appstore-app-item-publisher">${tx.from[0].add}</div>
        <button class="appstore-app-install-btn" id="${base64msg}">install</button>
      </div>
  `;
}
