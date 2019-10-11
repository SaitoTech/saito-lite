import { ArcadeListTemplate ***REMOVED*** from './arcade-list.template.js';
import { ArcadeAdd ***REMOVED*** from '../arcade-add/arcade-add.js';
import { ArcadeListRowTemplate ***REMOVED*** from './arcade-list-row.template.js';

export const ArcadeList = {
  render(mod) {
    document.querySelector('.main').innerHTML = ArcadeListTemplate();

    mod.arcade.games.forEach(row => {
      let {game, player***REMOVED*** = row;
      document.querySelector('.games-table').innerHTML += ArcadeListRowTemplate(game, player, 'accept');
***REMOVED***);

    this.attachEvents(mod);
  ***REMOVED***,

  attachEvents(mod) {
    document.querySelector('#arcade.create-button')
            .addEventListener('click', (e) => {
                ArcadeAdd.render(mod);
        ***REMOVED***);
  ***REMOVED***,
***REMOVED***