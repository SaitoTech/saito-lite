  
  canPlayerTrade(player) {
    return 0;
  }
  
  canPlayerPlayStrategyCard(player) {
    for (let i = 0; i < this.game.players_info[player-1].strategy.length; i++) {
      if (!this.game.players_info[player-1].strategy_cards_played.includes(this.game.players_info[player-1].strategy[i])) {
        return 1;
      }
    }
    return 0;
  }
  
  
  canPlayerPass(player) {
    if (this.canPlayerPlayStrategyCard(player) == 1) { return 0; }
    return 1;
  }

  canPlayerPlayActionCard(player) {
    let array_of_cards = this.returnPlayerActionCards(this.game.player);
    if (array_of_cards.length > 0) {
      return 1;
    } 
    return 0;
  }
  



  canPlayerResearchTechnology(tech) {
  
    let mytech = this.game.players_info[this.game.player-1].tech;
    if (mytech.includes(tech)) { return 0; }
  
    let prereqs = JSON.parse(JSON.stringify(this.game.tech[tech].prereqs));
  
    for (let i = 0; i < mytech.length; i++) {
      let color = mytech[i].color;
      for (let j = 0; j < prereqs.length; j++) {
        if (prereqs[j] == color) {
          prereqs.splice(j, 1);
  	  j = prereqs.length;
        }
      }
    }
  
    //
    // we meet the pre-reqs
    //
    if (prereqs.length == 0) {
      if (mytech.faction == "all" || mytech.faction == this.game.players_info[this.game.player-1].faction) {
        return 1;
      }
    }
  
    return 0;
  
  }


  returnAvailableVotes(player) {

    let array_of_cards = this.returnPlayerPlanetCards(player);
    let total_available_votes = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_votes += this.game.planets[array_of_cards[z]].influence;
    }
    return total_available_votes;

  }

  returnAvailableResources(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_resources = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_resources += this.game.planets[array_of_cards[z]].resources;
    }
    total_available_resources += this.game.players_info[player-1].goods;
    return total_available_resources;
  
  }


  returnAvailableInfluence(player) {
  
    let array_of_cards = this.returnPlayerUnexhaustedPlanetCards(player); // unexhausted
    let total_available_influence = 0;
    for (let z = 0; z < array_of_cards.length; z++) {
      total_available_influence += this.game.planets[array_of_cards[z]].influence;
    }
    total_available_influence += this.game.players_info[player-1].goods;
    return total_available_influence;
  
  }
  
  
  canPlayerActivateSystem(pid) {
  
    let imperium_self = this;
    let sys = imperium_self.returnSystemAndPlanets(pid);
    if (sys.s.activated[imperium_self.game.player-1] == 1) { return 0; }
    return 1;
  
  }





  hasUnresolvedSpaceCombat(attacker, sector) {
 
    let sys = this.returnSystemAndPlanets(sector);
 
    let defender = 0;
    let defender_found = 0;
    let attacker_found = 0;


    for (let i = 0; i < sys.s.units.length; i++) {
      if (attacker != (i+1)) {
        if (sys.s.units[i].length > 0) {
          defender = (i+1);
          defender_found = 1;
        }
      } else {
        if (sys.s.units[i].length > 0) {
	  attacker_found = 1;
	}
      }
    }

console.log("defender_found ---> " + defender_found); 
console.log("attacker_found ---> " + attacker_found); 

    if (defender_found == 0) {
      return 0;
    }
    if (defender_found == 1 && attacker_found == 1) { 
      return 1;
    }

    return 0;

  }



  hasUnresolvedGroundCombat(attacker, sector, pid) {

    let sys = this.returnSystemAndPlanets(sector);
    let defender = sys.p[pid].owner;   

    if (defender == attacker) { return 0; }
 
    attacker_forces = this.returnNumberOfGroundForcesOnPlanet(attacker, sector, pid);
    defender_forces = this.returnNumberOfGroundForcesOnPlanet(defender, sector, pid);

    if (attacker_forces > 0 && defender_forces > 0) { return 1; }
    return 0;

  }


  
  isPlanetExhausted(planetname) {
    if (this.game.planets[planetname].exhausted == 1) { return 1; }
    return 0;
  }
  
  


  canPlayerProduceInSector(player, sector) {
    let sys = this.returnSystemAndPlanets(sector);
    for (let i = 0; i < sys.p.length; i++) {
      for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
        if (sys.p[i].units[player-1][k].name == "spacedock") {
          return 1;
        }
      }
    }
    return 0;
  }



  canPlayerInvadePlanet(player, sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
    let space_transport_available = 0;
    let planets_ripe_for_plucking = 0;
    let total_available_infantry = 0;
    let can_invade = 0;
  
    //
    // any planets available to invade?
    //
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].owner != player) { planets_ripe_for_plucking = 1; }
    }
    if (planets_ripe_for_plucking == 0) { return 0; }
  
  
    //
    // do we have any infantry for an invasion
    //
    for (let i = 0; i < sys.s.units[player-1].length; i++) {
      let unit = sys.s.units[player-1][i];
      for (let k = 0; k < unit.storage.length; k++) {
        if (unit.storage[k].name == "infantry") {
          total_available_infantry += 1;
        }
      }
      if (unit.capacity > 0) { space_tranport_available = 1; }
    }
  
    //
    // return yes if troops in space
    //
    if (total_available_infantry > 0) {
      return 1;
    }
  
    //
    // otherwise see if we can transfer over from another planet in the sector
    //
    if (space_transport_available == 1) {
      for (let i = 0; i < sys.p.length; i++) {
        for (let k = 0; k < sys.p[i].units[player-1].length; k++) {
          if (sys.p[i].units[player-1][k].name == "infantry") { return 1; }
        }
      }
    }
  
    //
    // sad!
    //
    return 0;
  }
  
  
  

  returnSpeakerOrder() {

    let speaker = this.game.state.speaker;
    let speaker_order = [];
  

    for (let i = 0; i < this.game.players.length; i++) {
      let thisplayer = (i+speaker+1);
      if (thisplayer > this.game.players.length) { thisplayer-=this.game.players.length; }
      speaker_order.push(thisplayer);
    }

    return speaker_order;

  }



  returnInitiativeOrder() {
  
    let strategy_cards   = this.returnStrategyCards();
    let card_io_hmap  = [];
    let player_lowest = [];
  
    for (let j in strategy_cards) {
      card_io_hmap[j] = strategy_cards[j].order;
    }

    for (let i = 0; i < this.game.players_info.length; i++) {

      player_lowest[i] = 100000;

      for (let k = 0; k < this.game.players_info[i].strategy.length; k++) {
        let sc = this.game.players_info[i].strategy[k];
        let or = card_io_hmap[sc];
        if (or < player_lowest[i]) { player_lowest[i] = or; }
      }
    }
  
    let loop = player_lowest.length;
    let player_initiative_order = [];
  
    for (let i = 0; i < loop; i++) {
      let a = player_lowest.indexOf(Math.max(...player_lowest));
      player_lowest[a] = -1;
      player_initiative_order.push(a+1);
    }

    return player_initiative_order;
  
  }




  returnSectorsWithinHopDistance(destination, hops) {

console.log("DEST: " + destination);  
console.log("HOPS: " + hops);

    let sectors = [];
    let distance = [];
    let s = this.returnSectors();
  
    sectors.push(destination);
    distance.push(0);
  
    //
    // find which systems within move distance (hops)
    //
    for (let i = 0; i < hops; i++) {
      let tmp = JSON.parse(JSON.stringify(sectors));
      for (let k = 0; k < tmp.length; k++) {
        let neighbours = s[tmp[k]].neighbours;
        for (let m = 0; m < neighbours.length; m++) {
  	if (!sectors.includes(neighbours[m]))  {
  console.log("adding neighbours " + neighbours[m] + " at " + (i+1) + " from " + tmp[k]);
  	  sectors.push(neighbours[m]);
  	  distance.push(i+1);
  	}
        }
      }
    }
    return { sectors : sectors , distance : distance };
  }
  




  returnPDSWithinRange(attacker, destination, sectors, distance) {
  
    let battery = [];
  
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSystemAndPlanets(sectors[i]);
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {

console.log(".1 " + JSON.stringify(sys));
  
        for (let j = 0; j < sys.p.length; j++) {
console.log(".1 "+ j);
          for (let k = 0; k < sys.p[j].units.length; k++) {
console.log(".2 "+ k);
  	  if (k != attacker-1) {
console.log(".3");
  	    for (let z = 0; z < sys.p[j].units[k].length; z++) {
console.log(".4" + z);
  	      if (sys.p[j].units[k][z].name == "pds") {
console.log("RANGE: " + sys.p[j].units[k][z].range + " -- " + distance[i]);
  		if (sys.p[j].units[k][z].range >= distance[i]) {
  	          let pds = {};
  	              pds.combat = sys.p[j].units[k][z].combat;
  		      pds.owner = (k+1);
  		      pds.sector = sectors[i];
  
  	          battery.push(pds);
  		}
  	      }
  	    }
  	  }
          }
        }
      }
    }
  
    return battery;
  
  }
  




  returnShipsMovableToDestinationFromSectors(destination, sectors, distance) {
  
    let imperium_self = this;
    let ships_and_sectors = [];
    for (let i = 0; i < sectors.length; i++) {
  
      let sys = this.returnSystemAndPlanets(sectors[i]);
      
  
      //
      // some sectors not playable in 3 player game
      //
      if (sys != null) {
  
        let x = {};
        x.ships = [];
        x.ship_idxs = [];
        x.sector = null;
        x.distance = distance[i];
        x.adjusted_distance = [];
  
        //
        // only move from unactivated systems
        //
        if (sys.s.activated[imperium_self.game.player-1] == 0) {
  
          for (let k = 0; k < sys.s.units[this.game.player-1].length; k++) {
            let this_ship = sys.s.units[this.game.player-1][k];
  
  console.log("examining sector " + sectors[i] + " -- ship found ("+this_ship.name+") with move / distance : " + this_ship.move + " -- " + distance[i]);
  
            if (this_ship.move >= distance[i]) {
  console.log("PUSHING THIS SHIP TO OUR LIST!");
  	    x.adjusted_distance.push(distance[i]);
              x.ships.push(this_ship);
              x.ship_idxs.push(k);
              x.sector = sectors[i];
            }
          }
          if (x.sector != null) {
            ships_and_sectors.push(x);
          }
        }
  
      }
    }
  
    return ships_and_sectors;
  
  }
 

  returnNumberOfGroundForcesOnPlanet(player, sector, planet_idx) {
  
    let sys = this.returnSystemAndPlanets(sector);
    let num = 0;
  
    for (let z = 0; z < sys.p[planet_idx].units[player-1].length; z++) {
      if (sys.p[planet_idx].units[player-1][z].strength > 0 && sys.p[planet_idx].units[player-1][z].destroyed == 0) {
        num++;
      }
    }
  
    return num;
  }


  
  
  ///////////////////////////////
  // Return System and Planets //
  ///////////////////////////////
  returnSystemAndPlanets(pid) {
  
    if (this.game.board[pid] == null) {
      return;
    }
  
    if (this.game.board[pid].tile == null) {
      return;
    }
  
    let sys = this.game.systems[this.game.board[pid].tile];
    let planets = [];
  
    for (let i = 0; i < sys.planets.length; i++) {
      planets[i] = this.game.planets[sys.planets[i]];
    }
  
    return {
      s: sys,
      p: planets
    };
  }; 
  
  


  /////////////////////////////
  // Save System and Planets //
  /////////////////////////////
  saveSystemAndPlanets(sys) {
    for (let key in this.game.systems) {
      if (this.game.systems[key].img == sys.s.img) {
        this.game.systems[key] = sys.s;
        for (let j = 0; j < this.game.systems[key].planets.length; j++) {
          this.game.planets[this.game.systems[key].planets[j]] = sys.p[j];
        }
      }
    }
  };
  
  



  
  returnOtherPlayerHomeworldPlanets(player=this.game.player) {
  
    let planets = [];
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.player != (i+1)) {
        let their_home_planets = this.returnPlayerHomeworldPlanets((i+1));
        for (let z = 0; z < their_home_planets.length; z++) {
          planets.push(their_home_planets);
        }
      }
    }
  
    return planets;
  
  }
  
  
  returnPlayerHomeworldPlanets(player=null) {
    if (player == null) { player = this.game.player; }
    let home_sector = this.game.board[this.game.players_info[player-1].homeworld].tile;  // "sector";
    return this.game.systems[home_sector].planets;
  }
  
  returnPlayerUnexhaustedPlanetCards(player=null) {
    if (player == null) { player = this.game.player; }
    return this.returnPlayerPlanetCards(player, 1);
  }
  returnPlayerExhaustedPlanetCards(player=null) {
    if (player == null) { player = this.game.player; }
    return this.returnPlayerPlanetCards(player, 2);
  }
  returnPlayerPlanetCards(player=null, mode=0) {
  
    if (player == null) { player == this.game.player; }

    let x = [];
  
    for (var i in this.game.planets) {
      if (this.game.planets[i].owner == player) {
  
        if (mode == 0) {
          x.push(i);
        }
        if (mode == 1 && this.game.planets[i].exhausted == 0) {
          x.push(i);
        }
        if (mode == 2 && this.game.planets[i].exhausted == 1) {
  	x.push(i);
        }
      }
    }
  
    return x;
  
  }
  returnPlayerActionCards(player=this.game.player, mode=0) {
  
    let x = [];
    //
    // deck 2 -- hand #1
    //
    for (var i in this.game.deck[1].hand) {
      if (mode == 0) {
        x.push(i);
      }
    }
  
    return x;
  
  }
  
  returnPlanetCard(planetname="") {
  
    var c = this.game.planets[planetname];
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="planetcard" style="background-image: url('${c.img}');">
      </div>
    `;
    return html;
  
  }
  
  
  returnStrategyCard(cardname) {
  
    let cards = this.returnStrategyCards();
    let c = cards[cardname];
  
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="strategycard" style="background-image: url('${c.img}');">
        <div class="strategycard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnActionCard(cardname) {
    let cards = this.returnActionCards();
    let c = cards[cardname];
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+c.name+'</div>';
  
    }
    var html = `
      <div class="actioncard" style="background-image: url('${c.img}');">
        <div class="actioncard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  
  
  returnAgendaCard(cardname) {
  
    let cards = this.returnAgendaCards();
    let c = cards[cardname];
  
    if (c == undefined) {
  
      //
      // this is not a card, it is something like "skip turn" or cancel
      //
      return '<div class="noncard">'+cardname+'</div>';
  
    }
  
    var html = `
      <div class="agendacard" style="background-image: url('${c.img}');">
        <div class="agendacard_name">${c.name}</div>
      </div>
    `;
    return html;
  
  }
  

  doesSectorContainPlayerShips(player, sector) {

    let sys = this.returnSystemAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    return 0;
 
  }

  doesSectorContainPlayerUnits(player, sector) {

    let sys = this.returnSystemAndPlanets(sector);
    if (sys.s.units[player-1].length > 0) { return 1; }
    for (let i = 0; i < sys.p.length; i++) {
      if (sys.p[i].units[player-1].length > 0) { return 1; }
    }
    return 0;
 
  }
  
  

