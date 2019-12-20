module.exports = HeaderDropdownTemplate = (dropdownmods) => {
  let html = `
    <div id="modules-dropdown" class="header-dropdown">
      <ul>
  `;
  for (let i = 0; i < dropdownmods.length; i++) {
    if (dropdownmods[i].returnLink() != null) {
      html += `<a href="${dropdownmods[i].returnLink()***REMOVED***"><li>${dropdownmods[i].name***REMOVED***</li></a>`;
***REMOVED***
  ***REMOVED***
  html += `
    </ul>
    </div>
  `;
  return html;
***REMOVED***
