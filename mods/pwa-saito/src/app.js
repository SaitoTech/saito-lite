// import ArcadeUI from '../../../mods/arcade/web/arcade-ui';
import ChatUI from '../chat-ui/chat-ui';
// import EmailUI from '../../../mods/email/web/email-ui';
// import ForumUI from '../../../mods/forum/web/forum-ui';
// import WalletUI from '../../../mods/wallet/web/wallet-ui';

// Not a real module
// import SettingsUI from './settings/settings-ui';

import { HomeHeader ***REMOVED*** from '../components/header/home-header.js/index.js';
import { NavBar ***REMOVED*** from '../components/footer/navbar.js/index.js';

export default class App {
    constructor() {***REMOVED***

    init(saito) {
        this.saito = saito;

        this.chat = new ChatUI(this);

        this.initMods();

        this.initServiceWorker();
        this.initHeader();
        this.initFooter();

***REMOVED*** Faucet testing
        this.getTokens();
***REMOVED***

    initMods() {
***REMOVED*** this.forum.initialize();
***REMOVED*** this.arcade.initialize();
***REMOVED***

    initServiceWorker() {
        if (!navigator.serviceWorker) {
            return;
    ***REMOVED***
        navigator.serviceWorker
            .register('./sw.js')
            .then(() => {
                console.log('sw registered successfully!');
        ***REMOVED***)
            .catch((error) => {
                console.log('Some error while registering sw:', error);
        ***REMOVED***);
***REMOVED***

    initHeader() {
        HomeHeader.render(this);
***REMOVED***

    initFooter() {
        NavBar.render(this);
        NavBar.renderScreen(this, "chat");
        NavBar.updateNavBarButton("chat");
***REMOVED***

    getTokens() {
        let msg = {***REMOVED***;
        msg.data = {address: this.saito.wallet.returnPublicKey()***REMOVED***;
        msg.request = 'get tokens';

        setTimeout(() => {
            this.saito.network.sendRequest(msg.request, msg.data);
    ***REMOVED***, 1000);
***REMOVED***

    // getArcadeGames() {
    // ***REMOVED***

***REMOVED***
