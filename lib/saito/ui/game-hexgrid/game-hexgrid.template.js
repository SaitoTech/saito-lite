module.exports = GameOverlayTemplate = (height, width) => {

  let html = "";

  let max_width = width+1;

  html += '<ul id="game-hexGrid" class="game-hexGrid">';
  html += "\n";

  for (let h = 1, hid = 1; h <= height; h++, hid++, wid++) {
    for (let w = 1, wid = 1; w <= width; w++) {
     let id = (hid+"_"+wid);
     html += '<li id="'+id+'" class="hex"></li>';
    }
    html += "\n";
  }

  html += '</ul>';

  return html;

}

