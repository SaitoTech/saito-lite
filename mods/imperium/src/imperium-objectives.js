  
  returnSecretObjectives() {
    return this.secret_objectives;
  }
  
  importSecretObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/secret_objective.jpg"; }

    obj = this.addEvents(obj);
    this.secret_objectives[name] = obj;

  }  




  returnStageIPublicObjectives() {
    return this.stage_i_objectives;
  }
  
  importStageIPublicObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/objective_card_1_template.png"; }

    obj = this.addEvents(obj);
    this.stage_i_objectives[name] = obj;

  }  


  returnStageIIPublicObjectives() {
    return this.stage_ii_objectives;
  }
  
  importStageIIPublicObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/objective_card_1_template.png"; }

    obj = this.addEvents(obj);
    this.stage_ii_objectives[name] = obj;

  }  


