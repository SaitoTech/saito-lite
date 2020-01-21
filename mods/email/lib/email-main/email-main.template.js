module.exports = EmailMainTemplate = (app, data) => {
  let html = `
      <div class="email-header"></div>
      <div class="email-body"></div>
      <button id="email" class="create-button"><i class="fas fa-plus"></i></button>
  `;

  //
  // preload scripts
  //
  for (let i = 0; i < data.mods.length; i++) {
    let tmod = data.mods[i].respondTo("email-appspace");
    if (tmod != null) {
      if (tmod.script != "" && tmod.script !== "undefined" && tmod.script != undefined) {
        html += tmod.script;
      }
    }
  }

  return html;

}
