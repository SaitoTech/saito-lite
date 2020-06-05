  
  
  //////////////////
  // Return Units //
  //////////////////
  //
  // Unit Objects are expected to support the following
  //
  returnUnits() {
    return this.game.units;
  }
  
  importTech(name, obj) {

    if (obj.name == null) 		{ obj.name = "Unknown Unit"; }
    if (obj.storage  == null) 		{ obj.storage = []; }			// units this stores
    if (obj.space == null) 		{ obj.space = 1; }			// defaults to spaceship
    if (obj.ground == null) 		{ obj.ground = 0; }			// defaults to spaceship
    if (obj.cost == null) 		{ obj.cost = 1; }			// cost to product
    if (obj.capacity == null) 		{ obj.capacity = 0; }			// number of units we can store
    if (obj.capacity_required == null)	{ obj.capacity_required = 0; }		// number of units occupies
    if (obj.can_be_stored == null) 	{ obj.can_be_stored = 0; }		// can this be stored
    if (obj.strength == null) 		{ obj.strength = 0; }			// HP
    if (obj.max_strength == null) 	{ obj.max_strength = obj.strength; }	// restore to HP
    if (obj.combat == null) 		{ obj.combat = 0; }			// dice for hits
    if (obj.destroyed == null) 		{ obj.destroyed = 0; }			// when destroyed
    if (obj.move == null) 		{ obj.move = 0; }			// range to move
    if (obj.range == null) 		{ obj.range = 0; }			// firing range
    if (obj.production == null) 	{ obj.production = 0; }			// can produce

    obj = this.addEvents(obj);
    this.game.units[name] = obj;

  }  


