
  //
  // redraw all sectors
  //
  displayBoard() {
    for (let i in this.game.systems) {
      this.updateSectorGraphics(i);
    }
    this.addEventsToBoard();
   
  } 
 
 
  /////////////////////////
  // Add Events to Board //
  /////////////////////////
  addEventsToBoard() {
 
    let imperium_self = this;
    let pid  = "";
 
    $('.sector').off();
    $('.sector').on('mouseenter', function() {
      pid = $(this).attr("id");
      imperium_self.showSector(pid);
    }).on('mouseleave', function() {
      pid = $(this).attr("id");
      imperium_self.hideSector(pid);
    });

  }



  addUIEvents() {

    if (this.browser_active == 0) { return; }

    //make board draggable
    $('#hexGrid').draggable();
    //add ui functions  
    //log-lock
    document.querySelector('.log').addEventListener('click', (e) => {
      document.querySelector('.log').toggleClass('log-lock');
    });

    document.querySelector('.leaderboardbox').addEventListener('click', (e) => {
      document.querySelector('.leaderboardbox').toggleClass('leaderboardbox-lock');
    });

    //set player highlight color
    document.documentElement.style.setProperty('--my-color', `var(--p${this.game.player})`);

}

  


  showSector(pid) {
  
    let hex_space = ".sector_graphics_space_"+pid; 
    let hex_ground = ".sector_graphics_planet_"+pid;
  
    $(hex_space).fadeOut();
    $(hex_ground).fadeIn();
  
  }
  hideSector(pid) {
  
    let hex_space = ".sector_graphics_space_"+pid; 
    let hex_ground = ".sector_graphics_planet_"+pid;
  
    $(hex_ground).fadeOut();
    $(hex_space).fadeIn();
  
  }
  
  
  
  updateLeaderboard() {

    if (this.browser_active == 0) { return; }  

    let imperium_self = this;
    let factions = this.returnFactions();

    try {

      document.querySelector('.round').innerHTML = this.game.state.round;
      document.querySelector('.turn').innerHTML = this.game.state.turn;

      let html = '<div class="VP-track-label">Victory Points</div>';

      for (let j = this.vp_needed; j >= 0; j--) {
        html += '<div class="vp ' + j + '-points"><div class="player-vp-background">' + j + '</div>';
        html += '<div class="vp-players">'
  
        for (let i = 0; i < this.game.players_info.length; i++) {
          if  (this.game.players_info[i].vp == j) {
            html += `  <div class="player-vp" style="background-color:var(--p${i+1});"><div class="vp-faction-name">${factions[this.game.players_info[i].faction].name}</div></div>`;
          }
        }
    
        html += '</div></div>';
      }
  
      document.querySelector('.leaderboard').innerHTML = html;
  
    } catch (err) {}
  }
  
  

  updateSectorGraphics(sector) {

    let sys = this.returnSectorAndPlanets(sector);
  
    let divsector = '#hex_space_'+sector;
    let fleet_color = '';
    let bg = '';
    let bgsize = '';
 
    for (let z = 0; z < sys.s.units.length; z++) {
  
      let player = z+1;
  
      //
      // is activated?
      //
      if (sys.s.activated[player-1] == 1) {
        let divpid = '#'+sector;
        $(divpid).find('.hex_activated').css('background-color', 'yellow');
        $(divpid).find('.hex_activated').css('opacity', '0.3');
      }
  
  
      //
      // space
      //
      if (sys.s.units[player-1].length > 0) {
  
        updated_space_graphics = 1;
  
        let carriers     = 0;
        let fighters     = 0;
        let destroyers   = 0;
        let cruisers     = 0;
        let dreadnaughts = 0;
        let flagships    = 0;
  
        for (let i = 0; i < sys.s.units[player-1].length; i++) {
  
          let ship = sys.s.units[player-1][i];
  
          if (ship.type == "carrier") { carriers++; }
          if (ship.type == "fighter") { fighters++; }
          if (ship.type == "destroyer") { destroyers++; }
          if (ship.type == "cruiser") { cruisers++; }
          if (ship.type == "dreadnaught") { dreadnaughts++; }
          if (ship.type == "flagship") { flagships++; }
  
        }
  
        let space_frames = [];
        let ship_graphics = [];
        space_frames.push("white_space_frame.png");
  
        ////////////////////
        // SPACE GRAPHICS //
        ////////////////////
        fleet_color = "color"+player;
        
        if (fighters > 0 ) { 
	  let x = fighters; if (fighters > 9) { x = 9; } 
	  let numpng = "white_space_frame_1_"+x+".png";
	  ship_graphics.push("white_space_fighter.png");
	  space_frames.push(numpng);
	}
        if (destroyers > 0 ) { 
	  let x = destroyers; if (destroyers > 9) { x = 9; } 
	  let numpng = "white_space_frame_2_"+x+".png";
	  ship_graphics.push("white_space_destroyer.png");
	  space_frames.push(numpng);
	}
        if (carriers > 0 ) {
	  let x = carriers; if (carriers > 9) { x = 9; } 
	  let numpng = "white_space_frame_3_"+x+".png";
	  ship_graphics.push("white_space_carrier.png");
	  space_frames.push(numpng);
	}
        if (cruisers > 0 ) { 
	  let x = cruisers; if (cruisers > 9) { x = 9; } 
	  let numpng = "white_space_frame_4_"+x+".png";
	  ship_graphics.push("white_space_cruiser.png");
	  space_frames.push(numpng);
	}
        if (dreadnaughts > 0 ) { 
	  let x = dreadnaughts; if (dreadnaughts > 9) { x = 9; } 
	  let numpng = "white_space_frame_5_"+x+".png";
	  ship_graphics.push("white_space_dreadnaught.png");
	  space_frames.push(numpng);
	}
        if (flagships > 0 ) { 
	  let x = flagships; if (flagships > 9) { x = 9; } 
	  let numpng = "white_space_frame_6_"+x+".png";
	  ship_graphics.push("white_space_flagship.png");
	  space_frames.push(numpng);
	}


	//
	// remove and re-add space frames
	//
	let old_images = "#hex_bg_"+sector+" > .sector_graphics";
        $(old_images).remove();
	let divsector2 = "#hex_bg_"+sector;
	let player_color = "player_color_"+player;
        for (let i = 0; i < ship_graphics.length; i++) {
          $(divsector2).append('<img class="sector_graphics ship_graphic sector_graphics_space sector_graphics_space_'+sector+'" src="/imperium/img/frame/'+ship_graphics[i]+'" />');
        }
	for (let i = 0; i < space_frames.length; i++) {
          $(divsector2).append('<img class="sector_graphics '+player_color+' sector_graphics_space sector_graphics_space_'+sector+'" src="/imperium/img/frame/'+space_frames[i]+'" />');
        }
      }
    }
  
 
  
  
    let ground_frames = [];
    let ground_pos    = [];

    for (let z = 0; z < sys.s.units.length; z++) {
  
      let player = z+1;
  
      ////////////////////////
      // PLANETARY GRAPHICS //
      ////////////////////////
      let total_ground_forces_of_player = 0;
      
      for (let j = 0; j < sys.p.length; j++) {
        total_ground_forces_of_player += sys.p[j].units[player-1].length;
      }

      if (total_ground_forces_of_player > 0) {


        for (let j = 0; j < sys.p.length; j++) {

          let infantry     = 0;
          let spacedock    = 0;
          let pds          = 0;
  
          for (let k = 0; k < sys.p[j].units[player-1].length; k++) {
  
            let unit = sys.p[j].units[player-1][k];
  
            if (unit.type == "infantry") { infantry++; }
            if (unit.type == "pds") { pds++; }
            if (unit.type == "spacedock") { spacedock++; }
  
          }

	  let postext = "";

	  ground_frames.push("white_planet_center.png");
	  if (sys.p.length == 1) {
	    postext = "center";
	  } else {
	    if (j == 0) {
	      postext = "top_left";
	    }
	    if (j == 1) {
	      postext = "bottom_right";
	    }
	  }
	  ground_pos.push(postext);


          if (infantry > 0) { 
  	    let x = infantry; if (infantry > 9) { x = 9; } 
	    let numpng = "white_planet_center_1_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
          if (spacedock > 0) { 
  	    let x = spacedock; if (spacedock > 9) { x = 9; } 
	    let numpng = "white_planet_center_2_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
          if (pds > 0) { 
  	    let x = pds; if (pds > 9) { x = 9; } 
	    let numpng = "white_planet_center_3_"+x+".png";
	    ground_frames.push(numpng);
	    ground_pos.push(postext);
	  }
        }

	//
	// remove and re-add space frames
	//
	let old_images = "#hex_bg_"+sector+" > .sector_graphics_planet";
        $(old_images).remove();

	let divsector2 = "#hex_bg_"+sector;
        let player_color = "player_color_"+player;
	let pid = 0;
        for (let i = 0; i < ground_frames.length; i++) {
          if (i > 0 && ground_pos[i] != ground_pos[i-1]) { pid++; }
          $(divsector2).append('<img class="sector_graphics '+player_color+' sector_graphics_planet sector_graphics_planet_'+sector+' sector_graphics_planet_'+sector+'_'+pid+' '+ground_pos[i]+'" src="/imperium/img/frame/'+ground_frames[i]+'" />');
        }
      }
    }
  };
  

  
  addSectorHighlight(sector) {
    let divname = "#hex_space_"+sector;
    $(divname).css('background-color', '#900');
  }
  removeSectorHighlight(sector) {
    let divname = "#hex_space_"+sector;
    $(divname).css('background-color', 'transparent'); 
  }
  addPlanetHighlight(sector, pid)  {
    let divname = ".sector_graphics_planet_"+sector+'_'+pid;
    $(divname).show();
  }
  removePlanetHighlight(sector, pid)  {
    let divname = ".sector_graphics_planet_"+sector+'_'+pid;
    $(divname).hide();
  }
  showActionCard(c) {
    let action_cards = this.returnActionCards();
    let thiscard = action_cards[c];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideActionCard(c) {
    $('.cardbox').hide();
  }
  showStrategyCard(c) {
    let strategy_cards = this.returnStrategyCards();
    let thiscard = strategy_cards[c];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideStrategyCard(c) {
    $('.cardbox').hide();
  }
  showPlanetCard(sector, pid) {
    let planets = this.returnPlanets();
    let systems = this.returnSectors();
    let sector_name = this.game.board[sector].tile;
    let this_planet_name = systems[sector_name].planets[pid];
console.log(sector_name + " -- " + this_planet_name + " -- " + pid);
    let thiscard = planets[this_planet_name];
    $('.cardbox').html('<img src="'+thiscard.img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hidePlanetCard(sector, pid) {
    $('.cardbox').hide();
  }
  showAgendaCard(agenda) {
    let agendas = this.returnAgendaCards();
    $('.cardbox').html('<img src="'+agendas[agenda].img+'" style="width:100%" />'); 
    $('.cardbox').show();
  }
  hideAgendaCard(sector, pid) {
    $('.cardbox').hide();
  }


