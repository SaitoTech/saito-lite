

    this.importUnit("infantry", {
      name     		:       "Infantry",
      type     		:       "infantry",
      cost 		:	0.5,
      combat 		:	8,
      strength 		:	1,
      space		:	0,
      ground		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      description	:	"Infantry invade planets, but cannot move between sectors without being carried on carriers or other ships with capacity.",
    });

    this.importUnit("fighter", {
      name     		:       "Fighter",
      type     		:       "fighter",
      cost 		:	0.5,
      move 		:	1,
      combat 		:	9,
      strength 		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      description	:	"Fighters are disposable ships deployed to protect capital ships. They must be transported on carriers or other ships with capacity.",
    });


    this.importUnit("pds", {
      name     		:       "PDS",
      type     		:       "pds",
      range 		:	0,
      cost 		:	5,
      combat 		:	6,
      description	:	"PDS units fire on other ships that invade their sectors. They can also fire on foreign infantry that invade a planet.",
    });

    this.importUnit("spacedock", {
      name     		:       "Spacedock",
      type     		:       "spacedock",
      capacity 		:	3,
      production 	:	2,
      combat      	: 	0,
      range       	: 	0,
      description	:	"Spacedocks are used to produce infantry and other ships. They cannot produce ships in space if an opponent fighter is in the sector",
    });

    this.importUnit("carrier", {
      name     		:       "Carrier",
      type     		:       "carrier",
      cost 		:	3,
      move 		:	1,
      combat 		:	9,
      capacity 		:	4,
      strength 		:	1,
      description	:	"The Carrier is a troop and fighter transport ship. Load it with infantry and fighters and use it to conquer other sectors.",
    });

    this.importUnit("destroyer", {
      name     		:       "Destroyer",
      type     		:       "destroyer",
      cost 		:	1,
      move 		:	2,
      combat 		:	9,
      strength 		:	1,
      anti_fighter_barrage :	2,
      anti_fighter_barrage_combat :	9,
      description	:	"The Destroyer is an inexpensive but mobile ship designed to counter fighter swarms - its ANTI-FIGHTER BARRAGE (2 rolls hitting on 9 or higher) happens at the very start of space-combat",
    });

    this.importUnit("cruiser", {
      name     		:       "Cruiser",
      type     		:       "cruiser",
      cost 		:	2,
      move 		:	2,
      combat 		:	7,
      strength 		:	1,
      description	:	"The Cruiser is a more powerful ship with a reasonable chance of landing hits in battle.",
    });

    this.importUnit("dreadnaught", {
      name     		:       "Dreadnaught",
      type     		:       "dreadnaught",
      cost 		:	4,
      move 		:	1,
      capacity 		:	1,
      combat 		:	6,
      strength 		:	2,
      bombardment_rolls	:	1,
      bombardment_combat:	5,
      description	:	"The Dreadnaught is a powerful combat ship able to SUSTAIN DAMAGE once before being destroyed in combat",
    });

    this.importUnit("flagship", {
      name     		:       "Flagship",
      type     		:       "flagship",
      cost 		:	8,
      move 		:	1,
      capacity 		:	1,
      combat 		:	7,
      strength 		:	2,
      description	:	"The Flagship is the pride of the fleet -- each faction's flagship confers specific abilities. See your factino sheet for more details",
    });

    this.importUnit("warsun", {
      name     		:       "War Sun",
      type     		:       "warsun",
      cost 		:	12,
      shots 		:	3,
      move 		:	1,
      capacity 		:	3,
      combat 		:	3,
      strength 		:	2,
      bombardment_rolls	:	3,
      bombardment_combat:	3,
      description	:	"The War Sun is death packaged in a mass of planet-destroying turbinium. Rumours of their lethality abound, as few have fought one and lived to tell the tale." ,
    });

  
    this.importUnit("infantry-ii", {
      name     		:       "Infantry II",
      type     		:       "infantry",
      cost 		:	0.5,
      combat 		:	7,
      strength 		:	1,
      space		:	0,
      ground		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      extension 	: 	1,
      description	:	"Infantry II are stronger and more resilient but cannot typically be moved between sectors without moving on carriers or other ships with capacity.",
    });

    this.importUnit("fighter-ii", {
      name     		:       "Fighter II",
      type     		:       "fighter",
      cost 		:	0.5,
      move 		:	2,
      combat 		:	8,
      strength 		:	1,
      can_be_stored	:	1,
      capacity_required :	1,
      extension 	: 	1,
      description	:	"Fighter II can move without being transported by other ships. Any ships inexcess of your carrying capacity could against your fleet supply.",
      
    });

    this.importUnit("spacedock-ii", {
      name     		:       "Spacedock II",
      type     		:       "spacedock",
      capacity 		:	3,
      production 	:	4,
      extension 	: 	1,
      description	:	"Spacedock II can produce more units whenever they produce.",
    });

    this.importUnit("pds-ii", {
      name     		:       "PDS II",
      type     		:       "pds",
      cost 		:	5,
      combat 		:	5,
      range		:	1,
      extension 	: 	1,
      description	:	"PDS II has a slightly more accurate targeting mechanism and can fire into adjacent sectors.",
    });

    this.importUnit("carrier-ii", {
      name     		:       "Carrier II",
      type     		:       "carrier",
      cost 		:	3,
      move 		:	2,
      combat 		:	9,
      capacity 		:	6,
      strength 		:	1,
      extension 	: 	1,
      description	:	"Carrier II has upgraded ship capacity and is slightly more robust in combat",
    });

    this.importUnit("destroyer-ii", {
      name     		:       "Destroyer II",
      type     		:       "destroyer",
      cost 		:	1,
      move 		:	2,
      combat 		:	8,
      strength 		:	1,
      extension 	: 	1,
      anti_fighter_barrage :	3,
      anti_fighter_barrage_combat :	6,
      description	:	"Destroyer II has improved ANTI-FIGHTER-BARRAGE (3x6) and is slightly more effective in general combat",
    });

    this.importUnit("cruiser-ii", {
      name     		:       "Cruiser II",
      type     		:       "cruiser",
      cost 		:	2,
      move 		:	3,
      combat 		:	6,
      strength 		:	1,
      extension 	: 	1,
      description	:	"Cruiser II has extended range and the ability to support a small phalanx of ground troops",
    });

    this.importUnit("dreadnaught-ii", {
      name     		:       "Dreadnaught II",
      type     		:       "dreadnaught",
      cost 		:	4,
      move 		:	2,
      capacity 		:	1,
      combat 		:	5,
      strength 		:	2,
      extension 	: 	1,
      description	:	"Dreadnaught II has improved movement, can support a small ground team and is slightly more effective in space combat",
    });




 
