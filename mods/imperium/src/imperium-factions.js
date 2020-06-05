  
  
  returnFactions() {

console.log(JSON.stringify(this.factions));

    return this.factions;
  }
  
  importFaction(name, obj) {

    if (obj.name == null) 		{ obj.name = "Unknown Faction"; }
    if (obj.homeworld  == null) 	{ obj.homeworld = "sector32"; }
    if (obj.space_units == null) 	{ obj.space_units = []; }
    if (obj.ground_units == null) 	{ obj.ground_units = []; }
    if (obj.tech == null) 		{ obj.tech = []; }

    obj = this.addEvents(obj);

console.log("adding this.factions["+name+"]");

    this.factions[name] = obj;

  }  

