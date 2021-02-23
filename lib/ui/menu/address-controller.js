// const elParser = require('../../helpers/el_parser');
// const AddressMenuTemplate = require('./address-menu.template');
// DEPRECATED
// class AddressController {
//   /**
//    * Mods pass in a menu_map that defines both the string (html?)
//    * to use to extend the menu, plus a function to bind to the click event
//    *
//    * menu_map = {
//    *  'Send Email': function(app, data) {
//    *     data.email.active = 'email_compose';
//    *     data.email.main.render(app, data);
//    *   }
//    * }
//    *
//    */
// 
//   /**
//    * Responsible functionality
//    *
//    * 1. Rendering menu
//    * 2. Helper functions to Wrap publickeys or identifiers with events on click
//    * 3. Passing functions from modules and binding them to menu
//    *
//    */
// 
//   constructor(app, menu_item_fn_map) {
//     this.app = app;
//     // this.uidata = uidata;
// 
//     // default items that we include
//     this.menu_item_fn_map = Object.assign(
//       this.defaultFunctionMap(), menu_item_fn_map
//     );
//   }
// 
//   /**
//    * This is the function map structure for Address Menu
//    *
//    * Other modules can include their own items by passing them
//    * as a param in the constructor
//    */
//   defaultFunctionMap() {
//     return {
//       'add-contact': {
//         name: 'Add Contact',
//         callback: this.addContact.bind(this)
//       },
//       'block-contact': {
//         name: 'Block Contact',
//         callback: this.blockContact.bind(this)
//       }
//     }
//   }
// 
//   addContact(address) {
//     let encrypt_mod = this.app.modules.returnModule('Encrypt');
//     encrypt_mod.initiate_key_exchange([address]);
//     alert("Exchanging Keys with Address, please wait a moment");
//   }
// 
//   blockContact(address) {
//     alert("BLOCKING CONTACT");
//   }
// 
//   // pass coords to know where to put menu
//   renderMenu(coords) {
//     document.querySelector('body').append(elParser(AddressMenuTemplate(this.menu_item_fn_map, coords)));
//     this.attachMenuEvents();
//   }
// 
//   detachMenu() {
//     let address_menu = document.getElementById('address-menu');
//     if (address_menu) {
//       document.querySelector('body').removeChild(address_menu);
//     }
//     // this.attachMenuEvents();
//   }
// 
// 
//   attachEvents() {
//     Array.from(document.getElementsByClassName('saito-address')).forEach(address => {
//       var delay;
// 
//       let startTimer = (fn) => delay = setTimeout(fn, 500);
//       let stopTimer = () => clearTimeout(delay);
// 
//       // return the coordinates of the element on the page
//       let showAddressMenu = () => {
//         this.detachMenu();
//         this.selected_address = address.textContent;
//         this.renderMenu(address.getBoundingClientRect());
//       };
// 
//       // address.onclick = (e) => {
//       //   e.stopPropagation();
//       //   showAddressMenu();
//       // };
// 
//       address.onmouseover = () => startTimer(showAddressMenu);
//       address.onmouseout = () => stopTimer();
//     });
//   }
// 
//   attachMenuEvents() {
//     let address_menu = document.getElementById('address-menu');
//     if (address_menu) {
//       address_menu.onmouseover = (e) => {};
//       address_menu.onmouseleave = (e) => this.detachMenu();
//     }
// 
//     Object.entries(this.menu_item_fn_map).forEach(([key, value]) =>{
//       document.getElementById(key).onclick = (e) => {
//         value.callback(this.selected_address);
//         this.detachMenu();
//       };
//     });
//   }
// 
//   //
//   // TODO: NEED A BETTER FUNCTION
//   async returnPublicKey(addr_input) {
//     if (this.app.crypto.isPublicKey(addr_input)) { return addr_input }
//     try {
//       var resp = await this.app.keys.fetchPublicKeyPromise(addr_input);
//     } catch(err) {
//       console.error(err);
//     }
//     if (resp.rows) {
//       let record = resp.rows[0];
//       return record.publickey ? record.publickey : record;
//     }
//     return null
//   }
// 
//   async returnIdentifier(addr_input) {
//     if (this.app.crypto.isPublicKey(addr_input)) {
//       let identifier = this.app.keys.returnIdentifierByPublicKey(addr_input);
//       return identifier ? identifier : await this.app.keys.fetchIdentifierPromise(addr_input);
//     }
//   }
// 
//   /**
//    * Fetchs identifiers from a set of keys
//    *
//    * @param {Array} keys
//    */
//   async fetchIdentifiers(keys=[]) {
//     try {
//       let answer = await this.app.keys.fetchManyIdentifiersPromise(keys);
//       Object.entries(answer)
//           .forEach(([key, value]) => this.updateAddressHTML(key, value));
//     } catch(err) {
//       console.error(err);
//     }
//   }
// 
//   /**
//    * Can be kicked to helper function
//    * */
//   returnAddressHTML(key) {
//     let identifier = this.app.keys.returnIdentifierByPublicKey(key);
//     let id = !identifier ? key : identifier
//     return `<span class="saito-address saito-address-${key}">${id}</span>`
//   }
// 
//   async returnAddressHTMLPromise(key) {
//     let identifier = await this.returnIdentifier(key);
//     let id = !identifier ? key : identifier
//     return `<span class="saito-address saito-address-${key}">${id}</span>`
//   }
// 
//   updateAddressHTML(key, id) {
//     if (!id) { return; }
//     try {
//       let addresses = document.getElementsByClassName(`saito-address-${key}`);
//       Array.from(addresses).forEach(add => add.innerHTML = id);
//     } catch (err) {}
//   }
// }
// 
// module.exports = AddressController;
