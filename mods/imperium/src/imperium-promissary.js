  
  returnPromissaryNotes() {
    return this.promissary_notes;
  }
  
  importPromissary(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Promissary"; }
    if (obj.text == null)	{ obj.text = "Unknown Promissary"; }

    obj = this.addEvents(obj);
    this.promissary_notes[name] = obj;

  }  

  returnPromissaryPlayer(promissary) {

    let tmpar = promissary.split("-");
    for (let i = 0; i < this.game.players_info.length; i++) {
      if (this.game.players_info[i].faction === tmpar[0]) { return (i+1); }
    }

    return -1;

  }
  



