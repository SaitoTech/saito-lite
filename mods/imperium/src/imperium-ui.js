  
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
    }
  }


  handleSystemsMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();

    this.activated_systems_player++;

    if (this.activated_systems_player > this.game.players_info.length) { this.activated_systems_player = 1; }

    let html = `Showing Systems Activated by ${factions[this.game.players_info[this.activated_systems_player-1].faction].name}`;
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  

    $('.hex_activated').css('background-color', 'transparent');
    $('.hex_activated').css('opacity', '0.3');

    for (var i in this.game.board) {
      if (this.game.sectors[ this.game.board[i].tile ].activated[this.activated_systems_player-1] == 1) {
	let divpid = "#hex_activated_"+i;
        $(divpid).css('background-color', 'var(--p' + this.activated_systems_player + ')');
        $(divpid).css('opacity', '0.3');
      }
    }
  }
  
  
  
  handleLawsMenuItem() {
  
    let imperium_self = this;
    let laws = this.returnAgendaCards();
    let html = '';  

    if (this.game.state.laws.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Enforcement:</div>';
      html += '<p><ul>';
      for (let i = 0; i < this.game.state.laws.length; i++) {
        html += `  <li class="card option" id="${i}">${laws[this.game.state.laws[i]].name}</li>`;
      }
      html += '</ul>';
      html += '</p>';
    }
  
    if (this.game.state.agendas.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Consideration:</div>';
      html += '<ul>';
      for (let i = 0; i < this.game.state.agendas.length; i++) {
        html += `  <li class="card option" id="${i}">${laws[this.game.state.agendas[i]].name}</li>`;
      }
      html += '</ul>';
    }

    if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += 'There are no laws in force or agendas up for consideration at this time.';
    }
  
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();

    $('.option').off();
    $('.option').on('mouseenter', function() { let s = $(this).attr("id"); imperium_self.showAgendaCard(imperium_self.game.state.agendas[s]); });
    $('.option').on('mouseleave', function() { let s = $(this).attr("id"); imperium_self.hideAgendaCard(imperium_self.game.state.agendas[s]); });
  
  
  }
  

