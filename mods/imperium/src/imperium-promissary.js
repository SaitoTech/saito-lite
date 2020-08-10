  
  returnPromissaryNotes() {
    return this.promissary_notes;
  }
  
  importPromissary(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Promissary"; }
    if (obj.text == null)	{ obj.text = "Unknown Promissary"; }

    obj = this.addEvents(obj);
    this.promissary_notes[name] = obj;

  }  

  
  



