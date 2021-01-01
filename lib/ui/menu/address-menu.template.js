module.exports = AddressMenuTemplate = (elements, coords) => {

  let elements_html = "";

// fuck map
try {
  elements_html = Object.entries(elements).map(([key, value]) => {
    return `<li style="text-align: center;line-height: 2em; cursor: pointer;" id="${key}">${value.name}</li>`
  });
} catch (err) { return ""; }

  elements_html = elements_html.join('');

  let width = 240
  let height = 120;

  let left = coords.left + ((coords.width - width) / 2);
  let top = coords.top - (height / 2) - 70;

  return `
    <div id="address-menu" style="
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      height: ${height}px;
      width: ${width}px;
      padding: 10px;
      background: whitesmoke;
      color: black;
      font-family: "visuelt-light", "Microsoft Yahei", "Hiragino Sans GB";
        ">
      <ul style="list-style-type: none">
        ${elements_html}
      </ul>
    </div>
  `;
}
