export const ArcadeListRowTemplate = (game_name, author, type) => {
  return `
    <div class="games-row">
      <i class="icon-med fas fa-radiation"></i>
      <div class="games-content">
          <h3>${game_name***REMOVED***</h3>
          <p class="games-author">From: ${author.substring(0, 16)***REMOVED***</p>
      </div>
    <button class="games-button ${type***REMOVED***-button">${type.toUpperCase()***REMOVED***</button>
    </div>
  `
***REMOVED***