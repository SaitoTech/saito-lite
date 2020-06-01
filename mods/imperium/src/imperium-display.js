  
 
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
  
    let imperium_self = this;
    let factions = this.returnFactions();
    let html = "Round " + this.game.state.round + " (turn " + this.game.state.turn + ")";
  
        html += '<p></p>';
        html += '<hr />';
        html += '<ul>';
  
    for (let i = 0; i < this.game.players_info.length; i++) {
      html += `  <li class="card" id="${i}">${factions[this.game.players_info[i].faction].name} -- ${this.game.players_info[i].vp} VP</li>`;
    }
  
    html += '</ul>';
  
    $('.leaderboard').html(html);
  
  }
  
  

  updateSectorGraphics(sector) {
  
    let sys = this.returnSystemAndPlanets(sector);
  
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
  
          if (ship.name == "carrier") { carriers++; }
          if (ship.name == "fighter") { fighters++; }
          if (ship.name == "destroyer") { destroyers++; }
          if (ship.name == "cruiser") { cruisers++; }
          if (ship.name == "dreadnaught") { dreadnaughts++; }
          if (ship.name == "flagship") { flagships++; }
  
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
        total_ground_forces_of_player += sys.p[j].units[z].length;
      }
 
      if (total_ground_forces_of_player > 0) {
        for (let j = 0; j < sys.p.length; j++) {
  
          let infantry     = 0;
          let spacedock    = 0;
          let pds          = 0;
  
          for (let k = 0; k < sys.p[j].units[player-1].length; k++) {
  
            let unit = sys.p[j].units[player-1][k];
  
            if (unit.name == "infantry") { infantry++; }
            if (unit.name == "pds") { pds++; }
            if (unit.name == "spacedock") { spacedock++; }
  
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


