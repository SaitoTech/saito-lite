  
  returnPromissaryNotes() {
    return this.promissary_notes;
  }
  
  importPromissaryNote(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Promissary"; }
    if (obj.text == null)	{ obj.text = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.phase == null)	{ obj.phase = ""; }

    obj = this.addEvents(obj);
    this.promissary_notes[name] = obj;

  }  



