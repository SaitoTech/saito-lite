module.exports = EmailMainTemplate = (app, mod) => {
  let html = `
      <div class="email-header"></div>
      <div class="email-body"></div>
      <button id="email" class="create-button"><i class="fas fa-plus"></i></button>
  `;

  //
  // preload scripts
  //
  let mods = app.modules.respondTo("email-appspace");
  for (let i = 0; i < mods.length; i++) {
    let tmod = mods[i];
    if (tmod != null) {
      if (tmod.script != "" && tmod.script !== "undefined" && tmod.script != undefined) {
        html += tmod.script;
      }
    }
  }

  return html;

}
