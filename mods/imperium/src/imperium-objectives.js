  
  returnSecretObjectives() {
    return this.secret_objectives;
  }
  
  importSecretObjective(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Objective"; }
    if (obj.text == null)	{ obj.type = "Unclear Objective"; }
    if (obj.minPlayers == null) { obj.minPlayers = 2; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.phase == null)	{ obj.type = "imperial"; } // "action" if can be scored at end of turn
    if (obj.img  == null) 	{ obj.img = "/imperium/img/secret_objective_1.png"; }
    if (obj.vp == null)		{ obj.vp = 1; }

    if (obj.returnCardImage == null) {
      obj.returnCardImage = function() {
        return `
	  <div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
            <div class="objectives_card_name">${obj.name}</div>
              <div class="objectives_card_content">
                ${obj.text}
              <div class="objectives_secret_notice">secret</div>
            </div>
	  </div>
	`;
      };
    }

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
    if (obj.img  == null) 	{ obj.img = "/imperium/img/victory_point_1.png"; }
    if (obj.vp == null)		{ obj.vp = 1; }

    if (obj.returnCardImage == null) {
      obj.returnCardImage = function() {
        return `
          <div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
            <div class="objectives_card_name">${obj.name}</div>
            <div class="objectives_card_content">${obj.text}</div>
          </div>
        `;
      };
    }

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
    if (obj.vp == null)		{ obj.vp = 2; }

    if (obj.returnCardImage == null) {
      obj.returnCardImage = function() {
        return `
          <div class="objectives_overlay_objectives_card" style="background-image: url(${obj.img})">
            <div class="objectives_card_name">${obj.name}</div>
            <div class="objectives_card_content">${obj.text}</div>
          </div>
        `;
      };
    }

    obj = this.addEvents(obj);
    this.stage_ii_objectives[name] = obj;

  }  



