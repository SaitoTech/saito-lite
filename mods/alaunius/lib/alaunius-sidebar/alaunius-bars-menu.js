const AlauniusBarsMenuTemplate = require('./alaunius-bars-menu.template');

module.exports = AlauniusBarsMenu = {

  render(app, data) {

    document.querySelector('.alaunius-bars-menu').innerHTML = AlauniusBarsMenuTemplate();

    let alaunius_apps = document.querySelector(".alaunius-apps");
    for (let i = 0; i < data.mods.length; i++) {
      if (data.mods[i].respondTo("alaunius-appspace") != null) {
        alaunius_apps.innerHTML += `<li class="alaunius-apps-item" id="${i}">${data.mods[i].name}</li>`;
      }
    }

  },

  attachEvents(app, data) {
    //
    // inbox / sent / trash
    //
    Array.from(document.getElementsByClassName('alaunius-navigator-item'))
      .forEach(item => item.addEventListener('click', (e) => {

        if (e.currentTarget.classList.contains("active-navigator-item")) {
          // user clicks already-active item
        } else {

          Array.from(document.getElementsByClassName('alaunius-navigator-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");

                  if (e.currentTarget.id == "inbox") {
                    data.parentmod.alaunius.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    data.parentmod.alaunius.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    data.parentmod.alaunius.active = "trash";
                  }


                }
              }
          });

          Array.from(document.getElementsByClassName('alaunius-apps-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");

                  if (e.currentTarget.id == "inbox") {
                    data.parentmod.alaunius.active = "inbox";
                  }
                  if (e.currentTarget.id == "sent") {
                    data.parentmod.alaunius.active = "sent";
                  }
                  if (e.currentTarget.id == "trash") {
                    data.parentmod.alaunius.active = "trash";
                  }

                }
              }
          });

          data.parentmod.appspace_mod = null;
          data.parentmod.active = "alaunius_list";
          data.parentmod.header_title = "";

          data.parentmod.main.render(app, data);
          data.parentmod.main.attachEvents(app, data);

        }

    }));


    //
    // apps
    //
    Array.from(document.getElementsByClassName('alaunius-apps-item'))
      .forEach(item => item.addEventListener('click', (e) => {

        if (e.currentTarget.classList.contains("active-navigator-item")) {
          // user clicks already-active item
        } else {

          Array.from(document.getElementsByClassName('alaunius-apps-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");
                }
              }
          });

          Array.from(document.getElementsByClassName('alaunius-navigator-item'))
            .forEach(item2 => {
              if (item2.classList.contains("active-navigator-item")) {
                if (item2 != e.currentTarget) {
                  item2.classList.remove("active-navigator-item");
                  e.currentTarget.classList.add("active-navigator-item");
                }
              }
          });


        data.parentmod.active = "alaunius_appspace";
        data.parentmod.previous_state = "alaunius_list";
        data.parentmod.header_title = "Application";
        data.parentmod.appspace_mod = data.parentmod.mods[e.currentTarget.id];
        data.parentmod.appspace_mod_idx = e.currentTarget.id;

        data.parentmod.main.render(app, data)
        data.parentmod.main.attachEvents(app, data)

      }


    }));
  }
}
