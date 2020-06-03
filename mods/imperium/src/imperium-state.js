  
  ////////////////////
  // Return Planets //
  ////////////////////
  returnPlanets() {
  
    var planets = {};
  
    // regular planets
    planets['planet1']  = { type : "hazardous" , img : "/imperium/img/planets/" , name : "Crystalis" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet2']  = { type : "hazardous" , img : "/imperium/img/planets/TROTH.png" , name : "Troth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet3']  = { type : "industrial" , img : "/imperium/img/planets/LONDRAK.png" , name : "Londrak" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet4']  = { type : "hazardous" , img : "/imperium/img/planets/CITADEL.png" , name : "Citadel" , resources : 0 , influence : 4 , bonus : "red"  }
    planets['planet5']  = { type : "industrial" , img : "/imperium/img/planets/BELVEDYR.png" , name : "Belvedyr" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet6']  = { type : "industrial" , img : "/imperium/img/planets/SHRIVA.png" , name : "Shriva" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet7']  = { type : "hazardous" , img : "/imperium/img/planets/ZONDOR.png" , name : "Zondor" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet8']  = { type : "hazardous" , img : "/imperium/img/planets/CALTHREX.png" , name : "Calthrex" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet9']  = { type : "cultural" , img : "/imperium/img/planets/SOUNDRA-IV.png" , name : "Soundra IV" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet10'] = { type : "industrial" , img : "/imperium/img/planets/" , name : "Udon I" , resources : 1 , influence : 1 , bonus : "blue"  }
    planets['planet11'] = { type : "cultural" , img : "/imperium/img/planets/UDON-II.png" , name : "Udon II" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet12'] = { type : "cultural" , img : "/imperium/img/planets/NEW-JYLANX.png" , name : "New Jylanx" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet13'] = { type : "cultural" , img : "/imperium/img/planets/TERRA-CORE.png" , name : "Terra Core" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet14'] = { type : "cultural" , img : "/imperium/img/planets/OLYMPIA.png" , name : "Olympia" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet15'] = { type : "industrial" , img : "/imperium/img/planets/GRANTON-MEX.png" , name : "Granton Mex" , resources : 1 , influence : 0 , bonus : "yellow"  }
    planets['planet16'] = { type : "hazardous" , img : "/imperium/img/planets/HARKON-CALEDONIA.png" , name : "Harkon Caledonia" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet17'] = { type : "cultural" , img : "/imperium/img/planets/NEW-ILLIA.png" , name : "New Illia" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet18'] = { type : "hazardous" , img : "/imperium/img/planets/LAZAKS-CURSE.png" , name : "Lazak's Curse" , resources : 1 , influence : 3 , bonus : "red"  }
    planets['planet19'] = { type : "cultural" , img : "/imperium/img/planets/VOLUNTRA.png" , name : "Voluntra" , resources : 0 , influence : 2 , bonus : ""  }
    planets['planet20'] = { type : "hazardous" , img : "/imperium/img/planets/XERXES-IV.png" , name : "Xerxes IV" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet21'] = { type : "industrial" , img : "/imperium/img/planets/SIRENS-END.png" , name : "Siren's End" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet22'] = { type : "hazardous" , img : "/imperium/img/planets/RIFTVIEW.png" , name : "Riftview" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet23'] = { type : "cultural" , img : "/imperium/img/planets/BROUGHTON.png" , name : "Broughton" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet24'] = { type : "industrial" , img : "/imperium/img/planets/FJORDRA.png" , name : "Fjordra" , resources : 0 , influence : 3 , bonus : ""  }
    planets['planet25'] = { type : "cultural" , img : "/imperium/img/planets/SINGHARTA.png" , name : "Singharta" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet26'] = { type : "industrial" , img : "/imperium/img/planets/NOVA-KLONDIKE.png" , name : "Nova Klondike" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet27'] = { type : "industrial" , img : "/imperium/img/planets/CONTOURI-I.png" , name : "Contouri I" , resources : 1 , influence : 1 , bonus : "green"  }
    planets['planet28'] = { type : "hazardous" , img : "/imperium/img/planets/CONTOURI-II.png" , name : "Contouri II" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet29'] = { type : "cultural" , img : "/imperium/img/planets/HOTH.png" , name : "Hoth" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet30'] = { type : "industrial" , img : "/imperium/img/planets/UNSULLA.png" , name : "Unsulla" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet31'] = { type : "industrial" , img : "/imperium/img/planets/GROX-TOWERS.png" , name : "Grox Towers" , resources : 1 , influence : 1 , bonus : "blue"  }
    planets['planet32'] = { type : "hazardous" , img : "/imperium/img/planets/GRAVITYS-EDGE.png" , name : "Gravity's Edge" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet33'] = { type : "industrial" , img : "/imperium/img/planets/POPULAX.png" , name : "Populax" , resources : 3 , influence : 2 , bonus : "yellow"  }
    planets['planet34'] = { type : "cultural" , img : "/imperium/img/planets/OLD-MOLTOUR.png" , name : "Old Moltour" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet35'] = { type : "diplomatic" , img : "/imperium/img/planets/NEW-BYZANTIUM.png" , name : "New Byzantium" , resources : 1 , influence : 6 , bonus : ""  }
    planets['planet36'] = { type : "cultural" , img : "/imperium/img/planets/OUTERANT.png" , name : "Outerant" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet37'] = { type : "industrial" , img : "/imperium/img/planets/VESPAR.png" , name : "Vespar" , resources : 2 , influence : 2 , bonus : ""  }


    planets['planet38'] = { type : "hazardous" , img : "/imperium/img/planets/CRAW-POPULI.png" , name : "Craw Populi" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet41'] = { type : "industrial" , img : "/imperium/img/planets/LORSTRUCK.png" , name : "Lorstruck" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet42'] = { type : "hazardous" , img : "/imperium/img/planets/INDUSTRYL.png" , name : "Industryl" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet43'] = { type : "cultural" , img : "/imperium/img/planets/MECHANEX.png" , name : "Mechanex" , resources : 1 , influence : 0 , bonus : ""  }
    planets['planet44'] = { type : "industrial" , img : "/imperium/img/planets/HEARTHSLOUGH.png" , name : "Hearthslough" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet45'] = { type : "hazardous" , img : "/imperium/img/planets/INCARTH.png" , name : "Incarth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet46'] = { type : "cultural" , img : "/imperium/img/planets/AANDOR.png" , name : "Aandor" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet39'] = { type : "cultural" , img : "/imperium/img/planets/YSSARI-II.png" , name : "Yssari II" , resources : 0 , influence : 1 , bonus : ""  }
    planets['planet40'] = { type : "industrial" , img : "/imperium/img/planets/HOPES-LURE.png" , name : "Hope's Lure" , resources : 3 , influence : 2 , bonus : ""  }
    planets['planet47'] = { type : "hazardous" , img : "/imperium/img/planets/QUANDAM.png" , name : "Quandam" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet48'] = { type : "cultural" , img : "/imperium/img/planets/BREST.png" , name : "Brest" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet49'] = { type : "hazardous" , img : "/imperium/img/planets/HIRAETH.png" , name : "Hiraeth" , resources : 1 , influence : 1 , bonus : ""  }

  
    for (var i in planets) {

      planets[i].exhausted = 0;
      planets[i].owner = -1;
      planets[i].units = [this.totalPlayers]; // array to store units

      for (let j = 0; j < this.totalPlayers; j++) {
        planets[i].units[j] = [];

	if (j == 1) {
	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("pds", 1));
	  planets[i].units[j].push(this.returnUnit("pds", 1));
//	  planets[i].units[j].push(this.returnUnit("spacedock", 1));
	}

      }
    }
  
    return planets;
  }
  
  
  
  returnState() {
  
    let state = {};
  
        state.speaker = 1;
        state.round = 0;
        state.turn = 1;
        state.round_scoring = 0;
        state.events = {};
        state.laws = [];
        state.agendas = [];
        state.strategy_cards = [];
        state.strategy_cards_bonus = [];
        state.stage_i_objectives = [];
        state.stage_ii_objectives = [];
        state.secret_objectives = [];
        state.votes_available = [];
        state.votes_cast = [];
        state.voted_on_agenda = [];
        state.agendas_per_round = 2;
        state.how_voted_on_agenda = [];
        state.voting_on_agenda = 0;

	//
	// steps in move
	//
        state.planetary_invasion = 0;
  
        //
        // variables to track executing 
        //
        state.space_combat_round = 0;
        state.ground_combat_round = 0;

    return state;
  }
  
  ////////////////////
  // Return Planets //
  ////////////////////
  returnSystems() {
  
    var systems = {};
  
    systems['sector1']         = { img : "/imperium/img/sector1.png" , 	   	   name : "Sector 1" , hw : 0 , mr : 0 , planets : [] }
    systems['sector2']         = { img : "/imperium/img/sector2.png" , 	   	   name : "Sector 2" , hw : 0 , mr : 0 , planets : [] }
    systems['sector3']         = { img : "/imperium/img/sector3.png" , 	   	   name : "Sector 3" , hw : 0 , mr : 0 , planets : [] }
    systems['sector4']         = { img : "/imperium/img/sector4.png" , 	   	   name : "Sector 4" , hw : 0 , mr : 0 , planets : [] }
    systems['sector5']         = { img : "/imperium/img/sector5.png" , 	   	   name : "Sector 5" , hw : 0 , mr : 0 , planets : [] }
    systems['sector6']         = { img : "/imperium/img/sector6.png" , 	   	   name : "Sector 6" , hw : 0 , mr : 0 , planets : [] }
    systems['sector7']         = { img : "/imperium/img/sector7.png" , 	   	   name : "Sector 7" , hw : 0 , mr : 0 , planets : [] }
    systems['sector8']         = { img : "/imperium/img/sector8.png" , 	   	   name : "Sector 8" , hw : 0 , mr : 0 , planets : ['planet1','planet2'] }
    systems['sector9']         = { img : "/imperium/img/sector9.png" , 	   	   name : "Sector 9" , hw : 0 , mr : 0 , planets : ['planet3','planet4'] }
    systems['sector10']        = { img : "/imperium/img/sector10.png" , 	   name : "Sector 10" , hw : 0 , mr : 0 , planets : ['planet5','planet6'] }
    systems['sector11']        = { img : "/imperium/img/sector11.png" , 	   name : "Sector 11" , hw : 0 , mr : 0 , planets : ['planet7','planet8'] }
    systems['sector12']        = { img : "/imperium/img/sector12.png" , 	   name : "Sector 12" , hw : 0 , mr : 0 , planets : ['planet9','planet10'] }
    systems['sector13']        = { img : "/imperium/img/sector13.png" , 	   name : "Sector 13" , hw : 0 , mr : 0 , planets : ['planet11','planet12'] }
    systems['sector14']        = { img : "/imperium/img/sector14.png" , 	   name : "Sector 14" , hw : 0 , mr : 0 , planets : ['planet13','planet14'] }
    systems['sector15']        = { img : "/imperium/img/sector15.png" , 	   name : "Sector 15" , hw : 0 , mr : 0 , planets : ['planet15','planet16'] }
    systems['sector16']        = { img : "/imperium/img/sector16.png" , 	   name : "Sector 16" , hw : 0 , mr : 0 , planets : ['planet17','planet18'] }
    systems['sector17']        = { img : "/imperium/img/sector17.png" , 	   name : "Sector 17" , hw : 0 , mr : 0 , planets : ['planet19','planet20'] }
    systems['sector18']        = { img : "/imperium/img/sector18.png" , 	   name : "Sector 18" , hw : 0 , mr : 0 , planets : ['planet21','planet22'] }
    systems['sector19']        = { img : "/imperium/img/sector19.png" , 	   name : "Sector 19" , hw : 0 , mr : 0 , planets : ['planet23','planet24'] }
    systems['sector20']        = { img : "/imperium/img/sector20.png" , 	   name : "Sector 20" , hw : 0 , mr : 0 , planets : ['planet25','planet26'] }
    systems['sector21']        = { img : "/imperium/img/sector21.png" , 	   name : "Sector 21" , hw : 0 , mr : 0 , planets : ['planet27','planet28'] }
    systems['sector22']        = { img : "/imperium/img/sector22.png" , 	   name : "Sector 22" , hw : 0 , mr : 0 , planets : ['planet29'] }
    systems['sector23']        = { img : "/imperium/img/sector23.png" , 	   name : "Sector 23" , hw : 0 , mr : 0 , planets : ['planet30'] }
    systems['sector24']        = { img : "/imperium/img/sector24.png" , 	   name : "Sector 24" , hw : 0 , mr : 0 , planets : ['planet31'] }
    systems['sector25']        = { img : "/imperium/img/sector25.png" , 	   name : "Sector 25" , hw : 0 , mr : 0 , planets : ['planet32'] }
    systems['sector26']        = { img : "/imperium/img/sector26.png" , 	   name : "Sector 26" , hw : 0 , mr : 0 , planets : ['planet33'] }
    systems['sector27']        = { img : "/imperium/img/sector27.png" , 	   name : "Sector 27" , hw : 0 , mr : 0 , planets : ['planet34'] } 
    systems['new-byzantium']   = { img : "/imperium/img/sector28.png" , 	   name : "New Byzantium" , hw : 0 , mr : 1 , planets : ['planet35'] }
    systems['sector29']        = { img : "/imperium/img/sector29.png" , 	   name : "Sector 29" , hw : 0 , mr : 0 , planets : ['planet36'] }
    systems['sector30']        = { img : "/imperium/img/sector30.png" , 	   name : "Sector 30" , hw : 0 , mr : 0 , planets : ['planet37'] }
    systems['sector31']        = { img : "/imperium/img/sector31.png" , 	   name : "Sector 31" , hw : 0 , mr : 0 , planets : ['planet38'] }
    systems['sector32']        = { img : "/imperium/img/sector32.png" , 	   name : "Sector 32" , hw : 0 , mr : 0 , planets : ['planet39'] }
    systems['sector33']        = { img : "/imperium/img/sector34.png" , 	   name : "Sector 33" , hw : 0 , mr : 0 , planets : [] }
    systems['sector34']        = { img : "/imperium/img/sector34.png" , 	   name : "Sector 34" , hw : 0 , mr : 0 , planets : [] }
    systems['sector35']        = { img : "/imperium/img/sector35.png" , 	   name : "Sector 35" , hw : 0 , mr : 0 , planets : [] }
    systems['sector36']        = { img : "/imperium/img/sector36.png" , 	   name : "Sector 36" , hw : 0 , mr : 0 , planets : [] }
    systems['sector37']        = { img : "/imperium/img/sector36.png" , 	   name : "Sector 37" , hw : 0 , mr : 0 , planets : [] }
    systems['sector38']        = { img : "/imperium/img/sector38.png" , 	   name : "Sector 30" , hw : 1 , mr : 0 , planets : ['planet41','planet42'] }
    systems['sector39']        = { img : "/imperium/img/sector39.png" , 	   name : "Sector 31" , hw : 1 , mr : 0 , planets : ['planet43','planet44'] }
    systems['sector40']        = { img : "/imperium/img/sector40.png" , 	   name : "Sector 32" , hw : 1 , mr : 0 , planets : ['planet45','planet46'] }
    systems['sector41']        = { img : "/imperium/img/sector41.png" , 	   name : "Sector 41" , hw : 0 , mr : 0 , planets : ['planet40'] }
    systems['sector42']        = { img : "/imperium/img/sector42.png" , 	   name : "Sector 42" , hw : 0 , mr : 0 , planets : ['planet47'] }
    systems['sector43']        = { img : "/imperium/img/sector43.png" , 	   name : "Sector 43" , hw : 0 , mr : 0 , planets : ['planet48'] }
    systems['sector44']        = { img : "/imperium/img/sector44.png" , 	   name : "Sector 44" , hw : 0 , mr : 0 , planets : ['planet49'] }



    for (var i in systems) {
      systems[i].units = [this.totalPlayers]; // array to store units
      systems[i].activated = [this.totalPlayers]; // array to store units
  
      for (let j = 0; j < this.totalPlayers; j++) {
        systems[i].units[j] = []; // array of united
        systems[i].activated[j] = 0; // is this activated by the player
      }
  
      systems[i].units[1] = [];
      systems[i].units[1].push(this.returnUnit("fighter", 1));  

    }
    return systems;
  };
  
  
  
  
  returnSectors() {
    var slot = {};
    slot['1_1'] = {
      neighbours: ["1_2", "2_1", "2_2"]
    };
    slot['1_2'] = {
      neighbours: ["1_1", "1_3", "2_2", "2_3"]
    };
    slot['1_3'] = {
      neighbours: ["1_2", "1_4", "2_3", "2_4"]
    };
    slot['1_4'] = {
      neighbours: ["1_3", "2_4", "2_5"]
    };
    slot['2_1'] = {
      neighbours: ["1_1", "2_2", "3_1", "3_2"]
    };
    slot['2_2'] = {
      neighbours: ["1_1", "1_2", "2_1", "2_3", "3_2", "3_3"]
    };
    slot['2_3'] = {
      neighbours: ["1_2", "1_3", "2_2", "2_4", "3_3", "3_4"]
    };
    slot['2_4'] = {
      neighbours: ["1_3", "1_4", "2_3", "2_5", "3_4", "3_5"]
    };
    slot['2_5'] = {
      neighbours: ["1_4", "2_4", "3_5", "3_6"]
    };
    slot['3_1'] = {
      neighbours: ["2_1", "3_2", "4_1", "4_2"]
    };
    slot['3_2'] = {
      neighbours: ["2_1", "2_2", "3_1", "3_3", "4_2", "4_3"]
    };
    slot['3_3'] = {
      neighbours: ["2_2", "2_3", "3_2", "3_4", "4_3", "4_4"]
    };
    slot['3_4'] = {
      neighbours: ["2_3", "2_4", "3_3", "3_5", "4_4", "4_5"]
    };
    slot['3_5'] = {
      neighbours: ["2_4", "3_4", "3_6", "4_5", "4_6"]
    };
    slot['3_6'] = {
      neighbours: ["2_5", "3_5", "4_6", "4_7"]
    };
    slot['4_1'] = {
      neighbours: ["3_1", "4_2", "5_1"]
    };
    slot['4_2'] = {
      neighbours: ["3_1", "3_2", "4_1", "4_3", "5_1", "5_2"]
    };
    slot['4_3'] = {
      neighbours: ["3_2", "3_3", "4_2", "4_4", "5_2", "5_3"]
    };
    slot['4_4'] = {
      neighbours: ["3_3", "3_4", "4_3", "4_5", "5_3", "5_4"]
    };
    slot['4_5'] = {
      neighbours: ["3_4", "3_5", "4_4", "4_6", "5_4", "5_5"]
    };
    slot['4_6'] = {
      neighbours: ["3_5", "3_6", "4_5", "4_7", "5_5", "5_6"]
    };
    slot['4_7'] = {
      neighbours: ["3_6", "4_6", "5_6"]
    };
    slot['5_1'] = {
      neighbours: ["4_1", "4_2", "5_2", "6_1"]
    };
    slot['5_2'] = {
      neighbours: ["4_2", "4_3", "5_1", "5_3", "6_1", "6_2"]
    };
    slot['5_3'] = {
      neighbours: ["4_3", "4_4", "5_2", "5_4", "6_2", "6_3"]
    };
    slot['5_4'] = {
      neighbours: ["4_4", "4_5", "5_3", "5_5", "6_3", "6_4"]
    };
    slot['5_5'] = {
      neighbours: ["4_5", "4_6", "5_4", "5_6", "6_4", "6_5"]
    };
    slot['5_6'] = {
      neighbours: ["4_6", "4_7", "5_5", "6_5"]
    };
    slot['6_1'] = {
      neighbours: ["5_1", "5_2", "6_2", "7_1"]
    };
    slot['6_2'] = {
      neighbours: ["5_2", "5_3", "6_1", "6_3", "7_1", "7_2"]
    };
    slot['6_3'] = {
      neighbours: ["5_3", "5_4", "6_2", "6_4", "7_2", "7_3"]
    };
    slot['6_4'] = {
      neighbours: ["5_4", "5_5", "6_3", "6_5", "7_3", "7_4"]
    };
    slot['6_5'] = {
      neighbours: ["5_5", "5_6", "6_4", "7_4"]
    };
    slot['7_1'] = {
      neighbours: ["6_1", "6_2", "7_2"]
    };
    slot['7_2'] = {
      neighbours: ["6_2", "6_3", "7_1", "7_3"]
    };
    slot['7_3'] = {
      neighbours: ["6_3", "6_4", "7_2", "7_4"]
    };
    slot['7_4'] = {
      neighbours: ["6_4", "6_5", "7_3"]
    };
    return slot;
  }; 
  
  
  



  //////////////////////////////
  // Return Secret Objectives //
  //////////////////////////////
  returnSecretObjectives() {
  
    let secret = {};
  
    secret['military-catastrophe']			= {
      name 	: 	"Military Catastrophe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Destroy the flagship of another player" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['nuke-them-from-orbit']			= {
      name 	: 	"Nuke them from Orbit" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Destroy a player's last infantry using bombardment" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['anti-imperialism']			= {
      name 	: 	"Anti-Imperialism" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Achieve victory in combat with a player with the most VP" ,
      type	: 	"instant" , 
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['close-the-trap']			= {
      name 	: 	"Close the Trap" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Destroy another player's last ship in a system using a PDS" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['flagship-dominance']			= {
      name 	: 	"Launch Flagship" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Achieve victory in a space combat in a system containing your flagship. Your flagship must survive this combat" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['faction-technologies']			= {
      name 	: 	"Faction Technologies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 faction technologies" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['wormhole-administrator']			= {
      name 	: 	"Wormhole Administrator" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in systems containing alpha and beta wormholes respectively" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['galactic-observer']			= {
      name 	: 	"Galactic Observer" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in 6 different sectors" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['establish-a-blockade']			= {
      name 	: 	"Establish a Blockade" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in the same sector as an opponent's space dock" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['ion-cannon-master']			= {
      name 	: 	"Master of the Ion Cannon" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 4 PDS units in play" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['cultural-diplomacy']			= {
      name 	: 	"Cultural Diplomacy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control at least 4 cultural planets" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['act-of-espionage']			= {
      name 	: 	"Act of Espionage" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Discard 5 action cards from your hand" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['war-engine']			= {
      name 	: 	"Engine of War" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have three space docks in play" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['fleet-of-terror']			= {
      name 	: 	"Fleet of Terror" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have 5 dreadnaughts in play" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['space-to-breathe']			= {
      name 	: 	"Space to Breathe" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in 3 systems with no planets" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['ascendant-technocracy']			= {
      name 	: 	"Ascendant Technocracy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 4 tech upgrades on the same color path" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['penal-colonies']			= {
      name 	: 	"Penal Colonies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets with hazardous conditions" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['master-of-production']			= {
      name 	: 	"Master of Production" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets with industrial civilizations" ,
      type	: 	"instant" ,
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['occupy-new-byzantium']			= {
      name 	: 	"Occupy New Byzantium" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control New Byzantium and have at least 3 ships protecting the sector" ,
      type	: 	"instant",
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    secret['cast-a-long-shadow']			= {
      name 	: 	"Cast a Long Shadow" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Have at least 1 ship in a system adjacent to an opponents homeworld" ,
      type	: 	"instant",
      func	:	function(imperium_self, player) {
        return 1;
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
  
    return secret;
  
  }
  
  
  
  //////////////////////////////////////
  // Return Stage I Public Objectives //
  //////////////////////////////////////
  returnStageIPublicObjectives() {
  
    let obj = {};
  
    obj['manage-to-breathe']			= {
      name 	: 	"Figure out Breathing" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Just score this for free..." ,
      func	:	function(imperium_self, player) {
  
        return 1;
   
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['planetary-unity']			= {
      name 	: 	"Planetary Unity" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control four planets of the same planet type" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let success = 0;
        let types   = [];
        for (let i = 0; i < 3; i++) { types[i] = 0; }
  
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].type == "hazardous") { types[0]++; }
          if (imperium_self.game.planets[planets[i]].type == "industrial") { types[1]++; }
          if (imperium_self.game.planets[planets[i]].type == "cultural") { types[2]++; }
        }
  
        for (let i = 0; i < 3; i++) {
  	if (types[i] >= 4) { return 1; }
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['forge-of-war']				= {
      name 	: 	"Forge of War" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 unit upgrade technologies" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let unit_upgrades = 0;
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].unit == 1) { unit_upgrades++; }
        }
        if (unit_upgrades >= 2) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['diversified-research']			= {
      name 	: 	"Diversified Research" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 2 technologies in two different color paths" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let colortech = [];
        for (let i = 0; i < 4; i++) { colortech[i] = 0; }
  
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].color === "green") { colortech[0]++; }
  	if (imperium_self.game.tech[tech[i]].color === "red") { colortech[1]++; }
  	if (imperium_self.game.tech[tech[i]].color === "yellow") { colortech[2]++; }
  	if (imperium_self.game.tech[tech[i]].color === "blue") { colortech[3]++; }
        }
  
        let criteria = 0;
  
        for (let i = 0; i < 4; i++) {
          if (colortech[i] >= 2) { criteria++; }
        }
  
        if (criteria >= 2) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['mining-conglomerate']			= {
      name 	: 	"Mining Conglomerate" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend eight resources when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableResources(player);
        if (ar > 8) {
  	return 1;
        }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectResources(8, function(success) {
          mycallback(1);
        });
      }
    };
    obj['colonization']				= {
      name 	: 	"Colonization" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control six planets outside your home system" ,
      func	:	function(imperium_self, player) {
  
        let homeplanets = imperium_self.returnPlayerHomeworldPlanets(player);
        let planets = imperium_self.returnPlayerPlanetCards(player);
  
        let total_non_home_planets = 0;
  
        for (let i = 0; i < planets.length; i++) {
  	if (!homeplanets.includes(planets[i])) { total_non_home_planets++; }
        }
  
        if (total_non_home_planets >= 6) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['conquest-of-science']			= {
      name 	: 	"Conquest of Science" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 3 planets with tech specialities" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let specialities = 0;
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].bonus != "") { specialities++; }
        }
  
        if (specialities >= 3) {
  	return 1;
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['grand-gesture']				= {
      name 	: 	"A Grand Gesture" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 3 command or strategy tokens when scoring" ,
      func	:	function(imperium_self, player) {
        if ((imperium_self.game.players_info[player-1].command_tokens + imperium_self.game.players_info[player-1].strategy_tokens) >= 3) { return 1; }
        return 0;
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectStrategyAndCommandTokens(3, function(success) {
          mycallback(1);
        });
      }
    };
    obj['trade-outposts']				= {
      name 	: 	"Establish Trade Outposts" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 5 trade goods when scoring" ,
      func	:	function(imperium_self, player) {
  
        if (imperium_self.game.players_info[player-1].goods >= 5) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.addMove("expend\t"+player+"\ttrade\t5");
        mycallback(1);
      }
  
    };
    obj['pecuniary-diplomacy']			= {
      name 	: 	"Pecuniary Diplomacy" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 8 influence when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableInfluence(player);
        if (ar > 7) {
  	return 1;
        }
        return 0;
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectInfluence(8, function(success) {
          mycallback(1);
        });
      },
   
    };
  
    return obj;
  
  }
  
  
  
  ///////////////////////////////////////
  // Return Stage II Public Objectives //
  ///////////////////////////////////////
  returnStageIIPublicObjectives() {
  
    let obj = {};
  
    obj['manage-two-breathe']			= {
      name 	: 	"Figure outwo Breathing" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Just score this two VP for free..." ,
      func	:	function(imperium_self, player) {
  
        return 1;
   
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['master-of-commerce']			= {
      name 	: 	"Master of Commerce" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 10 trade goods when scoring" ,
      func	:	function(imperium_self, player) {
  
        if (imperium_self.game.players_info[player-1].goods >= 10) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.addMove("expend\t"+player+"\ttrade\t10");
        mycallback(1);
      }
  
    };
    obj['display-of-dominance']			= {
      name 	: 	"Display of Dominance" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control at least 1 planet in another player's home sector" ,
      func	:	function(imperium_self, player) {
  
        let my_planets    = imperium_self.returnPlayerPlanetCards(player);
        let their_planets = imperium_self.returnOtherPlayerHomeworldPlanets(player);
  
        for (let i = 0; i < my_planets.length; i++) {
  	if (their_planets.includes(my_planets[i])) { return 1; }
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    obj['technological-empire']			= {
      name 	: 	"Technological Empire" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 5 planets with tech bonuses" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let specialities = 0;
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].bonus != "") { specialities++; }
        }
  
        if (specialities >= 5) {
  	return 1;
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['galactic-currency']			= {
      name 	: 	"Establish Galactic Currency" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 16 resources when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableResources(player);
        if (ar > 15) {
  	return 1;
        }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectResources(16, function(success) {
          mycallback(1);
        });
      }
  
    };
    obj['cultural-revolution']			= {
      name 	: 	"A Cultural Revolution" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 6 command or strategy tokens when scoring" ,
      func	:	function(imperium_self, player) {
  
        if ((imperium_self.game.players_info[player-1].command_tokens + imperium_self.game.players_info[player-1].strategy_tokens) >= 6) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectStrategyAndCommandTokens(6, function(success) {
          mycallback(1);
        });
      }
  
    };
    obj['power-broken']			= {
      name 	: 	"Power Broken" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Spend 16 influence when scoring" ,
      func	:	function(imperium_self, player) {
  
        let ar = imperium_self.returnAvailableInfluence(player);
        if (ar > 15) {
  	return 1;
        }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        imperium_self.playerSelectInfluence(16, function(success) {
          mycallback(1);
        });
      }
  
    };
    obj['master-of-science']			= {
      name 	: 	"Master of Science" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Own 2 tech upgrades in each of 4 tech color paths" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let colortech = [];
        for (let i = 0; i < 4; i++) { colortech[i] = 0; }
  
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].color === "green") { colortech[0]++; }
  	if (imperium_self.game.tech[tech[i]].color === "red") { colortech[1]++; }
  	if (imperium_self.game.tech[tech[i]].color === "yellow") { colortech[2]++; }
  	if (imperium_self.game.tech[tech[i]].color === "blue") { colortech[3]++; }
        }
  
        let criteria = 0;
  
        for (let i = 0; i < 4; i++) {
          if (colortech[i] >= 2) { criteria++; }
        }
  
        if (criteria >= 4) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['colonial-dominance']			= {
      name 	: 	"Colonial Dominance" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 11 planets outside your home system" ,
      func	:	function(imperium_self, player) {
  
        let homeplanets = imperium_self.returnPlayerHomeworldPlanets(player);
        let planets = imperium_self.returnPlayerPlanetCards(player);
  
        let total_non_home_planets = 0;
  
        for (let i = 0; i < planets.length; i++) {
  	if (!homeplanets.includes(planets[i])) { total_non_home_planets++; }
        }
  
        if (total_non_home_planets >= 11) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['advanced-technologies']			= {
      name 	: 	"Advanced Technologies" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Research 3 unit upgrade technologies" ,
      func	:	function(imperium_self, player) {
  
        let tech = imperium_self.game.players_info[player-1].tech;
        let unit_upgrades = 0;
        for (let i = 0; i < tech.length; i++) {
  	if (imperium_self.game.tech[tech[i]].unit == 1) { unit_upgrades++; }
        }
        if (unit_upgrades >= 3) { return 1; }
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
    obj['imperial-unity']			= {
      name 	: 	"Imperial Unity" ,
      img		:	"/imperium/img/objective_card_1_template.png" ,
      text	:	"Control 6 planets of the same planet type" ,
      func	:	function(imperium_self, player) {
  
        let planets = imperium_self.returnPlayerPlanetCards(player);
        let success = 0;
        let types   = [];
        for (let i = 0; i < 3; i++) { types[i] = 0; }
  
        for (let i = 0; i < planets.length; i++) {
          if (imperium_self.game.planets[planets[i]].type == "hazardous") { types[0]++; }
          if (imperium_self.game.planets[planets[i]].type == "industrial") { types[1]++; }
          if (imperium_self.game.planets[planets[i]].type == "cultural") { types[2]++; }
        }
  
        for (let i = 0; i < 3; i++) {
  	if (types[i] >= 6) { return 1; }
        }
  
        return 0;
  
      },
      post	:	function(imperium_self, player, mycallback) {
        mycallback(1);
      }
  
    };
  
    return obj;
  
  }
  
  
  
  
  ////////////////////////////
  // Return Technology Tree //
  ////////////////////////////
  //
  // name -> technology name
  // img -> card image
  // color -> color
  // unit -> is this a unit technology (0/1)
  // faction -> is this restricted to a specific faction
  // prereqs -> array of colors needed
  // 

  returnTechnologyTree() {
  
    let tech = {};
  
    //
    // GREEN
    //
    tech['neural-implants']                       = {
      name        :       "Neural Implants" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	  :	  "normal" ,
      prereqs     :       [],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].action_cards_bonus_when_issued = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].action_cards_bonus_when_issued = 1;
        mycallback(1);
      },
      destroyedUnitTriggersSync :  function(imperium_self, player, attacker, defender, sector, planet_idx, details) {
	if (player == defender) { return 1; }
      },
      destroyedUnitEventSync :     function(imperium_self, player, attacker, defender, sector, planet_idx, unitname) {
	if (player == this.game.player) { aalert("10 free trade goods"); }
	imperium_self.game.players_info[player-1].trade_goods += 10;
      }

/*
      activateSystemTriggers : function(imperium_self, player, sector) {
	return 1;
      },
      activateSystemEvent : function(imperium_self, player, sector) {
	if (imperium_self.game.player == player) {
	  let c = confirm("Do you want to play Neural Implants?");
	  if (c) {
	    imperium_self.endTurn();
	  }
	  return 0;
	} else {
	  imperium_self.updateStatus("Player is decided whether to trigger Neural Implants!");
	  return 0;
	}
      }
*/
    };
    tech['resuscitation-pods']                    = {
      name        :       "Resuscitation Pods" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['green'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].reinforce_infantry_after_successful_ground_combat = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    tech['biotic-enhancements']                   = {
      name        :       "Biotic Enhancements" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['green','green'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].new_token_bonus_when_issued = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].new_token_bonus_when_issued = 1;
        mycallback(1);
      }
    };
    tech['viral-plasma']                  = {
      name        :       "X-91 Viral Plasma" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "green" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['green','green','green'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].x91_bacterial_bombardment = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
  
  
    //
    // BLUE
    //
    tech['electron-shielding']                    = {
      name        :       "Electron Shielding" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       [],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].fly_through_asteroids = 1;
        imperium_self.game.players_info[player-1].evasive_bonus_on_pds_shots = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].fly_through_asteroids = 1;
        imperium_self.game.players_info[player-1].evasive_bonus_on_pds_shots = 1;
        mycallback(1);
      }
    };
    tech['slingshot-drive']                       = {
      name        :       "Slingshot Drive" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['blue'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].ship_move_bonus = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].ship_move_bonus = 1;
        mycallback(1);
      }
    };
    tech['fleet-ansible']                 = {
      name        :       "Fleet Ansible" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['blue','blue'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].perform_two_actions = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].perform_two_actions = 1;
        mycallback(1);
      }
    };
    tech['stealth-cloaking']                      = {
      name        :       "Stealth Cloaking" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "blue" ,
      unit        :       0 ,
      prereqs     :       ['blue','blue','blue'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].move_through_sectors_with_opponent_ships = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].move_through_sectors_with_opponent_ships = 1;
        mycallback(1);
      }
    };
  
    //
    // YELLOW
    //
    tech['waste-recycling']                       = {
      name        :       "Waste Recycling" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      prereqs     :       [],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].production_bonus = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].production_bonus = 1;
        mycallback(1);
      }
    };
    tech['laser-targeting']                       = {
      name        :       "Laser Targeting" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      type	:	"normal" ,
      prereqs     :       ['yellow'],
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].assign_pds_hits_to_non_fighters = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    tech['deep-space-reanimatronics']                     = {
      name        :       "Deep Space Reanimatronics" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      prereqs     :       ['yellow','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].reallocate_four_infantry_per_round = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player) {
        mycallback(1);
      }
    };
    tech['frontline-assembly']                    = {
      name        :       "Frontline Assembly" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "yellow" ,
      unit        :       0 ,
      prereqs     :       ['yellow','yellow','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_produce_after_gaining_planet = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_produce_after_gaining_planet = 1;
        mycallback(1);
      }
    };
  
    //
    // RED
    //
    tech['plasma-clusters']                       = {
      name        :       "Plasma Clusters" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       [],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].extra_roll_on_bombardment_or_pdf = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].extra_roll_on_bombardment_or_pdf = 1;
        mycallback(1);
  
      }
    };
    tech['stasis-fields']                 = {
      name        :       "Stasis Fields" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       ['red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].stasis_on_opponent_combat_first_round = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        mycallback(1);
      }
    };
    tech['titanium-shielding']                    = {
      name        :       "Titanium Shielding" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       ['red','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_repair_damaged_ships_after_space_combat = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].may_repair_damaged_ships_after_space_combat = 1;
        mycallback(1);
      }
    };
    tech['chain-shot']                    = {
      name        :       "Chain Shot" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "red" ,
      unit        :       0 ,
      prereqs     :       ['red','red','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].chain_shot = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].chain_shot = 1;
        mycallback(1);
      }
    };
  
    tech['fighter-ii']                    = {
      name        :       "Fighter II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','blue'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_fighter = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_fighter = 1;
        mycallback(1);
      }
    };
    tech['infantry-ii']                   = {
      name        :       "Infantry II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','green'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_infantry = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_infantry = 1;
        mycallback(1);
      }
    };
    tech['carrier-ii']                    = {
      name        :       "Carrier II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','green','blue','blue'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      }
    };
    tech['dreadnaught-ii']                        = {
      name        :       "Dreadnaught II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['blue','blue','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_dreadnaught = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_dreadnaught = 1;
        mycallback(1);
      }
    };
    tech['cruiser-ii']                    = {
      name        :       "Cruiser II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['green','yellow','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_cruiser = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_cruiser = 1;
        mycallback(1);
      }
    };
    tech['spacedock-ii']                  = {
      name        :       "Space Dock II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['yellow','yellow'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_spacedock = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_spacedock = 1;
        mycallback(1);
      }
    };
    tech['destroyer-ii']                  = {
      name        :       "Destroyer II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['red','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_destroyer = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_destroyer = 1;
        mycallback(1);
      }
    };
    tech['pds-ii']                        = {
      name        :       "PDS II" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['yellow','red'],
      type	:	"normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_pds = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_pds = 1;
        mycallback(1);
      }
    };
    tech['war-sun']                       = {
      name        :       "War Sun" ,
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ['yellow','red','red','red'],
      type	:	  "normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_warsun = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_warsun = 1;
        mycallback(1);
      }
    };
  



    //
    // FACTION TECH
    //


    //
    // FACTION 1
    //
    tech['faction1-advanced-carrier-ii']   = {
      name        :       "Advanced Carrier II" ,
      faction	  :	  "faction1",
      replaces	  :	  "carrier-ii",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ["blue","blue"],
      type	  :	  "normal" ,
      upgradeUnit :	  function(imperium_self, player, unit) {
	unit.cost = 3;
	unit.combat = 9;
	unit.move = 2;
	unit.capacity = 8;
	return unit;
      },
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      }
    };
    tech['faction1-infantry-ii']   = {
      name        :       "Special Ops II" ,
      faction	  :	  "faction1",
      replaces	  :	  "infantry-ii",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ["green","green"],
      type	  :	  "normal" ,
      upgradeUnit :	  function(imperium_self, player, unit) {
	unit.cost = 0.5;
	unit.combat = 6;
	return unit;
      },
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      onNewTurn        :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].upgraded_carrier = 1;
        mycallback(1);
      },
      destroyedGroundUnitTriggerSync	: function(imperium_self, player, attacker, defender, sector, planet_idx, details) { 
	if (defender == player) { return 1; }
	return 0; 
      },
      destroyedGroundUnitEventSync	: function(imperium_self, player, attacker, defender, sector, planet_idx, details) { 
	if (details == "infantry") {
	  let dieroll = imperium_self.rollDice(10);
          if (dieroll <= 5) {
console.log("Spec Ops reanimated in homeworld... ("+dieroll+")");
	    imperium_self.addPlanetaryUnit(player, sector, planet_idx, "infantry");
	  } else {
console.log("Spec Ops not reanimated in homeworld...("+dieroll+")");
	  }
	}
	return 0;
      }
    };
    tech['faction1-orbital-drop']   = {
      name        :       "Orbital Drop" ,
      faction	  :	  "faction1",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       [],
      type	  :	  "normal" ,
      menuOption  :       function(imperium_self, player) { 
	let x = {};
	    x.trigger = 'orbitaldrop';
	    x.html = '<li class="option" id="orbitaldrop">orbital drop</li>';
	return x;
      },
      menuOptionTrigger:  function(imperium_self, player) { 
        if (imperium_self.game.players_info[imperium_self.game.player-1].command_tokens > 0) {
	  return 1;
	} else {
	  return 0;
	}
      },
      menuOptionActivated:  function(imperium_self, player) { 
	if (imperium_self.game.player != player) {
	} else {
	  let targets = imperium_self.returnPlayerPlanetCards(player);
	  let html = 'Select Planet to Orbital Drop: <p></p><ul>';
	  for (let i = 0; i < targets.length; i++) {
	    html += '<li class="option" id="'+targets[i]+'">' + imperium_self.game.planets[targets[i]].name + '</li>';
	  }
	  imperium_self.updateStatus(html);
	  $('.option').off();
	  $('.option').on('click',function () {

	    let choice = $(this).attr("id");

	    let systems = imperium_self.returnSystems();
	    for (let z in systems) {
	      if (systems[z].planets.includes(choice)) {

	        let idx = 0;
	        for (let i = 0; i < systems[z].planets.length; i++) {
		  if (systems[z].planets[i] == choice) { idx = i; }
		}

	        let u = imperium_self.returnUnit("infantry", imperium_self.game.player);
	        let mysector = imperium_self.convertSectorToTile(z);
   	        imperium_self.addMove("land\t"+imperium_self.game.player+"\t"+1+"\t"+mysector+"\t"+""+"\t"+""+"\t"+idx+"\t"+JSON.stringify(u));
   	        imperium_self.addMove("land\t"+imperium_self.game.player+"\t"+1+"\t"+mysector+"\t"+""+"\t"+""+"\t"+idx+"\t"+JSON.stringify(u));
   	        imperium_self.addMove("expend\t"+imperium_self.game.player+"\t"+"command"+"\t"+"1");

		imperium_self.endTurn();
	        
	      }
	    }
	  });
	}
      }
    };
    tech['faction1-versatile']   = {
      name        :       "Versatile" ,
      faction	  :	  "faction1",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       [],
      type	  :	  "normal" ,
      onNewRound     :    function(imperium_self, player, mycallback) {
	imperium_self.game.players_info[player-1].new_tokens_per_round = 3;
        mycallback(1);
      },
    };





    //
    // FACTION 2
    //
    tech['faction2-deep-space-conduits']   = {
      name        :       "Deep Space Conduits" ,
      faction	  :	  "faction2",
      replaces	  :	  "",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       ["blue","blue"],
      type	  :	  "normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 0;
        mycallback(1);
      },
      postSystemActivationTriggers :    function(imperium_self, player, sector) {
        if (imperium_self.game.players_info[player-1].deep_space_conduits_exhausted == 1) { return 0; }
	if (imerpium_self.doesSystemContainPlayerUnits(player, sector) == 1) {
	  return 1;
	}
	return 0;
      },
      postSystemActivation :   function(imperium_self, player, sector) {
	imperium_self.game.players_info[player-1].deep_space_conduits_exhausted = 1;
        imperium_self.game.players_info[player-1].deep_space_conduits = 1;
      }
    };
    tech['faction2-resupply-stations']   = {
      name        :       "Resupply Stations" ,
      faction	  :	  "faction2",
      replaces	  :	  "",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       1 ,
      prereqs     :       ["green","green"],
      type	  :	  "normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].resupply_stations = 1;
        mycallback(1);
      },
      postSystemActivationTriggers :    function(imperium_self, player, sector) {
        if (imperium_self.game.players_info[player-1].resupply_stations == 0) { return 0; }
	if (imperium_self.doesSystemContainPlayerShips(player, sector) == 1) { return 1; }
	return 0;
      },
      postSystemActivation :   function(imperium_self, player, sector) {
	imperium_self.game.players_info[player-1].goods += 4;
      }
    };
    tech['faction2-fragile']   = {
      name        :       "Fragile" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].space_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].ground_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].pds_combat_roll_modifier = -1;
        mycallback(1);
      },
    };
    tech['faction2-analytic']   = {
      name        :       "Analytic" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].space_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].ground_combat_roll_modifier = -1;
        imperium_self.game.players_info[player-1].pds_combat_roll_modifier = -1;
        mycallback(1);
      },
    };
    tech['faction2-brilliant']   = {
      name        :       "Brilliant" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      playStrategyCardSecondaryTriggers :  function(imperium_self, player, card) {
	if (card == "tech") {
	  return 1;
	}
	return 0;
      },
      playStrategyCardSecondaryEvent :  function(imperium_self, player, card) {
        this.playerResearchTechnology(function(tech) {
          imperium_self.addMove("resolve\tstrategy");
          imperium_self.addMove("strategy\t"+card+"\t"+player+"\t2");
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
          imperium_self.addMove("resetconfirmsneeded\t"+imperium_self.game.players_info.length);
          imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
          imperium_self.endTurn();
        });
      },
    };
 





    //
    // FACTION 3
    //
    tech['faction3-field-nullification']   = {
      name        :       "Field Nullification" ,
      faction	  :	  "faction3",
      replaces	  :	  "",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      unit        :       0 ,
      prereqs     :       ["yellow","yellow"],
      type	  :	  "normal" ,
      onNewRound     :       function(imperium_self, player, mycallback) {
        imperium_self.game.players_info[player-1].turn_nullification_exhausted = 0;
        mycallback(1);
      },
      postSystemActivationTriggers :    function(imperium_self, player, sector) {
        if (imperium_self.game.players_info[player-1].turn_nullification_exhausted == 1) { return 0; }
	if (imerpium_self.doesSystemContainPlayerShips(player, sector) == 1) {
	  return 1;
	}
	return 0;
      },
      postSystemActivation :   function(imperium_self, player, sector) {

	if (player != this.game.player) {
	  this.updateStatus("Opponent is deciding whether to use Field Nullification");
	  return 0;
	} else {
	  let c = confirm("Do you wish to use Field Nullification to end this player's turn?");
	  if (c) {
	    imperium_self.addMove("notify\tField Nullification is triggered...");
  	    imperium_self.addMove("resolve\tpost_activate");
	    imperium_self.endTurn();
	  } else {
	    imperium_self.addMove("notify\tField Nullification is not triggered...");
	    imperium_self.endTurn();
	  }
	}
      }
    };
    tech['faction3-peace-accords']   = {
      name        :       "Peace Accords" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      playStrategyCardSecondaryTriggers :  function(imperium_self, player, card) {
	if (card == "diplomacy") {
	  return 1;
	}
	return 0;
      },
      playStrategyCardSecondaryEvent :  function(imperium_self, player, card) {
alert("PEACE ACCORDS");
        imperium_self.playerResearchTechnology(function(tech) {
          imperium_self.addMove("resolve\tstrategy\t1\t"+imperium_self.app.wallet.returnPublicKey());
	  imperium_self.addMove("purchase\t"+player+"\ttechnology\t"+tech);
          imperium_self.endTurn();
        });
      },
    };


    tech['faction3-quash']   = {
      name        :       "Peace Accords" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      menuOption  :       function(imperium_self, player) { 
	let x = {};
	    x.trigger = 'quash';
	    x.html = '<li class="option" id="quash">quash</li>';
	return x;
      },
      menuOptionTrigger:  function(imperium_self, player) { 
        if (imperium_self.game.players_info[imperium_self.game.player-1].strategy_tokens > 0) {
	  return 1;
	} else {
	  return 0;
	}
      },
      menuOptionActivated:  function(imperium_self, player) { 

	let agendas = imperium_self.game.state.agendas;
	let laws = imperium_self.returnAgendaCards();
console.log("AGENDAS: " + JSON.stringify(agendas));

	if (imperium_self.game.player != player) {

	} else {

	  let html = 'Select Agenda to Quash: <p></p><ul>';
	  for (let i = 0; i < agendas.length; i++) {
	    html += '<li class="option" id="'+agendas[i]+'">' + laws[agendas[i]].name + '</li>';
	  }
	  imperium_self.updateStatus(html);

	  $('.option').off();
	  $('.option').on('click',function () {

	    let choice = $(this).attr("id");

	    //
	    // and reveal the agendas
            //
            imperium_self.addMove("revealagendas");
            for (let i = 1; i <= imperium_self.game.players_info.length; i++) {
              imperium_self.addMove("FLIPCARD\t3\t1\t1\t"+i); // deck card poolnum player
            }
            imperium_self.addMove("discard\t"+imperium_self.game.player+"\t"+"agenda"+"\t"+choice);
	    imperium_self.endTurn();
	        
	  });
	}
      },
    };
    tech['faction3-instinct-training']   = {
      name        :       "Instinct Training" ,
      faction	  :	  "faction2",
      img         :       "/imperium/img/card_template.jpg" ,
      color       :       "" ,
      prereqs     :       [],
      type	  :	  "special" ,
      onNewRound :  function(imperium_self, player, mycallback) {
	if (player == imperium_self.game.player) {
	  imperium_self.game.players_info[player-1].instinct_training_exhausted = 0;
	}
	mycallback(1);
      },
      playActionCardTriggers :  function(imperium_self, player, card) {
	if (imperium_self.game.players_info[player-1].instinct_training_exhausted == 1) { return 0; }
	return 1;
      },
      playActionCardEvent :  function(imperium_self, player, card) {

	let factions = imperium_self.returnFactions();
	let action_cards = imperium_self.returnActionCards();

	let html  = factions[imperium_self.game.player_info[player-1].faction].name;
	    html += ' has played ';
	    html += action_cards[card].name;

	    html += '<ul>';	   
	    html += '<li class="option" id="yes">cancel action card</li>';
	    html += '<li class="option" id="no">do nothing</li>';
	    html += '</ul>';	   

	imperium_self.updateStatus(html);

	$('.option').off();
	$('.option').on('click',function () {

	  let choice = $(this).attr("id");
	  if (choice == "yes") {
	    imperium_self.game.players_info[player-1].instinct_training_exhausted = 1;
	    imperium_self.addMove("resolve\taction_card_post");
	    imperium_self.addMove("notify\tAction Card cancelled...");
	    imperium_self.addMove("notify\tXXCha use Instinct Training");
            imperium_self.endTurn();
	  } else {
	    imperium_self.addMove("notify\tXXCha do not use Instinct Training");
            imperium_self.endTurn();
	  }
	});

      },
    };
 
 




    for (var i in tech) {

      if (tech[i].replaces == null) { tech[i].replaces = ""; }
      if (tech[i].faction == null) { tech[i].faction = "all"; }
      if (tech[i].prereqs == null) { tech[i].prereqs = []; }
      if (tech[i].type == null) { tech[i].type = "special"; } // i.e. not a tech card

      if (tech[i].upgradeUnit == null) {
	tech[i].upgradeUnit = function(imperium_self, player, unit) { return unit; }
      }
      if (tech[i].onNewRound == null) {
	tech[i].onNewRound = function(imperium_self, player, mycallback) { mycallback(1); }
      }
      if (tech[i].onNewTurn == null) {
	tech[i].onNewTurn = function(imperium_self, player, mycallback) { mycallback(1); }
      }

      //
      // modifies main menu
      //
      if (tech[i].menuOption == null) {
	tech[i].menuOption = function(imperium_self, player) { return 0; }
      }
      if (tech[i].menuOptionTrigger == null) {
	tech[i].menuOptionTrigger = function(imperium_self, player) { return {}; }
      }
      if (tech[i].menuOptionActivated == null) {
	tech[i].menuOptionActivated = function(imperium_self, player) { return 0; }
      }




      ////////////////////////
      // synchronous events //
      ////////////////////////
      //
      // these can be called directly from game code itself, ie the imperium-state-updates functions
      // that execute game-code collectively on all player machines. they do not need to be added to
      // the stack for a separate check, since they are guaranteed not to stop execution for user-input.
      //

      //
      // unit is destroyed
      //
      if (tech[i].destroyedUnitTriggersSync == null) {
	tech[i].destroyedUnitTriggers = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
      }
      if (tech[i].destroyedUnitEventSync == null) {
	tech[i].destroyedUnitEvent = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
      }

      //
      // space unit is destroyed
      //
      if (tech[i].destroyedSpaceUnitTriggersSync == null) {
	tech[i].destroyedSpaceUnitTriggers = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
      }
      if (tech[i].destroyedUnitEventSync == null) {
	tech[i].destroyedUnitEvent = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
      }

      //
      // ground unit is destroyed
      //
      if (tech[i].destroyedGroundUnitTriggersSync == null) {
	tech[i].destroyedGroundUnitTriggersSync = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
      }
      if (tech[i].destroyedGroundUnitEventSync == null) {
	tech[i].destroyedGroundUnitEventSync = function(imperium_self, player, attacker, defender, sector, planet_idx, details) { return 0; }
      }





      //////////////////////////
      // asynchronous eventsa //
      //////////////////////////
      //
      // these should be trigged by placing the request for examination directly on the game stack. at
      // which point the engine will examine which players wish to trigger the events and process the 
      // interventions IN ORDER based on who can successfully trigger.
      //

      //
      // when action card is played
      //
      if (tech[i].playActionCardTriggers == null) {
	tech[i].playActionCardTriggers = function(imperium_self, player, card) { return 0; }
      }
      if (tech[i].playActionCardEvent == null) {
	tech[i].playActionCardEvent = function(imperium_self, player, card) { return 0; }
      }



      //
      // when strategy card primary is played
      //
      if (tech[i].playStrategyCardPrimaryTriggers == null) {
	tech[i].playStrategyCardPrimaryTriggers = function(imperium_self, player, card) { return 0; }
      }
      if (tech[i].playStrategyCardPrimaryEvent == null) {
	tech[i].playStrategyCardPrimaryEvent = function(imperium_self, player, card) { return 0; }
      }


      //
      // when strategy card secondary is played
      //
      if (tech[i].playStrategyCardSecondaryTriggers == null) {
	tech[i].playStrategyCardSecondaryTriggers = function(imperium_self, player, card) { return 0; }
      }
      if (tech[i].playStrategyCardSecondaryEvent == null) {
	tech[i].playStrategyCardSecondaryEvent = function(imperium_self, player, card) { return 0; }
      }


      //
      // when system is activated
      //
      if (tech[i].activateSystemTriggers == null) {
	tech[i].activateSystemTriggers = function(imperium_self, player, sector) { return 0; }
      }
      if (tech[i].activateSystemEvent == null) {
	tech[i].postSystemActivation = function(imperium_self, player, sector) { return 0; }
      }

      //
      // when pds combat starts
      //
      if (tech[i].pdsSpaceDefenseTriggers == null) {
	tech[i].pdsSpaceDefenseTriggers = function(imperium_self, player, sector) { return 0; }
      }
      if (tech[i].pdsSpaceDefenseEvent == null) {
	tech[i].pdsSpaceDefenseEvent = function(imperium_self, player, sector) { return 0; }
      }

      //
      // when space combat round starts
      //
      if (tech[i].spaceCombatTriggers == null) {
	tech[i].spaceCombatTriggers = function(imperium_self, player, sector) { return 0; }
      }
      if (tech[i].pdsSpaceDefenseEvent == null) {
	tech[i].pdsSpaceDefenseEvent = function(imperium_self, player, sector) { return 0; }
      }

      //
      // when bombardment starts
      //
      if (tech[i].bombardmentTriggers == null) {
	tech[i].bombardmentTriggers = function(imperium_self, player, sector) { return 0; }
      }
      if (tech[i].bombardmentEvent == null) {
	tech[i].bombardmentEvent = function(imperium_self, player, sector) { return 0; }
      }

      //
      // when planetry invasion starts
      //
      if (tech[i].planetaryDefenseTriggers == null) {
	tech[i].planetaryDefenseTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
      }
      if (tech[i].planetaryDefenseEvent == null) {
	tech[i].planetaryDefenseEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
      }


      //
      // when ground combat round starts
      //
      if (tech[i].groundCombatTriggers == null) {
	tech[i].groundCombatTriggers = function(imperium_self, player, sector, planet_idx) { return 0; }
      }
      if (tech[i].groundCombatEvent == null) {
	tech[i].groundCombatEvent = function(imperium_self, player, sector, planet_idx) { return 0; }
      }

    }


    return tech;
  
  }
  
  ///////////////////////////
  // Return Strategy Cards //
  ///////////////////////////
  returnStrategyCards() {
  
    let strategy = {};
  
    strategy['initiative']	= { order : 1 , img : "/imperium/img/strategy/INITIATIVE.png" , name : "Leadership" };
    strategy['diplomacy'] 	= { order : 2 , img : "/imperium/img/strategy/DIPLOMACY.png" , name : "Diplomacy" };
    strategy['politics'] 	= { order : 3 , img : "/imperium/img/strategy/POLITICS.png" , name : "Politics" };
    strategy['infrastructure']	= { order : 4 , img : "/imperium/img/strategy/BUILD.png" , name : "Construction" };
    strategy['trade'] 	 	= { order : 5 , img : "/imperium/img/strategy/TRADE.png" , name : "Trade" };
    strategy['military'] 	= { order : 6 , img : "/imperium/img/strategy/MILITARY.png" , name : "Warfare" };
    strategy['tech'] 		= { order : 7 , img : "/imperium/img/strategy/TECH.png" , name : "Technology" };
    strategy['empire'] 	 	= { order : 8 , img : "/imperium/img/strategy/EMPIRE.png" , name : "Imperial" };
  
    return strategy;
  
  }
  
  
  /////////////////////////
  // Return Action Cards //
  /////////////////////////
  returnActionCards() {
  
    let action = {};
  
    action['action1']	= { 
  	name : "Accidental Colonization" ,
  	type : "instant" ,
  	text : "Gain control of one planet not controlled by any player" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action2']	= { 
  	name : "Hydrocannon Cooling" ,
  	type : "instant" ,
  	text : "Ship gets -2 on combat rolls next round" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action3']	= { 
  	name : "Agile Thrusters" ,
  	type : "instant" ,
  	text : "Attached ship may cancel up to 2 hits by PDS or Ion Cannons" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action4']	= { 
  	name : "Diaspora Conflict" ,
  	type : "instant" ,
  	text : "Exhaust a planet card held by another player. Gain trade goods equal to resource value." ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action5']	= { 
  	name : "Consortium Research" ,
  	type : "instant" ,
  	text : "Cancel 1 yellow technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action6']	= { 
  	name : "Independent Thinker" ,
  	type : "instant" ,
  	text : "Cancel 1 blue technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action7']	= { 
  	name : "Military-Industrial Complex" ,
  	type : "instant" ,
  	text : "Cancel 1 red technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action8']	= { 
  	name : "Innovative Cluster" ,
  	type : "instant" ,
  	text : "Cancel 1 green technology prerequisite" ,
  	interactive : 0 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action9']	= { 
  	name : "Aggressive Upgrade" ,
  	type : "instant" ,
  	text : "Replace 1 of your Destroyers with a Dreadnaught" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
    action['action10']	= { 
  	name : "Lost Mission" ,
  	type : "instant" ,
  	text : "Place 1 Destroyer in a system with no existing ships" ,
  	interactive : 1 ,
  	img : "/imperium/img/action_card_template.png" ,
        onPlay : function(imperium_self, player, mycallback) {
console.log("THE ACTION CARD: " + this.name + " is being played!");
          mycallback(1);
        },
    };
  
    return action;
  
  }
  
  
  /////////////////////////
  // Return Agenda Cards //
  /////////////////////////
  returnAgendaCards() {
  
    let agenda = {};
  
    agenda['a1']	= { 
  	name : "Unruly Natives" ,
  	type : "Law" ,
  	text : "All invasions of unoccupied planets require conquering 1 infantry" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a2']	= { 
  	name : "Wormhole Travel Ban" ,
  	type : "Law" ,
  	text : "All invasions of unoccupied planets require conquering 1 infantry" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a3']	= { 
  	name : "Regulated Bureaucracy" ,
  	type : "Law" ,
  	text : "Players may have a maximum of 3 action cards in their hands at all times" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a4']	= { 
  	name : "Freedom in Arms Act" ,
  	type : "Law" ,
  	text : "Players may place any number of PDS units on planets" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a5']	= { 
  	name : "Performance Testing" ,
  	type : "Law" ,
  	text : "After any player researches a tach, he must destroy a non-fighter ship if possible" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a6']	= { 
  	name : "Fleet Limitations" ,
  	type : "Law" ,
  	text : "Players may have a maximum of four tokens in their fleet supply." ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a7']	= { 
  	name : "Restricted Conscription" ,
  	type : "Law" ,
  	text : "Production cost for infantry and fighters is 1 rather than 0.5 resources" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a8']	= { 
  	name : "Representative Democracy" ,
  	type : "Law" ,
  	text : "All players have only 1 vote in each Politics Vote" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
    agenda['a9']	= { 
  	name : "Hidden Agenda" ,
  	type : "Law" ,
  	text : "Agendas are Hidden By Default and Only Revealed when the Politics Card is Played" ,
  	img : "/imperium/img/agenda_card_template.png" ,
        onPass : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW PASSED!");
          mycallback(1);
	} ,
        onFail : function(imperium_self, players_in_favour, players_opposed, mycallback) {
console.log("THE LAW FAILS!");
          mycallback(1);
	} ,
    };
  
    return agenda;
  }
  
  
  /////////////////////
  // Return Factions //
  /////////////////////
  returnFaction(player) {
    let factions = this.returnFactions();
    if (this.game.players_info[player-1] == null) { return "Unknown"; }
    if (this.game.players_info[player-1] == undefined) { return "Unknown"; }
    return factions[this.game.players_info[player-1].faction].name;
  }
  returnSpeaker() {
    let factions = this.returnFactions();
    return factions[this.game.players_info[this.game.state.speaker-1].faction].name;
  }
  returnSectorName(pid) {
    return this.game.systems[this.game.board[pid].tile].name;
  }
  returnPlanetName(sector, planet_idx) {
    let sys = this.returnSystemAndPlanets(sector);
    return sys.p[planet_idx].name;
  }
  
  
  
  
  returnPlayers(num=0) {
  
    var players = [];
    let factions = this.returnFactions();
  
    for (let i = 0; i < num; i++) {
  
      if (i == 0) { col = "color1"; }
      if (i == 1) { col = "color2"; }
      if (i == 2) { col = "color3"; }
      if (i == 3) { col = "color4"; }
      if (i == 4) { col = "color5"; }
      if (i == 5) { col = "color6"; }
  
      var keys = Object.keys(factions);
      let rf = keys[this.rollDice(keys.length)-1];
      delete factions[rf];
  
      players[i] = {};
      players[i].action_cards_per_round = 1;
      players[i].new_tokens_per_round = 2;
      players[i].new_token_bonus_when_issued = 0;
      players[i].command_tokens  	= 3;
      players[i].strategy_tokens 	= 2;
      players[i].fleet_supply    	= 3;
      players[i].faction 		= rf;
      players[i].homeworld	= "";
      players[i].color   		= col;
      players[i].goods		= 0;
      players[i].commodities	= 3;
      players[i].commodity_limit	= 3;
  
      players[i].vp		= 0;
      players[i].passed		= 0;
      players[i].strategy_cards_played = [];
  
      //
      // gameplay modifiers (action cards + tech)
      //
      players[i].action_cards_bonus_when_issued = 0;
      players[i].new_tokens_bonus_when_issued = 0;
      players[i].fleet_move_bonus = 0;
      players[i].ship_move_bonus = 0;
      players[i].fly_through_asteroids = 0;
      players[i].reinforce_infantry_after_successful_ground_combat = 0;
      players[i].x91_bacterial_bombardment = 0;
      players[i].evasive_bonus_on_pds_shots = 0;
      players[i].perform_two_actions = 0;
      players[i].move_through_sectors_with_opponent_ships = 0;
      players[i].assign_pds_hits_to_non_fighters = 0;
      players[i].reallocate_four_infantry_per_round = 0;
      players[i].may_produce_after_gaining_planet = 0;
      players[i].extra_roll_on_bombardment_or_pds = 0;
      players[i].stasis_on_opponent_combat_first_round = 0;
      players[i].may_repair_damaged_ships_after_space_combat = 0;
      players[i].chain_shot = 0;
      players[i].production_bonus = 0;

      //
      // faction gameplay modifiers 
      //
      players[i].deep_space_conduits = 0; // treat all systems adjacent to activated system
      players[i].resupply_stations = 0; // gain trade goods on system activation if contains ships 
      players[i].turn_nullification = 0; // after player activates system with ships, can end turn ...
 
      //
      // roll modifiers
      //
      players[i].space_combat_roll_modifier 	= 0;
      players[i].ground_combat_roll_modifier 	= 0;
      players[i].pds_combat_roll_modifier 	= 0;

      //
      // tech upgrades
      //
      players[i].temporary_green_tech_prerequisite = 0;
      players[i].temporary_yellow_tech_prerequisite = 0;
      players[i].temporary_red_tech_prerequisite = 0;
      players[i].temporary_blue_tech_prerequisite = 0;
      players[i].permanent_green_tech_prerequisite = 0;
      players[i].permanent_yellow_tech_prerequisite = 0;
      players[i].permanent_red_tech_prerequisite = 0;
      players[i].permanent_blue_tech_prerequisite = 0;
      players[i].temporary_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;
      players[i].permanent_ignore_number_of_tech_prerequisites_on_nonunit_upgrade = 0;

      players[i].upgraded_infantry = 0;
      players[i].upgraded_pds = 0;
      players[i].upgraded_spacedock = 0;
      players[i].upgraded_fighter = 0;
      players[i].upgraded_destroyer = 0;
      players[i].upgraded_carrier = 0;
      players[i].upgraded_cruiser = 0;
      players[i].upgraded_dreadnaught = 0;
      players[i].upgraded_flagship = 0;
      players[i].upgraded_warsun = 0;
  
      if (i == 1) { players[i].color   = "yellow"; }
      if (i == 2) { players[i].color   = "green"; }
      if (i == 3) { players[i].color   = "blue"; }
      if (i == 4) { players[i].color   = "purple"; }
      if (i == 5) { players[i].color   = "black"; }
  
      players[i].planets = [];		
      players[i].tech = [];
      players[i].tech_exhausted_this_turn = [];
      players[i].upgrades = [];
      players[i].strategy = [];		// strategy cards  

      // scored objectives
      players[i].scored_objectives = [];
      players[i].secret_objectives = [];
  
    }
  
    return players;
  
  }
  
  
  
  
  
  /////////////////////
  // Return Factions //
  /////////////////////
  returnFactions() {
    var factions = {};
    factions['faction1'] = {
      homeworld: "sector38",
      name: "Federation of Sol",
      space_units: ["carrier","carrier","destroyer","fighter","fighter","fighter"],
      ground_units: ["infantry","infantry","infantry","infantry","infantry","spacedock"],
      tech: ["neural-implants","electron-shielding","faction1-orbital-drop","faction1-versatile", "faction1-advanced-carrier-ii", "faction1-infantry-ii"]
    };
    factions['faction2'] = {
      homeworld: "sector39",
      name: "Universities of Jol Nar",
      space_units: ["carrier","carrier","dreadnaught","fighter"],
      ground_units: ["infantry","infantry","pds","spacedock"],
      tech: ["neural-implants","electron-shielding","waste-recycling","plasma-clusters","faction2-analytic","faction2-brilliant","faction2-fragile","faction2-deep-space-conduits","faction2-resupply-stations"]
    };
    factions['faction3'] = {
      homeworld: "sector40",
      name: "XXCha Kingdom",
      space_units: ["carrier","cruiser","cruiser","fighter","fighter","fighter"],
      ground_units: ["infantry","infantry","infantry","infantry","pds","spacedock"],
      tech: ["plasma-clusters", "faction3-field-nullification", "faction3-peace-accords", "faction3-quash", "faction3-instinct-training"]
    };
  /**
    factions['faction4'] = {
      homeworld: "sector32",
      name: "Faction 4"
    };
    factions['faction5'] = {
      homeworld: "sector32",
      name: "Faction 5"
    };
    factions['faction6'] = {
      homeworld: "sector32",
      name: "Faction 6"
    };
    factions['faction7'] = {
      homeworld: "sector32",
      name: "Faction 7"
    };
    factions['faction8'] = {
      homeworld: "sector32",
      name: "Faction 8"
    };
    factions['faction9'] = {
      homeworld: "sector32",
      name: "Faction 9"
    };
    factions['faction10'] = {
      homeworld: "sector32",
      name: "Faction 10"
    };
    factions['faction11'] = {
      homeworld: "sector32",
      name: "Faction 11"
    };
    factions['faction12'] = {
      homeworld: "sector32",
      name: "Faction 12"
    };
    factions['faction13'] = {
      homeworld: "sector32",
      name: "Faction 13"
    };
    factions['faction14'] = {
      homeworld: "sector32",
      name: "Faction 14"
    };
    factions['faction15'] = {
      homeworld: "sector32",
      name: "Faction 15"
    };
    factions['faction16'] = {
      homeworld: "sector32",
      name: "Faction 16"
    };
    factions['faction17'] = {
      homeworld: "sector32",
      name: "Faction 17"
    };
  **/
    return factions;
  }; 
  
  
  
  ///////////////////////////////
  // Return Starting Positions //
  ///////////////////////////////
  returnHomeworldSectors(players = 4) {
    if (players <= 2) {
      return ["1_1", "4_7"];
    }
  
    if (players <= 3) {
      return ["1_1", "4_7", "7_1"];
    }
  
    if (players <= 4) {
      return ["1_3", "3_1", "5_6", "7_2"];
    }
  
    if (players <= 5) {
      return ["1_3", "3_1", "4_7", "7_1", "7_4"];
    }
  
    if (players <= 6) {
      return ["1_1", "1_4", "4_1", "4_7", "7_1", "7_7"];
    }
  };
  
  
  
