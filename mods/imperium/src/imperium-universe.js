 
  ////////////////////
  // Return Planets //
  ////////////////////
  returnPlanets() {
  
    var planets = {};
  
    // regular planets
    planets['planet1']  = { type : "hazardous" , img : "/imperium/img/planets/CRYSTALIS.png" , name : "Crystalis" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet2']  = { type : "hazardous" , img : "/imperium/img/planets/TROTH.png" , name : "Troth" , resources : 2 , influence : 0 , bonus : ""  }
    planets['planet3']  = { type : "industrial" , img : "/imperium/img/planets/LONDRAK.png" , name : "Londrak" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet4']  = { type : "hazardous" , img : "/imperium/img/planets/CITADEL.png" , name : "Citadel" , resources : 0 , influence : 4 , bonus : "red"  }
    planets['planet5']  = { type : "industrial" , img : "/imperium/img/planets/BELVEDYR.png" , name : "Belvedyr" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet6']  = { type : "industrial" , img : "/imperium/img/planets/SHRIVA.png" , name : "Shriva" , resources : 2 , influence : 1 , bonus : ""  }
    planets['planet7']  = { type : "hazardous" , img : "/imperium/img/planets/ZONDOR.png" , name : "Zondor" , resources : 3 , influence : 1 , bonus : ""  }
    planets['planet8']  = { type : "hazardous" , img : "/imperium/img/planets/CALTHREX.png" , name : "Calthrex" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet9']  = { type : "cultural" , img : "/imperium/img/planets/SOUNDRA-IV.png" , name : "Soundra IV" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet10'] = { type : "cultural" , img : "/imperium/img/planets/VIGOR.png" , name : "Vigor" , resources : 1 , influence : 1 , bonus : ""  }
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
    planets['new-byzantium'] = { type : "diplomatic" , img : "/imperium/img/planets/NEW-BYZANTIUM.png" , name : "New Byzantium" , resources : 1 , influence : 6 , bonus : ""  }
    planets['planet36'] = { type : "cultural" , img : "/imperium/img/planets/OUTERANT.png" , name : "Outerant" , resources : 1 , influence : 3 , bonus : ""  }
    planets['planet37'] = { type : "industrial" , img : "/imperium/img/planets/VESPAR.png" , name : "Vespar" , resources : 2 , influence : 2 , bonus : ""  }
    planets['planet38'] = { type : "hazardous" , img : "/imperium/img/planets/CRAW-POPULI.png" , name : "Craw Populi" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet39'] = { type : "cultural" , img : "/imperium/img/planets/YSSARI-II.png" , name : "Yssari-II" , resources : 0 , influence : 1 , bonus : ""  }
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
    planets['planet50'] = { type : "cultural" , img : "/imperium/img/planets/FIREHOLE.png" , name : "Firehole" , resources : 3 , influence : 0 , bonus : ""  }
    planets['planet51'] = { type : "industrial" , img : "/imperium/img/planets/QUARTIL.png" , name : "Quartil" , resources : 3 , influence : 1 , bonus : ""  } // wormhole B system planet
    planets['planet52'] = { type : "hazardous" , img : "/imperium/img/planets/YODERUX.png" , name : "Yoderux" , resources : 3 , influence : 1 , bonus : ""  } // wormhole A system planet
    planets['planet53'] = { type : "homeworld" , img : "/imperium/img/planets/JOL.png" , name : "Jol" , resources : 1 , influence : 2 , bonus : ""  }
    planets['planet54'] = { type : "homeworld" , img : "/imperium/img/planets/NAR.png" , name : "Nar" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet55'] = { type : "homeworld" , img : "/imperium/img/planets/ARCHION-REX.png" , name : "Archion Rex" , resources : 2 , influence : 3 , bonus : ""  }
    planets['planet56'] = { type : "homeworld" , img : "/imperium/img/planets/ARCHION-TAO.png" , name : "Archion Tao" , resources : 1 , influence : 1 , bonus : ""  }
    planets['planet57'] = { type : "homeworld" , img : "/imperium/img/planets/EARTH.png" , name : "Earth" , resources : 4 , influence : 2 , bonus : ""  }
    planets['planet58'] = { type : "homeworld" , img : "/imperium/img/planets/ARTIZZ.png" , name : "Artizz" , resources : 4 , influence : 1 , bonus : ""  }
    planets['planet59'] = { type : "cultural" , img : "/imperium/img/planets/STARTIDE.png" , name : "Startide" , resources : 2 , influence : 0 , bonus : ""  }   	// sector 58
    planets['planet60'] = { type : "industrial" , img : "/imperium/img/planets/GIANTS-DRINK.png" , name : "Giant's Drink" , resources : 1 , influence : 1 , bonus : ""  }	// sector 59
    planets['planet61'] = { type : "hazardous" , img : "/imperium/img/planets/MIRANDA.png" , name : "Miranda" , resources : 0 , influence : 2 , bonus : ""  }		// sector 60
    planets['planet62'] = { type : "industrial" , img : "/imperium/img/planets/EBERBACH.png" , name : "Eberbach" , resources : 2 , influence : 1 , bonus : ""  }		// sector 61
    planets['planet63'] = { type : "hazardous" , img : "/imperium/img/planets/OTHO.png" , name : "Otho" , resources : 1 , influence : 2 , bonus : ""  }			// sector 62
    planets['planet64'] = { type : "hazardous" , img : "/imperium/img/planets/PERTINAX.png" , name : "Pertinax" , resources : 2 , influence : 2 , bonus : ""  }		// sector 63
    planets['planet65'] = { type : "cultural" , img : "/imperium/img/planets/COTILLARD.png" , name : "Cotillard" , resources : 2 , influence : 2 , bonus : ""  }	// sector 64
    planets['planet66'] = { type : "cultural" , img : "/imperium/img/planets/DOMINIC.png" , name : "Dominic" , resources : 3 , influence : 1 , bonus : ""  }		// sector 65
    planets['planet67'] = { type : "industrial" , img : "/imperium/img/planets/PESTULON.png" , name : "Pestulon" , resources : 1 , influence : 1 , bonus : "yellow"  }	// sector 66
    planets['planet68'] = { type : "hazardous" , img : "/imperium/img/planets/XIAO-ZUOR.png" , name : "Xiao Zuor" , resources : 1 , influence : 3 , bonus : ""  }	// sector 67
    planets['planet69'] = { type : "hazardous" , img : "/imperium/img/planets/KROEBER.png" , name : "Kroeber" , resources : 2 , influence : 0 , bonus : ""  }		// sector 68
    planets['planet70'] = { type : "hazardous" , img : "/imperium/img/planets/LEGUIN.png" , name : "Leguin" , resources : 0 , influence : 1 , bonus : ""  }		// sector 69
    planets['planet71'] = { type : "cultural" , img : "/imperium/img/planets/SIGURD.png" , name : "Sigurd's Cradle" , resources : 1 , influence : 3 , bonus : ""  }	// sector 70
    planets['planet72'] = { type : "cultural" , img : "/imperium/img/planets/KLENCORY.png" , name : "Klencory" , resources : 2 , influence : 2 , bonus : ""  }		// sector 71
    planets['planet73'] = { type : "homeworld" , img : "/imperium/img/planets/ALTAIR-IV.png" , name : "Altair-IV" , resources : 4 , influence : 4 , bonus : ""  }		// sector 71
    planets['planet74'] = { type : "homeworld" , img : "/imperium/img/planets/MUASYM.png" , name : "Muasym" , resources : 4 , influence : 1 , bonus : ""  }		// sector 71
    planets['planet75'] = { type : "homeworld" , img : "/imperium/img/planets/SARRON.png" , name : "Sarron" , resources : 1 , influence : 2 , bonus : ""  }		// sector 71
    planets['planet76'] = { type : "homeworld" , img : "/imperium/img/planets/REPTILLION.png" , name : "Reptillion" , resources : 2 , influence : 3 , bonus : ""  }		// sector 71

    for (var i in planets) {

      planets[i].exhausted = 0;
      planets[i].locked = 0; // units cannot be placed, produced or landed
      planets[i].owner = -1;
      planets[i].units = [this.totalPlayers]; // array to store units
      planets[i].sector = ""; // "sector43" <--- fleshed in by initialize
      planets[i].tile = ""; // "4_5" <--- fleshed in by initialize
      planets[i].idx = -1; // 0 - n // <--- fleshed in by initialize
      planets[i].planet = ""; // name in planets array
      planets[i].hw = 0;

      for (let j = 0; j < this.totalPlayers; j++) {
        planets[i].units[j] = [];


	if (j == 1) {
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("infantry", 1));
//	  planets[i].units[j].push(this.returnUnit("pds", 1));
//	  planets[i].units[j].push(this.returnUnit("pds", 1));
//	  planets[i].units[j].push(this.returnUnit("spacedock", 1));
	}

      }
    }
 
    return planets;
  }
  
  
  
  ////////////////////
  // Return Sectors //
  ////////////////////
  //
  // type 0 - normal
  // type 1 - rift
  // type 2 - nebula
  // type 3 - asteroids
  // type 4 - supernova
  //
  returnSectors() {

    var sectors = {};

    sectors['sector3']         = { img : "/imperium/img/sectors/sector3.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector4']         = { img : "/imperium/img/sectors/sector4.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector5']         = { img : "/imperium/img/sectors/sector5.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector6']         = { img : "/imperium/img/sectors/sector6.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector1']         = { img : "/imperium/img/sectors/sector1.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] }
    sectors['sector2']         = { img : "/imperium/img/sectors/sector2.png" , 	   	   name : "Empty Space" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } 
    sectors['sector7']         = { img : "/imperium/img/sectors/sector7.png" , 	   	   name : "Gravity Rift" , type : 1 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // black hole or rift
    //sectors['sector33']        = { img : "/imperium/img/sectors/sector33.png" , 	   name : "Nebula" , type : 2 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // nebula
    sectors['sector72']         = { img : "/imperium/img/sectors/sector72.png" , 	   name : "Nebula" , type : 2 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // nebula
    sectors['sector34']        = { img : "/imperium/img/sectors/sector34.png" , 	   name : "Asteroid Field" , type : 3 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // asteroids
    sectors['sector35']        = { img : "/imperium/img/sectors/sector35.png" , 	   name : "Asteroid Field" , type : 3 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // asteroids
    //sectors['sector36']        = { img : "/imperium/img/sectors/sector36.png" , 	   name : "Supernova" , type : 4 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // supernova
    sectors['sector71']        = { img : "/imperium/img/sectors/sector71.png" , 	   name : "Supernova" , type : 4 , hw : 0 , wormhole : 0, mr : 0 , planets : [] } // supernova
    sectors['sector54']        = { img : "/imperium/img/sectors/sector54.png" , 	   name : "Wormhole A" , type : 0 , hw : 0 , wormhole : 1, mr : 0 , planets : [] } 		// wormhole a
    sectors['sector56']        = { img : "/imperium/img/sectors/sector56.png" , 	   name : "Wormhole B" , type : 0 , hw : 0 , wormhole : 2, mr : 0 , planets : [] } 		// wormhole b

    sectors['sector55']        = { img : "/imperium/img/sectors/sector55.png" , 	   name : "Yoderux" , type : 0 , hw : 0 , wormhole : 1, mr : 0 , planets : ['planet52'] } 	// wormhole a
    sectors['sector57']        = { img : "/imperium/img/sectors/sector57.png" , 	   name : "Quartil" , type : 0 , hw : 0 , wormhole : 2, mr : 0 , planets : ['planet51'] } 	// wormhole b

    sectors['sector8']         = { img : "/imperium/img/sectors/sector8.png" , 	   	   name : "Crystalis / Troth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet1','planet2'] }
    sectors['sector9']         = { img : "/imperium/img/sectors/sector9.png" , 	   	   name : "Londrak / Citadel" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet3','planet4'] }
    sectors['sector10']        = { img : "/imperium/img/sectors/sector10.png" , 	   name : "Belvedyr / Shriva" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet5','planet6'] }
    sectors['sector11']        = { img : "/imperium/img/sectors/sector11.png" , 	   name : "Zondor / Calthrex" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet7','planet8'] }
    sectors['sector12']        = { img : "/imperium/img/sectors/sector12.png" , 	   name : "Soundra-IV / Vigor" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet9','planet10'] }
    sectors['sector15']        = { img : "/imperium/img/sectors/sector15.png" , 	   name : "Granton / Harkon" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet15','planet16'] }
    sectors['sector16']        = { img : "/imperium/img/sectors/sector16.png" , 	   name : "New Illia / Lazaks Curse" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet17','planet18'] }
    sectors['sector18']        = { img : "/imperium/img/sectors/sector18.png" , 	   name : "Siren's End / Riftview" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet21','planet22'] }
    sectors['sector19']        = { img : "/imperium/img/sectors/sector19.png" , 	   name : "Broughton / Fjordra" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet23','planet24'] }
    sectors['sector20']        = { img : "/imperium/img/sectors/sector20.png" , 	   name : "Singharta / Nova Klondike" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet25','planet26'] }
    sectors['sector22']        = { img : "/imperium/img/sectors/sector22.png" , 	   name : "Hoth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet29'] }
    sectors['sector25']        = { img : "/imperium/img/sectors/sector25.png" , 	   name : "Gravity's Edge" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet32'] }
    sectors['sector26']        = { img : "/imperium/img/sectors/sector26.png" , 	   name : "Populax" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet33'] }
    sectors['sector27']        = { img : "/imperium/img/sectors/sector27.png" , 	   name : "Old Moultour" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet34'] } 
    sectors['new-byzantium']   = { img : "/imperium/img/sectors/sector28.png" , 	   name : "New Byzantium" , type : 0 , hw : 0 , wormhole : 0, mr : 1 , planets : ['new-byzantium'] }
    sectors['sector29']        = { img : "/imperium/img/sectors/sector29.png" , 	   name : "Outerant" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet36'] }
    sectors['sector31']        = { img : "/imperium/img/sectors/sector31.png" , 	   name : "Craw Populi" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet38'] }
    sectors['sector32']        = { img : "/imperium/img/sectors/sector32.png" , 	   name : "Yssari-II" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet39'] }
    sectors['sector38']        = { img : "/imperium/img/sectors/sector38.png" , 	   name : "Lorstruck / Industryl" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet41','planet42'] }
    sectors['sector39']        = { img : "/imperium/img/sectors/sector39.png" , 	   name : "Mechanix / Hearthslough" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet43','planet44'] }
    sectors['sector40']        = { img : "/imperium/img/sectors/sector40.png" , 	   name : "Aandor / Incarth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet46','planet45'] }
    sectors['sector41']        = { img : "/imperium/img/sectors/sector41.png" , 	   name : "Hope's Lure" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet40'] }
    sectors['sector42']        = { img : "/imperium/img/sectors/sector42.png" , 	   name : "Quandam" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet47'] }
    sectors['sector43']        = { img : "/imperium/img/sectors/sector43.png" , 	   name : "Brest" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet48'] }
    sectors['sector44']        = { img : "/imperium/img/sectors/sector44.png" , 	   name : "Hiraeth" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet49'] }
    sectors['sector58']        = { img : "/imperium/img/sectors/sector58.png" , 	   name : "Startide" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet59'] }
    sectors['sector59']        = { img : "/imperium/img/sectors/sector59.png" , 	   name : "Giant's Drink" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet60'] }
    sectors['sector60']        = { img : "/imperium/img/sectors/sector60.png" , 	   name : "Miranda" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet61'] }
    sectors['sector62']        = { img : "/imperium/img/sectors/sector62.png" , 	   name : "Otho" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet63'] }
    sectors['sector65']        = { img : "/imperium/img/sectors/sector65.png" , 	   name : "Dominic" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet66'] }
    sectors['sector67']        = { img : "/imperium/img/sectors/sector67.png" , 	   name : "Xiao-Zuor" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet68'] }
    sectors['sector69']        = { img : "/imperium/img/sectors/sector69.png" , 	   name : "Sigurd's Cradle" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet71'] }

    //sectors['sector14']        = { img : "/imperium/img/sectors/sector14.png" , 	   name : "Sector 14" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet13','planet14'] }
    //sectors['sector17']        = { img : "/imperium/img/sectors/sector17.png" , 	   name : "Sector 17" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet19','planet20'] }
    //sectors['sector23']        = { img : "/imperium/img/sectors/sector23.png" , 	   name : "Sector 23" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet30'] }
    sectors['sector24']        = { img : "/imperium/img/sectors/sector24.png" , 	   name : "Grox Towers" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet31'] }
    //sectors['sector30']        = { img : "/imperium/img/sectors/sector30.png" , 	   name : "Sector 30" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet37'] }
    //sectors['sector45']        = { img : "/imperium/img/sectors/sector45.png" , 	   name : "Sector 45" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet50'] } 
    //sectors['sector61']        = { img : "/imperium/img/sectors/sector61.png" , 	   name : "Sector 61" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet62'] } // weird ring
    //sectors['sector63']        = { img : "/imperium/img/sectors/sector63.png" , 	   name : "Sector 63" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet64'] }
    //sectors['sector64']        = { img : "/imperium/img/sectors/sector64.png" , 	   name : "Sector 64" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet65'] }
    sectors['sector66']        = { img : "/imperium/img/sectors/sector66.png" , 	   name : "Pestulon" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet67'] }
    //sectors['sector68']        = { img : "/imperium/img/sectors/sector68.png" , 	   name : "Sector 68" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet69','planet70'] }
    //sectors['sector70']        = { img : "/imperium/img/sectors/sector70.png" , 	   name : "Sector 70" , type : 0 , hw : 0 , wormhole : 0, mr : 0 , planets : ['planet72'] }

    sectors['sector50']        = { img : "/imperium/img/sectors/sector50.png" , 	   name : "Jol Nar Homeworld" , type : 0 , hw : 1 , wormhole : 0 , mr : 0 , planets : ['planet53','planet54'] }
    sectors['sector51']        = { img : "/imperium/img/sectors/sector51.png" , 	   name : "XXCha Homeworld" , type : 0 , hw : 1 , wormhole : 0 , mr : 0 , planets : ['planet55','planet56'] }
    sectors['sector52']        = { img : "/imperium/img/sectors/sector52.png" , 	   name : "Sol Homeworld" , type : 0 , hw : 1 , wormhole : 0 , mr : 0 , planets : ['planet57'] }
    sectors['sector53']        = { img : "/imperium/img/sectors/sector53.png" , 	   name : "Sardaak Homeworld" , type : 0 , hw : 1 , wormhole: 0 , mr : 0 , planets : ['planet58'] }
    sectors['sector74']        = { img : "/imperium/img/sectors/sector74.png" , 	   name : "Yin Homeworld" , type : 0 , hw : 1 , wormhole : 0, mr : 0 , planets : ['planet73'] }
    sectors['sector75']        = { img : "/imperium/img/sectors/sector75.png" , 	   name : "Ysarril Homeworld" , type : 0 , hw : 1 , wormhole : 0, mr : 0 , planets : ['planet76','planet75'] }
    sectors['sector76']        = { img : "/imperium/img/sectors/sector76.png" , 	   name : "Muaat Homeworld" , type : 0 , hw : 1 , wormhole : 0, mr : 0 , planets : ['planet74'] }


    for (var i in sectors) {

      sectors[i].units = [this.totalPlayers]; // array to store units
      sectors[i].activated = [this.totalPlayers]; // array to store units
      sectors[i].sector = "";  // sector reference
      sectors[i].tile = "";  // tile on board

      for (let j = 0; j < this.totalPlayers; j++) {
        sectors[i].units[j] = []; // array of united
        sectors[i].activated[j] = 0; // is this activated by the player
      }

      
//      sectors[i].units[1] = [];
//      sectors[i].units[1].push(this.returnUnit("fighter", 1));  
//      sectors[i].units[1].push(this.returnUnit("fighter", 1));  


    }
    return sectors;
  };
  
  
  addWormholesToBoardTiles(tiles) {

    let wormholes = [];

    for (let i in this.game.sectors) {
      if (this.game.sectors[i].wormhole != 0) { wormholes.push(i); }
    }    

    for (let i in tiles) {
      if (this.game.board[i]) {
        let sector = this.game.board[i].tile;
        if (this.game.sectors[sector].wormhole != 0) {
	  for (let z = 0; z < wormholes.length; z++) {

	    //
	    // wormholes are all adjacent
	    //
	    if (this.game.state.wormholes_adjacent || this.game.state.temporary_wormholes_adjacent) {

	      if (wormholes[z] != sector && this.game.sectors[sector].wormhole != 0 && this.game.sectors[wormholes[z]].wormhole != 0) {
	        let tile_with_partner_wormhole = "";
	        for (let b in tiles) {
	          if (this.game.board[b]) {
	            if (this.game.board[b].tile == wormholes[z]) {
	              if (!tiles[i].neighbours.includes(b)) {
	  	        tiles[i].neighbours.push(b);
	  	      }
	            }
	          }
	        }
	      }

	    //
	    // wormholes are not adjacent
	    //
	    } else {

	      if (wormholes[z] != sector && this.game.sectors[sector].wormhole == this.game.sectors[wormholes[z]].wormhole) {
	        let tile_with_partner_wormhole = "";
	        for (let b in tiles) {
	          if (this.game.board[b]) {
	            if (this.game.board[b].tile == wormholes[z]) {
	              if (!tiles[i].neighbours.includes(b)) {
	  	        tiles[i].neighbours.push(b);
	  	      }
	            }
	          }
	        }
	      }
  	    }

  	  }
        }
      }
    }

    return tiles;
  }


  
  returnBoardTiles() {
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
  
  
  


  ///////////////////////////////
  // Return Starting Positions //
  ///////////////////////////////
  returnHomeworldSectors(players = 4) {
    if (players <= 2) {
      return ["1_1", "4_7"];
//      return ["1_1", "2_1"];
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



