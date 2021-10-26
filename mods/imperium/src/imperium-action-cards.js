  
  
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

    if (obj.returnCardImage == null) {
      obj.returnCardImage = function() {
        return `
          <div class="action_card" id="${name}" style="background-image: url(${obj.img});background-size:cover;">
            <div class="action_card_title">${obj.name}</div>
            <div class="action_card_text">${obj.text}</div>
          </div>
        `;
      }
    }

    obj = this.addEvents(obj);
    this.action_cards[name] = obj;

  }  


