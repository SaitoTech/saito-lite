  
  
  ////////////////////////////
  // Return Technology Tree //
  ////////////////////////////
  //
  // Technology Objects are expected to support the following
  //
  // name -> technology name
  // img -> card image
  // color -> color
  // faction -> is this restricted to a specific faction
  // prereqs -> array of colors needed
  // unit --> unit technology
  // returnCardImage(cardkey) --> returns image of card
  //
  returnTechnology() {
    return this.tech;
  }
  


  importTech(name, obj) {

    if (obj.name == null) 	{ obj.name = "Unknown Technology"; }
    if (obj.img  == null) 	{ obj.img = "/imperium/img/tech_card_template.jpg"; }
    if (obj.faction == null) 	{ obj.faction = "all"; }
    if (obj.prereqs == null) 	{ obj.prereqs = []; }
    if (obj.color == null)	{ obj.color = ""; }
    if (obj.type == null)	{ obj.type = "normal"; }
    if (obj.text == null)	{ obj.text = ""; }
    if (obj.unit == null)	{ obj.unit = 0; }
    if (obj.key == null)	{ obj.key = name; }
    if (obj.returnCardImage == null)	{ obj.returnCardImage = function() {

      let prereqs = "";

      for (let i = 0; i < obj.prereqs.length; i++) {
        if (obj.prereqs[i] == "yellow") { prereqs += '<span class="yellow">♦</span>'; }
        if (obj.prereqs[i] == "blue") { prereqs += '<span class="blue">♦</span>'; }
        if (obj.prereqs[i] == "green") { prereqs += '<span class="green">♦</span>'; }
        if (obj.prereqs[i] == "red") { prereqs += '<span class="red">♦</span>'; }      
      }

      return `<div id="${obj.key}" class="tech_${obj.color} tech_card card_nonopaque">
        <div class="tech_card_name">${obj.name}</div>
        <div class="tech_card_content">${obj.text}</div>
        <div class="tech_card_level">${prereqs}</div>
      </div>`;
    }; }

    obj = this.addEvents(obj);
    this.tech[name] = obj;

  }  

  doesPlayerHaveTech(player, tech) {
    for (let i = 0; i < this.game.players_info[player-1].tech.length; i++) {
      if (this.game.players_info[player-1].tech[i] == tech) { return 1; }
    }
    return 0;
  }


