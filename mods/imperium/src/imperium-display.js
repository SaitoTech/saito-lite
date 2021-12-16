
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

  let xpos = 0;
  let ypos = 0;

//
// TODO remove jquery dependency
//
try {
  $('.sector').off();
  $('.sector').on('mouseenter', function () {
    pid = $(this).attr("id");
    imperium_self.showSector(pid);
  }).on('mouseleave', function () {
    pid = $(this).attr("id");
    imperium_self.hideSector(pid);
  });
  $('.sector').on('mousedown', function (e) {
    xpos = e.clientX;
    ypos = e.clientY;
  });
  $('.sector').on('mouseup', function (e) {
    if (Math.abs(xpos-e.clientX) > 4) { return; }
    if (Math.abs(ypos-e.clientY) > 4) { return; }
    pid = $(this).attr("id");
    imperium_self.overlay.showOverlay(imperium_self.app, imperium_self, imperium_self.returnSectorInformationHTML(pid));
  });
} catch (err) {}
}



returnActivatedSectorsOverlay() {
  let imperium_self = this;
  let html = `
    <div class="activated_sectors_overlay" id="activated_sectors_overlay">

<h2>No Ships Available!</h2>

<p style="margin-bottom:30px"></p>

The only ships that could move into this sector are in activated sectors. 

<p style="margin-bottom:30px"></p>

Once you have "activated" a sector. You cannot move ships into or out of it until next round.

<p style="margin-bottom:30px"></p>

</div>
<style>
.activated_sectors_overlay {
  padding:30px;
  width: 800px;
  max-width: 80vw;
  max-height: 90vh;
  font-family: 'orbitron-medium', helvetica, arial;
  line-height: 1.7em;
  font-size: 1.1em;
  background-image: url('/imperium/img/starscape-background4.jpg');
  background-size: cover;
  color: white;
  overflow-y: scroll;
  font-size:1.4em;
}
</style>
`;

  return html;
}





returnFirstTurnOverlay() {
  let imperium_self = this;
  let html = `
    <div class="how_to_play_overlay" id="how_to_play_overlay">

<h2>Your First Turn:</h2>

<p></p>

<img src="/imperium/img/firstturn.png" style="width:400px;float:left;padding-right:15px;padding-bottom:5px;" />

Your home world is bordered in your color. In Round 1, you can only activate 
sectors you can reach. To see ship movement, click on UNITS in the CARDS menu.
This will also show you build costs and strength in combat.

<p style="margin-bottom:10px"></p>

First turn? Try moving a CARRIER into a sector adjacent to your homeworld. 
Bring INFANTRY so your can INVADE a planet in that sector after your fleet has
moved. The <span class="resources_box">resources</span> and <span class="influence_box">influence</span>
 of the planets you conquer will be available to spend Round 2.

    </div>

    <style type="text/css">
.resources_box {
 background-color:black;padding:4px;border:1px solid #fff;
}
.influence_box {
  background-color:orange;padding:4px;border:1px solid #fff;
}
.how_to_play_overlay {
  padding:30px;
  width: 800px;
  max-width: 80vw;
  max-height: 90vh;
  font-family: 'orbitron-medium', helvetica, arial;
  line-height: 1.7em;
  font-size: 1.1em;
  background-image: url('/imperium/img/starscape-background4.jpg');
  background-size: cover;
  color: white;
  overflow-y: scroll;
  font-size:1.4em;
}
    </style>
  `;

  return html;
}

returnHowToPlayOverlay() {
  let imperium_self = this;
  let html = `

    <div class="how_to_play_overlay" id="how_to_play_overlay">

<h2>Your Goal:</h2>

<img src="/imperium/img/planets/BROUGHTON.png" class="demo_planet_card" />

<p></p>

Conquer planets to gain resources and influence:

<p></p>

<div style="padding-left:30px;padding-right:30px;">
<div class="how_to_play_resources_entry">
<b><span class="resources_box">RESOURCES</span></b>
<p></p>
build units and research technology.
</div>

<div class="how_to_play_resources_entry">
<b><span class="influence_box">INFLUENCE</span></b>
<p></p>
buy command tokens and vote on laws.
</div>
</div>


<h2 style="margin-top:30px">On Your Turn:</h2>

<div style="padding-left:30px;font-family:'orbitron-medium', helvetica, arial;line-height:2em;">
  <ol class="demo_ordered_list" style="font-family: 'orbitron-medium', helvetica, arial">
    <li>Spend a command token to activate a sector</li>
      <ul style="margin-left:20px">
        <li style="list-style:none">- to move ships into the sector</li>
        <li style="list-style:none">- to produce in the sector</li>
      </ul>
    <li>Play a strategy card</li>
    <li>Pass</li>
  </ol>
</div>

    </div>
    </style>
  `;

  return html;
}

returnMovementOverlay() {
  let imperium_self = this;
  let html = `

    <div class="how_to_play_overlay" id="how_to_play_overlay">

<h2>Moving Ships:</h2>

<p style="margin-top:15px"></p>

Each ship can move a maximum number of hexes per turn. The INFO > UNITS 
menu will show you how many hexes.

<p style="margin-top:15px"></p>

To move a ship, activate the destination sector. You will be able to 
to select the ships you wish to move.

<p style="margin-top:15px"></p>

Some tech upgrades and action cards can increase movement distance. You 
can also <b>upgrade</b> units to increase combat and movement.


<h2 style="margin-top:30px">Carrying Units:</h2>

<p style="margin-top:15px"></p>

Some units like the CARRIER have the capacity to carry planet-based 
units like INFANTRY. You need these units to invade and controls
planets..

<p style="margin-top:15px"></p>

Capacity of each ship can be found in the INFO > UNITS menu.

</div>

    </div>
  `;

  return html;
}

returnCombatOverlay() {
  let imperium_self = this;
  let html = `

    <div class="how_to_play_overlay" id="how_to_play_overlay">

<h2>Space Battles:</h2>

<p style="margin-top:15px"></p>

The strength of each ship in combat can be found on the INFO > UNITS
menu. This is the number which must be rolled on a 10-sided dice to
secure a hit in combat.

<p style="margin-top:15px"></p>

In combat both players fire all available units, and both players then
take damage. Combat ends when one player is destroyed or retreats from
the battle.

<p style="margin-top:15px"></p>

Space battles are automated. If you have action cards that will
modify combat or allow you to avoid damage you will have the option to 
play them during your turn.

<p style="margin-top:15px"></p>

The order of combat:

<p style="margin-top:15px"></p>

<div style="padding-left:30px;font-family:'orbitron-medium', helvetica, arial;line-height:2em;">
  <ol class="demo_ordered_list" style="font-family: 'orbitron-medium', helvetica, arial">
    <li>PDS combat (optional)</li>
    <li>Anti-fighter barrage</li>
    <li>Space Combat</li>
  </ol>
</div>

<h2 style="clear:both;margin-top:35px;">Ground Combat:</h2>

<div style="padding-left: 30px">

Ground combat works like space combat. The sequence of events:

<p style="margin-top:15px"></p>

<div style="padding-left:30px;font-family:'orbitron-medium', helvetica, arial;line-height:2em;">
  <ol class="demo_ordered_list" style="font-family: 'orbitron-medium', helvetica, arial">
    <li>Bombardment (optional)</li>
    <li>Landing of Infantry</li>
    <li>Ground Combat</li>
  </ol>
</div>

<p style="margin-top:15px"></p>

Ground combat ends when one player's infantry are totally destroyed. The 
winner holds the planet, regardless of who controls the sector in space.

</div>

    </div>
  `;

  return html;
}

returnFactionOverlay() {
  let imperium_self = this;
  let html = `

    <div class="how_to_play_overlay" id="how_to_play_overlay">

<h2 style="clear:both;margin-top:35px;">Faction Abilities:</h2>

<div style="padding-left: 30px">

<img src="/imperium/img/factions/faction_dashboard.png" class="demo_planet_card" />

<p></p>

The faction dashboard shows the total influence and resources controlled by 
every faction. The third hex is the number of trade goods held by each 
faction. Trade goods may be spent 1-for-1 in lieu of resources or influence.

<p></p>

<div style="padding-left:30px;padding-right:30px;">
<div class="how_to_play_resources_entry">
<b>TRADE GOODS:</b>
<p></p>
can be used instead of resources or influence.
</div>

<div class="how_to_play_resources_entry">
<b>COMMODITIES:</b>
<p></p>
turn into trade goods when you trade them away
</div>
</div>

<p style="margin-top:15px"></p>

Learn more about the factions in the game by clicking on their faction 
dashboard. Each faction has unique faction abilities that can change the 
game radically. Learn your opponent's weaknesses and strengths.

    </div>
  `;

  return html;
}




returnNewSecretObjectiveOverlay(card) {
  let obj = this.secret_objectives[card];
  let html = `
    <div class="new_secret_objective_overlay" id="new_secret_objective_overlay">
      <div style="width:100%"><div class="new_secret_objective_overlay_title">New Secret Objective</div></div>
      <div style="width:100%"><div style="display:inline-block">
      <div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
        <div class="objectives_card_name">${obj.name}</div>
        <div class="objectives_card_content">
          ${obj.text}
        <div class="objectives_secret_notice">secret</div>
      </div>
      </div></div>
    </div>
  `;
  return html;
}


returnTechOverlay() {
  let html = '<div class="tech_overlay overlay" id="tech_overlay"><img src="/imperium/img/tech_tree.png" style="height:90vh;width:auto"></div>';
  return html;
}


returnSectorInformationHTML(sector) {

  if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

  let sys = this.returnSectorAndPlanets(sector);
  let html = `
    <div class="system_summary">
      <div class="system_summary_text">
  `;

  html += '<div class="system_summary_sector">';
  html += sys.s.name;
  html += "</div>";
  let units_html = "";
  for (let i = 0; i < sys.s.units.length; i++) {
    if (sys.s.units[i].length > 0) {
      units_html += this.returnPlayerFleetInSector((i+1), sector);
      i = sys.s.units.length;
    }
  }
  
  if (units_html != "") {
    html += '<div class="system_summary_units">';
    html += units_html;
    html += '</div>';
  }

  html += `
    <div class="grid-2">
  `;
  for (let i = 0; i < sys.p.length; i++) {
    let planet_owner = "UNCONTROLLED";
    if (sys.p[i].owner != -1) {
      planet_owner = this.returnFactionNickname(sys.p[i].owner);
    }
    html += `
      <div class="system_summary_planet">
        ${planet_owner}
        <p style="margin-top:10px" />
        <div style='clear:both;margin-left:10px;margin-top:6px;'>
          ${this.returnInfantryOnPlanet(sys.p[i])} infantry
          <br />
          ${this.returnPDSOnPlanet(sys.p[i])} PDS
          <br />
          ${this.returnSpaceDocksOnPlanet(sys.p[i])} spacedocks
        </div>
      </div>
      <div class="system_summary_planet_card" style="background-image: url('${sys.p[i].img}');"></div>
    `;
  }
  html += `
    </div>
  </div>
  `;

  return html;

}

     

updateCombatLog(cobj) {

  let are_there_rerolls = 0;
  let are_there_modified_rolls = 0;

  for (let i = 0; i < cobj.units_firing.length; i++) {
    if (cobj.reroll[i] == 1) { are_there_rerolls = 1; }
    if (cobj.modified_roll[i] != cobj.unmodified_roll[i]) { are_there_modified_rolls = 1; }
  }

  let html = '';
      html += '<table class="combat_log">';
      html += '<tr>';
      html += `<th class="combat_log_th">${this.returnFactionNickname(cobj.attacker)}</th>`;
      html += '<th class="combat_log_th">HP</th>';
      html += '<th class="combat_log_th">Combat</th>';
      html += '<th class="combat_log_th">Roll</th>';
  if (are_there_modified_rolls) {
      html += '<th class="combat_log_th">Modified</th>';
  }
  if (are_there_rerolls) {
      html += '<th class="combat_log_th">Reroll</th>';
  }
      html += '<th class="combat_log_th">Hit</th>';
      html += '</tr>';
  for (let i = 0; i < cobj.units_firing.length; i++) {
      html += '<tr>';
      html += `<td class="combat_log_td">${cobj.units_firing[i].name}</td>`;
      html += `<td class="combat_log_td">${cobj.units_firing[i].strength}</td>`;
      html += `<td class="combat_log_td">${cobj.hits_on[i]}</td>`;
      html += `<td class="combat_log_td">${cobj.unmodified_roll[i]}</td>`;
  if (are_there_modified_rolls) {
      html += `<td class="combat_log_td">${cobj.modified_roll[i]}</td>`;
  }
  if (are_there_rerolls) {
      html += `<td class="combat_log_td">${cobj.reroll[i]}</td>`;
  }
      html += `<td class="combat_log_td">${cobj.hits_or_misses[i]}</td>`;
      html += '</tr>';
  }
      html += '</table>';

  this.updateLog(html);

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
  let powner = '';

  if(this.game.planets[planet].owner > 0) {
    powner = "p" + this.game.planets[planet].owner;
  } else {
    powner = "nowner";
  }


  let html = '';

  if (ionp > 0) {
    html += '<div class="planet_infantry_count_label">Infantry</div><div class="planet_infantry_count">'+ionp+'</div>';
  }

  if (ponp > 0) {
    html += '<div class="planet_pds_count_label">PDS</div><div class="planet_pds_count">'+ponp+'</div>';
  }

  if (sonp > 0) {
    html += '<div class="planet_spacedock_count_label">Spacedock</div><div class="planet_spacedock_count">'+sonp+'</div>';
  }

  if (this.game.planets[planet].bonus != "") {
    html += '<div class="planet_tech_label tech_'+this.game.planets[planet].bonus+' bold">'+this.game.planets[planet].bonus+' TECH</div><div></div>';
  }

  if (ponp+sonp+ionp > 0 || this.game.planets[planet].bonus != "") {
    html = `<div class="sector_information_planetname ${powner}">${p.name}</div><div class="sector_information_planet_content">` + html + `</div>`;
  } else {
    html = `<div class="sector_information_planetname ${powner}">${p.name}</div>`;
  }

  return html;

}

returnFactionDashboard(agenda_phase=0) {

  let html = '';
  for (let i = 0; i < this.game.players_info.length; i++) {

    html += `

    <div data-id="${(i+1)}" class="dash-faction p${i+1}">
     <div data-id="${(i+1)}" class="dash-faction-name bk"></div>
    `;

    if (agenda_phase == 1) {
    html += `
      <div data-id="${(i+1)}" class="dash-faction-agenda">
        <div data-id="${(i+1)}" class="dash-item-agenda-influence agenda-influence">
          <span data-id="${(i+1)}" class="avail">${this.game.state.votes_available[i]}</span>
        </div>
      </div>
    `;
    } else {
    html += `
      <div data-id="${(i+1)}" class="dash-faction-info">
        <div data-id="${(i+1)}" class="dash-item tooltip dash-item-resources resources">
          <span data-id="${(i+1)}" class="avail"></span>
          <span data-id="${(i+1)}" class="total"></span>
        </div>

        <div data-id="${(i+1)}" class="dash-item tooltip dash-item-influence influence">
          <span data-id="${(i+1)}" class="avail"></span>
          <span data-id="${(i+1)}" class="total"></span>
        </div>

        <div data-id="${(i+1)}" class="dash-item tooltip dash-item-trade trade">
          <i data-id="${(i+1)}" class="fas fa-database pc white-stroke"></i>
          <div data-id="${(i+1)}" id="dash-item-goods" class="dash-item-goods">
            ${this.game.players_info[i].goods}
          </div>
        </div>
      </div>
    `;
    }
    html += `
      <div data-id="${(i+1)}" class="dash-faction-base">
	<div data-id="${(i+1)}" class="dash-faction-status-${(i+1)} dash-faction-status"></div>
	commodities : <span data-id="${(i+1)}" class="dash-item-commodities">${this.game.players_info[i].commodities}</span> / <span data-id="${(i+1)}" class="dash-item-commodity-limit">${this.game.players_info[i].commodity_limit}</span>
      </div>

      <div data-id="${(i+1)}" class="dash-faction-speaker`;
      if (this.game.state.speaker == (i+1)) {  html += ' speaker">speaker'; } else { html += '">'; }
      html += `</div>
    </div>
    `;

  }
  return html;

}


returnLawsOverlay() {

  let laws = this.returnAgendaCards();
  let html = '<div class="overlay_laws_container">';

  if (this.game.state.laws.length > 0) {
      html += '<ul style="clear:both;margin-top:10px;">';
      for (let i = 0; i < this.game.state.laws.length; i++) {
        html += `  <li style="background-image: url('/imperium/img/agenda_card_template.png');background-size:cover;" class="overlay_agendacard card option" id="${i}"><div class="overlay_agendatitle">${laws[this.game.state.laws[i].agenda].name}</div><div class="overlay_agendacontent">${laws[this.game.state.laws[i].agenda].text}</div><div class="overlay_law_option">${this.returnNameOfUnknown(this.game.state.laws[i].option)}</div></li>`;
      }
      html += '</ul>';
  }

  if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += '<div class="overlay_laws_header">There are no laws in force or agendas up for consideration at this time.</div>';
  }

  html += '</div>';

  return html;

}



returnAgendasOverlay() {

  let laws = this.returnAgendaCards();
  let html = '<div class="overlay_laws_container">';

  if (this.game.state.agendas.length > 0) {
      html += '<div class="overlay_laws_list">';
      for (let i = 0; i < this.game.state.agendas.length; i++) {
        html += `  <div style="background-image: url('/imperium/img/agenda_card_template.png');" class="overlay_agendacard card option" id="${i}"><div class="overlay_agendatitle">${laws[this.game.state.agendas[i]].name}</div><div class="overlay_agendacontent">${laws[this.game.state.agendas[i]].text}</div></div>`;
      }
      html += '</div>';
  }

  if (this.game.state.laws.length == 0 && this.game.state.agendas.length == 0) {
      html += '<div class="overlay_laws_header">There are no laws in force or agendas up for consideration at this time.</div>';
  }

  html += '</div>';

  return html;

}



returnUnitsOverlay() {

  let html = `<div class="units-overlay-container" style="">`;
  let units = [];
  let imperium_self = this;

  if (this.game.state.round == 1) {
    html += `
      <div style="width:100%;text-align:center"><div class="units-overlay-text" style="line-height: 1.4em; font-size: 1.8em; margin-top: 50px; margin-bottom: 30px; padding: 20px;">
        units <b>COST</b> resources to produce
<p style="margin-top:10px"></p>
        ships <b>MOVE</b> a maximum number of hexes
<p style="margin-top:10px"></p>
	some <b>CARRY</b> infantry or fighters
<p style="margin-top:10px"></p>
	lower <b>COMBAT</b> scores hit more often

      </div></div>
      <div class="unit-table">
    `;

    let fleet = this.returnPlayerFleet(this.game.player);

    if (fleet.carriers > 0) 	{ units.push("carrier"); }
    if (fleet.cruisers > 0) 	{ units.push("cruiser"); }
    if (fleet.destroyers > 0) 	{ units.push("destroyer"); }
    if (fleet.dreadnaughts > 0) { units.push("dreadnaught"); }
    if (fleet.warsuns > 0) 	{ units.push("warsun"); }
    if (fleet.fighters > 0) 	{ units.push("fighter"); }
    if (fleet.infantry > 0) 	{ units.push("infantry"); }
    if (fleet.flagships > 0) 	{ units.push("flagship"); }
    if (fleet.pds > 0) 		{ units.push("pds"); }
    if (fleet.spacedocks > 0) 	{ }

  } else {
    let player = this.game.players_info[this.game.player-1];

    html += `
      <div style="width:100%;text-align:center"><div class="units-overlay-title">Your Units</div></div>
      <div style="width:100%;text-align:center"><div class="units-overlay-text">check available upgrades in your faction overlay...</div></div>
      <div class="unit-table">
    `;

    if (imperium_self.doesPlayerHaveTech(this.game.player, "infantry-ii")) {
      units.push("infantry-ii");
    } else {
      units.push("infantry");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "fighter-ii")) {
      units.push("fighter-ii");
    } else {
      units.push("fighter");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "destroyer-ii")) {
      units.push("destroyer-ii");
    } else {
      units.push("destroyer");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "carrier-ii")) {
      units.push("carrier-ii");
    } else {
      units.push("carrier");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "cruiser-ii")) {
      units.push("cruiser-ii");
    } else {
      units.push("cruiser");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "dreadnaught-ii")) {
      units.push("dreadnaught-ii");
    } else {
      units.push("dreadnaught");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "flagship-ii")) {
      units.push("flagship-ii");
    } else {
      units.push("flagship");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "warsun-ii")) {
      units.push("warsun-ii");
    } else {
      if (player.may_produce_warsuns == 1) {
        units.push("warsun");
      }
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "spacedock-ii")) {
      units.push("spacedock-ii");
    } else {
      units.push("spacedock");
    }

    if (imperium_self.doesPlayerHaveTech(this.game.player, "pds-ii")) {
      units.push("pds-ii");
    } else {
      units.push("pds");
    }

  }

  for (let i = 0; i < units.length; i++) {
    html += this.returnUnitTableEntry(units[i]);
  }

  html += `

    <div id="close-units-btn" class="button" style="">CONTINUE</div>

  `;

  return html;
}


returnUnitPopup(unittype) {

  let html = `

    <div class="unit_details_popup">
      ${this.returnUnitPopupEntry(unittype)}}
    </div

  `;

  return html;

}
returnUnitPopupEntry(unittype) {

  let obj = this.units[unittype];
  if (!obj) { return ""; }

  let html = `
      <div class="unit-element" style="background:#333c;width:100%;padding:5%;border-radius:5px;font-size:0.7em;">
        <div class="unit-box-ship unit-box-ship-${unittype}" style="width:100%"></div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.cost}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">cost</div>
	</div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.move}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">move</div>
	</div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.combat}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">combat</div>
	</div>
        <div class="unit-box" style="width:24.5%;height:auto;padding-bottom:10px;">
	  <div class="unit-box-num" style="font-size:2.8em">${obj.capacity}</div>
	  <div class="unit-box-desc" style="font-size:1.4em;padding-top:5px;">carry</div>
	</div>
        <div class="unit-description" style="font-size:1.1em">${obj.description}.</div>
      </div>
    `;

  return html;

}

returnUnitTableEntry(unittype) {

console.log("UNIT: " + unittype);

  let preobj = this.units[unittype];
  let obj = JSON.parse(JSON.stringify(preobj));

  obj.owner = this.game.player;
  obj = this.upgradeUnit(obj, this.game.player);

  if (!obj) { return ""; }

  let html = `
      <div class="unit-element">
        <div class="unit-box-ship unit-box-ship-${unittype}"></div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.cost}</div>
	  <div class="unit-box-desc">cost</div>
	</div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.move}</div>
	  <div class="unit-box-desc">move</div>
	</div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.combat}</div>
	  <div class="unit-box-desc">combat</div>
	</div>
        <div class="unit-box">
	  <div class="unit-box-num">${obj.capacity}</div>
	  <div class="unit-box-desc">carry</div>
	</div>
        <div class="unit-description">${obj.description}.</div>
      </div>
    `;

  return html;

}



returnNewActionCardsOverlay(cards) {

  let title = "Your New Action Cards";

  let html = `
    <div class="new_action_cards_overlay_container" style="">
      <div class="new_action_cards_title">${title}</div>
      <div style="width:100%"><div class="new_objectives_text">click on your faction to see all your action cards anytime...</div></div>
      <div class="new_action_cards">
  `;

  for (let i = 0; i < cards.length; i++) {
    html += `
      <div class="overlay_action_card bc">
        <div class="action_card_name">${this.action_cards[cards[i]].name}</div>
        <div class="action_card_content">${this.action_cards[cards[i]].text}</div>
      </div>
    `;
  }
  html += `
      </div>
      <div id="close-action-cards-btn" class="button" style="">CONTINUE</div>
    </div>
  `;
  return html;
}



returnObjectivesOverlay() {

  let html = '';
  let imperium_self = this;

  html += '<div class="objectives-overlay-container" style="">';

  //
  // SECRET OBJECTIVES
  //
  for (let i = 0; i < imperium_self.game.deck[5].hand.length; i++) {
    if (!imperium_self.game.players_info[imperium_self.game.player - 1].objectives_scored.includes(imperium_self.game.deck[5].hand[i])) {
      let obj = imperium_self.secret_objectives[imperium_self.game.deck[5].hand[i]];
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
                 <div class="objectives_card_name">${obj.name}</div>
                 <div class="objectives_card_content">${obj.text}
		   <div class="objectives_secret_notice">secret</div>
		 </div>
	       </div>
      `;
    }
  }

  //
  // STAGE 1 OBJECTIVES
  //
  for (let i = 0; i < this.game.state.stage_i_objectives.length; i++) {
    let obj = this.stage_i_objectives[this.game.state.stage_i_objectives[i]];
    html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
               <div class="objectives_card_name">${obj.name}</div>
               <div class="objectives_card_content">${obj.text}</div>
               <div class="objectives_scorings">
    `;
    for (let p = 0; p < this.game.players_info.length; p++) {
      for (let z = 0; z < this.game.players_info[p].objectives_scored.length; z++) {
        if (this.game.state.stage_i_objectives[i] === this.game.players_info[p].objectives_scored[z]) {
          html += `<div class="objectives_players_scored players_scored_${(p+1)} p${(p+1)}"><div class="bk" style="width:100%;height:100%"></div></div>`;
        }
      }
    }
    html += `</div>`;
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
               <div class="objectives_scorings">
    `;
    for (let p = 0; p < this.game.players_info.length; p++) {
      for (let z = 0; z < this.game.players_info[p].objectives_scored.length; z++) {
        if (this.game.state.stage_ii_objectives[i] === this.game.players_info[p].objectives_scored[z]) {
          html += `<div class="objectives_players_scored players_scored_${(p+1)} p${(p+1)}"><div class="bk" style="width:100%;height:100%"></div></div>`;
        }
      }
    }
    html += `</div>`;
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
      html += `<div class="objectives_overlay_objectives_card" style="background-image: url(${objc[o].img})">
               <div class="objectives_card_name">${objc[o].name}</div>
               <div class="objectives_card_content">${objc[o].text}</div>
               <div class="objectives_players_scored players_scored_${(i+1)} p${(i+1)}"><div class="bk" style="width:100%;height:100%"></div></div>
             </div>`;
    }
  }

  html += '</div>';

  return html;

}




displayFactionDashboard(agenda_phase=0) {

  let imperium_self = this;

  try {

    document.querySelector('.dashboard').innerHTML = this.returnFactionDashboard(agenda_phase);

    let pl = "";
    let fo = "";
    for (let i = 0; i < this.game.players_info.length; i++) {

      pl = "p" + (i+1);
      fo = ".dash-faction."+pl;

      let total_resources = this.returnTotalResources((i+1)) - this.game.players_info[i].goods;
      let available_resources = this.returnAvailableResources((i+1)) - this.game.players_info[i].goods;
      let total_influence = this.returnTotalInfluence((i+1)) - this.game.players_info[i].goods;
      let available_influence = this.returnAvailableInfluence((i+1)) - this.game.players_info[i].goods;

      document.querySelector(`.${pl} .dash-faction-name`).innerHTML = this.returnFaction(i+1);
      try {
// availableinfluence first as rest will error-out on agenda overlay
      document.querySelector(`.${pl} .influence .avail`).innerHTML = available_influence;
      document.querySelector(`.${pl} .influence .total`).innerHTML = total_influence;
      document.querySelector(`.${pl} .resources .avail`).innerHTML = available_resources;
      document.querySelector(`.${pl} .resources .total`).innerHTML = total_resources;
      document.querySelector(`.${pl} .dash-item-goods`).innerHTML = this.game.players_info[i].goods;
      document.querySelector(`.${pl} .dash-item-commodities`).innerHTML = this.game.players_info[i].commodities;
      document.querySelector(`.${pl} .dash-item-commodity-limit`).innerHTML = this.game.players_info[i].commodity_limit;
      } catch (err) {}

      document.querySelector(fo).onclick = (e) => {
        imperium_self.displayFactionSheet((i+1));
      }

    }

/****
    $('.dash-item-resources').on('mouseenter', function() {
      imperium_self.showHelpCard("resources");
    }).on('mouseleave', function() {
      imperium_self.hideHelpCard();
    });

    $('.dash-item-influence').on('mouseenter', function() {
      imperium_self.showHelpCard("influence");
    }).on('mouseleave', function() {
      imperium_self.hideHelpCard();
    });

    $('.dash-item-trade').on('mouseenter', function() {
      imperium_self.showHelpCard("trade");
    }).on('mouseleave', function() {
      imperium_self.hideHelpCard();
    });
****/

  } catch (err) {
console.log("ERROR: " + err);
  }
}


displayFactionSheet(player) {

  let imperium_self = this;
  let html = imperium_self.returnFactionSheet(imperium_self, player);
  imperium_self.overlay.showOverlay(imperium_self.app, imperium_self, html);

}
returnFactionSheet(imperium_self, player=null) {

  if (!player) { player = imperium_self.game.player; }
  let player_class = "";
  let border_color = "";
  if (player != null) { player_class = "p"+player; border_color = "bc"+player;  }

  let html = `
      <div class="faction_sheet_container ${player_class} ${border_color}" style="overflow-y:scroll;padding:15px;;width:90vw;height:90vh;background-image:url('/imperium/img/factions/${imperium_self.game.players_info[player-1].faction}.jpg');background-size:cover;">
        <div class="faction_sheet_token_box" id="faction_sheet_token_box">
          <div class="faction_sheet_token_box_title">Command</div>
          <div class="faction_sheet_token_box_title">Strategy</div>
          <div class="faction_sheet_token_box_title">Fleet</div>
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
    // FACTION ABILITIES
    //
    html += `
      <div class="faction_sheet_tech_box" id="faction_sheet_abilities_box">
    `;
    for (let i = 0; i < imperium_self.game.players_info[player-1].tech.length; i++) {
      let tech = imperium_self.tech[imperium_self.game.players_info[player-1].tech[i]];
      if (tech.type == "ability") {
	let unmodded = tech.returnCardImage();
	html += unmodded.replace(/card_nonopaque/g, 'bc');
      }
    }
    html += `</div>`;

    
     //
     // tech
     //
     html += `
      <div class="faction_sheet_tech_box" id="faction_sheet_tech_box">
    `;
    //
    // tech we have
    //
    for (let i = 0; i < imperium_self.game.players_info[player-1].tech.length; i++) {
      let techname = imperium_self.game.players_info[player-1].tech[i];
      let tech = imperium_self.tech[techname];
      if (tech.type != "ability") {
	html += tech.returnCardImage();
      }
    }
    //
    // faction tech we do not have... yet
    //
    for (i in imperium_self.tech) {
      let tech = imperium_self.tech[i];
      if (tech.type == "special") {
	if (!imperium_self.game.players_info[player-1].tech.includes(i)) {
 	  if (imperium_self.game.players_info[player-1].faction == tech.faction) {
	    let unmodded = tech.returnCardImage();
	    html += unmodded.replace(/card_nonopaque/g, 'card_opaque');
	  }
	}
      }
    }
    html += `</div>`;





    //
    // ACTION CARDS
    //
    let ac = imperium_self.returnPlayerActionCards(imperium_self.game.player);
    if (ac.length > 0) {
      html += `
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
      //html += `</div>`;
    }

    //
    // PLANET CARDS
    //
    //html += `
    //  <div class="faction_sheet_planet_card_box" id="faction_sheet_planet_card_box">
    //`;
  
    let pc = imperium_self.returnPlayerPlanetCards(player);
    for (let b = 0; b < pc.length; b++) {
      let exhausted = "";
      if (this.game.planets[pc[b]].exhausted == 1) { exhausted = "exhausted"; }
      html += `<div class="faction_sheet_planet_card bc ${exhausted}" id="${pc[b]}" style="background-image: url(${this.game.planets[pc[b]].img});"></div>`
    }
    html += `
      </div>
    `;

  return html;
}





addUIEvents() {

  var imperium_self = this;

  if (this.browser_active == 0) { return; }

  $('#hexGrid').draggable();

  document.querySelector('.leaderboardbox').addEventListener('click', (e) => {
    document.querySelector('.leaderboardbox').toggleClass('leaderboardbox-lock');
  });

  //set player highlight color
  document.documentElement.style.setProperty('--my-color', `var(--p${this.game.player})`);

  this.displayFactionDashboard();
  var html = this.returnTokenDisplay(); 

  document.querySelector('.hud-header').append(this.app.browser.htmlToElement(html));

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

  let hex_space = ".sector_graphics_space_" + pid;
//  let hex_ground = ".sector_graphics_planet_" + pid;
//
//  $(hex_ground).fadeOut();
  $(hex_space).fadeIn();

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

    //
    // hide unnecessary VP entries
    //
    try {
      if (this.game.state.vp_target < 14) {
        for (let i = 14; i > this.game.state.vp_target; i--) {
          let leaderboard_div = "."+i+"-points"; 
          document.querySelector(leaderboard_div).style.display = "none";
        }
      }
    } catch (err) { 
    }


    document.querySelector('.round').innerHTML = this.game.state.round;
    document.querySelector('.turn').innerHTML = this.game.state.turn;

    let html = '<div class="VP-track-label">Victory Points</div>';

    let vp_needed = 14;
    if (this.game.state.vp_target != 14 && this.game.state.vp_target > 0) { vp_needed = this.game.state.vp_target; }
    if (this.game.options.vp) { vp_needed = parseInt(this.game.options.vp); }

    for (let j = vp_needed; j >= 0; j--) {
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

  if (sys == undefined) { return; }
  if (sys == null) { return; }
  if (sys.s == undefined) { return; }
  if (sys.s == null) { return; }
  try {

  if (sector.indexOf("_") == -1) { sector = sys.s.tile; }

  for (let i = 0; i < this.game.players_info.length; i++) {
    if (this.game.queue.length > 0) {
      let lmv = this.game.queue[this.game.queue.length-1].split("\t");
      //
      // don't prune if midway through destroying units, as causes array issues
      //
      if (lmv[0] !== "destroy_unit" && lmv[0] !== "assign_hit") {
        this.eliminateDestroyedUnitsInSector((i+1), sector);
      }
    }
  }


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


  //
  // if player_fleet_drawn is 0 then remove any space ships
  //
  if (player_fleet_drawn == 0) {
    let old_images = "#hex_bg_" + sector + " > .sector_graphics";
    $(old_images).remove();
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
        //$(divsector2).append('<img class="sector_graphics ' + player_color + ' sector_graphics_planet sector_graphics_planet_' + sector + ' sector_graphics_planet_' + sector + '_' + pid + ' ' + ground_pos[i] + '" src="/imperium/img/frame/' + ground_frames[i] + '" />');
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

  } catch (err) {}

};


  unhighlightSectors() {
    for (let i in this.game.sectors) {
      this.removeSectorHighlight(i);
    }
  }


  showUnit(unittype) {
    let unit_popup = this.returnUnitPopup(unittype);
    this.cardbox.showCardboxHTML("", unit_popup, "", function() {});
  }
  hideUnit(unittype) {
    this.cardbox.hideCardbox(1);
  }

  showSectorHighlight(sector) { this.addSectorHighlight(sector); }
  hideSectorHighlight(sector) { this.removeSectorHighlight(sector); }
  addSectorHighlight(sector) {

    if (sector.indexOf("_") > -1) { sector = this.game.board[sector].tile; }

    let sys = this.returnSectorAndPlanets(sector);

    try {
    if (sector.indexOf("planet") == 0 || sector == 'new-byzantium') {
      sector = this.game.planets[sector].sector;
    }

    let divname = ".sector_graphics_space_" + sys.s.tile;
    $(divname).css('display', 'none');

    // if we got here but the sector has no planets, nope out.
    if (!this.game.sectors[sector].planets) { return;}
    if (this.game.sectors[sector].planets.length == 0) { return;}

    //handle writing for one or two planets
    var info_tile = document.querySelector("#hex_info_" + sys.s.tile);

    let html = '';

    if (this.game.sectors[sector].planets.length == 1) {
      html = this.returnPlanetInformationHTML(this.game.sectors[sector].planets[0]);
      info_tile.innerHTML = html;
      info_tile.classList.add('one_planet');
    } else {
      html = '<div class="top_planet">';
      html += this.returnPlanetInformationHTML(this.game.sectors[sector].planets[0]);
      html += '</div><div class="bottom_planet">';
      html += this.returnPlanetInformationHTML(this.game.sectors[sector].planets[1]);
      html += '</div>';
      info_tile.innerHTML = html;
      info_tile.classList.add('two_planet');
    }

    document.querySelector("#hexIn_" + sys.s.tile).classList.add('bi');
    } catch (err) {}
  }

  removeSectorHighlight(sector) {
    try {
    if (sector.indexOf("planet") == 0 || sector == 'new-byzantium') {
      sector = this.game.planets[sector].sector;
    }
    let sys = this.returnSectorAndPlanets(sector);

    let divname = ".sector_graphics_space_" + sys.s.tile;
    $(divname).css('display', 'all');

    //let divname = "#hex_space_" + sys.s.tile;
    //$(divname).css('background-color', 'transparent');
    document.querySelector("#hexIn_" + sys.s.tile).classList.remove('bi');
    } catch (err) {}
  }

  addPlanetHighlight(sector, pid)  {
    if (sector.indexOf("_") > -1) { 
      sector = this.game.board[sector].tile;
    }
    this.showSectorHighlight(sector);
  }
  removePlanetHighlight(sector, pid)  {
    this.hideSectorHighlight(sector);
  }
  showHelpCard(type) {
    let html = "";

    if (type == "resources") { html = `<div style="width:100%; height: 100%"><img style="width:100%;height:auto;" src="/imperium/img/resources_dash_card.png" /></div>`; }
    if (type == "influence") { html = `<div style="width:100%; height: 100%"><img style="width:100%;height:auto;" src="/imperium/img/influence_dash_card.png" /></div>`; }
    if (type == "trade")     { html = `<div style="width:100%; height: 100%"><img style="width:100%;height:auto;" src="/imperium/img/trade_dash_card.png" /></div>`; }

    this.cardbox.showCardboxHTML(null, html);
  }
  hideHelpCard(c) {
    this.cardbox.hideCardbox(1);
  }

  showActionCard(c) {
    let thiscard = this.action_cards[c];
    let html = `
      <div class="overlay_action_card bc">
        <div class="action_card_name">${thiscard.name}</div>
        <div class="action_card_content">${thiscard.text}</div>
      </div>
    `;
    this.cardbox.showCardboxHTML(thiscard, html);
  }
  hideActionCard(c) {
    this.cardbox.hideCardbox(1);
  }
  showStrategyCard(c) {

    let strategy_cards = this.returnStrategyCards();
    let thiscard = strategy_cards[c];

    // - show bonus available
    let strategy_card_bonus = 0;
    for (let i = 0; i < this.game.state.strategy_cards.length; i++) {
      if (thiscard === this.game.state.strategy_cards[i]) {
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

    }
    //this.cardbox.showCardboxHTML(thiscard, '<img src="/imperium/img' + thiscard.img + '" style="width:100%" /><div class="strategy_card_overlay">'+thiscard.text+'</div>'+strategy_card_bonus_html);
    this.cardbox.showCardboxHTML(thiscard, thiscard.returnCardImage());
  }

  hideStrategyCard(c) {
    this.cardbox.hideCardbox(1);
  }
  showPlanetCard(sector, pid) {
    let planets = this.returnPlanets();
    let systems = this.returnSectors();
    let sector_name = this.game.board[sector].tile;
    let this_planet_name = systems[sector_name].planets[pid];
    let thiscard = planets[this_planet_name];
    this.cardbox.showCardboxHTML(thiscard, '<img src="' + thiscard.img + '" style="width:100%" />');
  }
  hidePlanetCard(sector, pid) {
    this.cardbox.hideCardbox(1);
  }
  showAgendaCard(agenda) {
    let thiscard = this.agenda_cards[agenda];
    let html = `
      <div style="background-image: url('/imperium/img/agenda_card_template.png');width:100%;height:100%;" class="overlay_agendacard card option" id="${agenda}">
        <div class="overlay_agendatitle">${thiscard.name}</div>
        <div class="overlay_agendacontent">${thiscard.text}</div>
      </div>
    `;
    this.cardbox.showCardboxHTML(thiscard, html);
  }
  hideAgendaCard(sector, pid) {
    this.cardbox.hideCardbox(1);
  }
  showTechCard(tech) {
    this.cardbox.showCardboxHTML(tech, this.tech[tech].returnCardImage());
  }
  hideTechCard(tech) {
    this.cardbox.hideCardbox(1);
  }


  returnShortGameOptionsArray(options) {

    let sgoa = super.returnShortGameOptionsArray(options);
    let ngoa = [];

    for (let i in sgoa) {
      if (sgoa[i] != "") {

        let okey = i;
        let oval = options[i];

        let output_me = 1;
        if (i == "game_length") { okey = "VP"; }

        if (output_me == 1) {
          ngoa[okey] = oval;
        }
      }
    }

    return ngoa;
  }



