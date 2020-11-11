module.exports = ArcadeMainTemplate = () => {
  return `
    <div id="arcade-main" class="arcade-main">
    
      <div id="arcade-hero" class="arcade-hero">
      
        <div class="a2 arcade-tile twilight-struggle-invite">
          <div class="invite-tile-cancel-button">X</div>
          <div class="invite-tile-join-button">JOIN</div>
          <div class="invite-tile-top">
            <span class="invite-tile-title">Twilight Struggle</span>
          </div>
          <div class="invite-tile-bottom">
            <div>Team:</div><div>US</div>
            <div>Deck:</div><div>Twilight Absurdum</div>
            <div>US Bonus:</div><div>10</div>
          </div>
        </div>
        
        <div class="a2 arcade-tile"></div>
        <div class="a2 arcade-tile"></div>
        <div class="a2 arcade-tile"></div>
        <div class="a2 arcade-tile"></div>
        <div class="a2 arcade-tile"></div>
        <div class="a2 arcade-tile"></div>

      </div>
      <div id="arcade-sub" class="arcade-sub">
      </div>
    </div>

  `;
}
