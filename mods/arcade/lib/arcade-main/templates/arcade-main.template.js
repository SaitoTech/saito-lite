module.exports = ArcadeMainTemplate = () => {
  return `
    <div id="arcade-main" class="arcade-main">
    
      <div id="arcade-hero" class="arcade-hero">

      <div class="a2 arcade-tile twilight-struggle-invite">
        <div class="invite-tile-left">Twilight Struggle</div>
        <div class="invite-tile-right">
          <div>Team:</div><div>US</div>
          <div>Deck:</div><div>Twilight Absurdum</div>
          <div>US Bonus:</div><div>10</div>
          <div>Time Limit:</div><div>120 Minutes</div>
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
