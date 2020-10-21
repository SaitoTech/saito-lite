module.exports = GameMenuIconTemplate = (options) => {

  let classname = "";
  if (options.class != undefined) { classname = options.class; }

  return `<li id="${options.id}" class="game-menu-icon ${classname}">${options.text}</li>`;

}

