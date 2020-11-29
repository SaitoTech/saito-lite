module.exports = ChatQRTemplate = () => {
  return `
    <div class="chat-qr">
      <div id="qr-hud" style="height: 92vh;">
        <div class="opaque-black" id="qr-hud-header" style="grid-template-columns: 1fr">
          <div style="display:grid; grid-template-columns: 5.2em auto 5.2em; align-items: center; width:100%">
            <i id="back-button" class="chat-qr-back icon-med fas fa-arrow-left"></i>
            <h2 style="justify-self: center">Scan QR</h2>
          </div>
        </div>
        <div id="qr-hud-body">
          <div class="opaque-black" id="qr-hud-top"></div>
          <div id="qr-hud-mid">
            <div class="opaque-black"></div>
            <div id="qr-hud-target"></div>
            <div class="opaque-black"></div>
          </div>
          <div class="opaque-black" id="qr-hud-bot"></div>
        </div>
      </div>
      <div class="video-container">
        <video playsinline autoplay></video>
      </div>
      <canvas style="display: none" id="qr-canvas"></canvas>
    </div>
  `;
}