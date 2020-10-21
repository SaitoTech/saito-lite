module.exports = GameMenuOptionTemplate = (options, sub_options=[]) => {

  let classname = "";
  if (options.class) { classname = options.class; }

  let html = `<li id="${options.id}" class="game-menu-option ${classname}">${options.text}`;
  if (sub_options.length > 0) {
    html += '<ul class="game-menu-sub-options">';
    for (let z = 0; z < sub_options.length; z++) {
      classname = "";
      if (sub_options[z].class) { classname = sub_options[z].class; }
      html += `<li id="${sub_options[z].id}" class="game-menu-sub-option ${classname}">${sub_options[z].text}</li>`;
    }
    html += '</ul>';
  }
  html += '</li>';

  return html;

}

