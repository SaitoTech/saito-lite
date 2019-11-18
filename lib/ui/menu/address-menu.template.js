module.exports = AddressMenuTemplate = (elements, coords) => {
  let elements_html = Object.entries(elements).map(([key, value]) => {
    return `<li style="text-align: center;line-height: 2em; cursor: pointer;" id="${key***REMOVED***">${value.name***REMOVED***</li>`
  ***REMOVED***);

  elements_html = elements_html.join('');

  let width = 240
  let height = 120;

  let left = coords.left + ((coords.width - width) / 2);
  let top = coords.top - (height / 2) - 70;

  return `
    <div id="address-menu" style="
      position: absolute;
      top: ${top***REMOVED***px;
      left: ${left***REMOVED***px;
      height: ${height***REMOVED***px;
      width: ${width***REMOVED***px;
      padding: 10px;
      background: whitesmoke;
      color: black;
      font-family: visuelt-light;
        ">
      <ul style="list-style-type: none">
        ${elements_html***REMOVED***
      </ul>
    </div>
  `;
***REMOVED***