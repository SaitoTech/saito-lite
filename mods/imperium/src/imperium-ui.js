
//
// manually add arcade banner support
//
respondTo(type) {

  if (super.respondTo(type) != null) {
    return super.respondTo(type);
  }

  if (type == "arcade-carousel") {
    let obj = {};
    obj.background = "/imperium/img/arcade/arcade-banner-background.png";
    obj.title = "Red Imperium";
    return obj;
  }

  return null;

}




/////////////////
/// HUD MENUS ///
/////////////////
hideOverlays() {
  document.querySelectorAll('.overlay').forEach(el => {
    el.classList.add('hidden');
  });
}

handleMovementMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnMovementOverlay());
}
handleCombatMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnCombatOverlay());
}
handleFactionMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnFactionOverlay());
}
handleHowToPlayMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnHowToPlayOverlay());
}
handleHowToPlayMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnHowToPlayOverlay());
}
handleTechMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnTechOverlay());
}

handleAgendasMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnAgendasOverlay());
}
handleLawsMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnLawsOverlay());
}
handleUnitsMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnUnitsOverlay());
  let imperium_self = this;
  $('#close-units-btn').on('click', function() {
    imperium_self.overlay.hideOverlay();
  });
}
handleStrategyMenuItem() {

  //
  // show overlay
  //
  this.overlay.showCardSelectionOverlay(this.app, this, this.returnStrategyCards(), {
    columns : 4 ,
    backgroundImage : "/imperium/img/starscape_background3.jpg" ,
  }, function() {
    alert("cardlist close strategy init menu");
  });

  //
  // add player, state and bonus
  //
  for (let s in this.strategy_cards) {

    let strategy_card_state = "not picked";
    let strategy_card_player = -1;
    let strategy_card_bonus = 0;

    for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
      if (s === this.game.state.strategy_cards[i]) {
        strategy_card_bonus = this.game.state.strategy_cards_bonus[i];
      }
    }

    let strategy_card_bonus_html = "";
    if (strategy_card_bonus > 0) {
      strategy_card_bonus_html =
      `<div class="strategy_card_bonus">
        <i class="fas fa-database white-stroke"></i>
        <span>${strategy_card_bonus}</span>
      </div>`;
      this.app.browser.addElementToDom(strategy_card_bonus_html, s);
    }

    let thiscard = this.strategy_cards[s];
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.players_info[i].strategy.includes(s)) {
        strategy_card_state = "unplayed";
        strategy_card_player = (i+1);
        if (this.game.players_info[i].strategy_cards_played.includes(s)) {
          strategy_card_state = "played";
        };
      };
    }

    card_html = '';
    if (strategy_card_state != "not picked") {
      card_html += `
        <div class="strategy_card_state p${strategy_card_player}">
          <div class="strategy_card_state_internal bk">${strategy_card_state}</div>
        </div>
     `;
    }

    this.app.browser.addElementToDom(card_html, s);   

  }
}

handleObjectivesMenuItem() {
  this.overlay.showOverlay(this.app, this, this.returnObjectivesOverlay());
}

handleInfoMenuItem() {
  if (document.querySelector('.gameboard').classList.contains('bi')) {
    for (let i in this.game.sectors) {
      this.removeSectorHighlight(i);
      document.querySelector('.gameboard').classList.remove('bi');
    }
  } else {
    for (let i in this.game.sectors) {
      this.addSectorHighlight(i);
      document.querySelector('.gameboard').classList.add('bi');
    }
  }
}



handleSystemsMenuItem() {

  let imperium_self = this;
  let factions = this.returnFactions();

  this.activated_systems_player++;

  if (this.activated_systems_player > this.game.players_info.length) { this.activated_systems_player = 1; }

  salert(`Showing Systems Activated by ${factions[this.game.players_info[this.activated_systems_player - 1].faction].name}`);

  $('.hex_activated').css('background-color', 'transparent');
  $('.hex_activated').css('opacity', '0.3');

  for (var i in this.game.board) {
    if (this.game.sectors[this.game.board[i].tile].activated[this.activated_systems_player - 1] == 1) {
      let divpid = "#hex_activated_" + i;
      $(divpid).css('background-color', 'var(--p' + this.activated_systems_player + ')');
      $(divpid).css('opacity', '0.3');
    }
  }
}




