const RewardsSidebarTemplate = require('./arcade-right-sidebar.template');
const RewardsSidebarRow = require('./arcade-sidebar-row.template')

module.exports = RewardsSidebar = {
  render(app, data) {
    document.querySelector(".arcade-sidebar-notices").innerHTML = RewardsSidebarTemplate(app);

    app.network.sendRequestWithCallback("get achievements", app.wallet.returnPublicKey(), (rows) => {
      document.querySelector(".arcade-sidebar-done").innerHTML = "";
      if (typeof rows.forEach == "undefined") { return }
      rows.forEach(row => {
        if (typeof (row.label) != "undefined" || typeof (row.icon) != "undefined") {
          document.querySelector(".arcade-sidebar-done").innerHTML += RewardsSidebarRow(row.label, row.icon, row.count);
        }
      });
    });

    app.modules.returnActiveModule().sendPeerRequestWithServiceFilter(
      "registry",
      {
        request: "get achievements",
        data: app.wallet.returnPublicKey()
      },
      (rows) => {
        document.querySelector(".arcade-sidebar-done").innerHTML = "";
        rows.forEach(row => {
          if (typeof (row.label) != "undefined" || typeof (row.icon) != "undefined") {
            document.querySelector(".arcade-sidebar-done").innerHTML += RewardsSidebarRow(row.label, row.icon, row.count);
          }
        });
      }
    );

    // app.modules.returnActiveModule().sendPeerRequestWithFilter(
    //   () => {
    //     let msg = {};
    //     msg.request = "get achievements";
    //     msg.data = app.wallet.returnPublicKey();
    //     return msg;
    //   },
    //   (rows) => {
    //     document.querySelector(".arcade-sidebar-done").innerHTML = "";
    //     rows.forEach(row => {
    //       if (typeof (row.label) != "undefined" || typeof (row.icon) != "undefined") {
    //         document.querySelector(".arcade-sidebar-done").innerHTML += RewardsSidebarRow(row.label, row.icon, row.count);
    //       }
    //     });
    //   },
    //   (peer) => {
    //     if (peer.peer.services) {
    //       for (let z = 0; z < peer.peer.services.length; z++) {
    //         if (peer.peer.services[z].service === "registry") {
    //           return 1;
    //         }
    //       }
    //     }
    //   });


  },

  attachEvents(app, data) { },
}

