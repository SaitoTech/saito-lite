
module.exports = HeaderDropdownTemplate = (ifaces) => {
  let linksHtml = "";
  for (let i = 0; i < ifaces.length; i++) {
    linksHtml += `<a href="${ifaces[i].link}"><li>${ifaces[i].name}</li></a>`;
  }
  let html = `
    <div id="modules-dropdown" class="header-dropdown">
      <ul>` + linksHtml + `</ul>
    </div>
  `;
  return html;
}


