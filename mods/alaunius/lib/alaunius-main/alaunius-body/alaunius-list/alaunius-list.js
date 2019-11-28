const AlauniusDetail       = require('../alaunius-detail/alaunius-detail');
const AlauniusHeader       = require('../../alaunius-header/alaunius-header');
const AlauniusListTemplate = require('./alaunius-list.template.js');
const AlauniusListRowTemplate = require('./alaunius-list-row.template.js');

module.exports = AlauniusList = {

    render(app, data) {

      document.querySelector('.alaunius-body').innerHTML = AlauniusListTemplate();

      data.parentmod.alaunius[data.parentmod.alaunius.active].forEach(tx => {
        document.querySelector('.alaunius-list').innerHTML +=
            AlauniusListRowTemplate(tx, data.parentmod.addrController.returnAddressHTML(tx.transaction.from[0].add));
      });

    },

    attachEvents(app, data) {

        data.parentmod.addrController.attachEvents();

        Array.from(document.getElementsByClassName('alaunius-message')).forEach(message => {
            message.onclick = (e) => {
                if (e.srcElement.nodeName == "INPUT") { return; }

                let sig = e.currentTarget.id;
                let selected_alaunius = data.parentmod.alaunius[data.parentmod.alaunius.active].filter(tx => {
                    return tx.transaction.sig === sig
                });

                data.parentmod.selected_alaunius = selected_alaunius[0];
                data.parentmod.header_title = data.parentmod.selected_alaunius.transaction.msg.title;

                data.parentmod.active = "alaunius_detail";

                data.parentmod.main.render(app, data);
                data.parentmod.main.attachEvents(app, data);

            };
        });

    }
}

