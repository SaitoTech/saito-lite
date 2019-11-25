//const sitepages = require("../../web/pages")
const WebsiteHeaderMenuTemplate = require('./website-header-menu.template')

module.exports = HeaderMenu = {
    render(app) {
        let header_menu = document.querySelector("#header-menu");
        header_menu.innerHTML = WebsiteHeaderMenuTemplate();
***REMOVED***
***REMOVED***;
