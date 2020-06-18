  
  
  returnActionCards(types=[]) {
    if (types.length == 0) { return this.action_cards; }
    else {

      let return_obj = {};
      for (let i in this.action_cards) {
	if (types.includes(this.action_cards[i].type)) {
	  return_obj[i] = this.action_cards[i];
	}
      }
      return return_obj;

    }
  }
  
  importActionCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Action Card"; }
    if (obj.type == null) 	{ obj.type = "instant"; }
    if (obj.text == null) 	{ obj.text = "Unknown Action"; }
    if (obj.img  == null) 	{ obj.img  = "/imperium/img/action_card_template.png"; }

    obj = this.addEvents(obj);
    this.action_cards[name] = obj;

  }  


