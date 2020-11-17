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
          //document.querySelector('#background-shim').onclick = () => { window.location.hash = "#"; };
          Array.from(document.getElementsByClassName('create-game-tab-button')).forEach((tabButton, i) => {
            tabButton.onclick = () => {
              let tabNumber = tabButton.id.split("-")[1];
              this.showTab(tabNumber)
            }
          });
          //document.getElementById("")
          
        }
      }
    });
  },
  render(app, mod, gameCreator) {
    window.location.hash = `#creategame=${gameCreator.modname}`;
    
  },

  attachEvents(app, mod) {

  },
  showTab(tabNumber) {
    Array.from(document.getElementsByClassName('create-game-tab')).forEach((tab, i) => {
      if(tab.id == `create-game-tab-${tabNumber}`) {
        tab.classList.remove("arcade-tab-hidden");
      } else {
        tab.classList.add("arcade-tab-hidden");
      }
    });
  }
}

const getOptions = () => {
  let options = {};
  document.querySelectorAll('form input, form select').forEach(element => {
    if (element.type == "checkbox") {
      if (element.checked) {
        options[element.name] = 1;
      }
    } else {
      options[element.name] = element.value;
    }
  });
  return options;
}