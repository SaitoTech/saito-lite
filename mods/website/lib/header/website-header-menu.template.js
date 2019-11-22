

module.exports = WebsiteHeaderMenuTemplate = () => {
    var sitepages = {
        "Applications": "./applications",
        "Tech": "./tech",
        "FAQ": "./FAQ",
        "Developers": "https://github.com/saitotech/saito-lite",
        "News": "https://org.saito.tech"
***REMOVED***;

    console.log(sitepages);

    var html = "";

    for (var key in sitepages) {
        html += '<a class="site-header-menu-item" href="';
        html += sitepages[key];
        html += '">';
        html += key;
        html += '</a>'
***REMOVED***

    return html;

***REMOVED***