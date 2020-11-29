module.exports = SaitoOverlayTemplate = (closebox) => {

  if (closebox) {
    return `  
      <div id="saito-overlay" class="saito-overlay">
        <div id="saito-overlay-closebox" class="saito-overlay-closebox"><i class="fas fa-times-circle saito-overlay-closebox-btn"></i></div>
      </div>
      <div id="saito-overlay-backdrop" class="saito-overlay-backdrop"></div>
    `;
  } else {
    return `  
      <div id="saito-overlay" class="saito-overlay"></div>
      <div id="saito-overlay-backdrop" class="saito-overlay-backdrop"></div>
    `;
  }

}

