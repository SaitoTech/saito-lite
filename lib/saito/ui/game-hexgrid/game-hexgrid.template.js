module.exports = GameHexGridTemplate = (height, width, mode=[]) => {
  
  let html = `
    <style type="text/css">
      .hex {
        width: ${100/width}%
      }
      .hex:nth-child(9n+6) {
        margin-left: ${(100/width)/2}%
      }
    </style>
  `;

  html += '<div id="game-hexgrid-container" class="game-hexgrid-container"><ul id="game-hexgrid" class="game-hexgrid">';
  html += "\n";

  let hexnum = 0;
  for (let h = 1, hid = 1; h <= height; h++, hid++) {
    let widdy = width;
    if (h%2 == 0) {widdy = width-1; }
    for (let w = 1, wid = 1; w <= widdy; w++) {

      if (mode.length > 0) {
	if (mode[hexnum] == 1) {

          let id = (hid+"_"+wid);
      
          html += `
    	    <li id="${id}" class="hex">
	     <div class="hexIn" id="hexIn_${id}">
      <div class="hexLink" id="hexLink_${id}">
	 	  <div class="hex_bg" id="hex_bg_${id}">
		  </div></div></div>
	    </li>
          `;
          wid++;
	} else {
          html += `<li id="" class="hex"></li>`;
        }
      } else {

        let id = (hid+"_"+wid);
        html += `
    	  <li id="${id}" class="hex">
	    <div class="hexIn" id="hexIn_${id}">
	      <div class="hexLink" id="hexLink_${id}">
		<div class="hex_bg" id="hex_bg_1_1">
		</div>
	      </div>
	    </div>
	  </li>
        `;
        wid++;

      }

      hexnum++;
    }
  }

  // rendering problem fix -- empty bottom row
  if ((height+1)%2 == 0) {
    for (let i = 0; i < width-1; i++) { html += '<li id="" class="hex"></li>'; }
  } else {
    for (let i = 0; i < width; i++) { html += '<li id="" class="hex"></li>'; }
  }

  html += "\n";
  html += '</ul></div>';
  return html;

}

