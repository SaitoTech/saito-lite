const EscrowSidebarTemplate 	= require('./escrow-sidebar.template.js');
const EscrowGameWizard	 	= require('./escrow-game-wizard.js');


module.exports = EscrowSidebar = {

  render(app, data) {
    document.querySelector(".arcade-sidebar-escrow").innerHTML = EscrowSidebarTemplate();
  },

  attachEvents(app, data) {

    document.getElementById('escrow-sidebar-btn')
        .addEventListener('click', (e) => {
          EscrowGameWizard.render(app, data);
          EscrowGameWizard.attachEvents(app, data);
    });

  }

}
