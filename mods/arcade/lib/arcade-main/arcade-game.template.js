module.exports = ArcadeMainTemplate = (mod, modobj) => {
  return `
      <li class="game glide__slide" id="${mod.name}">
        <div class="ribbon ribbon-top-left"><span>Click to Play</span></div>
        <img class="game-image" src="${modobj.img}" />
        <div class="game-title">${mod.name}</div>
      </li>
  `;
}
