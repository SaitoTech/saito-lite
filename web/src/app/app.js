import Arcade from './arcade/arcade';
import Chat from './chat/chat';
import Forum from './forum/forum';
import Wallet from './wallet/wallet';
import Email from './email/email';
import Settings from './settings/settings';

import { HomeHeader ***REMOVED*** from './components/header/home-header.js';
import { NavBar ***REMOVED*** from './components/navbar/navbar.js';

export default class App {
    constructor() {***REMOVED***

    init(saito) {
        this.saito = saito;

        this.chat = new Chat(this);
        this.arcade = new Arcade(this);
        this.forum = new Forum(this);
        this.wallet = new Wallet(this);
        this.email = new Email(this);
        this.settings = new Settings(this);

        this.initMods();

        this.initServiceWorker();
        this.initHeader();
        this.initFooter();

***REMOVED*** Faucet testing
        this.getTokens();
***REMOVED***

    initMods() {
        this.forum.initialize();
        this.arcade.initialize();
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
