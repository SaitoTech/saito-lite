
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
  let pid = "";

  $('.sector').off();
  $('.sector').on('mouseenter', function () {
    pid = $(this).attr("id");
    imperium_self.showSector(pid);
  }).on('mouseleave', function () {
    pid = $(this).attr("id");
    imperium_self.hideSector(pid);
  });

}




setPlayerActive(player) {
  let divclass = ".dash-faction-status-"+player;
  $(divclass).css('background-color', 'green');
}
setPlayerInactive(player) {
  let divclass = ".dash-faction-status-"+player;
  $(divclass).css('background-color', 'red');
}
setPlayerActiveOnly(player) {
  for (let i = 1; i <= this.game.players_info.length; i++) {
    if (player == i) { this.setPlayerActive(i); } else { this.setPlayerInactive(i); }  
  }
}


returnPlanetInformationHTML(planet) {

  let p = planet;
  if (this.game.planets[planet]) { p = this.game.planets[planet]; }
  let ionp = this.returnInfantryOnPlanet(p);
  let ponp = this.returnPDSOnPlanet(p);
  let sonp = this.returnSpaceDocksOnPlanet(p);

  let html = '';

  html += `<div class="sector_information_planetname">${p.name}</div><ul class="sector_information_planet_content">`;

  if (ionp > 0) {
    html += '<li class="sector_information_planet_content_box">';
    html += '<div class="planet_infantry_count">'+ionp+'</div>';
    hmtl += '</li>';
  }
  html += '</ul>';

  if (sonp > 0) {
    html += '<li class="sector_information_planet_content_box">';
    html += '<div class="planet_spacedock_count">'+sonp+'</div>';
    hmtl += '</li>';
  }
  html += '</ul>';

  if (ponp > 0) {
    html += '<li class="sector_information_planet_content_box">';
    html += '<div class="planet_pds_count">'+ponp+'</div>';
    hmtl += '</li>';
  }
  html += '</ul>';

  return html;

}

returnFactionDashboard() {

  let html = '';
  for (let i = 0; i < this.game.players_info.length; i++) {

    html += `

    <div data-id="${(i+1)}" class="dash-faction p${i+1}">
     <div data-id="${(i+1)}" class="dash-faction-name bk"></div>
      <div data-id="${(i+1)}" class="dash-faction-info">

        <div data-id="${(i+1)}" class="dash-item resources">
          <span data-id="${(i+1)}" class="avail"></span>
          <span data-id="${(i+1)}" class="total"></span>
        </div>

        <div data-id="${(i+1)}" class="dash-item influence">
          <span data-id="${(i+1)}" class="avail"></span>
          <span data-id="${(i+1)}" class="total"></span>
        </div>

        <div data-id="${(i+1)}" class="dash-item trade">
          <i data-id="${(i+1)}" class="fas fa-database pc white-stroke"></i>
          <div data-id="${(i+1)}" id="dash-item-goods" class="dash-item-goods">
            ${this.game.players_info[i].goods}
          </div>
        </div>

        <div data-id="${(i+1)}" class="dash-label">Resources</div>
        <div data-id="${(i+1)}" class="dash-label">Influence</div>
        <div data-id="${(i+1)}" class="dash-label">Goods</div>
      </div>

      <div data-id="${(i+1)}" class="dash-faction-base">
	<div data-id="${(i+1)}" class="dash-faction-status-${(i+1)} dash-faction-status"></div>
	commodities : <span data-id="${(i+1)}" class="dash-item-commodities">${this.game.players_info[i].commodities}</span> / <span data-id="${(i+1)}" class="dash-item-commodity-limit">${this.game.players_info[i].commodity_limit}</span>
      </div>
    </div>
    `;

  }
  return html;

}


returnFactionSheets() {

  let html = '';
  for (let i = 0; i < this.game.players_info.length; i++) {
    html += `
      <div data-id="${(i+1)}" class="faction_sheet faction_sheet_${(i+1)} p${(i+1)} hidden">
        <div class="faction_name faction_name_${(i+1)} p1"></div>
        <div id="faction_content_${(i+1)}" class="faction_content faction_content_${(i+1)} p${(i+1)}"></div>
      </div>
    `;
  }
  return html;

}



returnLawsOverlay() {

  let laws = this.returnAgendaCards();
  let html = '';

  if (this.game.state.laws.length > 0) {
      html += '<div style="margin-bottom: 1em;color:white;font-size:1.4em;margin-left:auto;margin-right:auto">Galactic Laws Under Enforcement:</div>';
      html += '<p></p>';
      html += '<ul style="clear:both;margin-top:10px;">';
      for (let i = 0; i < this.game.state.laws.length; i++) {
console.log("1: "+ this.game.state.laws[i]);
        html += `  <li style="background-image: url('/imperium/img/agenda_card_template.png');background-size:cover;" class="overlay_agendacard card option" id="${i}"><div class="overlay_agendatitle">${laws[this.game.state.laws[i]].name}</div><div class="overlay_agendacontent">${laws[this.game.state.laws[i]].text}</div></li>`;
      }
      html += '</ul>';
  }

  if (this.game.state.agendas.length > 0) {
      html += '<div style="margin-bottom: 1em; color:white;font-size:1.4em;margin-left:auto;margin-right:auto">Galactic Laws Under Consideration:</div>';
      html += '<p></p>';
      html += '<ul style="clear:both;margin-top:10px;">';
      for (let i = 0; i < this.game.state.agendas.length; i++) {
        html += `  <li style="background-image: url('/imperium/img/agenda_card_template.png');background-size:cover;" class="overlay_agendacard card option" id="${i}"><div class="overlay_agendatitle">${laws[this.game.state.agendas[i]].name}</div><div class="overlay_agendacontent">${laws[this.game.state.agendas[i]].text}</div></li>`;
      }
      html += '</ul>';
  }

  if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += '<div class="color:white;font-size:1.2em">There are no laws in force or agendas up for consideration at this time.</div>';
  }

  return html;

}




returnStrategyOverlay() {

  let html = '';
  let imperium_self = this;

  for (let s in this.strategy_cards) {

    let strategy_card_state = "not picked";
    let strategy_card_player = -1;
  
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
    html += `
	<div class="overlay_strategy_card_box">
	  <img class="overlay_strategy_card_box_img" src="${thiscard.img}" style="width:100%" />
	  <div class="overlay_strategy_card_text">${thiscard.text}</div>
	  <div class="strategy_card_state p${strategy_card_player}">
	    <div class="strategy_card_state_internal bk">${strategy_card_state}</div>
     	  </div>
	</div>
    `;;
  }


  return html;

}

returnObjectivesOverlay() {

  let html = '';
  let imperium_self = this;

  //
  // STAGE 1 OBJECTIVES
  //
  for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
    let obj = this.stage_i_objectives[this.game.state.stage_i_objectives[i]];
    html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
               <div class="objectives_card_name">${obj.name}</div>
               <div class="objectives_card_content">${obj.text}</div>
    `;
    for (let p = 0; p < this.game.players_info.length; p++) {
      let objc = imperium_self.returnPlayerObjectivesScored((p+1), ["stage_i_objectives"]);
      if (objc[obj]) {
        html += `<div class="objectives_players_scored players_scored_${(p+1)} p${(p+1)}"><div class="bk" style="width:100%;height:100%"></div></div>`;
      }
    }
    html += `</div>`;
  }

  html += '<p></p>';

  //
  // STAGE 2 OBJECTIVES
  //
  for (let i = 0; i < this.game.state.stage_ii_objectives.length; i++) {
    let obj = this.stage_ii_objectives[this.game.state.stage_ii_objectives[i]];
    html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
               <div class="objectives_card_name">${obj.name}</div>
               <div class="objectives_card_content">${obj.text}</div>
    `;
    for (let p = 0; p < this.game.players_info.length; p++) {
      let objc = imperium_self.returnPlayerObjectivesScored((p+1), ["stage_ii_objectives"]);
      if (objc[obj]) {
        html += `<div class="objectives_players_scored players_scored_${(p+1)} p${(p+1)}"><div class="bk" style="width:100%;height:100%"></div></div>`;
      }
    }
    html += `</div>`;
  }

  html += '<p></p>';

  //
  // SECRET OBJECTIVES
  //
  for (let i = 0; i < this.game.players_info.length; i++) {
    if (i > 0) { html += '<p></p>'; }
    let objc = imperium_self.returnPlayerObjectivesScored((i+1), ["secret_objectives"]);
    for (let o in objc) {
console.log("SECRET OBJECTIVES: ");
console.log(JSON.stringify(objc[o]));
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${objc[o].img})">
               <div class="objectives_card_name">${objc[o].name}</div>
               <div class="objectives_card_content">${objc[o].text}</div>
               <div class="objectives_players_scored players_scored_${(i+1)} p${(i+1)}"><div class="bk" style="width:100%;height:100%"></div></div>
             </div>`;
    }
  }

  return html;

}





displayFactionDashboard() {

  let imperium_self = this;

  try {

  document.querySelector('.dashboard').innerHTML = this.returnFactionDashboard();

  var pl = "";
  for (let i = 0; i < this.game.players_info.length; i++) {

    pl = "p" + (i+1);

    let total_resources = this.returnTotalResources((i+1)) - this.game.players_info[i].goods;
    let available_resources = this.returnAvailableResources((i+1)) - this.game.players_info[i].goods;
    let total_influence = this.returnTotalInfluence((i+1)) - this.game.players_info[i].goods;
    let available_influence = this.returnAvailableInfluence((i+1)) - this.game.players_info[i].goods;

    document.querySelector(`.${pl} .dash-faction-name`).innerHTML = this.returnFaction(i+1);
    document.querySelector(`.${pl} .resources .avail`).innerHTML = available_resources;
    document.querySelector(`.${pl} .resources .total`).innerHTML = total_resources;
    document.querySelector(`.${pl} .influence .avail`).innerHTML = available_influence;
    document.querySelector(`.${pl} .influence .total`).innerHTML = total_influence;
    document.querySelector(`.${pl} .dash-item-goods`).innerHTML = this.game.players_info[i].goods;
    document.querySelector(`.${pl} .dash-item-commodities`).innerHTML = this.game.players_info[i].commodities;
    document.querySelector(`.${pl} .dash-item-commodity-limit`).innerHTML = this.game.players_info[i].commodity_limit;


  }

    document.querySelectorAll('.dash-faction').forEach(el => {
      el.addEventListener('click', (e) => {
        let faction_player = e.target.dataset.id;
        imperium_self.displayFactionSheet(faction_player);
      });
    });

  } catch (err) {}
}


displayFactionSheet(player) {

  let imperium_self = this;

  if (!imperium_self.factions_enabled) {
    imperium_self.factions_enabled = [];
    for (let i = 0; i < imperium_self.game.players_info; i++) { 
      imperium_self.factions_enabled.push(0);
    }
  }

  let divar = "faction_content_"+player;
  let html = imperium_self.returnFactionSheet(imperium_self, player);
  document.getElementById(divar).innerHTML = html;

  if (document.querySelector('.interface_overlay').classList.contains('hidden')) {
    document.querySelector('.interface_overlay').classList.remove('hidden');
  }

  let is_visible = 0;
  if (imperium_self.factions_enabled[player-1] == 1) {
    imperium_self.factions_enabled[player-1] = 0;
  } else {
    imperium_self.factions_enabled[player-1] = 1;
  }

  let faction_sheet_class = ".faction_sheet_"+player;
  document.querySelector(faction_sheet_class).toggleClass('hidden');
  for (let i = 0; i < imperium_self.game.players_info.length; i++) {
    if (imperium_self.factions_enabled[i] > 0) { is_visible++; }
  }
  if (is_visible == 0) {
    document.querySelector('.interface_overlay').classList.add('hidden');
  }

}


addUIEvents() {


  var imperium_self = this;

  if (this.browser_active == 0) { return; }

  GameBoardSizer.render(this.app, this.data);
  GameBoardSizer.attachEvents(this.app, this.data, '.gameboard');



  $('#hexGrid').draggable();

  //log-lock
  document.querySelector('.log').addEventListener('click', (e) => {
    document.querySelector('.log').toggleClass('log-lock');
  });

  document.querySelector('.leaderboardbox').addEventListener('click', (e) => {
    document.querySelector('.leaderboardbox').toggleClass('leaderboardbox-lock');
  });

  //set player highlight color
  document.documentElement.style.setProperty('--my-color', `var(--p${this.game.player})`);

  document.getElementById('faction_sheets').innerHTML = this.returnFactionSheets();

  //add faction names to their sheets
  for (let i = 0; i < this.game.players_info.length; i++) {
    document.querySelector('.faction_name_' + (i+1)).innerHTML = this.returnFaction(i+1);
    let factions = this.returnFactions();
    document.querySelector('.faction_sheet_' + (i+1)).style.backgroundImage = "url('./img/factions/" + factions[this.game.players_info[i].faction].background + "')";
  };

  this.displayFactionDashboard();


  document.querySelectorAll('.faction_sheet').forEach(el => {
    el.addEventListener('click', (e) => {
      document.querySelector('.interface_overlay').classList.add('hidden');
    });
  });

  for (let i = 0; i < this.game.players_info.length; i++) {
    document.querySelector(`.faction_content.p${(i+1)}`).innerHTML = imperium_self.returnFactionSheet(imperium_self, (i+1));
  }

  var html = this.returnTokenDisplay(); 
  document.querySelector('.hud-header').append(elParser(html));


  document.querySelectorAll('.faction_sheet_buttons div').forEach((el) => {
    var target = el.dataset.action;
    el.addEventListener('click', (el) => {
      document.querySelectorAll('.'+target+'.anchor').forEach((sec) => {
        sec.parentElement.scrollTop = sec.offsetTop - sec.parentElement.offsetTop;
      });
    });
  });
  document.querySelectorAll('.overlay').forEach((el) => {
    el.addEventListener('click', (e) => {
      //e.target.classList.add("hidden");
      imperium_self.hideOverlays();
    });
  });
}




returnTokenDisplay(player=null) {

  if (player == null) { player = this.game.player; }

  let html = `
    <div class="hud-token-count">
      <div>	
        <span class="fa-stack fa-3x">
        <i class="fas fa-dice-d20 fa-stack-2x pc white-stroke"></i>
        <span class="fa fa-stack-1x">
        <div id="token_display_command_token_count" class="token_count command_token_count">
        ${this.game.players_info[player-1].command_tokens}
        </div>
        </span>
        </span>
      </div>
      <div>
        <span class="fa-stack fa-3x">
        <i class="far fa-futbol fa-stack-2x pc white-stroke"></i>
        <span class="fa fa-stack-1x">
        <div id="token_display_strategy_token_count" class="token_count strategy_token_count">
        ${this.game.players_info[player-1].strategy_tokens}
        </div>
        </span>
        </span>
      </div>
      <div>
        <span class="fa-stack fa-3x">
        <i class="fas fa-space-shuttle fa-stack-2x pc white-stroke"></i>
        <span class="fa fa-stack-1x">
        <div id="token_display_fleet_supply_count" class="token_count fleet_supply_count">
        ${this.game.players_info[player-1].fleet_supply}
        </div>
        </span>
        </span>
      </div>
    </div>`;

  return html;

}

returnFactionSheet(imperium_self, player=null) {

  if (!player) { player = imperium_self.game.player; }

  let html = `
        <div class="faction_sheet_token_box" id="faction_sheet_token_box">
        <div>Command</div>
        <div>Strategy</div>
        <div>Fleet</div>
        <div>	
          <span class="fa-stack fa-3x">
          <i class="fas fa-dice-d20 fa-stack-2x pc white-stroke"></i>
          <span class="fa fa-stack-1x">
          <span class="token_count commend_token_count">
          ${imperium_self.game.players_info[player - 1].command_tokens}
          </span>
          </span>
          </span>
        </div>
        <div>
          <span class="fa-stack fa-3x">
          <i class="far fa-futbol fa-stack-2x pc white-stroke"></i>
          <span class="fa fa-stack-1x">
          <span class="token_count strategy_token_count">
          ${this.game.players_info[player - 1].strategy_tokens}
          </span>
          </span>
          </span>
        </div>
        <div>
          <span class="fa-stack fa-3x">
          <i class="fas fa-space-shuttle fa-stack-2x pc white-stroke"></i>
          <span class="fa fa-stack-1x">
          <span class="token_count fleet_supply_count">
          ${this.game.players_info[player - 1].fleet_supply}
          </span>
          </span>
          </span>
        </div>
      </div>
      <div class="faction_sheet_active">
   `;


    //
    // ACTION CARDS
    //
    let ac = imperium_self.returnPlayerActionCards(imperium_self.game.player);
    if (ac.length > 0) {
      html += `
      <h3 class="action anchor">Action Cards</h3>
      <div class="faction_sheet_action_card_box" id="faction_sheet_action_card_box">
      `;
      if (imperium_self.game.player == player) {

	for (let i = 0; i < ac.length; i++) {
          html += `
            <div class="faction_sheet_action_card bc">
              <div class="action_card_name">${imperium_self.action_cards[ac[i]].name}</div>
              <div class="action_card_content">${imperium_self.action_cards[ac[i]].text}</div>
            </div> 
	  `;
	}

      } else {

	let acih = imperium_self.game.players_info[player-1].action_cards_in_hand;
	for (let i = 0; i < acih; i++) {
          html += `
            <div class="faction_sheet_action_card faction_sheet_action_card_back bc">
            </div> 
	  `;
	}
      }
      html += `</div>`;
    }

    //
    // PLANET CARDS
    //
    html += `
      <h3 class="planets anchor">Planet Cards</h3>
      <div class="faction_sheet_planet_card_box" id="faction_sheet_planet_card_box">
    `;
  
    let pc = imperium_self.returnPlayerPlanetCards(player);
    for (let b = 0; b < pc.length; b++) {
      let exhausted = "";
      if (this.game.planets[pc[b]].exhausted == 1) { exhausted = "exhausted"; }
      html += `<div class="faction_sheet_planet_card bc ${exhausted}" id="${pc[b]}" style="background-image: url(${this.game.planets[pc[b]].img});"></div>`
    }
    html += `
      </div>
    `;


    //
    // FACTION ABILITIES
    //
    html += `
      <h3 class="abilities anchor">Faction Abilities</h3>
      <div class="faction_sheet_tech_box" id="faction_sheet_abilities_box">
    `;

    for (let i = 0; i < imperium_self.game.players_info[player-1].tech.length; i++) {
      let tech = imperium_self.tech[imperium_self.game.players_info[player-1].tech[i]];
      if (tech.type == "ability") {
        html += `
          <div class="faction_sheet_tech_card bc">
            <div class="tech_card_name">${tech.name}</div>
            <div class="tech_card_content">${tech.text}</div>
            <div class="tech_card_level">♦♦</div>
          </div>
        `;
      }
    }
    html += `</div>`;

    
     html += `
      <h3 class="tech anchor">Tech</h3>
      <div class="faction_sheet_tech_box" id="faction_sheet_tech_box">
    `;

    for (let i = 0; i < imperium_self.game.players_info[player-1].tech.length; i++) {
      let techname = imperium_self.game.players_info[player-1].tech[i];
      let tech = imperium_self.tech[techname];
      if (tech.type != "ability") {
        html += imperium_self.returnTechCardHTML(techname, "faction_sheet_tech_card");
      }
    }
    html += `</div>`;



    //
    // OBJECTIVES
    //
    let objc = imperium_self.returnPlayerObjectives(player);
    let scored_objectives = [];
    let unscored_objectives = [];


      for (let i in objc) {
        if (this.game.players_info[player-1].objectives_scored.includes(i)) {
   	  scored_objectives.push(objc[i]);
        } else {
  	  unscored_objectives.push(objc[i]);
        }
      }

      html += `
        <h3 class="objectives anchor">Objectives</h3>
        <div class="faction_sheet_objectives">
          <div class="scored">
            <h4>Scored</h4>
            <div class="faction_sheet_objective_cards scored">
      `;

      for (let i = 0; i < scored_objectives.length; i++) {
        html += `
              <div class="faction_sheet_action_card bc" style="background-image: url(${scored_objectives[i].img})">
                <div class="action_card_name">${scored_objectives[i].name}</div>
                <div class="action_card_content">${scored_objectives[i].text}</div>
              </div>
        `;
      }

      html += `
          </div>
          </div>
          <div class="unscored">
            <h4>Unscored</h4>
            <div class="faction_sheet_objective_cards unscored">
      `;


      if (this.game.player != player) {
        for (let i = 0; i < this.game.players_info[player-1].secret_objectives_in_hand; i++) {
          html += `
            <div class="faction_sheet_action_card bc" style="background-image: url(/imperium/img/secret_objective_back.png)">
            </div>
        `;
        }
      }
	

      for (let i = 0; i < unscored_objectives.length; i++) {
        html += `
            <div class="faction_sheet_action_card bc" style="background-image: url(${unscored_objectives[i].img})">
              <div class="action_card_name">${unscored_objectives[i].name}</div>
              <div class="action_card_content">${unscored_objectives[i].text}</div>
            </div>
        `;
      }

      html += `
          </div>
        </div>
      </div>

     
      <h3 class="units anchor">Units</h3>

       


      <div class="faction_sheet_unit_box" id="faction_sheet_unit_box">
          
     `;
     
     //var unit_array = Object.entries(imperium_self.units);
     var unit_array = [];
     Object.entries(imperium_self.units).forEach(item => {
       let unit = item[1];
       if(unit.extension == 1) {
       } else {
         unit_array.push([item[0],{
           type: unit.type,
           name: unit.name,
           cost: unit.cost,
           combat: unit.combat, 
           move: unit.move,
           capacity: unit.capacity
         }]);
       }  
     });
     Object.entries(imperium_self.units).forEach(item => {
      let unit = item[1];
      if (unit.extension == 1) {
        for(i=0; i < unit_array.length; i++){
           if (unit_array[i][1].type == unit.type){
             unit_array[i][1].cost += " (" + unit.cost +")";
             unit_array[i][1].combat += " (" + unit.combat +")";
             unit_array[i][1].move += " (" + unit.move +")";
             unit_array[i][1].capacity += " (" + unit.capacity +")";
           }
         };
      }
    });
    unit_array.forEach((u) =>{
     html += `

     <div class="unit-display-tile _${u[1].type}">
   <div class="unit-name">${u[1].name}</div>
     <div class="unit-image player_color_${player}" style="background-image: url(img/units/${u[0]}.png);"></div>
     <div class="unit-display">
       <div class="cost">Cost: ${u[1].cost}</div>
       <div class="combat">Combat: ${u[1].combat}</div>
       <div class="movement">Move: ${u[1].move}</div>
       <div class="capacity">Carry: ${u[1].capacity}</div>
     </div>
 </div>
     `;
    });

    html += `
    </div>
    <h3 class="lore anchor">Faction Lore</h3>
    <div class="faction_sheet_lore" id="faction_sheet_lore">
    <div class="anyipsum-output"><p>Spicy jalapeno bacon ipsum dolor amet turducken jerky pork loin pork chop pig chislic boudin meatloaf biltong.  Beef tri-tip ham hock, swine biltong prosciutto frankfurter.  Porchetta swine chislic pork belly bacon salami beef ribs pork loin prosciutto fatback pastrami ham hock ham.  Pastrami sausage t-bone filet mignon cow porchetta, bresaola landjaeger pork loin shoulder alcatra chislic ham buffalo.  Beef ribs sirloin strip steak prosciutto corned beef.  Biltong sausage porchetta, hamburger turkey tenderloin tongue frankfurter bresaola rump doner kevin pancetta burgdoggen.  Picanha porchetta drumstick turkey tenderloin landjaeger pork ribeye pig swine sausage t-bone chuck flank bacon.</p><p>Andouille tail sausage, ham hock capicola turkey chicken short loin buffalo meatloaf sirloin.  Jerky filet mignon tenderloin pancetta bresaola kielbasa.  Beef venison t-bone, tongue sausage cow burgdoggen landjaeger jowl alcatra short loin shoulder turducken.  Tenderloin cow landjaeger, chuck capicola picanha beef tri-tip cupim prosciutto kevin.  Pancetta capicola short ribs shank.  Bacon porchetta short ribs short loin, prosciutto pork belly chicken corned beef.  Kielbasa biltong corned beef hamburger doner jowl boudin jerky shank cupim frankfurter pancetta strip steak ribeye.</p><p>Tri-tip beef pork chop beef ribs.  Capicola tongue cow flank ham, landjaeger hamburger beef ribs turkey sausage.  Meatball ground round pastrami cow bresaola.  Jerky tail tri-tip picanha salami ground round meatloaf shoulder strip steak jowl porchetta sausage pork chop short ribs shank.  Capicola bacon beef strip steak corned beef.  Strip steak beef pork leberkas.  Jerky shank ham hock leberkas beef ribs doner.</p><p>Pastrami drumstick picanha bresaola.  Cow kevin pork loin, turducken alcatra beef ribs jerky salami.  Pastrami pork meatball buffalo chuck, chicken short loin ham.  Pork belly swine venison chicken beef ribs beef.</p><p>Pork bresaola shankle short loin, frankfurter jowl flank leberkas.  Filet mignon drumstick tri-tip sirloin tenderloin meatloaf buffalo.  Cupim ground round venison tri-tip salami tenderloin pork chop spare ribs bacon.  Shank picanha flank chuck cupim jowl pork belly.  Meatball kevin jowl short ribs pork loin spare ribs.</p><p>Bacon frankfurter rump, chislic ground round sausage prosciutto fatback drumstick boudin.  Cow ground round burgdoggen tri-tip bresaola.  Pig chuck tail pork.  Pork loin swine chislic shoulder cupim.  Capicola pig doner brisket meatball burgdoggen.  Biltong short loin flank, pork loin meatball ham hock shank beef ribs fatback.  Shank ball tip beef ribs, ribeye ham hock pancetta sausage chislic chicken picanha biltong rump leberkas filet mignon alcatra.</p><p>Beef chislic short ribs jerky landjaeger tri-tip boudin corned beef.  Short ribs fatback rump shankle andouille.  Pig shoulder andouille burgdoggen, tongue frankfurter tail tenderloin pork landjaeger alcatra swine boudin turducken.  Short loin corned beef capicola chuck kielbasa tri-tip, burgdoggen bacon drumstick meatball spare ribs.  Sirloin pig jowl meatball, tail drumstick landjaeger short loin bresaola ham hock.  Capicola meatball ham hock ground round.  Boudin salami flank swine sirloin kevin ball tip strip steak capicola t-bone shankle landjaeger chuck chislic.</p><p>Ribeye rump pig doner tongue beef ribs boudin filet mignon turducken corned beef jowl shankle strip steak andouille short loin.  Turducken tongue pork belly pork loin short ribs jerky strip steak jowl shank leberkas filet mignon.  Corned beef flank buffalo, ham hock short loin turkey pork loin.  Tenderloin bacon bresaola, short ribs meatball rump tongue fatback picanha filet mignon.  Frankfurter chicken pork loin, pancetta chuck turkey rump cupim cow.  Picanha shank doner drumstick meatball landjaeger brisket cupim.</p><p>Capicola turkey pork belly andouille filet mignon buffalo.  Strip steak shoulder short ribs biltong chicken, corned beef sirloin salami capicola bacon.  Boudin tenderloin bresaola shank pork belly drumstick kevin alcatra brisket biltong chicken jerky shoulder shankle corned beef.  Pork chop beef ribs meatloaf boudin, buffalo shoulder jowl salami brisket ball tip beef chislic.  Turkey andouille spare ribs, pork belly tongue tail tri-tip venison.  Frankfurter chuck porchetta biltong pastrami andouille kielbasa flank chislic pig t-bone hamburger turducken boudin venison.  Tri-tip filet mignon kevin, porchetta jerky rump picanha shank buffalo flank short loin.</p></div>
    
      </div>
    </div>

    `;

  return html;
}



showSector(pid) {

  let sector_name = this.game.board[pid].tile;
  this.showSectorHighlight(sector_name);

//  let hex_space = ".sector_graphics_space_" + pid;
//  let hex_ground = ".sector_graphics_planet_" + pid;
//
//  $(hex_space).fadeOut();
//  $(hex_ground).fadeIn();

}
hideSector(pid) {

  let sector_name = this.game.board[pid].tile;
  this.hideSectorHighlight(sector_name);

//  let hex_space = ".sector_graphics_space_" + pid;
//  let hex_ground = ".sector_graphics_planet_" + pid;
//
//  $(hex_ground).fadeOut();
//  $(hex_space).fadeIn();

}



updateTokenDisplay() {

  let imperium_self = this;

  try {
    $('#token_display_command_token_count').html(imperium_self.game.players_info[imperium_self.game.player-1].command_tokens);
    $('#token_display_strategy_token_count').html(imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens);
    $('#token_display_fleet_supply_count').html(imperium_self.game.players_info[imperium_self.game.player-1].fleet_supply_tokens);
  } catch (err) {
  }

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
        if (this.game.players_info[i].vp == j) {
          html += `  <div class="player-vp" style="background-color:var(--p${i + 1});"><div class="vp-faction-name">${factions[this.game.players_info[i].faction].name}</div></div>`;
        }
      }

      html += '</div></div>';
    }

    document.querySelector('.leaderboard').innerHTML = html;

  } catch (err) { }
}



updateSectorGraphics(sector) {

  //
  // handle both 'sector41' and '2_1'
  //
  let sys = this.returnSectorAndPlanets(sector);
  if (sector.indexOf("_") == -1) { sector = sys.s.tile; }

  let divsector = '#hex_space_' + sector;
  let fleet_color = '';
  let bg = '';
  let bgsize = '';
  let sector_controlled = 0;
  let player_border_visible = 0;
  let player_fleet_drawn = 0;
  let player_planets_drawn = 0;

  //
  // is activated?
  //
  if (sys.s.activated[this.game.player - 1] == 1) {
    let divpid = '#' + sector;
    $(divpid).find('.hex_activated').css('background-color', 'var(--p' + this.game.player + ")");
    $(divpid).find('.hex_activated').css('opacity', '0.3');
  } else {
    let divpid = '#' + sector;
    $(divpid).find('.hex_activated').css('opacity', '0.0');
  }


  for (let z = 0; z < sys.s.units.length; z++) {

    let player = z + 1;

    if (sys.s.type > 0) {
      let divpid = '#hex_img_hazard_border_' + sector;
      $(divpid).css('display', 'block');
    }

    if (sys.s.units[player-1].length > 0) {
      let divpid = '#hex_img_faction_border_' + sector;
      let newclass = "player_color_"+player;
      $(divpid).removeClass("player_color_1");
      $(divpid).removeClass("player_color_2");
      $(divpid).removeClass("player_color_3");
      $(divpid).removeClass("player_color_4");
      $(divpid).removeClass("player_color_5");
      $(divpid).removeClass("player_color_6");
      $(divpid).addClass(newclass);
      $(divpid).css('display','block');
      $(divpid).css('opacity', '1');
      player_border_visible = 1;
    }


    //
    // space
    //
    if (sys.s.units[player - 1].length > 0) {

      updated_space_graphics = 1;
      player_fleet_drawn = 1;

      let carriers = 0;
      let fighters = 0;
      let destroyers = 0;
      let cruisers = 0;
      let dreadnaughts = 0;
      let flagships = 0;
      let warsuns = 0;

      for (let i = 0; i < sys.s.units[player - 1].length; i++) {

        let ship = sys.s.units[player - 1][i];
        if (ship.type == "carrier") { carriers++; }
        if (ship.type == "fighter") { fighters++; }
        if (ship.type == "destroyer") { destroyers++; }
        if (ship.type == "cruiser") { cruisers++; }
        if (ship.type == "dreadnaught") { dreadnaughts++; }
        if (ship.type == "flagship") { flagships++; }
        if (ship.type == "warsun") { warsuns++; }

      }

      let space_frames = [];
      let ship_graphics = [];

      ////////////////////
      // SPACE GRAPHICS //
      ////////////////////
      fleet_color = "color" + player;

      if (fighters > 0) {
        let x = fighters; if (fighters > 9) { x = 9; }
        let numpng = "white_space_frame_1_" + x + ".png";
        ship_graphics.push("white_space_fighter.png");
        space_frames.push(numpng);
      }
      if (destroyers > 0) {
        let x = destroyers; if (destroyers > 9) { x = 9; }
        let numpng = "white_space_frame_2_" + x + ".png";
        ship_graphics.push("white_space_destroyer.png");
        space_frames.push(numpng);
      }
      if (carriers > 0) {
        let x = carriers; if (carriers > 9) { x = 9; }
        let numpng = "white_space_frame_3_" + x + ".png";
        ship_graphics.push("white_space_carrier.png");
        space_frames.push(numpng);
      }
      if (cruisers > 0) {
        let x = cruisers; if (cruisers > 9) { x = 9; }
        let numpng = "white_space_frame_4_" + x + ".png";
        ship_graphics.push("white_space_cruiser.png");
        space_frames.push(numpng);
      }
      if (dreadnaughts > 0) {
        let x = dreadnaughts; if (dreadnaughts > 9) { x = 9; }
        let numpng = "white_space_frame_5_" + x + ".png";
        ship_graphics.push("white_space_dreadnaught.png");
        space_frames.push(numpng);
      }
      if (flagships > 0) {
        let x = flagships; if (flagships > 9) { x = 9; }
        let numpng = "white_space_frame_6_" + x + ".png";
        ship_graphics.push("white_space_flagship.png");
        space_frames.push(numpng);
      }
      if (warsuns > 0) {
        let x = warsuns; if (warsuns > 9) { x = 9; }
        let numpng = "white_space_frame_7_" + x + ".png";
        ship_graphics.push("white_space_warsun.png");
        space_frames.push(numpng);
      }

      //
      // remove and re-add space frames
      //
      let old_images = "#hex_bg_" + sector + " > .sector_graphics";
      $(old_images).remove();
      let divsector2 = "#hex_bg_" + sector;
      let player_color = "player_color_" + player;
      for (let i = 0; i < ship_graphics.length; i++) {
        $(divsector2).append('<img class="sector_graphics ' + player_color + ' ship_graphic sector_graphics_space sector_graphics_space_' + sector + '" src="/imperium/img/frame/' + ship_graphics[i] + '" />');
      }
      for (let i = 0; i < space_frames.length; i++) {
        $(divsector2).append('<img style="opacity:0.8" class="sector_graphics sector_graphics_space sector_graphics_space_' + sector + '" src="/imperium/img/frame/' + space_frames[i] + '" />');
      }
    }
  }





  let ground_frames = [];
  let ground_pos = [];

  for (let z = 0; z < sys.s.units.length; z++) {

    let player = z + 1;

    ////////////////////////
    // PLANETARY GRAPHICS //
    ////////////////////////
    let total_ground_forces_of_player = 0;

    for (let j = 0; j < sys.p.length; j++) {
      total_ground_forces_of_player += sys.p[j].units[player - 1].length;
    }


    if (total_ground_forces_of_player > 0) {

      for (let j = 0; j < sys.p.length; j++) {

	player_planets_drawn = 1;

        if (sys.p[j].units[player-1].length > 0 && player_border_visible == 0) {
          let divpid = '#hex_img_faction_border_' + sector;
          let newclass = "player_color_"+player;
          $(divpid).removeClass("player_color_1");
          $(divpid).removeClass("player_color_2");
          $(divpid).removeClass("player_color_3");
          $(divpid).removeClass("player_color_4");
          $(divpid).removeClass("player_color_5");
          $(divpid).removeClass("player_color_6");
          $(divpid).addClass(newclass);
          $(divpid).css('display','block');
          $(divpid).css('opacity', '0.6');
          player_border_visible = 1;
        }


        let infantry = 0;
        let spacedock = 0;
        let pds = 0;

        for (let k = 0; k < sys.p[j].units[player - 1].length; k++) {

          let unit = sys.p[j].units[player - 1][k];

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
          let numpng = "white_planet_center_1_" + x + ".png";
          ground_frames.push(numpng);
          ground_pos.push(postext);
        }
        if (spacedock > 0) {
          let x = spacedock; if (spacedock > 9) { x = 9; }
          let numpng = "white_planet_center_2_" + x + ".png";
          ground_frames.push(numpng);
          ground_pos.push(postext);
        }
        if (pds > 0) {
          let x = pds; if (pds > 9) { x = 9; }
          let numpng = "white_planet_center_3_" + x + ".png";
          ground_frames.push(numpng);
          ground_pos.push(postext);
        }
      }



      //
      // remove space units if needed - otherwise last unit will not be removed when sector is emptied
      //
      if (player_fleet_drawn == 0) {
        let old_images = "#hex_bg_" + sector + " > .sector_graphics";
        $(old_images).remove();
	player_fleet_drawn = 1;
      }



      //
      // remove and re-add space frames
      //
      let old_images = "#hex_bg_" + sector + " > .sector_graphics_planet";
      $(old_images).remove();

      let divsector2 = "#hex_bg_" + sector;
      let player_color = "player_color_" + player;
      let pid = 0;
      for (let i = 0; i < ground_frames.length; i++) {
        if (i > 0 && ground_pos[i] != ground_pos[i - 1]) { pid++; }
        $(divsector2).append('<img class="sector_graphics ' + player_color + ' sector_graphics_planet sector_graphics_planet_' + sector + ' sector_graphics_planet_' + sector + '_' + pid + ' ' + ground_pos[i] + '" src="/imperium/img/frame/' + ground_frames[i] + '" />');
      }
    }
  }

  if (player_border_visible == 0) {
    for (let p = 0; p < sys.p.length; p++) {
      if (sys.p[p].owner != -1) {
        let divpid = '#hex_img_faction_border_' + sector;
        let newclass = "player_color_"+sys.p[p].owner;
        $(divpid).removeClass("player_color_1");
        $(divpid).removeClass("player_color_2");
        $(divpid).removeClass("player_color_3");
        $(divpid).removeClass("player_color_4");
        $(divpid).removeClass("player_color_5");
        $(divpid).removeClass("player_color_6");
        $(divpid).addClass(newclass);
        $(divpid).css('display','block');
        $(divpid).css('opacity', '0.6');
        player_border_visible = 1;
      }
    }
  }

};


  unhighlightSectors() {
    for (let i in this.game.sectors) {
      this.removeSectorHighlight(i);
    }
  }

  showSectorHighlight(sector) { this.addSectorHighlight(sector); }
  hideSectorHighlight(sector) { this.removeSectorHighlight(sector); }
  addSectorHighlight(sector) {

alert("This is where we switch over to the new display");

    if (sector.indexOf("planet") == 0 || sector == 'new-byzantium') {
      sector = this.game.planets[sector].sector;
    }
    let sys = this.returnSectorAndPlanets(sector);
    let divname = "#hex_space_" + sys.s.tile;
    $(divname).css('background-color', '#900');
  }
  removeSectorHighlight(sector) {
    if (sector.indexOf("planet") == 0 || sector == 'new-byzantium') {
      sector = this.game.planets[sector].sector;
    }
    let sys = this.returnSectorAndPlanets(sector);
    let divname = "#hex_space_" + sys.s.tile;
    $(divname).css('background-color', 'transparent');
  }
  addPlanetHighlight(sector, pid)  {
    this.showSectorHighlight(sector);
// red overlay
//    let divname = ".sector_graphics_planet_" + sector + '_' + pid;
//    $(divname).show();
  }
  removePlanetHighlight(sector, pid)  {
    this.hideSectorHighlight(sector);
// red overlay
//    let divname = ".sector_graphics_planet_" + sector + '_' + pid;
//    $(divname).hide();
  }
  showActionCard(c) {
    let thiscard = this.action_cards[c];
    $('.cardbox').html('<img src="' + thiscard.img + '" style="width:100%" /><div class="action_card_overlay">'+thiscard.text+'</div>');
    $('.cardbox').show();
  }
  hideActionCard(c) {
    $('.cardbox').hide();
  }
  showStrategyCard(c) {
    let strategy_cards = this.returnStrategyCards();
    let thiscard = strategy_cards[c];
    $('.cardbox').html('<img src="' + thiscard.img + '" style="width:100%" /><div class="strategy_card_overlay">'+thiscard.text+'</div>');
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
    let thiscard = planets[this_planet_name];
    $('.cardbox').html('<img src="' + thiscard.img + '" style="width:100%" />');
    $('.cardbox').show();
  }
  hidePlanetCard(sector, pid) {
    $('.cardbox').hide();
  }
  showAgendaCard(agenda) {
    $('.cardbox').html('<img src="' + this.agenda_cards[agenda].img + '" style="width:100%" /><div class="agenda_card_overlay">'+this.agenda_cards[agenda].text+'</div>');
    $('.cardbox').show();
  }
  hideAgendaCard(sector, pid) {
    $('.cardbox').hide();
  }
  showTechCard(tech) {
    let html = this.returnTechCardHTML(tech);
    $('.cardbox').html(html);
    $('.cardbox').show();
  }
  hideTechCard(tech) {
    $('.cardbox').hide();
  }



