const AlauniusBarsMenuTemplate = require('../../../alaunius-sidebar/alaunius-bars-menu.template');
const AlauniusInboxHeaderTemplate = require('./alaunius-inbox-header.template');

module.exports = AlauniusInboxHeader = {

  render(app, data) {
    document.querySelector('.alaunius-header').innerHTML = AlauniusInboxHeaderTemplate(app, data);
  },

  attachEvents(app, data) {

    document.getElementById('alaunius-select-icon')
            .addEventListener('click', (e) => {
              Array.from(document.getElementsByClassName('alaunius-selected')).forEach(checkbox => {
                checkbox.checked = e.currentTarget.checked;
              });
            });

    document.getElementById('alaunius-delete-icon')
            .addEventListener('click', (e) => {
              let alaunius_list = document.querySelector('.alaunius-list');
              Array.from(document.getElementsByClassName('alaunius-message')).forEach(mail => {
                let is_checked = mail.children[0].checked;

                // remove from DOM
                if (is_checked) {
                  alaunius_list.removeChild(mail);
                  //
                  // tell our parentmod to purge this transaction
                  //
                  let mysig = mail.id;
                  for (let i = 0; i < data.parentmod.alaunius[data.parentmod.alaunius.active].length; i++) {
                    let mytx = data.parentmod.alaunius[data.parentmod.alaunius.active][i];
                    if (mytx.transaction.sig == mysig) {
                      data.parentmod.deleteTransaction(mytx);
                    }
                  }
                }

              });
            });

    document.getElementById('alaunius-bars-icon')
            .addEventListener('click', (e) => {
                let alaunius_bars_menu = document.querySelector('#mobile.alaunius-bars-menu');
                if (alaunius_bars_menu != null) {
                    alaunius_bars_menu.style.display = alaunius_bars_menu.style.display == "block" ? "none" : "block";
                } else {
                    alaunius_bars_menu = document.createElement('DIV');
                    alaunius_bars_menu.classList.add('alaunius-bars-menu');
                    alaunius_bars_menu.id = "mobile"
                    alaunius_bars_menu.style.display = "block";
                    alaunius_bars_menu.innerHTML = AlauniusBarsMenuTemplate();
                    for (let i = 0; i < data.mods.length; i++) {
                        let mobile_alaunius_apps = alaunius_bars_menu.querySelector(".alaunius-apps")
                        mobile_alaunius_apps.innerHTML
                            += `<li class="alaunius-apps-item" id="${i}">${data.mods[i].name}</li>`;
                    }
                    document.querySelector('body').append(alaunius_bars_menu);
                    AlauniusBarsMenu.attachEvents(app, data);
                    // extend functionatliy for mobile menu

                    alaunius_bars_menu.addEventListener('click', () => {
                        alaunius_bars_menu.style.display = "none";
                    });

                    window.addEventListener('click', (e) => {
                        if (e.target.id !== "alaunius-bars-icon") {
                            alaunius_bars_menu.style.display = "none";
                        }
                    });

                }
            });
  },
}
