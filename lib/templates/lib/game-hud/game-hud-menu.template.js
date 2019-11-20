module.exports = GameMenuHudTemplate = (menu_items) => {
  return `
  <ul>${
    Object.entries(menu_items)
          .map(([key, value]) => `<li><a id="${key***REMOVED***">${value.name***REMOVED***</a></li>`)
          .join('')
  ***REMOVED***</ul>`;
***REMOVED***