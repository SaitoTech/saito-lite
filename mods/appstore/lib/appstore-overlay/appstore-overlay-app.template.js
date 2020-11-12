module.exports = AppStoreOverlayAppTemplate = (app, approw) => {

  let base64msg = app.crypto.stringToBase64(JSON.stringify({ name : approw.name , description : approw.description , unixtime : approw.unixtime , publickey : approw.publickey , version : approw.version , bsh : approw.bsh , bid : approw.bid }));
  let appimg = '/saito/img/dreamscape.png';

  return `

    <div class="appstore-overlay-app" id="${base64msg}">
      <div class="appstore-overlay-app-image" style="background-image: url('/twilight/img/arcade.jpg')"></div>
      <div class="appstore-overlay-app-details">
        <div class="appstore-overlay-app-title">${approw.name}</div>
        <div class="appstore-overlay-app-author">david@saito</div>
        <div class="appstore-overlay-app-btn" id="" class="appstore-overlay-app-btn button">install</div>
      </div>
    </div>

  `;

}


