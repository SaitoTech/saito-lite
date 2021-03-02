
class SideMenu {
  constructor(app) {
    this.shown = false;
  
  }
  render(app, mod) {
    if(!document.getElementById("modules-dropdown")){
      let html = `
      <hr/>
      <div id="modules-dropdown" class="header-dropdown-links">
      `;
      app.modules.getRespondTos("header-dropdown").forEach((response, i) => {
        html += `<div class="wallet-action-row"><a id="nav-${response.name}" href="/${response.slug}" class="wallet-action-nav-link"><i class="settings-fas-icon ${response.icon_fa}"></i> ${response.name}</a></div>`;
      });
      html += `</div><hr>`;
      app.browser.addElementToDom(html, 'settings-dropdown');
      this.attachEvents(app, mod);
    }
    
    if(this.shown) {
      document.querySelector('#settings-dropdown').classList.add("show-right-sidebar")
    } else {
      document.querySelector('#settings-dropdown').classList.remove("show-right-sidebar")
    }
  }
  attachEvents(app, mod) {
    let showHideSideMenuCallback = (e) => {
      document.querySelectorAll(".wallet-action-row, #modules-dropdown a").forEach((elem, i) => {
        if(elem === e.currentTarget) {
          return;
        }
      });
      this.shown = false;
      this.render(app, mod);
    }
    window.removeEventListener('click', showHideSideMenuCallback)
    window.addEventListener('click', showHideSideMenuCallback)
    
    document.querySelectorAll(".wallet-action-row .wallet-action-nav-link").forEach((elem, i) => {
      elem.onclick = (e) => {
        let navName = e.currentTarget.id.replace("nav-", "");
        app.browser.logMatomoEvent("Navigation", "HeaderDropdown", "NavigationClick", navName);
      }
    });
    document.querySelector('#settings-dropdown').addEventListener('click' , (event) => {
      // dont' close the side menu if the user clicked within it... unless they clicked 
      event.cancelBubble = true;
    });
  
    document.querySelectorAll("#header-mini-wallet, #navigator").forEach((elem, i) => {
      elem.onclick = (event) => {
        this.shown = !this.shown;
        this.render(app, mod);
        event.cancelBubble = true;
      };
    });
  
  }
}
module.exports = SideMenu