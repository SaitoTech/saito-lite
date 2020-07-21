var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Midnight extends GameTemplate {

  constructor(app) {

    super(app);

    this.name            = "Midnight Rogue";
    this.slug            = "midnight";
    this.description     = "Experimental Interactive Fiction demo";
    this.categories      = "Arcade Games Entertainment";

    this.maxPlayers      = 1;
    this.minPlayers      = 1;
    this.type            = "Fiction";

  }




  initializeGame(game_id) {

    if (this.game.status != "") { this.updateStatus(this.game.status); }

    this.initializeDice(); 

    this.updateStatus("Generating the Game");
    this.game.queue.push("page\t1");

    this.game.state = this.returnState();

  }


  returnState() {

    let state = {};
        state.skill 	= this.rollDice(6) + 6;
        state.stamina	= this.rollDice(6) + this.rollDice(6) + 12;
        state.luck 	= this.rollDice(6) + 6;

        state.inventory = [];

    return state;

  }



  handleGameLoop(msg=null) {

    let midnight_self = this;


    ///////////
    // QUEUE //
    ///////////
    if (this.game.queue.length > 0) {

console.log("QUEUE: " + JSON.stringify(this.game.queue));

      let qe = this.game.queue.length-1;
      let mv = this.game.queue[qe].split("\t");


      //
      // goto X
      // combat
      //
      if (mv[0] === "page") {

	let page = mv[1];

        this.game.queue.splice(qe, 1);
	this.showPage(page);

	return 0;

      }

      if (mv[0] === "combat") {

	let enemies 	 = JSON.parse(mv[1]);
	let victory_page = mv[2];
	let defeat_page  = mv[3];

	this.handleCombat(enemies, victory_page, defeat_page);

	return 0;

      }

    } // if cards in queue
    return 1;
  }




  showPage(page) {

    let midnight_self = this;
    let book = this.returnBook();
    let html = book[page].text;

    if (book[page].choices) {
      if (book[page].choices.length > 0) {
	html += '<ul>';
	for (let i = 0; i < book[page].choices.length; i++) {
	  html += `<li class="textchoice" id="${i}">${book[page].choices[i].option}</li>`;
	}
	html += '/<ul>';
      }
    }

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action = $(this).attr("id");

      midnight_self.addMove(book[page].choices[action].command);
      midnight_self.endTurn();

    });

  }




  returnBook() {

    var book = {};

    book['1'] = {
      text	:	"As you leave the Guild, your mind works quickly, listing the places where you might find some information as to the gem's whereabouts. Most of the rich merchants in the town have houses near the Field Gate; If you can find Brass's house, you may be able to find some useful information there. Then again, the Merchant's Guild is just across the Market Square, and if Brass is an important merchant, he's bound to have a suite of offices there. Finally, there's the Noose, the area of town around the Thieves' Guild. You hardly ever see a merchant there, but it's the best place in Allansia for picking up all kinds of gossip and rumours. Where will you try first?",
      choices	:	[
	{
	  option	:	"The Merchant's Guild",
	  command	:	"page\t129",
	},
	{
	  option	:	"Brass's house?",
	  command	:	"page\t156",
	},
	{
	  option	:	"The Noose",
	  command	:	"page\t203",
	}
      ]
    };


    book['2'] = {
      text  : "The water is icy cold. You start to wade across the pond, and instantly your legs are attacked by a packoff small but vicious cold water Piranha. You try tofight them off, but it isn’t easy — you can hardly seethem through the weed-choked water, and you endup splashing a lot but hitting very little, Fight thePiranha as a single enemy, subtracting 1 point FromPour Attack Strength for this combat.",
      choices : [
  {
    option  : "Fight Piranha",
    command : "page\t8",
  },
      ]
    };

    book['3'] = {
      text  :"You try the door, but it’s locked. If you have PICK LOCK skill, turn to 259. If not, will you try the door with the fish symbol (turn to 163), or will you give up on the Merchants’ Guild and look for clues in Brass’s house( if you haven’t been there before) by turning to 156, or set out in search of Eye of the Basilisk armed only with the information you already have (turn to 144)?",
      choices : [
  {
    option  : "PICK LOCK skill",
    command : "page\t259",
  },
  {
    option  : "Go to Brass’s House",
    command : "page\t156",
  },
  {
    option  : "Search for Eye of the Basilisk",
    command : "page\t144",
  }
      ]
    };


    book['4'] = {
      text  :"You find a suitable place for climbing, and start to scale the wall. If you are using a rope and grapnel, turn to 15. If you are not, turn to 257",
      choices : [
  {
    option  : "I'm using a Rope and Grapnel",
    command : "page\t15",
  },
  {
    option  : "I'm not using",
    command : "page\t257",
  },
      ]
    };

 book['5'] = {
      text  :"Your weapon files with deadly accuracy, and knocks the torch out of its holder. It falls to the floor, sputters for a few seconds, and goes out. You decide to douse your own torch as well, just in case the light form that casts another unfriendly shadow. It is now pitch-dark, and you feel your way along the walls of the cavern, trying to find the passage which will take you out of it. Test your luck, if you are Lucky, turn to 94. If you are Unlucky, turn to 220.",
      choices : [
  {
    option  : "Lucky",
    command : "page\t94",
  },
  {
    option  : "Unlucky",
    command : "page\t220",
  },
      ]
    };


 book['6'] = {
      text   :"You open the cage, and the Dwarf springs out, reaching for your throat. He seems to grow larger as he attacks you; his skin  becomes scaly, and spines erupt from his head and back. You have been tricked by a Shapechanger.  Now you must flight for your life.",
      choices : [
  {
    option  : "Defeat the Shapechanger,leave the room",
    command : "page\t155",
  },
      ]
    };

book['7'] = {
      text   : "You run out of the house and lose yourself in the night, twisting and turning through winding alleys to throw off any possible pursuit. You know that the crash will have roused the whole household, and you decide to wait for an hour or so before returning to the house, to let them all get back to sleep. You can use this time to visit the Merchants’ Guild - if you haven’t already - by turning to 129, or you cam simply wait. In either case, you will have no trouble getting into the house when you return, because you have been there before. So make a note of entry 276, and start there when you return to the house.",
      choices : [
  {
    option  : "Visit the Merchants’ Guild",
    command : "page\t129",
  },
  {
    option  : "just wait",
    command : "page\t276",
  },
      ]
    };

book['8'] = {
      text   :"You reach the plinth safety, and stand clutching the statue for a moment, catching your breath before you look at the inscription. Brushing the dead leaves and other rubbish away, you reveal the following words:\n\nMy enemy’s a heart of stone,\nMy arrow never flies,\nYet when my arrow heads for home,\nThe gate of death yawns wide.\nYou puzzle for a while, wondering what to do. As you lean against the statue, it shifts slightly, making you jump. You push it, and it shifts again - the whole thing is made to swivel back and forth. The arrow must be the key to getting into the barrow.What will you do?\n\nYou puzzle for a while, wondering what to do. As you lean against the statue, it shifts slightly, making you jump. You push it, and it shifts again - the whole thing is made to swivel back and forth. The arrow must be the key to getting into the barrow.What will you do?",
      choices : [
  {
    option  : "Point it at the barrow?",
    command : "page\t294",
  },
  {
    option  : "Pointing it at the site of the house?",
    command : "page\t346",
  },
   {
    option  : "Point it at the standing stone by the barrow?",
    command : "page\t383",
  },
      ]
    };

book['9'] = {
      text   :"You push past the men and run out into the night, leaving the Rat and Ferret behind you. As you wander through the shadow alleys of the Noose, you decide on your next move. What will it be?",
      choices : [
  {
    option  : "Try to find a bigger(if you haven’t already)?",
    command : "page\t26",
  },
  {
    option  : "Visit Madame Star(if you haven’t already)?",
    command : "page\t117",
  },
   {
    option  : "Or will you leave the Noose and go elsewhere?     ",
    command : "page\t387",
  },
      ]
    };

book['10'] = {
      text   :"You put your ear to the door, and are taken completely by surprise when a plank whips round and hits you! Lose 2 STAMINA points. The ‘door’ suddenly unfolds into a great humanoid shape: it is a Wood Golem, and you must fight it.\n\nWOOD GOLEM\tSKILL 8\tSTAMINA 6",
      choices : [
  {
    option  : "Fight Wood Golem",
    command : "page\t123",
  },
      ]
    };

book['11'] = {
      text   :"You try to tell yourself that this isn’t happening. Whoever heard of flighting your own shadow? You dodge to one side as the shadowy figure attacks, and its weapon strikes the cavern wall with a very solid-sounding clang. Your shadow has the same SKILL and STAMINA scores as you do; flight it normally. If you win, turn to 237.",
      choices : [
  {
    option  : "Fight your own shadow",
    command : "page\t237",
  },
      ]
    };

  book['12'] = {
      text   :"You hurl yourself to the floor, and the thing, whatever it is, misses you by a whisker. It hovers above the dead thief’s body for a fraction of a second, then sinks down into it, soaking into the deaf flesh like water soaks into a sponge. The body twitches once, and then drags itself to its feet. You scalp tingles as the dead eyes stare sightlessly into yours, and the dead thief shambles to attack you. Will you fight the Animated Corpse(turn to 82), or try to run away (turn to 192)?",
      choices : [
  {
    option  : "Fight the Animated Corpse",
    command : "page\t82",
  },
  {
    option  : "Run away",
    command : "page\t192",
  },
      ]
    };  

  book['13'] = {
      text   :"Very slowly, you reach for the key. The scorpion doesn’t move as you take it. Breathing a sigh of relief , you turn the key in the lock and the great iron door swings open. You step through the doorway(turn to 79).",
      choices : [
  {
    option  : "Step through the doorway",
    command : "page\t79",
  },
      ]
    };  


book['14'] = {
      text   :"The men stare in amazement as you flick the knife expertly between fingers. It moves faster and faster, lapping the table between your your fingers, but never touching them. As the end of a minute, you hand back the knife, smiling. The men hand over 10 gold pieces. You try to engage them in conversation. But it quickly becomes clear that they know nothing of interest to you. You will have to look elsewhere for information. What will you do now? You can ask Bald Morri what he knows about Brass (turn to 195). Or leave the Rat and Ferret and try your luck elsewhere in the Noose (turn back to 203 and choose again).",
      choices : [
  {
    option  : "Ask Bald Morri what he knows about Brass",
    command : "page\t195",
  },
  {
    option  : "Leave the Rat and Ferret and try your luck elsewhere in the Noose",
    command : "page\t203",
  },
      ]
    };

book['15'] = {
      text:"You haul yourself level with the top of the wall. To your horror, you see that it’s studded with glass, which has gradually been cutting your rope as you climbed. The instant you reach the top, the last strand of your rope gives way. The rope and grapnel is now useless: cross it off your Adventure Sheet. Roll two dice. If the results is equal to your SKILL score or less, turn to 257. Turn to 209.",
      choices : [
  {
    option  : "If the results is equal to your SKILL score or less",
    command : "page\t257",
  },
  {
    option  : "if not",
    command : "page\t209",
  },
      ]
    }; 

book['16'] = {
      text:"Skirting carefully round the palace, you find a stretch of wall where you think you will have a good chance of climbing undetected. You look around quickly, see no one, and start to climb. You have nearly reached the top of the wall when you hear a shout from below. The Palace Guard has spotted you. What will you do now?",
      choices : [
  {
    option  : "Keep on climbing?",
    command : "page\t146",
  },
  {
    option  : "Jump down and try to get away?",
    command : "page\t391",
  },
      ]
    }; 

book['17'] = {
      text:  "Hardly daring to breathe, you set about disarming the trap. After a few seconds of careful work, there is a click, and a handful of small darts - no thicker than needles - falls out on to the ground. In the moonlight you can see something sticky glistening on their points: position intended to kill thieves. You are about to start work on the door when you hear booted feet in the distance, and the unconscious guard begins to groan. Rather than stay and explain, you dodge into an alley which runs down one side of the building, looking for some way in that isn’t quite so exposed. Turn to 210.",
      choices : [
  {
    option  : "Looking for some way in that isn’t quite so exposed",
    command : "page\t210",
  },
      ]
    }; 

book['18'] = {
      text :"You drop on the other side of the palace wall, but the guards are waiting for you, and you are cut down before you can get to your feet. You should have known better than try to break into the palace. Your adventure ends here.",
      choices : [],

}; 

book['19'] = {
      text:"You reach out and touch the hunched figure. It turns round with an inhuman snarl and you find yourself staring into the building, hate-filled eyes of Ghoul. You have disturbed its nocturnal feast, and now you must flight to keep yourself off the menu.\nGHOUL\tSKILL 8\tSTAMINA 7\nIf the Ghoul hits you four times, turn 171. If you kill the Ghoul, turn to 57.",
      choices : [
  {
    option  : "Ghoul hits you four times",
    command : "page\t171",
  },
  {
    option  : "Kill the Ghoul",
    command : "page\t57",
  },
      ]
    }; 

book['20'] = {
      text   : "You reach in and touch the disc. Too late, you notice the silver wire which connects it to the second Crystal Warrior. Before you realize what has happened, you feel the crystal sword resting lightly on the back of your neck. Your only hope is to try to take the disc without activating the trap any further. If you have PICK POCKET skill, turn to 208. If you do not, turn to 49.",
      choices : [
  {
    option  : "I have PICK POCKET skill",
    command : "page\t208",
  },
  {
    option  : "I do not",
    command : "page\t49",
  },
      ]
    }; 

book['21'] = {
      text   : "Some instinct tells you that there is something very odd about one of the chests in the strongroom, and you leave hurriedly, closing the iron door behind you. You’ve heard that some people build fake strongrooms full of traps just to make mincemeat of the thieves, and hide their valuables somewhere else. What will you do next? You can examine the desk (turn to 90), or leave the Merchants’ Guild stealthily and search for clues in Brass’s house (if you haven’t been there before) by turning to 156, or set out in search of the Eye of the Basilisk without looking for any more information(turn to 144).",
      choices : [
  {
    option  : "Examine the desk ",
    command : "page\t90",
  },
  {
    option  : "Search for clues in Brass’s house",
    command : "page\t156",
  },
  {
    option  : "Set out in search of the Eye of the Basilisk without looking for any more information",
    command : "page\t144",
  },
      ]
    }; 

book['22'] = {
      text   : "You head for the Singing Bridge. You remember hearing something about a place underneath it - perhaps that’s where the Eye of the Basilisk is hidden. Going down some steps at the side of the bridge, you come to a small wooden hut, with the words KEEP OUT painted on the door. Will you knock on the door (turn to 307), or - if you have PICK LOCK skill or a set of lock-picks - try to pick the lock (turn to 141)?",
      choices : [
  {
    option  : "knock on the door",
    command : "page\t307",
  },
  {
    option  : "I have PICK LOCK skill or a set of lock-picks",
    command : "page\t141",
  },
      ]
    }; 

book['23'] = {
      text   : "The corpse drops to the ground, but as you watch, the special blue face oozes back out of the dead flesh, and hangs in the air before you, chucking evilly. It is a Possessor Spirit, and you must flight it. If you have a magic weapon, turn to 142; if not, turn to 111.",
      choices : [
  {
    option  : "I have a magic weapon",
    command : "page\t142",
  },
  {
    option  : "I do not have",
    command : "page\t111",
  },
      ]
    }; 

book['24'] = {
      text   : "You hurry silently across the darkened room, feeling your way along one wall. You feel another wall in front of you, and quickly find a doorway and a wooden door. You push and pull, but it doesn’t open, it must locked. If you have PICK LOCK skill, turn to 324. If you do not, turn to 245.",
      choices : [
  {
    option  : "I have PICK LOCK skill",
    command : "page\t324",
  },
  {
    option  : "I do not have",
    command : "page\t245",
  },
      ]
    }; 

book['25'] = {
      text   : "Hardly daring to breathing, you pick your way through the bones and other debris. It seems like hours before you are past the holes, but finally you make it. You let out a sigh of relief, and as you do so the Grubs shoot from their burrows agin - you shudder to think how sensitive their hearing is.Turn to 84.",
      choices : [
  {
    option  : "",
    command : "page\t84",
  },
      ]
    }; 

book['26'] = {
      text   : "You walk quietly along the Noose, looking for a beggar. All beggars in Port Blacksand  are members of the Thieves’ Guild, and they can be a very valuable source of information. After a little way, you see Bargo the Wheeler trundling towards you along the darkened street. He was s soldier one, but lost both legs in a war many years ago. Since then, he was been reduced to begging, pushing himself about the city in a little cart. Bargo recognizes you as you approach, and greets you with a nod.\n‘hello, young’ un’, he says. ‘out on your test, eh?’\n You nod, and ask him if he knows anything about Brass. He shrugs.\n\n‘Trust what everybody knows.’ He says.  ‘He’s a big merchant, with a house by the Field Gate and an office in the Merchants’s Guid. Can’t be much help, I’m afraid.’ What will you do next?",
      choices : [
  {
    option  : "Thank him and give him a gold piece?",
    command : "page\t234",
  },
  {
    option  : "Go to the Rat and Ferret? ",
    command : "page\t309",
  },
  {
    option  : "Visit Madame Star? ",
    command : "page\t117",
  },
   {
    option  :  "Or will you leave the Noose and try elsewhere? ",
    command : "page\t387",
  },
      ]
    }; 

book['27'] = {
      text   : "In your hurry to get out of the cavern, you fail to notice a series of holes in the passage wall. Six small darts shoot across the passage at chest height. Roll one die to see how many of them hit you. Each dart that hits causes 1 STAMINA point of damage; you may halve the total damage (rounding fractions up) if you successfully Test your Luck. If you are still alive, carry on down the passage to 191.",
      choices : [
  {
    option  : "You are still alive",
    command : "page\t191",
  },
      ]
    }; 

book['28'] = {
      text   : "You draw your sword as the men approach, and back against the wall. The other customers scramble out of the way - they don’t want to get involve in a flight. Flight the men one at a time.\nFirst THUG\tSKILL 7\tSTAMINA 6\nSecond THUG\tSKILL 6\tSTAMINA 6\nThird THUG\tSKILL 5\tSTAMINA 7",
      choices : [
  {
    option  : "Fight three rounds of combat,",
    command : "page\t84",
  },
      ]
    }; 

book['29'] = {
      text   : "You try to prise the lid off the chest - you are certain that the key to getting the Eye of the Basilisk lies inside. As you attack the check, you hear a faint snapping sound from inside it, followed by a stony creak from the second Crystal Warrior. You look up sharply, but are too slow to do anything about the crystal sword which is descending on your neck. Your adventure and your life both end here.",
      choices : []
    }; 

book['30'] = {
      text   : "Your hair bristles as you approach the barrow - you can almost feel the ancient power flowing around you. The trees silhouetted against the dark sky suddenly seem threatening, their branches reaching out to seize you… you shake your head to clear out these wild ideas, and concentrate on what you have to do. You walk right round the barrow, looking for a plain grassy mound. There is a standing stone on one side of barrow, but you can’t find any kind of entrance. If you have SPOT MIDDEN skill, turn to 132. If you don’t, turn to 206.
      choices : [
  {
    option  : "I have SPOT MIDDEN skill",
    command : "page\t132",
  },
  {
    option  : "I do not have",
    command : "page\t206",
  },
      ]
    }; 

book['31'] = {
      text   : "The two Skeletons crumble back into dust, hopefully for good this time. You have little time to enjoy your victory, however, for the Skeleton on the plinth begins to rise as soon as its two guards are destroyed. Hefting the huge longsword which lay beside it, the Skeleton Lord advances slowly towards you.\nSKELETON LORD\tSKILL 8\tSTAMINA 6\n\nEvery time the Skeleton Lord wounds you, you lose 2 STAMINA points, and the Skeleton Lord adds 1 to its Attack Strength for the following round only. If you win, turn to 288.",
      choices : [
  {
    option  : "Win",
    command : "page\t288",
  },
      ]
    }; 

book['32'] = {
      text   : "You look all the way around the smaller house. The only way in seems to be a door on one side. You try the handle, but the door is locked. If you have PICK LOCK skill and you want to try to pick the lock, turn to 211. If not, or if you don’t want to pick the lock, you must decide what to do next. You can try the house across the street (with the coin symbol) by turning to 384, or you can give up on the houses altogether and go to the Merchants’ Guild (if you haven’t  already been there )by retracting your steps to the Market Square and turning to 129.",
      choices : [
  {
    option  : "Pick the lock",
    command : "page\t211",
  },
  {
    option  : "Try the house across the street",
    command : "page\t384",
  },
  {
    option  : "Go to the Merchants’ Guild",
    command : "page\t129",
  },
      ]
    }; 

book['33'] = {
      text   : "In an instant, the Shapechanger has bent bars of the cage back, and leaps out to attack you. Fight it normally.\nSHAPECHANGER\tSKILL 10\tSTAMINA 10If you win, leave the room and carry on to 155.",
      choices : [
  {
    option  : "win",
    command : "page\t155",
  },
      ]
    }; 

book['34'] = {
      text   : "The room is about twenty feet square, and entirely hewn out of rock, an indication of how deep underground you are. The only thing you can see in the room is a large, golden-brown lizard, which lies bleeding and apparently dead in one corner. Will you go over and examine the lizard (turn to 228), or leave the room immediately and carry on up the passage (turn to 252)?",
      choices : [
  {
    option  : "Go over and examine the lizard ",
    command : "page\t228",
  },
  {
    option  : "Leave the room immediately and carry on up the passage",
    command : "page\t252",
  },
      ]
    }; 

book['35'] = {
      text   : "35You just manage to raise your sword in time fend off the attack. You have disturbed a Ghoul from its nocturnal feast, and now you must fight to keep yourself off the menu.\n\nGHOUL\tSKILL 8\tSTAMINA 7\nIf the Ghoul hits you four times,  turn to 171. If you kill the Ghoul, turn to 57.",
      choices : [
  {
    option  : "Ghoul hits you four times",
    command : "page\t171",
  },
  {
    option  : "Kill the Ghou",
    command : "page\t57",
  },
      ]
    }; 

book['36'] = {
      text   : "There are just too many guards. You fight for as long as you can, but eventually something crashes into the back of your head and everything goes black. When you wake up, you are in a dungeon cell. Your test is over, and your life may not have much longer to run. You adventure ends here.",
      choices : []
    }; 


book['37'] = {
      text   : "You leap forward, and your first attack strikes home before the Ogre has a chance to collect its wits. It howls in pain, and clambers to its feet to defend itself. Fight the Ogre normally.\n\nOGRE\tSKILL 8\tSTAMINA 10\nIf you win, turn to 342.",
      choices : [
  {
    option  : "Win",
    command : "page\t342",
  },
      ]
    }; 

book['38'] = {
      text   : "You aim a blow at the black of the guard’s unprotected head. Roll two dice. If the result is less than your SKILL score, turn to 205. If not, turn to 310.",
      choices : [
  {
    option  : "The result is less than your SKILL score",
    command : "page\t205",
  },
  {
    option  : "it's not",
    command : "page\t310",
  },
      ]
    }; 


book['39'] = {
      text   : "You look at the symbol carefully. It is one of the secret signs of the Thieves’ Guild, but part of it is missing: the thief must have died before he could finish it. You think it’s the symbol for illusion, but you can’t be sure. You pause for a few seconds to offer a silent prayer to the God of Thieves, asking him to look after the dead thief in the next word as well as looking after you in this world, and then you prepare to move on, Turn to 302.",
      choices : [
  {
    option  : "Prepare to move on,",
    command : "page\t302",
  },
      ]
    }; 

book['40'] = {
      text   : "Your first thought is to hold your breath, so that the deadly spores can’t get into your system - but you are too late. Your eyes start to water and you begin to choke, slumping to the ground in a fit of helpless coughing, knowing that each breath brings more of the spores into your body. Your adventure and your life both end here.",
      choices : []
    }; 


book['41'] = {
      text   : "As soon as the wire is cut, the Crystal Warrior attacks you\n\nCRYSTAL WARRIOR\tSKILL 10\tSTAMINA 13\n If you are using a stone axe, flight the Crystal Warrior normally. Otherwise, you have to use the pommel of the your sword, as the only available blunt weapon - deduct 2 points from your Attack Strength during this fight. If you win, you take the obsidian disc ( it counts as a backpack item ). Then turn to 316.",
      choices : [
  {
    option  : "win",
    command : "page\t316",
  },
      ]
    }; 

book['42'] = {
      text   : "It’s not good, you just can’t see any way out. You have no option but to return to the Thieves’ Guild and report your failure. You adventure ends here.",
      choices : []
    }; 

book['43'] = {
      text   : "You reach the great stone slab at the end of the passage. It is immense, filling the height and width of the passage. And it appears to be at least a couple of feet thick. Will you try to force it open( turn to 348), look for some hidden mechanism(turn to 303 - only if you have SPOT HIDDEN skill), or look for a way around the slab(turn to 198)?",
      choices : [
  {
    option  : "Try to force it open",
    command : "page\t348",
  },
  {
    option  : "look for some hidden mechanism",
    command : "page\t303",
  },
  {
    option  : "I have SPOT HIDDEN skil",
    command : "page\t198",
  },
      ]
    }; 

book['44'] = {
      text   : "One of the guardsmen takes your money with a chuckle. ‘All right,’ he says. ‘we didn’t see you this time. Just make sure we don’t see you again.’ The patrol marches on. Turn to 177.",
      choices : [
  {
    option  : "The patrol marches on",
    command : "page\t177",
  },
      ]
    }; 


book['45'] = {
      text   : "You start along the balcony towards the landing at the far end, but you haven’t gone more than a step or two when one of the doors - the first on the right - opens. You stop dead. A white- clad figure comes silently out of the mom and begins to cross the baloney towards you. It appears to be a young man in a white robe. What will you do?",
      choices : [
  {
    option  : "Try to hide?",
    command : "page\t146",
  },
  {
    option  : "Run out of the house?",
    command : "page\t110",
  },
  {
    option  : "Attack?",
    command : "page\t281",
  },
      ]
    }; 

book['46'] = {
      text   : "You go into the room. There’s more treasure here than you could every carry, but a pocketful of gems will be enough to make you rich when you get out of here. Although the object of your test is the Eye if the Basilisk, the Guild didn’t say that you couldn’t keep anything else you found along the way. You reach forward to pick up some gems - and suddenly the pile of treasure rears up, and you find yourself wrapped in the coils of a brightly colored snake. Lose 2 STAMINA points as it squeezes you. You have heard of the Scitalis or Treasure - you have fallen for its illusion, and now you must fight for your life!\n\nCITALIS\tSKILL 8\tSTAMINA 10\nIf you wi the first round of combat, the snake is not wounded, but you have escaped from its coils. If you lose, you are still trapped and the snake squeezes you for another 2 STAMINA points of damage. You can not wound the snake until you are free of its coils. If you win, turn to 168.",
      choices : [
  {
    option  : "win",
    command : "page\t168",
  },
      ]
    }; 


book['47'] = {
      text   : "You approach the door quietly, and listen at it for a few moments. You hear nothing , all is quiet in the servants’ quarters. What will you do now?",
      choices : [
  {
    option  : "Open the door?",
    command : "page\t235",
  },
  {
    option  : "Go up the stairs?",
    command : "page\t368",
  },
  {
    option  : "Examine the suit of armour beside the stairs?",
    command : "page\t62",
  },
      ]
    }; 

book['48'] = {
      text   : "You crawl dazedly into the shadows, and close your eyes, waiting for the Gargoyle to strike. The sound of its wings comes closer and closer, and then it suddenly recedes. You look cautiously upwards to see the Gargoyle’s shadowy form back on its rooftop perch. Obviously it didn’t see where you fell; you thank the gods of luck that it is too stupid to keep looking for very long. Add 1 LUCK point for this fortunate escape. What will you do now?",
      choices : [
  {
    option  : "Try the back door?",
    command : "page\t159",
  },
  {
    option  : "Climb to the roof?",
    command : "page\t4",
  },
      ]
    }; 


book['49'] = {
      text   : "Sweet breaks out on your forehead as, painfully slowly, you lift the disc off the silver wire. Then, just at the wrong moment, an involuntary twitch makes you drop it, and it lands with a thump on the silver wire. The Crystal Warrior’s  sword bites into your neck. Your test and your life both end here.",
      choices : []
    }; 

book['50'] = {
      text   : "The door is not locked , so you open it and creep stealthily into the room. It is furnished with a single bed, a wardrobe and dressing table. Someone - a child, judging by the size - is asleep in the bed. You can see nothing of value in the room, just a few dolls on the dressing table and floor. Suddenly, a floorboard creaks loudly under your feet.The sleeping form in the bed murmurs and stirs slightly. Will you go further into the room (turn to 60), or leave the room ( turn to 201)?",
      choices : [
  {
    option  : "Go further into the room",
    command : "page\t60",
  },
  {
    option  : "Leave the room",
    command : "page\t201",
  },
      ]
    }; 


book['51'] = {
      text   : "You hit the door a second time, but still it doesn’t budge. The spores are thick in the air now, and although the cloth over your face gives you some protection, it doesn’t last for ever. Your eyes begin to water, and you start to choke on the spores. You sink to the ground in a fit of uncontrollable coughing, knowing that each breath takes the deadly spores deeper Into your body. Your adventure and your life both end here.",
      choices : []
    }; 

book['52'] = {
      text   : "The symbol is familiar, but you can’t make it out. You wish you’d worked harder at learning the secret signs - this might be an important clue, and you have no idea what it means. If you have SPOT HIDDEN skill, turn to 314. If you do not, turn to 212.",
      choices : [
  {
    option  : "I have SPOT HIDDEN skill",
    command : "page\t314",
  },
  {
    option  : "No,I do not",
    command : "page\t212",
  },
      ]
    }; 


book['53'] = {
      text   : "Wood Golems are highly resistant to all forms of magic. Your magical weapon will behave like a normal weapon for this combat. Continue fighting the Wood Golem.\n\nWOOD GOLEM\t SKILL 8\tSTAMINA 4\nIf you win, turn to 136.",
      choices : [
  {
    option  : "Win",
    command : "page\t136",
  },
      ]
    }; 

book['54'] = {
      text   : "Your heart rises as you recognize the sign for a hidden mechanism. There is a way out of here - but where? You look at the walls again, and suddenly realize that the brick on which the symbol is scratched is loose. Pulling the brick out of the wall, you find a small lever down, and closes behind you as you go back into the study. What will you fo now? You can examine the desk (turn to 90), or leave the Merchants’ Guild stealthily and search for clues in Brass’s house (if you haven’t been there before) by turning to 136, or set out in search of the Eye of the Basilisk without looking for any more information(turn to 144).",
      choices : [
  {
    option  : "Examine the desk",
    command : "page\t90",
  },
  {
    option  : "Leave the Merchants’ Guild stealthily and search for clues in Brass’s house ",
    command : "page\t136",
  },
  {
    option  : "Set out in search of the Eye of the Basilisk",
    command : "page\t144",
  },
      ]
    }; 


book['55'] = {
      text   : "You put the key marked ‘L’ in the left-hand lock and the key marked ‘R’ in the right-hand lock, and turn them together. Turn to 335.",
      choices : [
  {
    option  : "Turn them together",
    command : "page\t335",
  },
 ]
    }; 

book['56'] = {
      text   : "You reach into the gap. The tips of your fingers brush something - a catch of some kind. This must be the mechanism that opens the door. You pulled it, and with a sickening thunk a row oof spikes shoots into your hand. The spikes are poisoned. Roll four dice - if the result is equal to your current STAMINA or less, you lose a STAMINA points. If the result is more than your current STAMINA, you lose 4 STAMINA points. Also , you lose 1 SKILL point. Go back to 43 and reconsider your options.",
      choices : [
  {
    option  : "You lose 1 SKILL point",
    command : "page\t43",
  },
  ]
    }; 

book['57'] = {
      text   : "The Ghoul falls to the ground at your feet, twitches once and is still. After pausing to catch your breath, you investigate what it was eating, and find to your disgust that it is a human corpse. Searching the chewed body quickly, you turn up 2 gold pieces and a dragger. Make a note of them on your Adventure Sheet, then turn to 246.",
      choices : [
  {
    option  : "Make a note of them on your Adventure Sheet",
    command : "page\t246",
  },
  {
    option  : "No,I do not",
    command : "page\t212",
  },
      ]
    }; 
book['58'] = {
      text   : "If you have PICK LOCK skill, roll two dice. If the result is equal to your SKILL SCORE or less, turn to 139. If not, or if you do not have PICK LOCK skill, turn to 221.",
      choices : [
  {
    option  : "if the result is equal to your SKILL SCORE or less",
    command : "page\t139",
  },
  {
    option  : "If not, or if you do not have PICK LOCK skill",
    command : "page\t221",
  },
      ]
    }; 

book['59'] = {
      text   : "As you lunge through the hail of missiles towards the far side of the room, you spot a door  set into an alcove. If you have SPOT HIDDEN skill, turn to 126. If you do not, turn to 317.",
      choices : [
  {
    option  : "I have SPOT HIDDEN skill",
    command : "page\t126",
  },
  {
    option  : "No,I do not",
    command : "page\t317",
  },
      ]
    }; 

book['60'] = {
      text   :"You move cautiously forward, and the person in the bed - a young girl - sits bolt upright with a sheltering scream. You have no choice but run before the whole household is woken. You hurry back to the Market Square, planning your next move. It’s too dangerous to go back to Brass’s house, so you will have to do without any information that you could have gained from there. That leaves you two options - either you can go to the Merchants’ Guild, if you haven’t already done so (turn to 129), or you can hope that you have enough information to find the Eye of the Basilisk and set out in reach of it(turn to 144).",
      text   : "The symbol is familiar, but you can’t make it out. You wish you’d worked harder at learning the secret signs - this might be an important clue, and you have no idea what it means. If you have SPOT HIDDEN skill, turn to 314. If you do not, turn to 212.",
      choices : [
  {
    option  : "I haven’t already done",
    command : "page\t129",
  },
  {
    option  : "I can hope that you have enough information to find the Eye of the Basilisk and set out in reach of it",
    command : "page\t144",
  },
      ]
    }; 

book['61'] = {
      text   : "You shrink back into the shadows, but your luck is out: you knock something over as you do so, and it fails to the floor with a crash. The breathing stops abruptly, and you hear a faint groan. Whatever is there, you’ve worked it up. What will you do now?",
      choices : [
  {
    option  : "Dash out and climb up the drainpipe (if you haven’t already done so)?",
    command : "page\t225",
  },
  {
    option  : "Dash out and climb to the roof by some other means? ",
    command : "page\t4",
  },
  {
    option  : "Stand still and hope for the best?",
    command : "page\t119",
  },
      ]
    }; 

book['62'] = {
      text   : "The armour is about a hundred years old, and in very good condition. It has been inlaid with gold and silver, and it is probably quite valuable. You can’t carry it out with you, though, so there’s no real point in standing looking at it. You start to turn away, and then you notice something behind the armour, glinting yellow in the light from your hand-lamp. You can’t see what it is, and you’re not sure that you’ll be able to reach it. If you want to try, turn to 147 if you have PICK POCKET skill, 109 if do not.\n\nIf you don’t want to try to retrieve the object, you can either go up the stairs (turn to 368) or try the door under the landing (turn to 47).",
      choices : [
  {
    option  : "I want to try,",
    command : "page\t147",
  },
  {
    option  : "I do not have PICK POCKET skill",
    command : "page\t109",
  },
  {
    option  : "I don’t want to try to retrieve the object,go up the stairs",
    command : "page\t368",
  },
   {
    option  : "I don’t want to try to retrieve the object,try the door under the landing",
    command : "page\t47",
  },
      ]
    }; 

book['63'] = {
      text   : "You cover your mouth and nose, hoping that this will protect you from the worst of the spores, and charge the door, Roll two dice. If the result is equal to your SKILL score or less, turn to 190. If not, turn to 390.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t190",
  },
  {
    option  : "No,it isn’t",
    command : "page\t390",
  },
      ]
    }; 

book['64'] = {
      text   : "Madame Star shrugs. ’Well,’ she says，’I do have a living to make, you know. I can’t go round doing things for free.’ ‘it’s obvious that you’ll get nowhere without money. If you agree to her price of 2 gold pieces, take the money off your Adventure Sheet and turn to 289. If you don’t have 2 gold pieces, or if you don’t want to pay, you will have to leave her house, and decide what to do next. Will you: ",
      choices : [
  {
    option  : "Go to the Rat and Ferret (if you haven’t already)? ",
    command : "page\t309",
  },
  {
    option  : "Try to find a beggar (if you haven’t already)?",
    command : "page\t26",
  },
  {
    option  : "Or will you leave the Noose and try elsewhere? ",
    command : "page\t389",
  },
      ]
    }; 

book['65'] = {
      text   : "You can’t avert your eyes in time, and find yourself staring into those big, glowing yellow eyes. They are the last thing you see, as the Basilisk’s gaze turns to you stone. Your adventure ends here.",
      choices : []
    }; 

book['66'] = {
      text   : "Bald Morri takes your money with a scowl, clears his throat and spits, ‘Brass, ’he says, ‘is a yellow metal, an alloy of copper and zinc.’ You start to explain that you meant Brass the merchant, but her interrupts you. ‘That’s all you’re getting for that kind of money,’ he growls. ‘Now drink up and be off.’ You have no option but to finish your drink and leave the tavern. What will you do next?",
      choices : [
  {
    option  : "Try to find  beggar (if you haven’t already)?",
    command : "page\t26",
  },
  {
    option  : "Visit Madame Star (if you haven’t already)?",
    command : "page\t117",
  },
  {
    option  : "Or will you leave the Noose and try elsewhere?",
    command : "page\t383",
  },
      ]
    }; 

book['67'] = {
      text   : "Holding your torch before you, you edge closer to your shadow. If fades as the light strikes it, becoming less substantial as you move closer. It seems to sense the danger of the light, since it makes no move to attack you as you head for the passage that leads out of the cavern. If you have SPOT HIDDEN skill, turn to 381. If you don’t , turn to 27.",
      choices : [
  {
    option  : "I have SPOT HIDDEN skill",
    command : "page\t381",
  },
  {
    option  : "No,I don’t",
    command : "page\t27",
  },
      ]
    }; 

book['68'] = {
      text   : "You can’t see whatever is throwing the furniture about, but as a small table rises into the air and flies towards you, you realize that there’s a Poltergeists in the room. Will you back out of the room ( turn to 339)?",
      choices : [
  {
    option  : "Will you back out of the room?",
    command : "page\t339",
  },
      ]
    }; 

book['69'] = {
      text   : "You find a passage leading out of the chamber  and hurry down it, eager to escape the spores. The passage forks, and you can see a number of turnings leading off from each side of either passage, like a maze. Do you have a map? If you have, turn to 362;If not, turn to 81.",
      choices : [
  {
    option  : "I have",
    command : "page\t362;",
  },
  {
    option  : "No,I don’t",
    command : "page\t81",
  },
      ]
    }; 

book['70'] = {
      text   : "You put your ear against the door and listen, but hear nothing. What will you do now?",
      choices : [
  {
    option  : "Go into the room?",
    command : "page\t30",
  },
  {
    option  : "Listen at the door on the left?",
    command : "page\t277",
  },
  {
    option  : "Listen at the second door on the right ? ",
    command : "page\t76",
  },
      ]
    }; 

book['71'] = {
      text   : "Your finger is cut, but not seriously. You have lost the game, and the men insist that you pay up. Do you have 5 gold pieces? If you have, cross them off your Adventure Sheet and turn to 227. If you do not have 5 gold pieces, turn to 112.",
      choices : [
  {
    option  : "If you have, cross them off your Adventure Sheet ",
    command : "page\t227",
  },
  {
    option  : "If you do not have 5 gold pieces",
    command : "page\t112",
  },
      ]
    }; 

book['72'] = {
      text   : "You climb rapidly, and are halfway up the wall before the Footpads even realize what you are doing. Turn to 226.",
      choices : [
  {
    option  : "You climb rapidly, and are halfway up the wall before the Footpads even realize what you are doing.",
    command : "page\t226",
  },
      ]
    }; 

book['73'] = {
      text   : "You realize that you can’t harm the Gargoyle without  a magical weapon, but there may be another way of dealing with it. Do you have:",
      choices : [
  {
    option  : "A rope and grapnel?",
    command : "page\t125",
  },
  {
    option  : "A black hooded cloak?",
    command : "page\t263",
  },
  {
    option  : "A length of heavy chain?",
    command : "page\t340",
  },
      ]
    }; 

book['74'] = {
      text   : "The guard does not seem to be particularly alert. He leans against the wall a few feet from the door, and iron the way is his head keeps nodding, he appears to be on the verge of dropping off to sleep. You can try sneaking past him (if you have SNEAK skill, turn to 326, if you do not, turn to 372) or bribing him (turn to 345), or you can look around the building for an unguarded entrance (turn to 210).",
      choices : [
  {
    option  : "If you have SNEAK skill,",
    command : "page\t326",
  },
  {
    option  : "If you don’t;",
    command : "page\t372",
  },
  {
    option  : "bribing him",
    command : "page\t345",
  },
   {
    option  : "you can look around the building for an unguarded entrance",
    command : "page\t210",
  },
      ]
    }; 

book['75'] = {
      text   : "You approach the trees carefully, your eyes fixed on the place where you last saw movement. As you draw close, you can see movement again - there’s definitely something in there, but it’s too dark to see quite what it is. Turn to 358 if you have SNEAK skill, 127 if you don’t; or you can decide not to investigate further, and head straight for the Merchants’ Guild avoiding the trees - turn to 246.",
      choices : [
  {
    option  : "You have SNEAK skill",
    command : "page\t358",
  },
  {
    option  : "If you don’t;",
    command : "page\t127",
  },
  {
    option  : "Head straight for the Merchants’ Guild avoiding the trees",
    command : "page\t246",
  },
      ]
    }; 

book['76'] = {
      text   : "You listen at the door, but hear nothing. Pushing it gently open, you see a young man in a large fourposter bed, sound asleep and snoring softly. A glance round the room reveals nothing of interest, so you leave, closing the door softly behind you. What will you do now?Or you can leave the house, and do one of two things. You can try to find the Eye of the Basilisk, if you think you have enough information (turn to 144), or you can look for more information in the Merchants’ Guild, if you haven’t been there before (turn to 129). ",
      choices : [
  {
    option  : "Listen at the next door?",
    command : "page\t70",
  },
  {
    option  : "Listen at the door across the passage?",
    command : "page\t277",
  },
  {
    option  : "Try the door at the other end of the landing?",
    command : "page\t321",
  },
   {
    option  : "You have enough information ",
    command : "page\t144",
  },
   {
    option  : "Look for more information in the Merchants’ Guild",
    command : "page\t129",
  },
      ]
    }; 

book['77'] = {
      text   : "The garden is old and overgrown, more like a jungle these days, but in places you can still traces of a flower-bed, proving that it used to be a garden. Heading towards the blackened clearing where the house once stood, you see what looks like a statue a few yards to your left. Will you inspect the statue (turn to 301) or go straight across what was once the lawn to the side of the house (turn to 287)？",
      choices : [
  {
    option  : "Inspect the statue",
    command : "page\t301",
  },
  {
    option  : "Go straight across what was once the lawn to the side of the house",
    command : "page\t287",
  },
      ]
    }; 

book['78'] = {
      text   : "Bald Morri takes your money with a scowl, clears his throat and spits, ‘Brass, ’he says, ‘is a yellow metal, an alloy of copper and zinc.’ You start to explain that you meant Brass the merchant, but her interrupts you. ‘That’s all you’re getting for that kind of money,’ he growls. ‘Now drink up and be off.’ You have no option but to finish your drink and leave the tavern. What will you do next?",
      choices : [
  {
    option  : "Try to find  beggar (if you haven’t already)?",
    command : "page\t26",
  },
  {
    option  : "Visit Madame Star (if you haven’t already)?",
    command : "page\t117",
  },
  {
    option  : "Or will you leave the Noose and try elsewhere?",
    command : "page\t383",
  },
      ]
    }; 


    return book;

  }



  handleCombat(enemies, victory_page, defeat_page) {

    let midnight_self = this;

    //this.playerAcknowledgeNotice("You win in combat", function() {
      midnight_self.showPage(victory_page);
    //});
  }


}

module.exports = Midnight;



