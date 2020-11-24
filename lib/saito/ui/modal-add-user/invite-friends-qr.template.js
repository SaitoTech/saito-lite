module.exports = InviteFriendsQRTemplate = () => {
  return `
    <div class="add-contact-modal-qr">
      <div id="qr-hud-target" style="
        position: absolute;
        width: 10em;
        height: 10em;
        border: 2px solid red;
        background-color: transparent;
        margin: 2em 8.5em;"></div>
      <div class="video-container">
        <video playsinline autoplay style="width: 100%; max-width: 26em"></video>
      </div>
      <canvas style="display: none" id="qr-canvas"></canvas>
    </div>
  `;
}