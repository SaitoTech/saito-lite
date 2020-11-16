const ArcadeCreateGameOverlayTemplate = require('./templates/arcade-create-game-overlay.template');


module.exports = ArcadeCreateGameOverlay = {
  initialize(app, mod) {
    window.addEventListener("hashchange", () => {
      if (window.location.hash.startsWith("#creategame")){
        let moduleName = window.location.hash.split("=")[1];
        let module = app.modules.returnModule(moduleName);
        if(module) {
          mod.overlay.showOverlay(app, mod, ArcadeCreateGameOverlayTemplate(app, {...module.requestInterface("arcade-create-game"), modname: moduleName}));
          document.querySelector('#return-to-arcade').onclick = () => { window.location.hash = "#"; };
          document.querySelector('#background-shim').onclick = () => { window.location.hash = "#"; };
        }
      }
    });
  },
  render(app, mod, gameCreator) {
    window.location.hash = `#creategame=${gameCreator.modname}`;
  },

  attachEvents(app, mod) {

  },
}
