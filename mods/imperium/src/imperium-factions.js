  
  
  returnFactions() {
    return this.factions;
  }
  
  importFaction(name, obj) {

    if (obj.name == null) 		{ obj.name = "Unknown Faction"; }
    if (obj.homeworld  == null) 	{ obj.homeworld = "sector32"; }
    if (obj.space_units == null) 	{ obj.space_units = []; }
    if (obj.ground_units == null) 	{ obj.ground_units = []; }
    if (obj.tech == null) 		{ obj.tech = []; }

    obj = this.addEvents(obj);
console.log("SETTING this.factions["+name+"] to object: " + JSON.stringify(obj));
    this.factions[name] = obj;
console.log("... and done");



  }  

