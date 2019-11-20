module.exports = GameMenuHudTemplate = (menu_items) => {
  return `
  <ul>${
    Object.entries(menu_items)
          .map(([key, value]) => `<li><a id="${key}">${value.name}</a></li>`)
          .join('')
  }</ul>`;
}