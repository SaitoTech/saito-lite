let demoTile = `
<div class="arcade-tile twilight-struggle-invite">
  <div class="invite-tile-left">
    <span class="invite-tile-title">Twilight Struggle</span>
  </div>
  <div class="invite-tile-right">
    <div class="invite-tile-button invite-tile-cancel-button">CANCEL</div>
    <div class="invite-tile-button invite-tile-join-button">JOIN</div>
    <div class="genericInfo">Team: US</div>
    <div class="genericInfo">Deck: Twilight Absurdum</div>
    <div class="genericInfo">US Bonus: 10</div>
    <div class="playersInfo">2/6 Players</div>
  </div>
</div>`;
module.exports = ArcadeMainTemplate = () => {
  return `
    <div id="arcade-main" class="arcade-main">
      <div id="arcade-hero" class="arcade-hero">
        ${demoTile}
        ${demoTile}
        ${demoTile}
        ${demoTile}
        ${demoTile}
        ${demoTile}
        ${demoTile}
      </div>
      <div id="arcade-sub" class="arcade-sub">
      </div>
    </div>

  `;
}
