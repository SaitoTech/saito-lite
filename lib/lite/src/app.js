// import ArcadeUI from '../../../mods/arcade/web/arcade-ui';
import ChatUI from '../../../mods/chat/lib/ui/chat-ui';
// import EmailUI from '../../../mods/email/web/email-ui';
// import ForumUI from '../../../mods/forum/web/forum-ui';
// import WalletUI from '../../../mods/wallet/web/wallet-ui';

// Not a real module
// import SettingsUI from './settings/settings-ui';

import { HomeHeader } from '../../../mods/web-components/header/home-header.js';
import { NavBar } from '../../../mods/web-components/footer/navbar.js';

export default class App {
    constructor() {}

    init(saito) {
        this.saito = saito;

        this.chat = new ChatUI(this);
        // this.arcade = new ArcadeUI(this);
        // this.forum = new ForumUI(this);
        // this.wallet = new WalletUI(this);
        // this.email = new EmailUI(this);
        // this.settings = new SettingsUI(this);

        this.initMods();

        this.initServiceWorker();
        this.initHeader();
        this.initFooter();

        // Faucet testing
        this.getTokens();
    }

    initMods() {
        // this.forum.initialize();
        // this.arcade.initialize();
    }

    initServiceWorker() {
        if (!navigator.serviceWorker) {
            return;
        }
        navigator.serviceWorker
            .register('./sw.js')
            .then(() => {
                console.log('sw registered successfully!');
            })
            .catch((error) => {
                console.log('Some error while registering sw:', error);
            });
    }

    initHeader() {
        HomeHeader.render(this);
    }

    initFooter() {
        NavBar.render(this);
        NavBar.renderScreen(this, "chat");
        NavBar.updateNavBarButton("chat");
    }

    getTokens() {
        let msg = {};
        msg.data = {address: this.saito.wallet.returnPublicKey()};
        msg.request = 'get tokens';

        setTimeout(() => {
            this.saito.network.sendRequest(msg.request, msg.data);
        }, 1000);
    }

    // getArcadeGames() {
    // }

}
