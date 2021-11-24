  
  
  returnFactions() {
    return this.factions;
  }
  
  importFaction(name, obj) {

    if (obj.id == null)			{ obj.id = "faction"; }
    if (obj.name == null) 		{ obj.name = "Unknown Faction"; }
    if (obj.nickname == null)		{ obj.nickname = obj.name; }
    if (obj.homeworld  == null) 	{ obj.homeworld = "sector32"; }
    if (obj.space_units == null) 	{ obj.space_units = []; }
    if (obj.ground_units == null) 	{ obj.ground_units = []; }
    if (obj.action_cards == null)  	{ obj.action_cards = []; }
    if (obj.objectives == null)  	{ obj.objectives = []; }
    if (obj.ground_units == null) 	{ obj.ground_units = []; }
    if (obj.tech == null) 		{ obj.tech = []; }
    if (obj.intro == null) 		{ obj.intro = `
        <div style="font-weight:bold">The Republic has fallen!</div>
        <div style="margin-top:10px">
	As the Galactic Senate collapses into factional squabbling, the ascendant powers on the outer rim plot to seize New Byzantium...</div>
        <div style="margin-top:10px">
	Take the lead by moving your fleet to capture New Byzantium, or establish a power-base to displace the leader and impose your will on your peers.
 	</div>
    `; }

    obj = this.addEvents(obj);
    this.factions[name] = obj;

  }  

