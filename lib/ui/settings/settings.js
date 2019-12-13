const SettingsTemplate = require('./settings.template');

module.exports = class Settings {
***REMOVED***
        this.app = app;
***REMOVED***

    render() {
        document.querySelector('.main').innerHTML = SettingsTemplate();
        this.initSettings();
        this.attachEvents(this.app.app);
***REMOVED***

    attachEvents(app) {
        let reset_button = document.querySelector('.settings-reset-button');
        reset_button.addEventListener('click', async () => {
            await app.storage.resetOptions();
            alert('Your options have been reset');
            window.location.reload();
    ***REMOVED***);

        let save_button = document.querySelector('.settings-backup-button');
        save_button.onclick = () => {
            var pom = document.createElement('a');
            pom.setAttribute('type', "hidden");
            pom.setAttribute('href', 'data:application/json;utf-8,' + encodeURIComponent(JSON.stringify(this.app.options)));
            pom.setAttribute('download', "saito.wallet.json");
            document.body.appendChild(pom);
            pom.click();
            pom.remove();
    ***REMOVED***;

        let load_button = document.querySelector('.settings-import-button');
        load_button.addEventListener('click', () => {
            let inputFile = document.getElementById('file-input')
            inputFile.addEventListener('change', function(e) {

                let file = e.target.files[0];
                if (!file) { return; ***REMOVED***
                let reader = new FileReader();

                reader.onload = function(e) {
                  let contents = e.target.result;
                  let tmpoptions = JSON.parse(contents);
                  if (tmpoptions.wallet.publickey != null) {
                    app.options = JSON.parse(contents);
                    app.storage.saveOptions();
                    alert("Wallet Import Successful");
              ***REMOVED*** else {
                    alert("This does not seem to be a valid wallet file");
              ***REMOVED***
            ***REMOVED***;
                reader.readAsText(file);
          ***REMOVED***, false);
            inputFile.click();
    ***REMOVED***);
***REMOVED***

    initSettings() {
        let change_theme_mode = (event) => {
            if (document.querySelector('html').dataset.theme == 'dark') {
                document.querySelector('html').dataset.theme = 'light';
                document.querySelector('#theme-dark').style.display = "none";
                document.querySelector('#theme-light').style.display = "block";
        ***REMOVED*** else {
                document.querySelector('html').dataset.theme = 'dark';
                document.querySelector('#theme-dark').style.display = "block";
                document.querySelector('#theme-light').style.display = "none";
        ***REMOVED***
    ***REMOVED***
        let theme_mode = document.querySelector('#theme-mode');
        theme_mode.addEventListener('click', change_theme_mode);
***REMOVED***
***REMOVED***