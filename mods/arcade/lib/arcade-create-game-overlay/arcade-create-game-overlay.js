const ArcadeCreateGameOverlayTemplate = require('./templates/arcade-create-game-overlay.template');
const FirstTabTemplate = require('./templates/first-tab.template');
const LastTabTemplate = require('./templates/last-tab.template');

let makeTabs = (app, gameCreator) => {
  let retObj = {
    buttonNames: [],
    tabContents: [],
  };
  retObj.buttonNames.push("Options");
  retObj.tabContents.push(FirstTabTemplate(app, gameCreator));
  if (gameCreator.returnAdvancedGameOptionsHTML) {
    retObj.buttonNames.push("Advanced Options");
    retObj.tabContents.push(gameCreator.returnAdvancedGameOptionsHTML());
  }
  retObj.buttonNames.push("Start");
  retObj.tabContents.push(LastTabTemplate());
  return retObj;
}

module.exports = ArcadeCreateGameOverlay = {
  initialize(app, mod) {
    window.addEventListener("hashchange", () => {
      if (window.location.hash.startsWith("#creategame")){
        // This is basically "render"
        let moduleName = window.location.hash.split("=")[1];
        let module = app.modules.returnModule(moduleName);
        if(module) {
          let gameCreator = {...module.requestInterface("arcade-create-game"), modname: moduleName};
          let tabs = makeTabs(app, gameCreator)
          mod.overlay.showOverlay(app, mod, ArcadeCreateGameOverlayTemplate(tabs, gameCreator));
          this.showTab(0, tabs.buttonNames.length); // do this to attach next/prev button callback events
          document.getElementById('return-to-arcade').onclick = () => {
            window.location.hash = "#";
          };
          // Must do this after ArcadeCreateGameOverlayTemplate is drawn
          Array.from(document.getElementsByClassName('create-game-tab-button')).forEach((tabButton, i) => {
            tabButton.onclick = () => {
              let tabNumber = parseInt(tabButton.id.split("-")[1]);
              this.showTab(tabNumber, tabs.buttonNames.length);
            }
          });
        }
      }
    });
  },
  render(app, mod, gameCreator) {
    window.location.hash = `#creategame=${gameCreator.modname}`;
  },

  attachEvents(app, mod) {

  },
  showTab(tabNumber, howManyTabs) {
    // hide/show tab content
    for (let i = 0; i < howManyTabs; i++) {
      if (i == tabNumber) {
        document.getElementById(`tab-${i}-button`).classList.add("arcade-tab-selected");
        document.getElementById(`create-game-tab-${i}`).classList.remove("arcade-tab-hidden");  
      } else {
        document.getElementById(`tab-${i}-button`).classList.remove("arcade-tab-selected");
        document.getElementById(`create-game-tab-${i}`).classList.add("arcade-tab-hidden");
      }
    }
    // When we switch tabs, the functinoality of next/prev needs to change
    let nextButton = document.getElementById("next-tab-button");
    let prevButton = document.getElementById("prev-tab-button");
    nextButton.onclick = () => {
      this.showTab(tabNumber + 1, howManyTabs);
    }
    prevButton.onclick = () => {
      this.showTab(tabNumber - 1, howManyTabs);
    }
    // hide or show next/prev buttons
    if (tabNumber == howManyTabs - 1) {
      nextButton.classList.add("arcade-tab-hidden");
    } else {
      nextButton.classList.remove("arcade-tab-hidden");
    }
    if (tabNumber == 0) {
      prevButton.classList.add("arcade-tab-hidden");
    } else {
      prevButton.classList.remove("arcade-tab-hidden");
    }
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