import { ArcadeList ***REMOVED*** from './arcade-list/arcade-list.js';
import { ArcadeListRowTemplate ***REMOVED*** from './arcade-list/arcade-list-row.template.js';

export default class ArcadeUI {
***REMOVED***
        this.app = app;
        this.arcade = app.saito.modules.returnModule("Arcade");
        this.bindDOMFunctionsToModule();

        return this;
***REMOVED***

    initialize() {
        let msg = {***REMOVED***;
        msg.data = {***REMOVED***;
        msg.request = 'arcade request games';

        setTimeout(() => {
            this.app.saito.network.sendRequest(msg.request, msg.data);
    ***REMOVED***, 1000);
***REMOVED***

    render() {
        ArcadeList.render(this);
***REMOVED***

    bindDOMFunctionsToModule() {
        this.arcade.addRowToGameTable = this.addRowToGameTable.bind(this.arcade);
***REMOVED***

    addRowToGameTable(row) {
        let { game, player ***REMOVED*** = row;
        let arcade_row = ArcadeListRowTemplate(game, player, 'accept');
        document.querySelector('.games-table').innerHTML += arcade_row;
***REMOVED***
***REMOVED***
