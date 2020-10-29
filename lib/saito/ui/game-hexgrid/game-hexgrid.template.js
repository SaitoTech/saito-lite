module.exports = GameHexGridTemplate = (height, width) => {

  let html = "";

  let max_width = width+1;

  html += '<ul id="game-hexgrid" class="game-hexgrid">';
  html += "\n";

  for (let h = 1, hid = 1; h <= height; h++, hid++) {
    for (let w = 1, wid = 1; w <= width; w++) {
      let id = (hid+"_"+wid);
      html += '<li id="'+id+'" class="hex"></li>';
      wid++;
    }
    html += "\n";
  }

  html += '</ul>';

  return html;

}

