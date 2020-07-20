module.exports = GameMenuHudTemplate = (menu_items) => {

  let html = '';
      html += '<ul>';

  for (let i in menu_items) {
    let key = i;
    let value = menu_items[i].name;
    let name = '<span class="hud-menu-first-letter">'+value[0]+'</span><span class="hud-menu-other-letters">'+value.substring(1)+'</span>';
    html += '<li class="hud_menu_'+key+'" id="hud_menu_'+key+'"><a class="'+key+'" id="'+key+'">'+name+'</a></li>';
  }
  html += '</ul>';

  return html;

}
