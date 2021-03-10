  
  
  returnAgendaCards() {
    return this.agenda_cards;
  }

  
  importAgendaCard(name, obj) {

console.log("Importing " + obj.name);

    if (obj.name == null) 	{ obj.name = "Unknown Agenda"; }
    if (obj.type == null)	{ obj.type = "Law"; }
    if (obj.text == null)	{ obj.text = "Unknown Document"; }
    if (obj.img  == null)	{ obj.img = "/imperium/img/agenda_card_template.png"; }

    obj = this.addEvents(obj);
    this.agenda_cards[name] = obj;

  }  


