module.exports = ArcadeMainTemplate = () => {
  return `
    <div id="arcade-main" class="arcade-main">
      <div id="arcade-hero" class="arcade-hero">

<div class="game-invite-container">
  <div glass="game-invite-imagebox">
  <div class="game-invite-header">
    <div class="game-invite-header-players"><img class="game-invite-header-players-creator-emoticon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MjAnIGhlaWdodD0nNDIwJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDI0MCwyNDAsMjQwLDEpOyc+PGcgc3R5bGU9J2ZpbGw6cmdiYSgyMTcsMzgsNjIsMSk7IHN0cm9rZTpyZ2JhKDIxNywzOCw2MiwxKTsgc3Ryb2tlLXdpZHRoOjIuMTsnPjxyZWN0ICB4PScxNjgnIHk9JzI1Micgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9Jzg0JyB5PScxNjgnIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjxyZWN0ICB4PScyNTInIHk9JzE2OCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9Jzg0JyB5PScyNTInIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjxyZWN0ICB4PScyNTInIHk9JzI1Micgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9Jzg0JyB5PSczMzYnIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjxyZWN0ICB4PScyNTInIHk9JzMzNicgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzAnIHk9Jzg0JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMzM2JyB5PSc4NCcgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzAnIHk9JzI1Micgd2lkdGg9Jzg0JyBoZWlnaHQ9Jzg0Jy8+PHJlY3QgIHg9JzMzNicgeT0nMjUyJyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMCcgeT0nMzM2JyB3aWR0aD0nODQnIGhlaWdodD0nODQnLz48cmVjdCAgeD0nMzM2JyB5PSczMzYnIHdpZHRoPSc4NCcgaGVpZ2h0PSc4NCcvPjwvZz48L3N2Zz4=" /></div>
    <div class="game-invite-header-title">Twilight</div>
  </div>
  <div class="game-invite-image">
    <img src="/twilight/img/arcade.jpg" class="game-invite-image" />
  </div>
  </div>
<div class="game-invite-btn">Join</div>
</div>

      </div>
      <div id="arcade-sub" class="arcade-sub">
      </div>
    </div>

<style type="text/css">

.game-invite-header-players-creator-emoticon {
  height: 30px;
  width: 30px;
}

.game-invite-imagebox {
  width: 200px;
  height: 140px;
  border: 1px solid white;
}

.game-invite-header {
  position: absolute;
  width: 100%;
  background-color: #ddd5;
}
.game-invite-image {
  position: absolute;
  width: 200px;
  height: 140px;
}
.game-invite-btn {
  width: 180px;
  margin-left: auto;
  margin-right: auto;
}

</style>
  `;
}
