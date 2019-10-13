import { ArcadeList } from '../arcade-list/arcade-list.js';
import { ArcadeAddTemplate } from './arcade-add.template.js';
import { saito_lib } from '../../../../lib/index';

export const ArcadeAdd = {
    active_game: "",
    render(mod) {
      document.querySelector(".main").innerHTML = ArcadeAddTemplate();
      this.attachEvents(mod);
    },

    attachEvents(mod) {
      Array.from(document.getElementsByClassName('game'))
          .forEach(game => game.addEventListener('click', (e) => {
            let game_id = e.currentTarget.id;
            this.active_game = game_id;
            // let arcade_start_game = document.querySelector('.arcade-start-game');
            let game = mod.app.saito.modules.returnModule(game_id);
            document.getElementById('game-title').innerHTML = game.name;
            document.getElementById('game-description').innerHTML = game.description;
            document.getElementById('game-options').innerHTML = game.returnGameOptionsHTML();

            // show our game options
            document.querySelector('.arcade-start-game').style.display = 'grid';
          })
      );
      document.getElementById('submit-game').addEventListener('click', () => {
        this.submitOpenGame(mod);
      });
    },

    submitOpenGame(mod) {
      // let { game, state, options, ts, sig, validfor, gameid } = tx.returnMessage();
      let publickey = mod.app.saito.network.peers[0].peer.publickey;
      let game_module = mod.app.saito.modules.returnModule(this.active_game);

      let newtx = mod.app.saito.wallet.createUnsignedTransactionWithDefaultFee(publickey, 0.0);

      // need to get values from form
      let options    = {};

      newtx.transaction.to.push(new saito_lib.slip(mod.app.saito.wallet.returnPublicKey(), 0.0));
      newtx.transaction.msg.module   = "Arcade";
      newtx.transaction.msg.request  = "creategame";
      newtx.transaction.msg.game     = this.active_game;
      newtx.transaction.msg.state    = "open";
      newtx.transaction.msg.options  = game_module.returnQuickLinkGameOptions(options);
      newtx.transaction.msg.ts       = new Date().getTime();
      newtx.transaction.msg.sig      = mod.app.saito.wallet.signMessage(newtx.transaction.msg.ts.toString(), mod.app.saito.wallet.returnPrivateKey());

      newtx = mod.app.saito.wallet.signTransaction(newtx);
      mod.app.saito.network.propagateTransaction(newtx);

      alert("Your game has been submitted!");

      ArcadeList.render(mod);
    }
}