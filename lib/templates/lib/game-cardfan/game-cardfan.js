const GameCardfanTemplate = require('./game-cardfan.template');
const dragElement = require('../../../helpers/drag_element');
const elParser = require('../../../helpers/el_parser');

class GameCardfan {

    constructor(app, dimensions) {
      this.app = app;
      this.dimensions = dimensions;
    }

    render(app, data) {
      // let card_html = data.cards.map(card => {
      //   return `<img class="card" src="/poker/img/cards/${card.name}.png />`
      // }).join('');

      // for (let i = 0; i < this.game.deck[0].hand.length; i++) {
      //   let card = this.game.deck[0].cards[this.game.deck[0].hand[i]];
      //   let card_img = card.name + ".png";
      //   let html = '<img class="card" src="/poker/img/cards/'+card_img+'" />';
      //   $('#hand').append(html);
      // }

      if (!document.getElementById('cardfan')) {
        document.body.innerHTML += GameCardfanTemplate();
      }

      let { cards, hand } = data.game.deck[0];
      let cards_in_hand = hand.map(key => cards[key]);

      let cards_html = cards_in_hand
        .map(card => `<img class="card" src="${data.card_img_dir}/${card.name}">`)
        .join('');

      document.getElementById('cardfan').innerHTML = cards_html;
    }

    attachEvents(app, data) {
      let cardfan = document.getElementById('cardfan');
      dragElement(cardfan);
    }

}

module.exports = GameCardfan


