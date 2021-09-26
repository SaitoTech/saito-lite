  
  
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

    obj = this.addEvents(obj);
    this.tech[name] = obj;

  }  

  doesPlayerHaveTech(player, tech) {
    for (let i = 0; i < this.game.players_info[player-1].tech.length; i++) {
      if (this.game.players_info[player-1].tech[i] == tech) { return 1; }
    }
    return 0;
  }

  returnTechCardHTML(tech, tclass="tech_card") {

    let name = this.tech[tech].name;
    let text = this.tech[tech].text;
    let color = this.tech[tech].color;
    let prereqs = "";

    for (let i = 0; i < this.tech[tech].prereqs.length; i++) {
      if (this.tech[tech].prereqs[i] == "yellow") { prereqs += '<span class="yellow">♦</span>'; }
      if (this.tech[tech].prereqs[i] == "blue") { prereqs += '<span class="blue">♦</span>'; }
      if (this.tech[tech].prereqs[i] == "green") { prereqs += '<span class="green">♦</span>'; }
      if (this.tech[tech].prereqs[i] == "red") { prereqs += '<span class="red">♦</span>'; }
    }

    let html = `
    <div class="tech_${color} ${tclass}">
      <div class="tech_card_name">${name}</div>
      <div class="tech_card_content">${text}</div>
      <div class="tech_card_level">${prereqs}</div>
    </div>
    `;

    return html;
  }

