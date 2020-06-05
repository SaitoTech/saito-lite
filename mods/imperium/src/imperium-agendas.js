  
  
  returnAgendaCards() {
    return this.game.agenda_cards;
  }

  
  importAgendaCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Agenda"; }
    if (obj.type == null)	{ obj.type = "Law"; }
    if (obj.text == null)	{ obj.text = "Unknown Document"; }
    if (obj.img  == null)	{ obj.img = "/imperium/img/agenda_card_template.png"; }

    obj = this.addEvents(obj);
    this.game.agenda_cards[name] = obj;

  }  


