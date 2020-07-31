
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
menuItems() {
  return {
    'game.sectors': {
      name: 'Systems',
      callback: this.handleSystemsMenuItem.bind(this)
    },
    'game-player': {
      name: 'Laws',
      callback: this.handleLawsMenuItem.bind(this)
    },
    'game-tech': {
      name: 'Tech',
      callback: this.handleTechMenuItem.bind(this)
    },
    'game-strategy': {
      name: 'Strat',
      callback: this.handleStrategyMenuItem.bind(this)
    },
    'game-objectives': {
      name: 'VP',
      callback: this.handleObjectivesMenuItem.bind(this)
    },
    'board-info': {
      name: 'Info',
      callback: this.handleInfoMenuItem.bind(this)
    },
  }
}


hideOverlays() {
  document.querySelectorAll('.overlay').forEach(el => {
    el.classList.add('hidden');
  });
}

handleTechMenuItem() {
  this.hideOverlays();
  $('.tech_overlay').removeClass("hidden");
}

handleStrategyMenuItem() {
  this.hideOverlays();
  $('.strategy_overlay').html(this.returnStrategyOverlay());
  $('.strategy_overlay').removeClass("hidden");
}

handleObjectivesMenuItem() {
  this.hideOverlays();
  $('.objectives_overlay').html(this.returnObjectivesOverlay());
  $('.objectives_overlay').removeClass("hidden");
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



handleLawsMenuItem() {

  this.hideOverlays();
  $('.laws_overlay').html(this.returnLawsOverlay());
  $('.laws_overlay').removeClass("hidden");

}

