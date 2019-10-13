import { ArcadeListTemplate } from './arcade-list.template.js';
import { ArcadeAdd } from '../arcade-add/arcade-add.js';
import { ArcadeListRowTemplate } from './arcade-list-row.template.js';

export const ArcadeList = {
  render(mod) {
    document.querySelector('.main').innerHTML = ArcadeListTemplate();

    mod.arcade.games.forEach(row => {
      let {game, player} = row;
      document.querySelector('.games-table').innerHTML += ArcadeListRowTemplate(game, player, 'accept');
    });

    this.attachEvents(mod);
  },

  attachEvents(mod) {
    document.querySelector('#arcade.create-button')
            .addEventListener('click', (e) => {
                ArcadeAdd.render(mod);
            });
  },
}