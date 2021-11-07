const GameCardfanTemplate = require('./game-cardfan.template');
const dragElement = require('../../../helpers/drag_element');

class GameCardfan {

    constructor(app, dimensions) {
      this.app = app;
      this.dimensions = dimensions;
    }

    render(app, data, cards_html="") {

      try {

        if (!document.getElementById('cardfan')) {
          document.body.append(app.browser.htmlToElement(GameCardfanTemplate()));
        }

	if (cards_html == "")  {
          let { cards, hand } = data.game.deck[0];
          let cards_in_hand = hand.map(key => cards[key]);
          cards_html = cards_in_hand
            .map(card => `<img class="card" src="${data.card_img_dir}/${card.name}">`)
            .join('');
	}

        document.getElementById('cardfan').innerHTML = cards_html;
        document.getElementById('cardfan').style.display = "block";

      } catch (err) {
      }

    }

    hide() {
      try {
        document.getElementById('cardfan').style.display = "none";
      } catch (err) {
      }
    }


    prependCard(app, data, cards_html="") {
      document.getElementById('cardfan').innerHTML = cards_html + document.getElementById('cardfan').innerHTML;
    }
    addCard(app, data, cards_html="") {
      document.getElementById('cardfan').innerHTML += cards_html;
    }

    attachEvents(app, data) {
 
      try {
        let cardfan = document.getElementById('cardfan');
        dragElement(cardfan);
//        cardfan.addEventListener('mousedown', () => cardfan.style.width = '100vw');
      } catch (err) {
      }
    }
}

module.exports = GameCardfan


