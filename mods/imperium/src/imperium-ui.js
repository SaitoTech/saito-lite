
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
  this.overlay.showOverlay(this.app, this, this.returnStrategyOverlay());
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




