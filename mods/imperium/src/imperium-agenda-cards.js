
  returnAgendaCards() {
    return this.agenda_cards;
  }

  
  importAgendaCard(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Agenda"; }
    if (obj.type == null)	{ obj.type = "Law"; }
    if (obj.text == null)	{ obj.text = "Unknown Document"; }
    if (obj.img  == null)	{ obj.img = "/imperium/img/agenda_card_template.png"; }
    if (obj.elect == null)	{ obj.elect = "other"; }

    if (obj.returnCardImage == null) {
      obj.returnCardImage = function() {
        return `
  	  <div style="background-image: url('/imperium/img/agenda_card_template.png');" class="overlay_agendacard card option" id="${name}">
	    <div class="overlay_agendatitle">${obj.name}</div>
	    <div class="overlay_agendacontent">${obj.text}</div>
	  </div>
        `;
      }
    }

    obj = this.addEvents(obj);
    this.agenda_cards[name] = obj;

  }  

