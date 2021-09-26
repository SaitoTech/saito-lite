module.exports = AppStoreOverlayAppTemplate = (app, approw) => {

  let base64msg = app.crypto.stringToBase64(JSON.stringify({ name : approw.name , description : approw.description , unixtime : approw.unixtime , publickey : approw.publickey , version : approw.version , bsh : approw.bsh , bid : approw.bid }));
  let appimg = '/saito/img/dreamscape.png';
  if (approw.image != "") { appimg = approw.image; }

  let html = `

    <div class="appstore-overlay-app" id="${base64msg}">
   `;
  if (approw.image != "") {
    html += `    <div class="appstore-overlay-app-image" style="background: url(`+approw.image+`);background-repeat: no-repeat; background-size: cover"></div>`;
  } else {
    html += `    <div class="appstore-overlay-app-image" style="background-image: url('${appimg}')"></div>`;
  }
  html += `
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">${approw.name}</div>
        <div class="appstore-overlay-app-author">Publisher: ${app.keys.returnUsername(approw.publickey)}</div>
        <div class="appstore-overlay-app-btn" class="appstore-overlay-app-btn button">install</div>
      </div>
    </div>

  `;

  return html;

}


