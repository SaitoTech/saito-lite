  
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
      'game-systems': {
        name: 'Systems',
        callback: this.handleSystemsMenuItem.bind(this)
      },
      'game-planets': {
        name: 'Planets',
        callback: this.handlePlanetsMenuItem.bind(this)
      },
      'game-tech': {
        name: 'Tech',
        callback: this.handleTechMenuItem.bind(this)
      },
      'game-player': {
        name: 'Trade',
        callback: this.handleTradeMenuItem.bind(this)
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

    if (this.activated_systems_player >= this.game.players_info.length) { this.activated_systems_player = 0; }

    let html = `Showing Systems Activated by ${factions[this.game.players_info[this.activated_systems_player].faction].name}`;
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  

    $('.hex_activated').css('background-color', 'transparent');
    $('.hex_activated').css('opacity', '0.3');

    for (var i in this.game.board) {
      if (this.game.systems[ this.game.board[i].tile ].activated[this.activated_systems_player] == 1) {
	let divpid = "#hex_activated_"+i;
        $(divpid).css('background-color', 'yellow');
        $(divpid).css('opacity', '0.3');
      }
    }
  }
  
  


  handlePlanetsMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Planetary Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.option').on('click', function() {
  
      let player_action = $(this).attr("id");
      let array_of_cards = imperium_self.returnPlayerPlanetCards(player_action+1); // all
  
      let html  = "<ul>";
      for (let z = 0; z < array_of_cards.length; z++) {
        if (imperium_self.game.planets[array_of_cards[z]].exhausted == 1) {
          html += '<li class="cardchoice exhausted" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
        } else {
          html += '<li class="cardchoice" id="cardchoice_'+array_of_cards[z]+'">' + imperium_self.returnPlanetCard(array_of_cards[z]) + '</li>';
        }
      }
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
      $('.hud-menu-overlay').show();
  
    });
  }
  
  


 
  handleTechMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Technological Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
    html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.option').on('click', function() {
  
      let p = $(this).attr("id");
      let tech = imperium_self.game.players_info[p].tech;
  
      let html  = "<ul>";
      for (let z = 0; z < tech.length; z++) {
        html += '<li class="cardchoice" id="">' + tech[z] + '</li>';
      }
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
  
    });
  }
  




  
  handleTradeMenuItem() {
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html =
    `
      <div id="menu-container">
        <div style="margin-bottom: 1em">
          The Commercial Empires:
        </div>
        <ul>
     `;
    for (let i = 0; i < this.game.players_info.length; i++) {
    html += `  <li class="option" id="${i}">${factions[this.game.players_info[i].faction].name}</li>`;
    }
    html += `
        </ul>
      </div>
    `
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
    //
    // leave action enabled on other panels
    //
    $('.card').on('click', function() {
  
      let p = $(this).attr("id");
      let commodities_total = imperium_self.game.players_info[p].commodities;
      let goods_total = imperium_self.game.players_info[p].goods;
      let fleet_total = imperium_self.game.players_info[p].fleet_supply;
      let command_total = imperium_self.game.players_info[p].command_tokens;
      let strategy_total = imperium_self.game.players_info[p].strategy_tokens;
  
      let html  = "Total Faction Resources: <p></p><ul>";
      html += '<li>' + commodities_total + " commodities" + '</li>';
      html += '<li>' + goods_total + " goods" + '</li>'
      html += '<li>' + command_total + " command tokens" + '</li>'
      html += '<li>' + strategy_total + " strategy tokens" + '</li>'
      html += '<li>' + fleet_total + " fleet supply" + '</li>'
      html += '</ul>';
  
      $('.hud-menu-overlay').html(html);
  
    });
  }




  handleLawsMenuItem() {
  
    let imperium_self = this;
    let laws = this.returnAgendaCards();
    let html = '<div id="menu-container">';
  
    if (this.game.state.laws.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Enforcement:</div>';
      html += '<ul>';
      for (let i = 0; i < this.game.state.laws.length; i++) {
        html += `  <li class="card" id="${i}">${laws[this.game.state.laws[i]].name}</li>`;
      }
      html += '</ul>';
      html += '<p></p>';
    }
  
    if (this.game.state.agendas.length > 0) {
      html += '<div style="margin-bottom: 1em">Galactic Laws Under Consideration:</div>';
      html += '<ul>';
      for (let i = 0; i < this.game.state.agendas.length; i++) {
        html += `  <li class="card options" id="${i}">${laws[this.game.state.agendas[i]].name}</li>`;
      }
      html += '</ul>';
    }
  
    if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += 'There are no laws in force or agendas up for consideration at this time.';
    }
  
    html += '</div>';
  
    $('.hud-menu-overlay').html(html);
    $('.hud-menu-overlay').show();
    $('.status').hide();
  
  }
  

