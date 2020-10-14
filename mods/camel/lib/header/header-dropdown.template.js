module.exports = HeaderDropdownTemplate = (dropdownmods) => {
  let html = `
    <div id="modules-dropdown" class="header-dropdown">
      <ul>
  `;
  for (let i = 0; i < dropdownmods.length; i++) {
    if (dropdownmods[i].returnLink() != null) {
      html += `<a href="${dropdownmods[i].returnLink()}"><li>${dropdownmods[i].name}</li></a>`;
    }
  }
  html += `
    </ul>
    </div>
  `;
  return html;
}
