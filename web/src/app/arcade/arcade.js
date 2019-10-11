import { ArcadeList } from './arcade-list/arcade-list.js';
import { ArcadeListRowTemplate } from './arcade-list/arcade-list-row.template.js';

export default class Arcade {
    constructor(app) {
        this.app = app;
        this.arcade = app.saito.modules.returnModule("Arcade");
        this.bindDOMFunctionsToModule();

        return this;
    }

    initialize() {
        let msg = {};
        msg.data = {};
        msg.request = 'arcade request games';

        setTimeout(() => {
            this.app.saito.network.sendRequest(msg.request, msg.data);
        }, 1000);
    }

    render() {
        ArcadeList.render(this);
    }

    bindDOMFunctionsToModule() {
        this.arcade.addRowToGameTable = this.addRowToGameTable.bind(this.arcade);
    }

    addRowToGameTable(row) {
        let { game, player } = row;
        let arcade_row = ArcadeListRowTemplate(game, player, 'accept');
        document.querySelector('.games-table').innerHTML += arcade_row;
    }
}
