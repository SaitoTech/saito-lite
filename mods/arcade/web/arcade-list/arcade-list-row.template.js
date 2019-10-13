export const ArcadeListRowTemplate = (game_name, author, type) => {
  return `
    <div class="games-row">
      <i class="icon-med fas fa-radiation"></i>
      <div class="games-content">
          <h3>${game_name}</h3>
          <p class="games-author">From: ${author.substring(0, 16)}</p>
      </div>
    <button class="games-button ${type}-button">${type.toUpperCase()}</button>
    </div>
  `
}