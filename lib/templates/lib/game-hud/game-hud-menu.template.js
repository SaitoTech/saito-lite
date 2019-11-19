module.exports = GameMenuHudTemplate = (menu_items) => {
  let items_html =
    Object.entries(menu_items)
          .map(([key, value]) => `<li><a id="${key}">${value.name}</a></li>`);
  return `<ul>${items_html.join('')}</ul>`;
}