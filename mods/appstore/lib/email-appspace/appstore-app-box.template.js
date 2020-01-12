module.exports = AppStoreAppBoxTemplate = (app, approw) => {

  // let tx = JSON.parse(approw.tx);

  let base64msg = app.crypto.stringToBase64(JSON.stringify({ name : approw.name , description : approw.description , unixtime : approw.unixtime , publickey : approw.publickey , version : approw.version , bsh : approw.bsh , bid : approw.bid }));
  let appimg = '/saito/img/dreamscape.png';
  

  return `
      <div id="appstore-app-item-${approw.version}" class="appstore-app-item">
        <div class="appstore-app-item-image" style="background-image: url(${appimg})"></div>
        <div class="appstore-app-list-details">
          <div class="appstore-app-item-name">${approw.name}</div>
          <div class="appstore-app-item-publisher grid-2"><div>Publisher</div><div>${approw.publickey}</div></div>
          <button class="appstore-app-install-btn" id="${base64msg}">install</button>
        </div>
        <div class="appstore-app-item-categories">${approw.categoriesHTML}</div>
        <div class="appstore-app-item-description">${approw.description}</div>
      </div>
  `;
}
