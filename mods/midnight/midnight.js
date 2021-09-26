var saito = require('../../lib/saito/saito');
var GameTemplate = require('../../lib/templates/gametemplate');


//////////////////
// CONSTRUCTOR  //
//////////////////
class Midnight extends GameTemplate {

  constructor(app) {

    super(app);

    this.name            = "Midnight";
    this.slug            = "midnight";
    this.description     = "Experimental Interactive Fiction demo";
    this.categories      = "Arcade Games Entertainment";
    this.maxPlayers      = 1;
    this.minPlayers      = 1;
    this.type            = "Fiction";

    this.useHUD = 0;

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
	html += '</ul>';
      }
    }

    this.updateStatus(html);

    $('.textchoice').off();
    $('.textchoice').on('click', function() {

      let action = $(this).attr("id");

      alert(book[page].choices[action].command);

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
      ],
    };


    book['2'] = {
      text  : "The water is icy cold. You start to wade across the pond, and instantly your legs are attacked by a packoff small but vicious cold water Piranha. You try tofight them off, but it isn’t easy — you can hardly seethem through the weed-choked water, and you endup splashing a lot but hitting very little, Fight the Piranha as a single enemy, subtracting 1 point From your Attack Strength for this combat.",
      choices : [
  {
    option  : "Fight Piranha",
    command : "page\t8",
  },
      ],
    };

    book['3'] = {
      text  :"You try the door, but it’s locked. Check if your PICK LOCK skill is high enough. If not, will you try the door with the fish symbol, or will you give up on the Merchants’ Guild and look for clues in Brass’s house( if you haven’t been there before), or set out in search of Eye of the Basilisk armed only with the information you already have?",
      choices : [
  {
    option  : "PICK LOCK skill",
    command : "page\t259",
  },
  {
    option  : "Door with Fish Symbol",
    command : "page\t163",
  },
  {
    option  : "Go to Brass’s House",
    command : "page\t156",
  },
  {
    option  : "Search for Eye of the Basilisk",
    command : "page\t144",
  }
      ],
    };


    book['4'] = {
      text  :"You find a suitable place for climbing, and start to scale the wall. You can choose to use a rope and grapnel.",
      choices : [
  {
    option  : "Use a Rope and Grapnel",
    command : "page\t15",
  },
  {
    option  : "I'm not using",
    command : "page\t257",
  },
      ],
    };

 book['5'] = {
      text  :"Your weapon files with deadly accuracy, and knocks the torch out of its holder. It falls to the floor, sputters for a few seconds, and goes out. You decide to douse your own torch as well, just in case the light form that casts another unfriendly shadow. It is now pitch-dark, and you feel your way along the walls of the cavern, trying to find the passage which will take you out of it. Test your luck.",
      choices : [
  {
    option  : "Lucky",
    command : "page\t94",
  },
  {
    option  : "Unlucky",
    command : "page\t220",
  },
      ],
    };


 book['6'] = {
      text   :"You open the cage, and the Dwarf springs out, reaching for your throat. He seems to grow larger as he attacks you; his skin  becomes scaly, and spines erupt from his head and back. You have been tricked by a Shapechanger.  Now you must fight for your life.",
      choices : [
  {
    option  : "Defeat the Shapechanger, leave the room",
    command : "page\t155",
  },
      ],
    };

book['7'] = {
      text   : "You run out of the house and lose yourself in the night, twisting and turning through winding alleys to throw off any possible pursuit. You know that the crash will have roused the whole household, and you decide to wait for an hour or so before returning to the house, to let them all get back to sleep. You can use this time to visit the Merchants’ Guild - if you haven’t already - or you can simply wait. In either case, you will have no trouble getting into the house when you return, because you have been there before. So make a note of entry, and start there when you return to the house.",
      choices : [
  {
    option  : "Visit the Merchants’ Guild",
    command : "page\t129",
  },
  {
    option  : "Just wait",
    command : "page\t276",
  },
      ],
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
      ],
    };

book['9'] = {
      text   :"You push past the men and run out into the night, leaving the Rat and Ferret behind you. As you wander through the shadowy alleys of the Noose, you decide on your next move. What will it be?",
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
    option  : "Leave the Noose and go elsewhere?     ",
    command : "page\t387",
  },
      ],
    };

book['10'] = {
      text   :"You put your ear to the door, and are taken completely by surprise when a plank whips round and hits you! Lose 2 STAMINA points. The ‘door’ suddenly unfolds into a great humanoid shape: it is a Wood Golem, and you must fight it.\n\nWOOD GOLEM\tSKILL 8\tSTAMINA 6",
      choices : [
  {
    option  : "Win a round of combat",
    command : "page\t123",
  },
      ],
    };

book['11'] = {
      text   :"You try to tell yourself that this isn’t happening. Whoever heard of flighting your own shadow? You dodge to one side as the shadowy figure attacks, and its weapon strikes the cavern wall with a very solid-sounding clang. Your shadow has the same SKILL and STAMINA scores as you do; flight it normally.",
      choices : [
  {
    option  : "If you win",
    command : "page\t237",
  },
      ],
    };

  book['12'] = {
      text   :"You hurl yourself to the floor, and the thing, whatever it is, misses you by a whisker. It hovers above the dead thief’s body for a fraction of a second, then sinks down into it, soaking into the deaf flesh like water soaks into a sponge. The body twitches once, and then drags itself to its feet. You scalp tingles as the dead eyes stare sightlessly into yours, and the dead thief shambles to attack you.",
      choices : [
  {
    option  : "Fight the Animated Corpse",
    command : "page\t82",
  },
  {
    option  : "Try to run away",
    command : "page\t192",
  },
      ],
    };  

  book['13'] = {
      text   :"Very slowly, you reach for the key. The scorpion doesn’t move as you take it. Breathing a sigh of relief , you turn the key in the lock and the great iron door swings open.",
      choices : [
  {
    option  : "Step through the doorway",
    command : "page\t79",
  },
      ],
    };  


book['14'] = {
      text   :"The men stare in amazement as you flick the knife expertly between your fingers. It moves faster and faster, tapping the table between your your fingers, but never touching them. As the end of a minute, you hand back the knife, smiling. The men hand over 10 gold pieces. You try to engage them in conversation. But it quickly becomes clear that they know nothing of interest to you. You will have to look elsewhere for information. What will you do now?",
      choices : [
  {
    option  : "Ask Bald Morri what he knows about Brass",
    command : "page\t195",
  },
  {
    option  : "Leave the Rat and Ferret and try your luck elsewhere in the Noose",
    command : "page\t203",
  },
      ],
    };

book['15'] = {
      text:"You haul yourself level with the top of the wall. To your horror, you see that it’s studded with glass, which has gradually been cutting your rope as you climbed. The instant you reach the top, the last strand of your rope gives way. The rope and grapnel is now useless: cross it off your Adventure Sheet. Roll two dice.",
      choices : [
  {
    option  : "If the results is equal to your SKILL score or less",
    command : "page\t257",
  },
  {
    option  : "If not",
    command : "page\t209",
  },
      ],
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
      ],
    }; 

book['17'] = {
      text:  "Hardly daring to breathe, you set about disarming the trap. After a few seconds of careful work, there is a click, and a handful of small darts - no thicker than needles - falls out on to the ground. In the moonlight you can see something sticky glistening on their points: position intended to kill thieves. You are about to start work on the door when you hear booted feet in the distance, and the unconscious guard begins to groan. Rather than stay and explain, you dodge into an alley which runs down one side of the building, looking for some way in that isn’t quite so exposed.",
      choices : [
  {
    option  : "Go through the 'not quite exposed' way",
    command : "page\t210",
  },
      ],
    }; 

book['18'] = {
      text :"You drop on the other side of the palace wall, but the guards are waiting for you, and you are cut down before you can get to your feet. You should have known better than try to break into the palace. Your adventure ends here.",
      choices : [],

}; 

book['19'] = {
      text:"You reach out and touch the hunched figure. It turns round with an inhuman snarl and you find yourself staring into the burning, hate-filled eyes of Ghoul. You have disturbed its nocturnal feast, and now you must flight to keep yourself off the menu.\nGHOUL\tSKILL 8\tSTAMINA 7\n",
      choices : [
  {
    option  : "Ghoul hits you four times",
    command : "page\t171",
  },
  {
    option  : "Kill the Ghoul",
    command : "page\t57",
  },
      ],
    }; 

book['20'] = {
      text   : "You reach in and touch the disc. Too late, you notice the silver wire which connects it to the second Crystal Warrior. Before you realize what has happened, you feel the crystal sword resting lightly on the back of your neck. Your only hope is to try to take the disc without activating the trap any further.",
      choices : [
  {
    option  : "If you have PICK POCKET skill",
    command : "page\t208",
  },
  {
    option  : "I do not",
    command : "page\t49",
  },
      ],
    }; 

book['21'] = {
      text   : "Some instinct tells you that there is something very odd about one of the chests in the strongroom, and you leave hurriedly, closing the iron door behind you. You’ve heard that some people build fake strongrooms full of traps just to make mincemeat of the thieves, and hide their valuables somewhere else. What will you do next?",
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
      ],
    }; 

book['22'] = {
      text   : "You head for the Singing Bridge. You remember hearing something about a place underneath it - perhaps that’s where the Eye of the Basilisk is hidden. Going down some steps at the side of the bridge, you come to a small wooden hut, with the words KEEP OUT painted on the door.",
      choices : [
  {
    option  : "Knock on the door",
    command : "page\t307",
  },
  {
    option  : "I have PICK LOCK skill or a set of lock-picks",
    command : "page\t141",
  },
      ],
    }; 

book['23'] = {
      text   : "The corpse drops to the ground, but as you watch, the special blue face oozes back out of the dead flesh, and hangs in the air before you, chucking evilly. It is a Possessor Spirit, and you must flight it. Check if you have a magic weapon to fight it with.",
      choices : [
  {
    option  : "I have a magic weapon",
    command : "page\t142",
  },
  {
    option  : "I do not have",
    command : "page\t111",
  },
      ],
    }; 

book['24'] = {
      text   : "You hurry silently across the darkened room, feeling your way along one wall. You feel another wall in front of you, and quickly find a doorway and a wooden door. You push and pull, but it doesn’t open, it must be locked.",
      choices : [
  {
    option  : "I have PICK LOCK skill",
    command : "page\t324",
  },
  {
    option  : "I do not have",
    command : "page\t245",
  },
      ],
    }; 

book['25'] = {
      text   : "Hardly daring to breath, you pick your way through the bones and other debris. It seems like hours before you are past the holes, but finally you make it. You let out a sigh of relief, and as you do so the Grubs shoot from their burrows agin - you shudder to think how sensitive their hearing is.",
      choices : [
  {
    option  : "Continue",
    command : "page\t84",
  },
      ],
    }; 

book['26'] = {
      text   : "You walk quietly along the Noose, looking for a beggar. All beggars in Port Blacksand  are members of the Thieves’ Guild, and they can be a very valuable source of information. After a little way, you see Bargo the Wheeler trundling towards you along the darkened street. He was s soldier one, but lost both legs in a war many years ago. Since then, he was been reduced to begging, pushing himself about the city in a little cart. Bargo recognizes you as you approach, and greets you with a nod.\n‘hello, young’ un’, he says. ‘out on your test, eh?’\n You nod, and ask him if he knows anything about Brass. He shrugs.\n\n‘Trust what everybody knows.’ He says.  ‘He’s a big merchant, with a house by the Field Gate and an office in the Merchants’s Guild. Can’t be much help, I’m afraid.’ What will you do next?",
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
      ],
    }; 

book['27'] = {
      text   : "In your hurry to get out of the cavern, you fail to notice a series of holes in the passage wall. Six small darts shoot across the passage at chest height. Roll one die to see how many of them hit you. Each dart that hits causes 1 STAMINA point of damage; you may halve the total damage (rounding fractions up) if you successfully Test your Luck. If you are still alive, carry on down the passage.",
      choices : [
  {
    option  : "You are still alive",
    command : "page\t191",
  },
      ],
    }; 

book['28'] = {
      text   : "You draw your sword as the men approach, and back against the wall. The other customers scramble out of the way - they don’t want to get involve in a fight. Fight the men one at a time.\nFirst THUG\tSKILL 7\tSTAMINA 6\nSecond THUG\tSKILL 6\tSTAMINA 6\nThird THUG\tSKILL 5\tSTAMINA 7",
      choices : [
  {
    option  : "Fight three rounds of combat",
    command : "page\t332",
  },
      ],
    }; 

book['29'] = {
      text   : "You try to prise the lid off the chest - you are certain that the key to getting the Eye of the Basilisk lies inside. As you attack the check, you hear a faint snapping sound from inside it, followed by a stony creak from the second Crystal Warrior. You look up sharply, but are too slow to do anything about the crystal sword which is descending on your neck. Your adventure and your life both end here.",
      choices : [],
    }; 

book['30'] = {
      text   : "Your hair bristles as you approach the barrow - you can almost feel the ancient power flowing around you. The trees silhouetted against the dark sky suddenly seem threatening, their branches reaching out to seize you… you shake your head to clear out these wild ideas, and concentrate on what you have to do. You walk right round the barrow, looking for a plain grassy mound. There is a standing stone on one side of barrow, but you can’t find any kind of entrance.",
      choices : [
  {
    option  : "Use SPOT HIDDEN skill",
    command : "page\t132",
  },
  {
    option  : "I do not have",
    command : "page\t206",
  },
      ],
    }; 

book['31'] = {
      text   : "The two Skeletons crumble back into dust, hopefully for good this time. You have little time to enjoy your victory, however, for the Skeleton on the plinth begins to rise as soon as its two guards are destroyed. Hefting the huge longsword which lay beside it, the Skeleton Lord advances slowly towards you.\nSKELETON LORD\tSKILL 8\tSTAMINA 6\n\nEvery time the Skeleton Lord wounds you, you lose 2 STAMINA points, and the Skeleton Lord adds 1 to its Attack Strength for the following round only.",
      choices : [
  {
    option  : "You win",
    command : "page\t288",
  },
      ],
    }; 

book['32'] = {
      text   : "You look all the way around the smaller house. The only way in seems to be a door on one side. You try the handle, but the door is locked. Choose your next action.",
      choices : [
  {
    option  : "Pick the lock IF you have the skill",
    command : "page\t211",
  },
  {
    option  : "Try the house across the street (with the coin symbol)",
    command : "page\t384",
  },
  {
    option  : "Go to the Merchants’ Guild (If you have not been there already)",
    command : "page\t129",
  },
      ],
    }; 

book['33'] = {
      text   : "In an instant, the Shapechanger has bent bars of the cage back, and leaps out to attack you. Fight it normally.\nSHAPECHANGER\tSKILL 10\tSTAMINA 10.",
      choices : [
  {
    option  : "You win",
    command : "page\t155",
  },
      ],
    }; 

book['34'] = {
      text   : "The room is about twenty feet square, and entirely hewn out of rock, an indication of how deep underground you are. The only thing you can see in the room is a large, golden-brown lizard, which lies bleeding and apparently dead in one corner.",
      choices : [
  {
    option  : "Go over and examine the lizard ",
    command : "page\t228",
  },
  {
    option  : "Leave the room immediately and carry on up the passage",
    command : "page\t252",
  },
      ],
    }; 

book['35'] = {
      text   : "You just manage to raise your sword in time fend off the attack. You have disturbed a Ghoul from its nocturnal feast, and now you must fight to keep yourself off the menu.\n\nGHOUL\tSKILL 8\tSTAMINA 7\n",
      choices : [
  {
    option  : "Ghoul hits you four times",
    command : "page\t171",
  },
  {
    option  : "Kill the Ghoul",
    command : "page\t57",
  },
      ],
    }; 

book['36'] = {
      text   : "There are just too many guards. You fight for as long as you can, but eventually something crashes into the back of your head and everything goes black. When you wake up, you are in a dungeon cell. Your test is over, and your life may not have much longer to run. You adventure ends here.",
      choices : []
    }; 


book['37'] = {
      text   : "You leap forward, and your first attack strikes home before the Ogre has a chance to collect its wits. It howls in pain, and clambers to its feet to defend itself. Fight the Ogre normally.\n\nOGRE\tSKILL 8\tSTAMINA 10\n",
      choices : [
  {
    option  : " You win",
    command : "page\t342",
  },
      ],
    }; 

book['38'] = {
      text   : "You aim a blow at the black of the guard’s unprotected head. Roll two dice.",
      choices : [
  {
    option  : "The result is less than your SKILL score",
    command : "page\t205",
  },
  {
    option  : "If not",
    command : "page\t310",
  },
      ],
    }; 


book['39'] = {
      text   : "You look at the symbol carefully. It is one of the secret signs of the Thieves’ Guild, but part of it is missing: the thief must have died before he could finish it. You think it’s the symbol for illusion, but you can’t be sure. You pause for a few seconds to offer a silent prayer to the God of Thieves, asking him to look after the dead thief in the next word as well as looking after you in this world.",
      choices : [
  {
    option  : "Prepare to move on,",
    command : "page\t302",
  },
      ],
    }; 

book['40'] = {
      text   : "Your first thought is to hold your breath, so that the deadly spores can’t get into your system - but you are too late. Your eyes start to water and you begin to choke, slumping to the ground in a fit of helpless coughing, knowing that each breath brings more of the spores into your body. Your adventure and your life both end here.",
      choices : [],
    }; 


book['41'] = {
      text   : "As soon as the wire is cut, the Crystal Warrior attacks you\n\nCRYSTAL WARRIOR\tSKILL 10\tSTAMINA 13\n If you are using a stone axe, flight the Crystal Warrior normally. Otherwise, you have to use the pommel of the your sword, as the only available blunt weapon - deduct 2 points from your Attack Strength during this fight. If you win, you take the obsidian disc (it counts as a backpack item).",
      choices : [
  {
    option  : "You win",
    command : "page\t316",
  },
      ],
    }; 

book['42'] = {
      text   : "It’s not good, you just can’t see any way out. You have no option but to return to the Thieves’ Guild and report your failure. You adventure ends here.",
      choices : [],
    }; 

book['43'] = {
      text   : "You reach the great stone slab at the end of the passage. It is immense, filling the height and width of the passage. And it appears to be at least a couple of feet thick.",
      choices : [
  {
    option  : "Try to force it open",
    command : "page\t348",
  },
  {
    option  : "If you have HIDDEN skill, look for some hidden mechanism",
    command : "page\t303",
  },
  {
    option  : "Look for a way around the slab",
    command : "page\t198",
  },
      ],
    }; 

book['44'] = {
      text   : "One of the guardsmen takes your money with a chuckle. ‘All right,’ he says. ‘We didn’t see you this time. Just make sure we don’t see you again.’",
      choices : [
  {
    option  : "The patrol marches on",
    command : "page\t177",
  },
      ],
    }; 


book['45'] = {
      text   : "You start along the balcony towards the landing at the far end, but you haven’t gone more than a step or two when one of the doors - the first on the right - opens. You stop dead. A white- clad figure comes silently out of the room and begins to cross the baloney towards you. It appears to be a young man in a white robe. What will you do?",
      choices : [
  {
    option  : "Try to hide?",
    command : "page\t215",
  },
  {
    option  : "Run out of the house?",
    command : "page\t110",
  },
  {
    option  : "Attack?",
    command : "page\t281",
  },
      ],
    }; 

book['46'] = {
      text   : "You go into the room. There’s more treasure here than you could every carry, but a pocketful of gems will be enough to make you rich when you get out of here. Although the object of your test is the Eye if the Basilisk, the Guild didn’t say that you couldn’t keep anything else you found along the way. You reach forward to pick up some gems - and suddenly the pile of treasure rears up, and you find yourself wrapped in the coils of a brightly colored snake. Lose 2 STAMINA points as it squeezes you. You have heard of the Scitalis or Treasure Snake - you have fallen for its illusion, and now you must fight for your life!\n\nCITALIS\tSKILL 8\tSTAMINA 10\nIf you wi the first round of combat, the snake is not wounded, but you have escaped from its coils. If you lose, you are still trapped and the snake squeezes you for another 2 STAMINA points of damage. You can not wound the snake until you are free of its coils.",
      choices : [
  {
    option  : "You win",
    command : "page\t168",
  },
      ],
    }; 


book['47'] = {
      text   : "You approach the door quietly, and listen at it for a few moments. You hear nothing , all is quiet in the servants’ quarters. What will you do now?",
      choices : [
  {
    option  : "Open the door?",
    command : "page\t255",
  },
  {
    option  : "Go up the stairs?",
    command : "page\t368",
  },
  {
    option  : "Examine the suit of armour beside the stairs?",
    command : "page\t62",
  },
      ],
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
      ],
    }; 


book['49'] = {
      text   : "Sweet breaks out on your forehead as, painfully slowly, you lift the disc off the silver wire. Then, just at the wrong moment, an involuntary twitch makes you drop it, and it lands with a thump on the silver wire. The Crystal Warrior’s  sword bites into your neck. Your test and your life both end here.",
      choices : [],
    }; 

book['50'] = {
      text   : "The door is not locked , so you open it and creep stealthily into the room. It is furnished with a single bed, a wardrobe and dressing table. Someone - a child, judging by the size - is asleep in the bed. You can see nothing of value in the room, just a few dolls on the dressing table and floor. Suddenly, a floorboard creaks loudly under your feet.The sleeping form in the bed murmurs and stirs slightly.",
      choices : [
  {
    option  : "Go further into the room",
    command : "page\t60",
  },
  {
    option  : "Leave the room",
    command : "page\t201",
  },
      ],
    }; 


book['51'] = {
      text   : "You hit the door a second time, but still it doesn’t budge. The spores are thick in the air now, and although the cloth over your face gives you some protection, it doesn’t last for ever. Your eyes begin to water, and you start to choke on the spores. You sink to the ground in a fit of uncontrollable coughing, knowing that each breath takes the deadly spores deeper Into your body. Your adventure and your life both end here.",
      choices : []
    }; 

book['52'] = {
      text   : "The symbol is familiar, but you can’t make it out. You wish you’d worked harder at learning the secret signs - this might be an important clue, and you have no idea what it means.",
      choices : [
  {
    option  : "Use SPOT HIDDEN skill",
    command : "page\t314",
  },
  {
    option  : "I do not have it",
    command : "page\t212",
  },
      ],
    }; 


book['53'] = {
      text   : "Wood Golems are highly resistant to all forms of magic. Your magical weapon will behave like a normal weapon for this combat. Continue fighting the Wood Golem.\n\nWOOD GOLEM\t SKILL 8\tSTAMINA 4\n",
      choices : [
  {
    option  : "You win",
    command : "page\t136",
  },
      ],
    }; 

book['54'] = {
      text   : "Your heart rises as you recognize the sign for a hidden mechanism. There is a way out of here - but where? You look at the walls again, and suddenly realize that the brick on which the symbol is scratched is loose. Pulling the brick out of the wall, you find a small lever down, and closes behind you as you go back into the study. What will you fo now?",
      choices : [
  {
    option  : "Examine the desk",
    command : "page\t90",
  },
  {
    option  : "Leave the Merchants’ Guild stealthily and search for clues in Brass’s house ",
    command : "page\t156",
  },
  {
    option  : "Set out in search of the Eye of the Basilisk",
    command : "page\t144",
  },
      ],
    }; 


book['55'] = {
      text   : "You put the key marked ‘L’ in the left-hand lock and the key marked ‘R’ in the right-hand lock.",
      choices : [
  {
    option  : "Turn them together",
    command : "page\t335",
  },
 ],
    }; 

book['56'] = {
      text   : "You reach into the gap. The tips of your fingers brush something - a catch of some kind. This must be the mechanism that opens the door. You pulled it, and with a sickening thunk a row oof spikes shoots into your hand. The spikes are poisoned. Roll four dice - if the result is equal to your current STAMINA or less, you lose a STAMINA points. If the result is more than your current STAMINA, you lose 4 STAMINA points. Also , you lose 1 SKILL point.",
      choices : [
  {
    option  : "Reconsider your options",
    command : "page\t43",
  },
  ],
    }; 

book['57'] = {
      text   : "The Ghoul falls to the ground at your feet, twitches once and is still. After pausing to catch your breath, you investigate what it was eating, and find to your disgust that it is a human corpse. Searching the chewed body quickly, you turn up 2 gold pieces and a dagger.",
      choices : [
  {
    option  : "Make a note of them on your Adventure Sheet",
    command : "page\t246",
  },
      ],
    }; 
book['58'] = {
      text   : "If you have PICK LOCK skill, roll two dice.",
      choices : [
  {
    option  : "If the result is equal to your SKILL SCORE or less",
    command : "page\t139",
  },
  {
    option  : "If not, or if you do not have PICK LOCK skill",
    command : "page\t221",
  },
      ],
    }; 

book['59'] = {
      text   : "As you lunge through the hail of missiles towards the far side of the room, you spot a door  set into an alcove.",
      choices : [
  {
    option  : "Use the SPOT HIDDEN skill",
    command : "page\t126",
  },
  {
    option  : "I do not have it",
    command : "page\t317",
  },
      ],
    }; 

book['60'] = {
      text   :"You move cautiously forward, and the person in the bed - a young girl - sits bolt upright with a sheltering scream. You have no choice but run before the whole household is woken. You hurry back to the Market Square, planning your next move. It’s too dangerous to go back to Brass’s house, so you will have to do without any information that you could have gained from there. That leaves you two options.",
      choices : [
  {
    option  : "Go to the Merchants' Guild if you have not already done so",
    command : "page\t129",
  },
  {
    option  : "Hope that you have enough information to find the Eye of the Basilisk and set out in reach of it",
    command : "page\t144",
  },
      ],
    }; 

book['61'] = {
      text   : "You shrink back into the shadows, but your luck is out: you knock something over as you do so, and it fails to the floor with a crash. The breathing stops abruptly, and you hear a faint groan. Whatever is there, you’ve worked it up. What will you do now?",
      choices : [
  {
    option  : "Dash out and climb up the drainpipe? (if you haven’t already done so)",
    command : "page\t225",
  },
  {
    option  : "Dash out and climb to the roof by some other means?",
    command : "page\t4",
  },
  {
    option  : "Stand still and hope for the best?",
    command : "page\t119",
  },
      ],
    }; 

book['62'] = {
      text   : "The armour is about a hundred years old, and in very good condition. It has been inlaid with gold and silver, and it is probably quite valuable. You can’t carry it out with you, though, so there’s no real point in standing looking at it. You start to turn away, and then you notice something behind the armour, glinting yellow in the light from your hand-lamp. You can’t see what it is, and you’re not sure that you’ll be able to reach it.",
      choices : [
  {
    option  : "I want to try my PICK POCKET skill",
    command : "page\t147",
  },
  {
    option  : "I do not have PICK POCKET skill",
    command : "page\t109",
  },
  {
    option  : "I don’t want to try to retrieve the object, go up the stairs",
    command : "page\t368",
  },
   {
    option  : "I don’t want to try to retrieve the object, try the door under the landing",
    command : "page\t47",
  },
      ],
    }; 

book['63'] = {
      text   : "You cover your mouth and nose, hoping that this will protect you from the worst of the spores, and charge the door, Roll two dice.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t190",
  },
  {
    option  : "If it isn't",
    command : "page\t390",
  },
      ],
    }; 

book['64'] = {
      text   : "Madame Star shrugs. ’Well,’ she says，’I do have a living to make, you know. I can’t go round doing things for free.’ ‘it’s obvious that you’ll get nowhere without money. Her price is 2 gold pieces. If you don’t have 2 gold pieces, or if you don’t want to pay, you will have to leave her house, and decide what to do next.",
      choices : [
  {
    option  : "Pay her 2 gold pieces and cross them off your Adventure Sheet.",
    command : "page\t289",
  },
  {
    option  : "Go to the Rat and Ferret (if you haven’t already)?",
    command : "page\t309",
  },
  {
    option  : "Try to find a beggar (if you haven’t already)?",
    command : "page\t26",
  },
  {
    option  : "Or will you leave the Noose and try elsewhere? ",
    command : "page\t387",
  },
      ],
    }; 

book['65'] = {
      text   : "You can’t avert your eyes in time, and find yourself staring into those big, glowing yellow eyes. They are the last thing you see, as the Basilisk’s gaze turns to you stone. Your adventure ends here.",
      choices : [],
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
    command : "page\t387",
  },
      ],
    }; 

book['67'] = {
      text   : "Holding your torch before you, you edge closer to your shadow. If fades as the light strikes it, becoming less substantial as you move closer. It seems to sense the danger of the light, since it makes no move to attack you as you head for the passage that leads out of the cavern.",
      choices : [
  {
    option  : "I have SPOT HIDDEN skill",
    command : "page\t381",
  },
  {
    option  : "No, I don’t",
    command : "page\t27",
  },
      ],
    }; 

book['68'] = {
      text   : "You can’t see whatever is throwing the furniture about, but as a small table rises into the air and flies towards you, you realize that there’s a Poltergeists in the room.",
      choices : [
  {
    option  : "Will you back out of the room?",
    command : "page\t121",
  },
  {
    option  : "Try to make it to the other side?",
    command : "page\t339",
  },
      ],
    }; 

book['69'] = {
      text   : "You find a passage leading out of the chamber  and hurry down it, eager to escape the spores. The passage forks, and you can see a number of turnings leading off from each side of either passage, like a maze. Do you have a map?",
      choices : [
  {
    option  : "I do",
    command : "page\t362;",
  },
  {
    option  : "I don’t",
    command : "page\t81",
  },
      ],
    }; 

book['70'] = {
      text   : "You put your ear against the door and listen, but hear nothing. What will you do now?",
      choices : [
  {
    option  : "Go into the room?",
    command : "page\t50",
  },
  {
    option  : "Listen at the door on the left?",
    command : "page\t277",
  },
  {
    option  : "Listen at the second door on the right ? ",
    command : "page\t76",
  },
      ],
    }; 

book['71'] = {
      text   : "Your finger is cut, but not seriously. You have lost the game, and the men insist that you pay up.",
      choices : [
  {
    option  : "If you have, cross them off your Adventure Sheet ",
    command : "page\t227",
  },
  {
    option  : "If you do not have 5 gold pieces",
    command : "page\t112",
  },
      ],
    }; 

book['72'] = {
      text   : "You climb rapidly, and are halfway up the wall before the Footpads even realize what you are doing.",
      choices : [
  {
    option  : "Continue",
    command : "page\t226",
  },
      ],
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
      ],
    }; 

book['74'] = {
      text   : "The guard does not seem to be particularly alert. He leans against the wall a few feet from the door, and fron the way his head keeps nodding, he appears to be on the verge of dropping off to sleep. You can try sneaking past him.",
      choices : [
  {
    option  : "You have SNEAK skill",
    command : "page\t326",
  },
  {
    option  : "If you don’t;",
    command : "page\t372",
  },
  {
    option  : "Bribe him",
    command : "page\t345",
  },
   {
    option  : "You can look around the building for an unguarded entrance",
    command : "page\t210",
  },
      ],
    }; 

book['75'] = {
      text   : "You approach the trees carefully, your eyes fixed on the place where you last saw movement. As you draw close, you can see movement again - there’s definitely something in there, but it’s too dark to see quite what it is.",
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
    option  : "Investigate further by heading straight for the Merchants’ Guild avoiding the trees",
    command : "page\t246",
  },
      ],
    }; 

book['76'] = {
      text   : "You listen at the door, but hear nothing. Pushing it gently open, you see a young man in a large fourposter bed, sound asleep and snoring softly. A glance round the room reveals nothing of interest, so you leave, closing the door softly behind you. What will you do now?",
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
    option  : "Leave the house to go find the Eye of the Basilisk. You think you have enough information",
    command : "page\t144",
  },
   {
    option  : "Leave the house to look for more information in the Merchants’ Guild (If you have not been there before)",
    command : "page\t129",
  },
      ],
    }; 

book['77'] = {
      text   : "The garden is old and overgrown, more like a jungle these days, but in places you can still traces of a flower-bed, proving that it used to be a garden. Heading towards the blackened clearing where the house once stood, you see what looks like a statue a few yards to your left.",
      choices : [
  {
    option  : "Inspect the statue",
    command : "page\t301",
  },
  {
    option  : "Go straight across what was once the lawn to the side of the house",
    command : "page\t287",
  },
      ],
    }; 

book['78'] = {
      text   : "You draw your sword and back against a wall as the Footpads close round you. One massively built villain steps forwards, armed with a length of heavy chain. ‘Well, well.’ He chuckles unpleasantly. ‘it’s got a sword. Come on, then - let’s see how good you are!’ You must fight the Footpad. \n\n \tFOOTPAD SKILL 8\tSTAMINA 6\n. If you roll double 1 on your attack dice at any time. ‘Test your luck. If you are Lucky, carry on fighting.",
      choices : [
  {
    option  : "If you're Unlucky",
    command : "page\t166",
  },
  {
    option  : "If you win",
    command : "page\t218",
  },
      ],
    }; 

book['79'] = {
      text   : "Going thought the door, you find yourself in a passage, which leads off and right.",
      choices : [
  {
    option  : "Go left",
    command : "page\t241",
  },
  {
    option  : "Go right",
    command : "page\t351",
  },
      ],
    };

book['80'] = {
      text   : "You walk stealthily down the side-alley, which appears to be deserted.",
      choices : [
    {
    option  : "Will you open the door?",
    command : "page\t159",
  },
  {
    option  : "Climb the drainpipe?",
    command : "page\t225",
  },
  {
    option  : "Leave and continue walking round the building?",
    command : "page\t271",
  },    
      ],
    };


book['81'] = {
      text   : "On instinct, you set off down the left-hand passage, but you are not sure which is the right way, and soon you realize that you are lost in a maze of tunnels. Test your Luck.",
      choices : [
  {
    option  : "If youre Lucky",
    command : "page\t178",
  },
  {
    option  : "Go right",
    command : "page\t370",
  },
      ],
    }; 

book['82'] = {
      text   : "You stand firm, with your weapon ready, as the Animated Corpse shambles towards you. Fight it normally.\n\n \tANIMATED CORPSE SKILL 5 \tSTAMINA 6\n Because it moves slowly, you can run away after winning a round of combat", 
      choices : [
  {
    option  : "Run away",
    command : "page\t192",
  },
  {
    option  : "You destroy the Animated Corpse",
    command : "page\t23",
  },
      ],
    };

book['83'] = {
      text   : "You head for the door, but before you reach it you step on something under the carpet. There’s a sound click.", 
      choices : [
  {
    option  : "Continue",
    command : "page\t106",
  }, 
      ],
    };    

book['84'] = {
      text   : "A few yards further on, the passage widens again, and is faced with dressed stone as before. You come to a door in the right-hand side of the passage.", 
      choices : [
  {
    option  : "Listen at the door",
    command : "page\t10",
  }, 
  {
    option  : "Try to open it",
    command : "page\t140",
  }, 
  {
    option  : "Ignore it, carry on down the passage",
    command : "page\t374",
  }, 
      ],
    };

book['85'] = {
      text   : "Your mind works quickly, and you decide that the easiest way to defeat your own shadow is to stop casting it. But how? If you have HIDE skill - you must have the skill itself; a black hooded cloak isn’t good enough here - roll two dice.", 
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t184",
  }, 
  {
    option  : "The result is more than your SKILL score or you do not have HIDE skill",
    command : "page\t311",
  }, 
      ],
    };

book['86'] = {
      text   : "Something makes you suspicious, and you decide to make sure that Dwarf is telling the truth. After all, the dead thief you passed was severely wounded in this room, yet there’s nothing here but a caged Dwarf without a scratch on him. ‘Where is the Master of the Thieves’ Guild?’ You ask. If the Dwarf is really a thief, he will know the answer. The Dwarf does not answer your questions. He reaches through the bars of the cage, trying to catch hold of you. He seems to grow bigger, his skin becomes green and scaly, and spines erupt all along his back. With a ferocious snarl, the Shapechanger bends the bars of the cage, preparing to attack you. If you prefer to leave the room before it frees itself, roll two dice.", 
      choices : [
  {
    option  : "Fight the Shapechanger",
    command : "page\t33",
  }, 
  {
    option  : "The roll dice result is equal to your SKILL score or less",
    command : "page\t229",
  },
  {
    option  : "If the result is higher than your SKILL score",
    command : "page\t367",
  },  
      ],
    };

book['87'] = {
      text   : "Carefully, you move the obsidian disc into the light. As the light strikes the disc, it is absorbed, and the disc is unharmed. You reach carefully beneath the disc to take the gem. The disc is very heavy to hold steady in the light one-handed, and it begins to waver - roll two dice.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t214",
  }, 
  {
    option  : "If the result is higher than your SKILL score",
    command : "page\t380",
  },  
      ],
    };

book['88'] = {
      text   : "You notice something glinting in the blanket of mould that covers the end of the passage. Looking closer, you see that it is metal - part of a doorknob, by the look of it. You reach to turn the doorknob, and then you see something else. To one side of the door that must be underneath all the mould, there’s a lump which you thought was just an irregularity in the rock. But as you look more closely, you can see that it is a body. The mould has grown over it and obscured its shape, but it is definitely a body. You stop and think. You remember hearing somewhere that there are types of mould which fire clouds of spores into the air the moment that anything disturbs them. The spores are poisonous, and cause death almost instantly, giving the mould a fresh supply of organic matter to grow on. The problem is, you have to open the door without disturbing the mould.",
      choices : [
  {
    option  : "You have PICK POCKET skill",
    command : "page\t197",
  }, 
  {
    option  : "Try to burn the mould away with your torch",
    command : "page\t160",
  },
  {
    option  : "Cover your nose and mouth, charge the door and hope for the best",
    command : "page\t115",
  },    
      ],
    };

book['89'] = {
      text   : "At last the Chest Creature is destroyed. As rapid search of the strongroom reveals nothing  of interest except a small silver whistle (make a note of this on your Adventure Sheet if you take it - it is not a backpack item), and you turn your attention to how you are going to get out. The door is closed fast, and no amount of pushing on pulling will shift it. There’s no keyhole on the inside, so you can’t pick the lock. You are about to give up in despair when you see a symbol scratched on the wall.",
      choices : [
  {
    option  : "Turn to 54 if you have SECREAT SIGN skill, 349 if you don’t.",
    command : "page\t54",
  }, 
  {
    option  : "Try to burn the mould away with your torch",
    command : "page\t349",
  },
  {
    option  : "Cover your nose and mouth, charge the door and hope for the best",
    command : "page\t115",
  },    
      ],
    };

book['90'] = {
      text   : "You search the desk thoroughly. There are three drawers on one side: two are locked, but you find some keys in a third drawer, and unlock them. In the desk you find the following: \n\nA key, marked with the letter ‘L’；\nCoins totaling 10 gold pieces;\nA deed of purchase, showing, but Brass recently bought a piece of Land called Barrow Hill; a letter from the Wizard Brabantius, telling Brass that ‘The Barrow Hill properly has been refilled according to your instructions’.Make a note of anything you take on your Adventure Sheet.\n\n The two documents are an important clue: make a note of the number of this paragraph on your Adventure  Sheet. What will you do next?",
      choices : [
  {
    option  : "Examine the iron door",
    command : "page\t377",
  }, 
  {
    option  : "Leave the Merchants' Guild stealthily and search for clues in Brass' house (if you haven't been there before)",
    command : "page\t156",
  },
  {
    option  : "Set out in search of Eye of the Basilisk without looking for any more information",
    command : "page\t144",
  },    
      ],
    };

book['91'] = {
      text   : "You hold your breath and throw yourself at the door. There’s no time to think - you must try to break down the door and get out of the deadly cloud. Roll two dice.",
      choices : [
  {
    option  : "If the result is equal to your SKILL score or less",
    command : "page\t190",
  }, 
  {
    option  : "If not",
    command : "page\t107",
  },   
      ],
    };

book['92'] = {
      text   : "You open the door, and throw the bottle into the darkened room. It breaks against the floor, and its contents spill out, dispelling, the magical darkness and lighting the room brightly.",
      choices : [
  {
    option  : "You killed the monster in the room",
    command : "page\t34",
  }, 
  {
    option  : "If not",
    command : "page\t200",
  },   
      ],
    };

book['93'] = {
      text   : "The sign tells you that the door is trapped.",
      choices : [
  {
    option  : "Use SPOT HIDDEN skill",
    command : "page\t153",
  }, 
  {
    option  : "If you don't have the skill",
    command : "page\t210",
  },   
      ],
    };

book['94'] = {
      text   : "You feel your way along the cavern walls, and finally find the entrance to the passage. You daren’t light a torch until you are well clear of the cavern, so you grope your way forward in darkness for a few paces. Suddenly you stumble, and as you do so you hear a click followed by a shower of darts flying above your head. Gain 1 LUCK point for your lucky fall. If you hadn’t stumbled, the darts would surely have hit you.",
      choices : [
  {
    option  : "Light a torch and follow the passage",
    command : "page\t191",
  }, 
      ],
    };

book['95'] = {
      text   : "You retreat from the room as quietly as you can. That dog looked awfully big, and the last thing you want to do at the moment is to have it wake the whole house with its barking.",
      choices : [
  {
    option  : "Try the upper floor",
    command : "page\t368",
  }, 
      ],
    };

book['96'] = {
      text   : "You lash out at the nearest Footpad, but he parries the blow with a chair-leg and the gang closes round you. You shrink back into a deep doorway, clutching your sword in both hands. The doorway gives you a limited amount of cover, so that the Footpads can only come at you one at a time. Flight the first three Footpads normally.",
      choices : [],
    };

book['97'] = {
      text   : "You try to dodge between the guardsmen who surround you. Roll two dice.",
      choices : [
  {
    option  : "Result is less than equal to your SKILL score",
    command : "page\t188",
  },
  {
    option  : "Result is more than your SKILL score",
    command : "page\t162",
  },  
      ],
    };

book['98'] = {
      text   : "Your torch quickly ignites the Wood Golem, and it stumbles about, burning fiercely.",
      choices : [
  {
    option  : "Keep out of its way until it is destroyed",
    command : "page\t136",
  },
      ],
    };

book['99'] = {
      text   : "The first Crystal Warrior lies shattered on the floor. You watch the second closely, but it does not move. You take a look at the chest; it is security locked. Turn to 360 if you have PICK LOCK skill. If not, you can not open the chest. Leave the room and turn to 316.",
      choices : [
  {
    option  : "Use PICK LOCK skill",
    command : "page\t360",
  },
  {
    option  : "If you don't have the skill, leave the room",
    command : "page\t316",
  },  
      ],
    };

book['100'] = {
      text   : "You look at the stone carefully, trying to make out the design. It looks something like the Thieves’ sign meaning ‘mark’ - a victim or target. Very strange. Whatever it means, you still can’t find anyway into the barrow.",
      choices : [
  {
    option  : "Start to look around the garden",
    command : "page\t77",
  },
      ],
    };

book['101'] = {
      text   : "The guard looks at your money, his eyes narrowed. ‘Is that all?’ He laughs. ‘The thieves’ Guild must have fallen on hard times indeed ! Then he levels his spear and attacks you. Your money falls to the ground with a jingle as you dodge his first blow and draw your sword.",
      choices : [
  {
    option  : "Continue",
    command : "page\t131",
  },
      ],
    };

book['102'] = {
      text   : "You recognize the symbol as one of the secret signs of the Thieves’ Guild. Another thief has managed to get this far before you. You try not to think about what lies ahead that prevented him or her from reaching the Eye of the Basilisk. The secret sign tells you that there’s a hidden door, and as you lean on the plinth it glides back smoothly, revealing a flight of steps going down.",
      choices : [
  {
    option  : "You follow the steps",
    command : "page\t300",
  },
      ],
    };

book['103'] = {
      text   : "You move quietly to the table. The piece of paper seems to be a letter. It has already been opened, so you pick it up and read it. It addressed to a Captain Marlin, and concerns a trading voyage that he is about to undertake on behalf of a merchant called Silas Whitebait. There’s no mention of Brass at all very strange.",
      choices : [
  {
    option  : "Leave this house and go look at the house across the street, the one with the coin symbol",
    command : "page\t384",
  },
  {
    option  : "Investigate this house further and examine the door at the end of the hall",
    command : "page\t318",
  },
      ],
    };

book['104'] = {
      text   : "The safe is firmly set into the wall behind the picture; you estimate that the door is about four inches thick, and realize that you wouldn’t be able to force it open even if you knocked the wall down around it. It has two locks, one either side of the wheel-shaped handle.",
      choices : [
  {
    option  : "Use key marked '1'",
    command : "page\t273",
  },
  {
    option  : "Use key marked 'R'",
    command : "page\t124",
  },
  {
    option  : "Use both keys (If you have them)",
    command : "page\t55",
  },
  {
    option  : "If you don't have neither key, use PICK LOCK (If you have the skill)",
    command : "page\t165",
  },
  {
    option  : "Search the desk if you haven’t done so already",
    command : "page\t143",
  },
  {
    option  : "Leave the study, back on to the landing",
    command : "page\t325",
  },
  {
    option  : "Leave the study, out of the window",
    command : "page\t306",
  },
      ],
    };

book['105'] = {
      text   : "Breathing hard, you limp away from the dead guardsmen. You don’t stop to rifle their bodies, someone is bound to have heard the noise of the fight, and reinforcements could arrive at any moment. You go on your way, staying in the shadows and avoiding the main streets as you look for Brass’s house.",
      choices : [
  {
    option  : "Continue",
    command : "page\t177",
  },
      ],
    };

book['106'] = {
      text   : "Suddenly a small panel in the wall at floor level flies open, and a Jib-Jib - a small, strange-looking creature, little more than a furball on legs - flies out. You have to kill it in a single blow - you know that its howling is loud enough to be heard in Zengis, and will bring guards running to the scene. Attack the Jib-Jib normally. \n\nJIB-JIB \nSKILL 1 \nSTAMINA 2\n",
      choices : [
  {
    option  : "You win the first round",
    command : "page\t398",
  },
  {
    option  : "You don't win the first round",
    command : "page\t388",
  },
      ],
    };

book['107'] = {
      text   : "You hurl yourself at the door, and the air is suddenly filled with a dense mustard-colored cloud of spores as the wood quivers at the impact. The door doesn’t open, and your pent-up breath escapes before you can try again. You begin to choke on the spores, and your eyes begin to water. You slump to the ground, coughing helplessly and knowing that each breath takes the deadly spores deeper into your system. Your adventure and your life both end here.",
      choices : [],
    };

book['108'] = {
      text   : "After first checking to make sure that the coast is clear, you begin to climb the drainpipe. It ’s an easy climb, so it doesn’t matter if you don’t have CLIMB skill. Test your Luck.",
      choices : [
  {
    option  : "You're Lucky",
    command : "page\t238",
  },
  {
    option  : "You're Unlucky",
    command : "page\t375",
  },
      ],
    };

book['109'] = {
      text   : "You reach carefully behind the suit of armour, and your fingertips just graze something. You stretch a little further, and accidentally brush against the armour. You hardly touch it, but it is enough to upset the precariously balanced armour, which topples over with a crash. Immediately, a dog starts barking behind the door under the landing, and you hear people stirring upstairs. What will you do?",
      choices : [
  {
    option  : "Run out of the house",
    command : "page\t7",
  },
  {
    option  : "Stay and fight anyone who comes",
    command : "page\t336",
  },
  {
    option  : "Hide and hope no one finds you (If you have HIDE Skill)",
    command : "page\t170",
  },
  {
    option  : "Hide and hope no one finds you (If you do NOT have HIDE Skill)",
    command : "page\t254",
  },
      ],
    };

book['110'] = {
      text   : "You leave the house quickly and quietly, return through the right to the Market Square. What will you do next?",
      choices : [
  {
    option  : "Go to the Merchants' Guild (If you haven't already)",
    command : "page\t129",
  },
  {
    option  : "Try to find the Eye of the Basilisk using only the information that you have found so far",
    command : "page\t144",
  },
      ],
    };

book['111'] = {
      text   : "You lash out with your weapon, but it passes through the insubstantial Spirit as if it weren’t there. The spirit chuckles again as you turn to run, and you feel adventure and your life both end here.",
      choices : [],
    };

book['112'] = {
      text   : "The men stand up angrily when you tell them that you can’t play off the bet, and one of them pushes you roughly against the wall. What will you do now?",
      choices : [
  {
    option  : "Fight them",
    command : "page\t28",
  },
  {
    option  : "Try to run away",
    command : "page\t333",
  },
  {
    option  : "Offer them something else",
    command : "page\t283",
  },
      ],
    };

book['113'] = {
      text   : "Your mind works quickly. There’s some kind of sorcery at work here, and you don’t like the idea of lighting your own shadow at all. Then you have an idea. Shadows are caused when something blocks out light - they are peaches of darkness. Now if the shadow that’s preparing to attack you is made of darkness, then you can probably use another source of light - such as the torch you are carrying - to dispel it. ",
      choices : [
  {
    option  : "You hold the torch high, trying to keep it in a position where it will dispel the shadow cast by the torch on the wall.",
    command : "page\t67",
  },
      ],
    };

book['114'] = {
      text   : "You douse your torch quickly and shrink back into the shadow as the Ogre awakens. Although you’ve never seen an Ogre before, you can tell at a glance that you'd rather not fight it unless you have to. The Ogre comes straight for you, sniffing frequently, and with a sinking feeling you realize that the darkness doesn't hide you from its sense of smell.",
      choices : [
  {
    option  : "Fight the Ogre substracting 2 from your Attack Strenght because of the darkness.",
    command : "page\t328",
  },
      ],
    };

book['115'] = {
      text   : "You decide that the only thing to do is to cover your nose and mouth to protect you against the worst of the spores, charge the door, and hope to break through to the other side before there are too many spores in the air. What do you have to cover your face with?",
      choices : [
  {
    option  : "Use a black hooded cloak or some rags tied round your feet",
    command : "page\t63",
  },
  {
    option  : "You have neither, hold your breath as you charge",
    command : "page\t172",
  },
      ],
    };

book['116'] = {
      text   : "The sound of the crash brings people to their windows all along the street. Some lean out of their windows with lanterns and candles, trying to see what the noise was. You huddle in the shadow of a doorway, praying that they won’t spot you. After a few minutes, everyone goes back to bed. You stay where you are for a few minutes more, though, to give them time to get back to sleep. Then you decide what to do next. There is no way via the drainpipe now.",
      choices : [
  {
    option  : "Try to reach the windows (If you have CLIMB skill or Climbing equipment)",
    command : "page\t238",
  },
  {
    option  : "Open the front door (If you have PICK LOCK skill)",
    command : "page\t276",
  },
  {
    option  : "Go back via the Market Square to the Merchant's Guild (If you haven't been there)",
    command : "page\t129",
  },
  {
    option  : "You can't do any of these things or don't wish to. You might be able to find the hiding-place of the Eye of the Basilisk without any further information, who knows?",
    command : "page\t144",
  },
      ],
    };

book['117'] = {
      text   : "You walk along the Noose towards Madame Star’s cottage. You trained eyes pick out a number of beggars, pickpockets and cutpurses skulking in the shadows, but no one bothers you. Everyone in the Noose knows that you are an apprentice on your test. Finally , you reach the little tumbledown cottage where Madame Star lives. She is a little surprised when she answers the door, but offers to ready your future for 2 gold pieces.",
      choices : [
  {
    option  : "Give her 2 gold pieces (write them off your Adventure Sheet)",
    command : "page\t289",
  },
  {
    option  : "You don't have the gold or don't wish to pay her",
    command : "page\t64",
  },
      ],
    };

book['118'] = {
      text   : "You manage to prise open the lid of the chest. Inside is a disc of black obsidian, almost a foot across and so highly polished it reflects the light of your torch like a mirror. You reach to take it.",
      choices : [
  {
    option  : "You have SPOT HIDDEN skill",
    command : "page\t182",
  },
  {
    option  : "You don't have the skill",
    command : "page\t20",
  },
      ],
    };

book['119'] = {
      text   : "You stand very still, your heart in your mouth. Don’t hurt me, whines a plaintive voice. I’ve done no harm. All I wanted was somewhere to sleep out of the weather. You have caught a beggar, who sneaked in here to sleep.",
      choices : [
  {
    option  : "Pretend to be a guard and order him out",
    command : "page\t330",
  },
  {
    option  : "Tell him you are a friend",
    command : "page\t291",
  },
      ],
    };

book['120'] = {
      text   : "As you are examining the strongroom, you hear a soft grating sound, and see a movement from the corner of your eye. Turning round, you are amazed to find yourself being charged by a chest - at least, it look like a chest, but it has a stumpy leg at each corner and it gnashes its lid viciously. You turn to flee, but the iron door clangs shut! You are trapped and must fight the Chest Creature. \n\nCHEST CREATER \nSKILL 5 \nSTAMINA 6\n",
      choices : [
  {
    option  : "You win",
    command : "page\t89",
  },
      ],
    };

book['121'] = {
      text   : "The Poltergeist attacks once more as you run across the room. You plunge towards the door, wishing that it was something you could at least fight. \n\nPOLTERGEIST \nSKILL 0 \nSTAMINA 0\n Roll for Attack Strengths as normal, but if you win, you have not wounded the Poltergeist, merely dodged its missile. If the Poltergeist wins, you lose 1 STAMINA point. Fight one round of combat",
      choices : [
  {
    option  : "Leave room and go back along the passage to try the other way",
    command : "page\t351",
  },
      ],
    };

book['122'] = {
      text   : "You dodge into a shadow doorway and stay very still. As you watch and wait, a two-man patrol from the City Guard marches past. You hold your breath, but they don’t notice you, and continue on their way. You breathe a sigh of relief once they have passed, and slip out of the shadows to look for Brass’s house.",
      choices : [
  {
    option  : "Continue",
    command : "page\t177",
  },
      ],
    };

book['123'] = {
      text   : "What kind of weapon are you using?",
      choices : [
  {
    option  : "Magic Weapon",
    command : "page\t53",
  },
  {
    option  : "Torch",
    command : "page\t98",
  },
  {
    option  : "Any other kind of weapon",
    command : "page\t183",
  },
      ],
    };

book['124'] = {
      text   : "You put the key in the right-hand keyhole and turn it slowly.",
      choices : [
  {
    option  : "Use PICK LOCK skill",
    command : "page\t335",
  },
  {
    option  : "You do not have the skill",
    command : "page\t202",
  },
      ],
    };

book['125'] = {
      text   : "Landing on to the drainpipe with one hand, you struggle to unpack the rope and grapnel, and you hurl it as the Gargoyle prepares to swoop down on you again. Remember to cross it off your Adventure Sheet. Roll two dice.",
      choices : [
  {
    option  : "Result is equal to your SKILL score or less, you hit the Gargoyle",
    command : "page\t232",
  },
  {
    option  : "Result is higher than your SKILL score, you miss",
    command : "page\t389",
  },
      ],
    };

book['126'] = {
      text   : "As you plunge towards the door, you spot a slot in the ceiling above it, the slot which might house a portcullis or some other trap.",
      choices : [
  {
    option  : "Keep on towards the door",
    command : "page\t317",
  },
  {
    option  : "Turn round and try to leave the room by the passage",
    command : "page\t152",
  },
      ],
    };

book['127'] = {
      text   : "You approach the trees, moving as quietly as you can. You have lost sight of the movement, and as you draw closer you step on a twig, which snaps loudly in the still night air. Barely an instant later, a snarling figure hurls itself out of the darkness at you. Roll two dice.",
      choices : [
  {
    option  : "Result is less than or equal to your SKILL score",
    command : "page\t35",
  },
  {
    option  : "Result is more than your SKILL score",
    command : "page\t313",
  },
      ],
    };

book['128'] = {
      text   : "You pick your way cautiously through the debris, but after a few paces your foot knocks something with a faint tap. Instantly, the Grubs shoot from their burrows, with their mandibles clicking all around you. You fail at them with your torch and try to fight your way clear, but not without some injury. Roll one dice to see how many STAMINA points you lose. You may halve this amount (rounding fractions up) if you successfully Test your Luck.",
      choices : [
  {
    option  : "Continue",
    command : "page\t84",
  },
      ],
    };

book['129'] = {
      text   : "The Merchants’ Guild is on the south side of the Market Square, opposite the   Noose. The square is quiet now, all the markets stalls have been packed away, and you see no one as you make your way across. You keep to the edge of the square, hugging the shadows - the last thing you want is to be stopped and questioned by the City Guard, tonight of all nights. When you are about halfway across, you suddenly notice a movement among a clump of trees in the middle of the square.",
      choices : [
  {
    option  : "Investigate the movement",
    command : "page\t75",
  },
  {
    option  : "Ignore it and carry on towards the Merchants' Guild",
    command : "page\t246",
  },
      ],
    };

book['130'] = {
      text   : "You pick up a stone from the floor of the chamber, and throw it at the gem. As the stone passes through the column of light, there is a brilliant flash, and it is destroyed. You search the room thoroughly, but can find no means of turning the light off. What will you do now?",
      choices : [
  {
    option  : "Take the gem",
    command : "page\t269",
  },
  {
    option  : "Try to block the light with something",
    command : "page\t292",
  },
      ],
    };

book['131'] = {
      text   : "Fight the guard normally.\n\nGUARD \n SKILL 6 \nSTAMINA 6\n",
      choices : [
  {
    option  : "Fight lasts more than three rounds",
    command : "page\t299",
  },
  {
    option  : "Win within that time",
    command : "page\t337",
  },
      ],
    };

book['132'] = {
      text   : "You hunt all round the barrow, but can’t find any way in, it seems be no more than a featureless grassy mound. You are about to give up when you notice something scratched faintly into the standing stone which stands to one side of the barrow.",
      choices : [
  {
    option  : "You have SECRET SIGN skill",
    command : "page\t100",
  },
  {
    option  : "You do not have the skill",
    command : "page\t344",
  },
      ],
    };

book['133'] = {
      text   : "Are you using a magical weapon?",
      choices : [
  {
    option  : "You are",
    command : "page\t299",
  },
  {
    option  : "You are not",
    command : "page\t180",
  },
      ],
    };

book['134'] = {
      text   : "The door opens with a soft click, and you find yourself in a large study. A huge wooden desk stands against one wall, and also in the room are a bookcase and a few plush-looking chairs. Above the desk hangs a life-size portrait of a middle-aged man, very well dressed and obviously wealthy; Brass the merchant. The windows to the room are barred, but this bars can be opened from the inside. You close the door softly behind you, and advance into the room. What will you do next?",
      choices : [
  {
    option  : "Search the desk",
    command : "page\t143",
  },
  {
    option  : "Search the rest of the room",
    command : "page\t242",
  },
  {
    option  : "Leave through the window",
    command : "page\t306",
  },  
      ],
    };

book['135'] = {
      text   : "The door opens and you stagger back into the darkness, throwing the door shut and bolting it behind you. You lean against the door, trying to catch your breath, but the pounding on the door reminds you that the bolt won’t hold for ever - you need to find some way out. The guardsmen hammering on the door must have woken the house’s owner, for you can hear something stirring upstairs. You hurry to a window on the other side of the room, and climb out. By the time the guardsmen get into the house, you will be long gone.",
      choices : [
  {
    option  : "Continue",
    command : "page\t177",
  },
      ],
    };

book['136'] = {
      text   : "With the Wood Golem destroyed, you are able to look through the doorway into the room beyond. It is a small room, barely ten feet square, and it is filled with a huge pile of gold and gems. None of the gems looks particularly big, but the Eye of  the Basilisk might be in here somewhere.",
      choices : [
  {
    option  : "Search through the treasure",
    command : "page\t46",
  },
  {
    option  : "Ignore it and carry on up the passage",
    command : "page\t374",
  },
      ],
    };

book['137'] = {
      text   : "Before you can do anything, you are struck by a vivid blue spark. The world suddenly gets bigger, and a vast hand picks you up by the long green tail you seem to have acquired. You’ll get used to it after a while, ‘say Nicodemus the Wizard.’ ‘it’s not a bad life, being a newt -just watch out for big fish!’  With that, he throws you in the river. How will you survive? Well, one thing’s for certain - you’ve failed your test. Your adventure ends here.",
      choices : [],
    };

book['138'] = {
      text   : "You creep into the darkened room, but after a couple of places a floorboard creaks loudly under your feet. In the darkness, the snoring stops. What will you do?",
      choices : [
  {
    option  : "Back quietly out of the room",
    command : "page\t315",
  },
  {
    option  : "Stay still",
    command : "page\t193",
  },
  {
    option  : "Carry on into the room",
    command : "page\t261",
  },
      ],
    };

book['139'] = {
      text   : "The lock is the most complex, you have ever seen and it seems to take forever to pick it, but eventually the last of the tumblers click back and the door swings open with a barely audible creak.",
      choices : [
  {
    option  : "Continue",
    command : "page\t79",
  },
      ],
    };

book['140'] = {
      text   : "You try the handle of the door, and give it a shove. You are taken completely by surprise when a plank whips round and hits you! Lose 2 STAMINA points. The ‘door’ unfolds itself into a great humanoid shape. It is a Wood Golem, and you must fight it. \n\nWOOD GOLEM \nSKILL 8 \nSTAMINA 6\n",
      choices : [
  {
    option  : "Win a round of combat",
    command : "page\t123",
  },
      ],
    };

book['141'] = {
      text   : "You start to pick the lock, but almost as soon as you do so, the door flies open and you are confronted by an old man with a long white  beard. He looks angry, what will you do?",
      choices : [
  {
    option  : "Whatever you decide to do",
    command : "page\t137",
  },
      ],
    };

book['142'] = {
      text   : "Fight the Possessor Spirt normally. \n\nPOSSESSOR SPIRIT \n SKILL 10 \nSTAMINA 10\n Every time you lose a round of combat, you lose 1 LUCK point in addition to the usual 2 STAMINA points.",
      choices : [
  {
    option  : "You Win",
    command : "page\t323",
  },
      ],
    };

book['143'] = {
      text   : "You search the desk carefully. There are some papers relating to business deals in which Brass has been involved recently, but you can’t find anything about the Eye of the Basilisk. You may help yourself to a silver paper-knife worth 5 gold pieces, but you find nothing else of interest or value. What will you do next?",
      choices : [
  {
    option  : "Search the rest of the room",
    command : "page\t242",
  },
  {
    option  : "Leave the room via the window",
    command : "page\t306",
  },
  {
    option  : "Leave via the doors at the other end of the landing",
    command : "page\t325",
  },
      ],
    };

book['144'] = {
      text   : "You think about the information you’ve collected and the obstacles you’ve overcome. You must be close to the Eye of the Basilisk by now - at least, you now know where it is hidden. You do know, don’t you? Where will you look for it?",
      choices : [
  {
    option  : "Clock Street",
    command : "page\t369",
  },
  {
    option  : "Singing Bridge",
    command : "page\t22",
  },
  {
    option  : "Lord Azzur's Palace",
    command : "page\t167",
  },
  {
    option  : "Barrow Hill",
    command : "page\t284",
  },
      ],
    };

book['145'] = {
      text   : "As you pick the lock, a jolt of electricity lashes up your arm, throwing you across  the room, lose 4 STAMINA  points. If you still alive, you open the chest. Inside is a wise of black obsidian, almost a foot across and so highly polished it reflects the light of your torch like a mirror. You reach in to take it.",
      choices : [
  {
    option  : "You have SPOT HIDDEN skill",
    command : "page\t182",
  },
  {
    option  : "You do not have the skill",
    command : "page\t20",
  },
      ],
    };

book['146'] = {
      text   : "Climbing rapidly, you reach the top of the wall, with arrows whistling past you. Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t18",
  },
  {
    option  : "You are Unlucky",
    command : "page\t329",
  },
      ],
    };

book['147'] = {
      text   : "You reach carefully behind the suit of armour, and graze something with your fingertips. You realize that  the suit of armour is probablely fairly unstable without someone inside to hold it all together, and that it would make a horrible noise if you did happen to knock it over, so you don’t try to stretch any further behind it. After what seems like hours, you manage to shift the object so that you can pick it up, and you withdraw your hand carefully from behind the armour. You open your hand to see what you haev found, and discover that it is a gold piece. It must have been dropped in the hallway, and rolled behind the armor without anyone noticing. Make a note of it on your Adventure Sheet, even though it was hardly worth the effort. What will you do now?",
      choices : [
  {
    option  : "Go up the stairs",
    command : "page\t368",
  },
  {
    option  : "Investigate the door beneath the landing",
    command : "page\t47",
  },
      ],
    };

book['148'] = {
      text   : "Roll two dice.",
      choices : [
  {
    option  : "Result equal to your SKILL score or less",
    command : "page\t8",
  },
  {
    option  : "Result higher than your SKILL score",
    command : "page\t2",
  },
      ],
    };

book['149'] = {
      text   : "Trying not to let the guardsman see what you’re doing, your reach behind you and feel along the door until you find the doorknob. Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t135",
  },
  {
    option  : "You are Unlucky",
    command : "page\t347",
  },
      ],
    };

book['150'] = {
      text   : "You find yourself in an alcove looking into a small burial chamber. The chamber is crudely built, soil filters in through the slabs of the walls and ceiling. An ancient body lies mouldering on a plinth in the centre, with a long sword by its side, and two piles of bones show where other bodies once lay. Suddenly, the bones are stirred by unseen force, and gather themselves into Skeletons, each armed with a spear.  They raise their spears and advance towards you. ",
      choices : [
  {
    option  : "Stay in the alcove",
    command : "page\t366",
  },
  {
    option  : "Advance to meet them",
    command : "page\t233",
  },
      ],
    };

book['151'] = {
      text   : "You shout - you hope you sound ferocious - and charge the nearest of the Footpads. Roll two dice.",
      choices : [
  {
    option  : "Result equal to your SKILL score or less",
    command : "page\t244",
  },
  {
    option  : "Result higher than your SKILL score",
    command : "page\t96",
  },
      ],
    };

book['152'] = {
      text   : "You throw yourself across the room, with bric-a-brac flying all round you. The poltergeist attacks you there three times as you run across the room. \n\nPOLTERGEIST \nSKILL 6 \nSTAMINA 0\n Roll for Attack Strength as normal, but if you win you have not wounded the Poltergeist, merely dodged its missle. If the Poltergeist wins, you lose 1 STAMINA point. Fight three rounds of combat.",
      choices : [
  {
    option  : "Leave the room and run back down the passage",
    command : "page\t351",
  },
      ],
    };

book['153'] = {
      text   : "Straining your eyes in the darkness, you see a serious of long straight cracks near the lock. It looks suspicious at though there is a flip-open panel which throws something nasty out when anyone tampers with the lock.",
      choices : [
  {
    option  : "Try to disarm the trap",
    command : "page\t173",
  },
  {
    option  : "Leave it alone and look for another way in",
    command : "page\t210",
  },
      ],
    };

book['154'] = {
      text   : "You run across the cavern as fast as you can - if you can get out of the light, your shadow should disappear. While you are running, your shadow attacks you three times. Fight three rounds of combat your shadow has the same SKILL score as you do. If you win a round, you have not wounded your shadow, merely evaded its attack - you are too busy running to fight back. If your shadow wins a round. You are wounded as normal. After three rounds, you reach the far side of the cavern.",
      choices : [
  {
    option  : "Use SPOT HIDDEN skill",
    command : "page\t381",
  },
  {
    option  : "You do not have the skill",
    command : "page\t27",
  },
      ],
    };

book['155'] = {
      text   : "You carry on down the passage. It narrows abruptly, and the dressed stone walls gives way to roughewn rock again. Soon you see why. Both walls are dotted with small holes, about three inches across; between the holes, the floor is littered with bones and other rubbish. A rat, disturbed by the light of your torch, skitters down the passage in front of you. As it goes, it disturbs some of the rubbish and instantly a sharp-jawed, caterpillar -like creature - something like a Rock Grub, but smaller and faster - shots from each of the holes, attracted by the noise. The rat doesn’t stand a chance , and is quickly torn to pieces. You wait for the Grubs to return to their holes, and move forward cautiously. You must move absolutely silently in order to get past without disturbing them.",
      choices : [
  {
    option  : "Use SNEAK skill",
    command : "page\t25",
  },
  {
    option  : "You do not have the skill",
    command : "page\t128",
  },
      ],
    };

book['156'] = {
      text   : "You set out towards the Field Gate. The area between Palace Street and Field Street, near Lord Azzur’s  palace, is the richest part of the town, and you know that you will have to be especially careful there. The city Guard is double watchful in that part of town, always keen that the people with the money should see them doing their duty. After you have gone a few yards down Thread Street, you see a bobbing light approaching, and hear the sound of booted feet.",
      choices : [
  {
    option  : "Use HIDE skill",
    command : "page\t122",
  },
  {
    option  : "You do not have the skill",
    command : "page\t293",
  },
      ],
    };

book['157'] = {
      text   : "The monster, whatever it is , slithers off into the darkness. You hear it thrashing about for a few seconds, then silence. Carrying on across the room, you feel your way to the far wall, and after a few seconds' groping you find a door. You try the handle, but it won’t open - it must be locked. If you do not have PICK LOCK skill, you will have to try to break down the door. Roll two dice. If the result is higher than your SKILL score then you failed, lose 1 STAMINA point for a bruised shoulder and try again. Keep trying until you break down the door or die in the attempt",
      choices : [
  {
    option  : "You have PICK LOCK skill",
    command : "page\t324",
  },
  {
    option  : "You do not have the skill, If dice result is equal to your SKILL score or less then you succeed",
    command : "page\t324",
  },
      ],
    };

book['158'] = {
      text   : "There is no way that you could have picked up a magical weapon by this stage in the adventure - you’ve been cheating!",
      choices : [
  {
    option  : "Go back to 1 and start again - but do it honestly this time.",
    command : "page\t1",
  },
      ],
    };

book['159'] = {
      text   : "You try the handles of the door. It is not locked, and opens with a faint creak. You step cautiously into a darkened room. By the light of your hand-lamp, you see that room is furnished with a long table and served chairs - possibly it is some kind of meeting room. At the same time, you become aware of heavy breathing coming from somewhere in the room.",
      choices : [
  {
    option  : "Creep out and climb the drainpipe (if you haven't already done so)",
    command : "page\t225",
  },
  {
    option  : "Creep out and climb to the roof by some other route",
    command : "page\t4",
  },
  {
    option  : "Stay where you are and use HIDE skill",
    command : "page\t179",
  },
  {
    option  : "Stay where you are without HIDE skill",
    command : "page\t61",
  },
      ],
    };

book['160'] = {
      text   : "You thrust your torch into the mould, trying to burn it always from the door. Instantly, the air is filled with a dense mustard - colored cloud of spores. Roll two dice.",
      choices : [
  {
    option  : "Result is equal to your SKILL score or less",
    command : "page\t91",
  },
  {
    option  : "Result is higher than your SKILL score",
    command : "page\t40",
  },
      ],
    };

book['161'] = {
      text   : "You stop to think. You are certain that the Eye of the Basilisk lies ahead. If you go back, you will have failed your test and you will spend the rest of your life wondering whether or not you could have succeeded. On the other hand, if you go on you will have to face whatever is in there. It may be able to see in the magical darkness and if it can ,you will be at a terrible disadvantage. You think hard about what to do. ",
      choices : [
  {
    option  : "Choose to go on after all",
    command : "page\t352",
  },
      ],
    };

book['162'] = {
      text   : "You try to  push past the guardsmen and make a break for it, but one of them catches you by the shoulder and pushes you roughly back into the doorway. You think fast as the guardsmen close in round you. What till you do now?",
      choices : [
  {
    option  : "Try to bribe the guardsmen (if you haven't already)",
    command : "page\t327",
  },
  {
    option  : "Try to escape through the door behind you",
    command : "page\t149",
  },
  {
    option  : "Attack the patrol",
    command : "page\t224",
  },
      ],
    };

book['163'] = {
      text   : "You try the door, but it is locked.",
      choices : [
  {
    option  : "Use PICK LOCK skill",
    command : "page\t187",
  },
  {
    option  : "You do not have the skill, so you try the door with the coin symbol",
    command : "page\t3",
  },
  {
    option  : "Give up on the Merchants’ Guild and look for clues in Brass's house (If you haven't already)",
    command : "page\t156",
  },
  {
    option  : "Set out in the search of the Eye of the Basilisk armed only with the information you already have",
    command : "page\t144",
  },
      ],
    };

book['164'] = {
      text   : "You can’t reach with your dagger - the blade is too rigid.",
      choices : [
  {
    option  : "Put your hand in the gap",
    command : "page\t56",
  },
  {
    option  : "Try something else (go back and choose again)",
    command : "page\t43",
  },
      ],
    };

book['165'] = {
      text   : "You choose a lock, and start working on it. Suddenly, a tiny snake shoots out of the other lock and buries its Langs in your hands. Lose 4 STAMINA points to its poisonous bite.",
      choices : [
  {
    option  : "You are still alive, search the desk (If you haven’t done so already)",
    command : "page\t143",
  },
  {
    option  : "Leave via the door and investigate the doors at the other end of the landing",
    command : "page\t325",
  },
      ],
    };

book['166'] = {
      text   : "The Footpads’ heavy chain wraps around your sword, breaking the blade, subtract 3 points from your Attack Strength until you can find another weapon.",
      choices : [
  {
    option  : "Carry on fighting",
    command : "page\t78",
  },
      ],
    };

book['167'] = {
      text   : "You make your way cautiously towards the palace. As you approach,  you can see that the main gate is locked and securely guarded. This won’t be easy. How will you get into the palace?",
      choices : [
  {
    option  : "Through the main gate",
    command : "page\t223",
  },
  {
    option  : "Over the wall (If you have CLIMB skill or a rope and grapnel)",
    command : "page\t16",
  },
      ],
    };

book['168'] = {
      text   : "Finally the Snake dies, and you find that there’s no treasure in the room, just the bones of its victims. You do find some provisions in a backpack, though, a little stale, but enough for 2 meals. You also turn up a scroll or parchment; it appears to be a map of some kind of maze. Make a note of these items on your Adventure Sheet if you take them. Finding nothing else of the interest in the room.",
      choices : [
  {
    option  : "Leave and carry on along the passage",
    command : "page\t374",
  },
      ],
    };

book['169'] = {
      text   : "If you are using a stone axe, the Crystal Warrior is wounded. Conduct the rest of the combat normally. \n\nCRYSTAL WARRIOR \nSKILL 10 \nSTAMINA 11 \n If you are using any other kind of weapon, the Crystal Warrior is unharmed. You realize that you need a blunt weapon to wound it. Conduct the rest of the combat using the pommel of your sword, deducing  2 points from your ATTACK Strength.",
      choices : [
  {
    option  : "You win",
    command : "page\t99",
  },
      ],
    };

book['170'] = {
      text   : "You scramble behind a high-backed chair in the hallway, dousing your hand-lamp as you do so. You are barely under cover when a barely-eyed servant opens the door beneath the landing, holding a huge black dog which strains against its chain. The dog is growling unpleasantly, and you hope it doesn’t notice you. That armour again, you hear the servant mutter. ‘Well, I am not putting it back together tonight - it’ll have to wait till the morning. Come on, you stupid dog, stop your growling, there’s nothing here. With that, he drags the dog back through the doors, and all is quiet again. You decide not try the servants’ quarters tonight - for one thing, you don’t want to meet that dog! - so you slip quietly up the stairs. ",
      choices : [
  {
    option  : "Continue",
    command : "page\t368",
  },
      ],
    };

book['171'] = {
      text   : "The Ghoul prepares to strike again, and you instinctively raise your sword to parry the blow. Or rather, you don’t. You find yourself paralyzed, and unable to move. You try to run away, to scream for help, but your body simply doesn’t respond. The creature now has two bodies to feast upon, and there’s nothing you can do to prevent it. Your adventure ends here, along with your life.",
      choices : [],
    };

book['172'] = {
      text   : "You hold your breath and charge the door. Roll two dice.",
      choices : [
  {
    option  : "Result is equal to your SKILL score or less",
    command : "page\t190",
  },
  {
    option  : "Result is higher than your SKILL score",
    command : "page\t107",
  },
      ],
    };

book['173'] = {
      text   : "Roll two dice.",
      choices : [
  {
    option  : "Result is equal to your SKILL score or less",
    command : "page\t17",
  },
  {
    option  : "Result is higher than your SKILL score",
    command : "page\t356",
  },
      ],
    };

book['174'] = {
      text   : "You avert your eyes just in time, and leave hurriedly.",
      choices : [
  {
    option  : "Follow the passage",
    command : "page\t252",
  },
      ],
    };

book['175'] = {
      text   : "Taloned feet slam into your back, and you are lifted into the air. The Gargoyle carries you to its rooftop lair, and your heart sinks as you see bones glinting in the moonlight. You struggle in vain - the talons hold you fast. Your test ends here, as a meal for a Gargoyle.",
      choices : [],
    };

book['176'] = {
      text   : "As soon as your appear in the room, the dog is awake, snarling and growling as it launches itself at your throat. You must fight the dog. \n\nDOG \nSKILL 7 \nSTAMINA 7 \n The sleeping servant wakes up abruptly, and calls out for help. Soon more servants appear, armed with pokers and other improvised weapons. If you defeat the dog in under three rounds of combat, you must fight the servants. Fight them as a single enemy. \n\nSERVANTS \nSKILL 7 \nSTAMINA 9 \n",
      choices : [
  {
    option  : "Dog is not defeated under three rounds of combat",
    command : "page\t194",
  },
  {
    option  : "Fight one round against the servants",
    command : "page\t194",
  },
      ],
    };

book['177'] = {
      text   : "You make your way along Thread Street to the Field Gate, keeping to the shadows - you never know when you might meet another patrol. After a while, you come to the concert of Short Street and Field Street, when you see two houses. The one on the right is an impressive two-story stone building, and you see the symbol of an oar on a painted sign over the door. One of these is the house of Brass the merchant.  Do you know which one?",
      choices : [
  {
    option  : "Try the house on the right",
    command : "page\t384",
  },
  {
    option  : "Try the house on the left",
    command : "page\t32",
  },
      ],
    };

book['178'] = {
      text   : "You finally come to a small chamber, carved out of the bedrock and devoid of ornament except for the occasional patch of bluish green mould growing on the walls and ceiling. In the middle of the chamber there’s a chest on the floor, flanked by two statues of armed warriors, apparently carved from some kind of translucent crystal. On the other side of the room is a door. As you approach the chest, one of the crystal statues starts to move. It draws a slim, needle-like sword of crystal, and steps between you and the chest. You must fight the Crystal Warrior. \n\nCRYSTAL WARRIOR \nSKILL 10 \nSTAMINA 13 \n",
      choices : [
  {
    option  : "Win a round of combat",
    command : "page\t169",
  },
      ],
    };

book['179'] = {
      text   : "You shrink into the shadows, hardly daring to breathe. As your eyes become accustomed to the light, you see a dark shape in a chair - the source of breathing. Also in the room is a long table, and there’s a door at the far end.",
      choices : [
  {
    option  : "Investigate the dark form",
    command : "page\t298",
  },
  {
    option  : "Leave through the far door",
    command : "page\t350",
  },
      ],
    };

book['180'] = {
      text   : "Your weapon glances off the Gargoyle’s magical hide with a stony clink - there is no way you can harm it without a magical weapon. You lunge for the skylight, trying to avoid the Gargoyle’s claws. Roll Attack Strengths for yourself and the Gargoyle.",
      choices : [
  {
    option  : "The Gargoyle wins, you lose 2 STAMINA points",
    command : "page\t243",
  },
  {
    option  : "You win, neither side loses STAMINA, and you escape through the skylight",
    command : "page\t354",
  },
      ],
    };

book['181'] = {
      text   : "You look carefully around the walls, and suddenly realize that the brick on which the symbol is scratched is loose. Pulling the brick out of the wall, you find a small lever. The door swings open with a click as you push the lever down, and closes behind you as you go back into the study. What will you do now?",
      choices : [
  {
    option  : "Examine the desk",
    command : "page\t90",
  },
  {
    option  : "Leave the Merchants’ Guild stealthily and search for clues in Brass’s house (if you haven’t been there before)",
    command : "page\t156",
  },
  {
    option  : "Set out in search of the Eye of the Basilisk without looking for any more information",
    command : "page\t144",
  },
      ],
    };

book['182'] = {
      text   : "You see that the disc is resting on a fine silver wire which runs out of the chest and  connects to the ankle of the second Crystal Warrior. What will you do? ",
      choices : [
  {
    option  : "Cut the wire",
    command : "page\t41",
  },
  {
    option  : "Try to lift the disc without setting off the trap (if you have PICK POCKET skill)",
    command : "page\t208",
  },
  {
    option  : "Try to lift the disc without setting off the trap (Without PICK POCKET skill)",
    command : "page\t49",
  },
  {
    option  : "Leave it alone and go to the door",
    command : "page\t316",
  },
      ],
    };

book['183'] = {
      text   : "Your weapon strikes the Wood Golem with a thunk, and appears to wound it - you were afraid that it might be vulnerable only to magic. Continue to fight the Wood Golem. \n\nWOOD GOLEM \nSKILL 8 \nSTAMINA 4 \n",
      choices : [
  {
    option  : "You win",
    command : "page\t136",
  },
      ],
    };

book['184'] = {
      text   : "Using all your training, yo spot a slight depression in one wall where you get out of the torchlight, and dive for it. You flatten yourself against the rock as if you are part of it, and as soon as you are out of the torchlight, the shadow disappears. You have solved the problem temporarily, but what will you do now? As soon as you step back into the light, you shadow will reappear. You think carefully. If you can somehow douse the torch on the wall, there will be no light to cast a shadow. You daren’t risk casting a shadow, so you can’t simply  walk up to it and put it out. Your only option is to throw your weapon at it,  in the hope of knocking it out of its bracket. One the other hand, you might be able to use the torch you are carrying in order to disrupt the shadow cast by the torch on the wall. What will you do? If you try to douse the torch on the wall, roll two dice. Don’t forget to cross the weapon off your Adventure Sheet.",
      choices : [
  {
    option  : "You try to douse the torch, dice result is equal to your SKILL score or less",
    command : "page\t5",
  },
  {
    option  : "You try to douse the torch, dice result is higher than SKILL score",
    command : "page\t249",
  },
  {
    option  : "Try to disrupt the shadow with torch you are carrying",
    command : "page\t67",
  },
      ],
    };

book['185'] = {
      text   : "Slowly, painfully slowly, you lift the chain off Brass’s chest, break it, and take the key. Brass  does not stir. Make a note of the key on your Adventure Sheet - it does not count as a backpack item - and leave the room quietly. What will you do now?",
      choices : [
  {
    option  : "Try the first door across the passage",
    command : "page\t70",
  },
  {
    option  : "Try the second door across the passage",
    command : "page\t76",
  },
  {
    option  : "Go to the door at the other end of the landing",
    command : "page\t321",
  },
  {
    option  : "Leave the house quietly and go to the Merchants’ Guild, if you haven’t already done so",
    command : "page\t129",
  },
  {
    option  : "Set out in the search of the Eye of the Basilisk without looking for any further information",
    command : "page\t144",
  },
      ],
    };

book['186'] = {
      text   : "You burst through the door into a torch-lit passage, with the monster hot on your heels.",
      choices : [
  {
    option  : "Stand and fight it, now that you can see what you’re doing",
    command : "page\t334",
  },
  {
    option  : "Will you try to outrun it up the passage",
    command : "page\t252",
  },
      ],
    };

book['187'] = {
      text   : "Slipping through the door, you find yourself in an office of some kind. It is richly furnished, and across the deep carpet there’s a large desk placed against one wall. A rapid search of the desk turns up some papers, which tell you that the office belongs to one Silas Whitebait.  It’s not the office you are looking for. What will you you?",
      choices : [
  {
    option  : "Try the office across the passage, the one with the coin symbol",
    command : "page\t3",
  },
  {
    option  : "Leave the Merchants’ Guild stealthily and search for the clues in Brass’s house, if you haven’t been there before",
    command : "page\t156",
  },
  {
    option  : "Set out in search of the Eve of the Basilisk without looking for any more information",
    command : "page\t144",
  },
      ],
    };

book['188'] = {
      text   : "You dodge past the guardsmen, and run off into the night. You can hear the sound of their booted feet close behind you, but you twisted and turn of their booted feet close  behind you, but you twist and turn through a succession of alleys and back-streets until you are sure that you have lost them.",
      choices : [
  {
    option  : "Make sure that they are no longer  following you and carry on",
    command : "page\t177",
  },
      ],
    };

book['189'] = {
      text   : "You head for the door, but before you reached it you step on something under the carpet. There’s loud click.",
      choices : [
  {
    option  : "Continue",
    command : "page\t106",
  },
      ],
    };

book['190'] = {
      text   : "You hurl yourself against the door, and instantly the air is filled with a dense mustard- colored cloud of spores. The door swings open, though, and you half-fall through the doorway into a small chamber, not stopping to breath until you are well clear of the spore-cloud.",
      choices : [
  {
    option  : "Continue",
    command : "page\t69",
  },
      ],
    };

book['191'] = {
      text   : "You follow the passage onwards. After a little way, it broadens out and becomes more regular. The walls are made of stone slabs rather than being hewn out of the rock. You turn a corner, and find a dead body in the passage- another thief, by the look of things. A trail of blood indicates that he called back along the passage after being seriously wounded. You notice a symbol sketched on the floor in the thief’s blood; he must have put it there as he lay dying, to warn anyone who came after him.",
      choices : [
  {
    option  : "Use SECRET SIGNS skill",
    command : "page\t39",
  },
  {
    option  : "You do not have the skill",
    command : "page\t231",
  },
      ],
    };

book['192'] = {
      text   : "You run off the passage, leaving the shambling Corpse behind you. You have hardly gone five paces before you hear the Corpse drop to the ground and a streak of blue light slams into your back, knocking you to the ground- lose 2 STAMINA points, 1 SKILL point and 1 LUKC point. The spectral glowing head bangs in the air before you, chuckling evilly. It is a Possessor Spirit, and you have no option but to fight it.",
      choices : [
  {
    option  : "You have a magic weapon",
    command : "page\t142",
  },
  {
    option  : "You do not have a magic weapon",
    command : "page\t111",
  },
      ],
    };

book['193'] = {
      text   : "Hardly daring to breathe, you freeze, willing yourself to melt into the shadows.",
      choices : [
  {
    option  : "You have HIDE skill, after a few seconds - they seem like hours - the snoring starts again. Carry on carefuly into the room",
    command : "page\t396",
  },
  {
    option  : "You do not have the skill",
    command : "page\t261",
  },
      ],
    };

book['194'] = {
      text   : "You keep fighting for as long as you can, but eventually the weight of numbers gets the better of you. Everything goes back as something - it feels like a cannonball - crashed into the back of your head. When you wake up, it is daylight. You have a lump the size of a Gryphon’s egg on your head , and the daylight hurts your eyes. You are in a cell, chained to the wall, and all your equipment is gone. Your adventure ends here, and your life probably doesn’t have too much longer to run. Capture thieves get very short shift from the authorities of Port Blacksand.",
      choices : [],
    };

book['195'] = {
      text   : "You ask Bald Morri if he knows anything about Brass. ‘Certainly,’ he says with a wink. ‘what’s it worth?’ Are you prepared to pay for information? If you pay for information, decide how many gold pieces you will offer, then roll one die. Don’t forget to cross the gold you spend off your Adventure Sheet.",
      choices : [
  {
    option  : "You decide not to pay for information, then you go play pin-finger",
    command : "page\t278",
  },
  {
    option  : "Leave the tavern to try your luck elsewhere",
    command : "page\t203",
  },
  {
    option  : "You decide to pay for information, result of the die is equal to or less than the number of gold pieces you offer",
    command : "page\t66",
  },
      ],
    };

book['196'] = {
      text   : "The rest of the Footpads turn and run- they’re used to easier prey. A rapid search turns up a short sword (you can use this to replace your weapon if it was broken earlier), a chair-leg, two lengths of heavy chain, and a total of 5 gold pieces, plus the rags which footpads tie round their feet, If you take the rags and tie them round your own feet, your footsteps are muffled just as if you had SNEAK skill- make a note of the skill on your Adventure Sheet. If you already have SNEAK skill, they have no effect. Made a note of what you take - everything except the rags and the money counts as a backpack item.",
      choices : [
  {
    option  : "Continue",
    command : "page\t386",
  },
      ],
    };

book['197'] = {
      text   : "You reach cautiously for the doorknob, and manage to get a three-fingered grip on it without disturbing the mould. Slowly, painfully slowly, you begin to turn it, praying that the door isn’t locked. There’s a slight click, and the door shifts a fraction. Holding your breath, you throw the door open and run through the dense mustard-coloured cloud of spores that suddenly fills the air, and into a small chamber. You don’t stop to breathe until you are well clear of the spore-cloud. ",
      choices : [
  {
    option  : "Continue",
    command : "page\t69",
  },
      ],
    };

book['198'] = {
      text   : "The slab is big. It’s sort of thing you’re meant to notice. And while you’re looking at it, you’re not looking at the real way in, which is hidden somewhere else. It’s an old trick, but you wonder if it's being used here. You search the end of the passage, and finally you find a loose stone in the right-hand wall. You pull it out. Then another, and another. In no time, you have made a hole big enough to crawl through.",
      choices : [
  {
    option  : "Continue",
    command : "page\t150",
  },
      ],
    };

book['199'] = {
      text   : "Your finger is painfully cut: lose 1 SKILL point and 1 STAMINA point. You have lost the game, and the men insist that you pay up. Do you have 5 gold pieces? Don't forget to cross the gold pieces off your Adventure Sheet.",
      choices : [
  {
    option  : "You have the money",
    command : "page\t227",
  },
  {
    option  : "You do not have the money",
    command : "page\t112",
  },
      ],
    };

book['200'] = {
      text   : "As the light floors the room, you see the monster clearly for the first time: a large, golden-brown lizard. Its huge yellow eyes focus on you, and you realize that it’s a Basilisk, whose gaze is deadly. Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t174",
  },
  {
    option  : "You are Unlucky",
    command : "page\t65",
  },
      ],
    };

book['201'] = {
      text   : "Rather than risk raising the alarm, you back quietly out of the room. What will you do now?",
      choices : [
  {
    option  : "Listen at the next door",
    command : "page\t76",
  },
  {
    option  : "Listen at the door across the passage",
    command : "page\t277",
  },
  {
    option  : "Try the door at the other end of the landing",
    command : "page\t321",
  },
  {
    option  : "You leave the house and ry to find the Eye of the Basilisk, if you think you have enough information",
    command : "page\t144",
  },
  {
    option  : "You can look for more information in the Merchants’ Guild ,if you haven’t been there before",
    command : "page\t129",
  },
      ],
    };

book['202'] = {
      text   : "You put the key in one lock, and begin to turn it. Suddenly, tiny snake shoots out of the other lock and buries its fangs in your hand. Lose 4 STAMINA points to its poisonous bite. Choose what to do if you are still alive.",
      choices : [
  {
    option  : "Search the desk, if you haven’t already done so",
    command : "page\t143",
  },
  {
    option  : "Leave the room via the window",
    command : "page\t306",
  },
  {
    option  : "Leave via the door and investigate the doors at the other end of the landing",
    command : "page\t325",
  },
      ],
    };

book['203'] = {
      text   : "As you make your way along the Noose, you think about likely places for picking up information. At the edge of the Noose is a tavern called the Rat and Ferret, where thieves, beggars and all sorts of people come to drink. The Noose is always filled with beggars, at any time of the day or night, and they see and hear all sorts of things. And on one side of Noose lives Madame Star, the clairvoyant. She spends her days in the Market Square telling fortunes, but at this time of night she would be at home. What will you do?",
      choices : [
  {
    option  : "Go to the Rat and Ferret",
    command : "page\t309",
  },
  {
    option  : "Try to find a beggar",
    command : "page\t26",
  },
  {
    option  : "Visit Madame Star",
    command : "page\t117",
  },
  {
    option  : "Leave the Noose",
    command : "page\t387",
  },
      ],
    };

book['204'] = {
      text   : "You scoop up a handful of the black ashes and cinders. To your amazement, they are still hot even though the house burnt down decades ago! Before you drop them, the ashes have burnt through your glove and seared the palm of your hand - lose 1 SKILL point and 1 STAMINA point. You leave the site of the house hurriedly and go to look at the statue.",
      choices : [
  {
    option  : "Continue",
    command : "page\t301",
  },
      ],
    };

book['205'] = {
      text   : "Your blow hits the guard just behind one ear, and he crumples to the ground unconscious. You pick him up and prop him in the doorway, so it looks as if he is still awake. As you do so, you noticed a symbol scratched into the door-frame.",
      choices : [
  {
    option  : "You have SECRET SIGNS skill",
    command : "page\t93",
  },
  {
    option  : "You do not have the skill",
    command : "page\t262",
  },
      ],
    };

book['206'] = {
      text   : "You can’t find any way into the barrow; perhaps the Eye of the Basilisk is hidden somewhere else.",
      choices : [
  {
    option  : "Look around the rest of the garden",
    command : "page\t77",
  },
      ],
    };

book['207'] = {
      text   : "You throw yourself to one side as the Giant Spider crashes to the cavern floor, and barely have time to roll back to your feet before it is upon you. Fight the Giant Spider normally. \n\nGIANT SPIDER \nSKILL 7 \nSTAMINA 8 \n",
      choices : [
  {
    option  : "You lose a round of combat, lose 2 STAMINA points",
    command : "page\t285",
  },
  {
    option  : "You kill the Giant Spider without losing a single round of combat",
    command : "page\t353",
  },
      ],
    };

book['208'] = {
      text   : "Painfully slowly, you lift the disc off the silver wire. Nothing happens, and you breather a sigh of relief. Note the obsidian disc on your Adventure Sheet - it counts as a backpack item.",
      choices : [
  {
    option  : "Turn back",
    command : "page\t316",
  },
      ],
    };

book['209'] = {
      text   : "Clutching at empty air, you fall head long to the alley below. Lose 3 STAMINA points.",
      choices : [
  {
    option  : "You are still alive, go back and rethink your choice",
    command : "page\t386",
  },
      ],
    };

book['210'] = {
      text   : "Your follow the alley along one side of the Merchants’ Guild. After a few yards it turns right sharply, and a few feet after you see an even narrower alley running off to your left, coming to a dead end after a few yards, with a door on the left and a drainpipe leading up past a window to the roof.",
      choices : [
  {
    option  : "You go down the alley to your left",
    command : "page\t271",
  },
      ],
    };

book['211'] = {
      text   : "You pick the lock quickly and quietly, and swing the door open. If creaks softly on its hinges, but not loudly enough to wake anyone. By the light of your hand-lamp, you can see that you are in a hallway. There’s a small table against one wall, with a piece of paper resting on a tray. And at the are end of the hall is a door. Near the door is a coal-stand, and a black hooded cloak hangs on it. If you take the cloak, you may hide as if you had HIDE skill, even if you don’t have the skill. Remember to make a note of cloak on your Adventure Sheet if you take it. It does not count as a backpack item.",
      choices : [
  {
    option  : "You examine the tray",
    command : "page\t103",
  },
  {
    option  : "You ignore it and head straight for the door",
    command : "page\t318",
  },
      ],
    };

book['212'] = {
      text   : "You search the chamber throughly, but you can’t find any hiding-place where the gem might be, or any way out except the way you came in. Defeated, you trudge back to the Thieves’ Guild to report that you have failed the test. Your adventure ends here.",
      choices : [],
    };

book['213'] = {
      text   : "You notice a strand of web - if that’s the right word for a sticky rope the thickness of a ship’s cable which the Giant Spider must have dragged down form the ceiling when it attacked you. You give it a bug, and it seems to be firm, so t=you begin to climb it. As you climb, you realize that the cavern is really a huge vertical shaft, and soon you reach the main part of the Spider’s web, which is strung right across the shaft. You shudder as you notice several silk-wrapped packages hanging in the web - about the right size and shape to be human bodies. Others before you were not so lucky.",
      choices : [
  {
    option  : "You investigate the bodies",
    command : "page\t290",
  },
  {
    option  : "You carry on climbing",
    command : "page\t341",
  },
      ],
    };

book['214'] = {
      text   : "You keep the disc steady as you reach in the beneath it to take the gem. Withdrawing the disc from the light, you hold the gem in both hands - you can hardly believe that you have passed the test. Then you look at the gem more closely, and your heart sinks. There is a crack in one side, and a small bubble in the middle. The gem is a fake -a worthless piece of glass!",
      choices : [
  {
    option  : "Continue",
    command : "page\t400",
  },
      ],
    };

book['215'] = {
      text   : "You flatten yourself against the wooden railing of the balcony and stay very still. The figure gives no sign of having seen you, and walks past, the hem of his robe brushing your face. He goes to the end of the landing, turns round, and goes back into the room he came out of - the first on the right. Add 1 LUCK point for not panicking. If you had done anything to waken the sleepwalker, his screams could have woken the whole house. You wait for a couple of minutes, to give him time to get back into bed and settle into deep sleep, and then you creep across the balcony.",
      choices : [
  {
    option  : "Continue",
    command : "page\t325",
  },
      ],
    };

book['216'] = {
      text   : "Bracing your hands and feet against one side of the shaft and your back against the order, you work your way carefully downwards. After about forty feet, the shaft opens out into the ceiling of a passage, and you drop cautiously to the floor.",
      choices : [
  {
    option  : "Continue",
    command : "page\t263",
  },
      ],
    };

book['217'] = {
      text   : "Morri sees that you don’t understand the symbol, and hurriedly wipes it out with his hand. He turns his back on you, and begins to clean some mugs very busily. You try to attack his attention again, but he doesn’t seem to notice you. What will you do now?",
      choices : [
  {
    option  : "You join in the game of pin-finger",
    command : "page\t278",
  },
  {
    option  : "Leave the tavern and try elsewhere (by going back and choosing again)",
    command : "page\t203",
  },
      ],
    };

book['218'] = {
      text   : "The huge Footpad slumps to the ground. For a moment, the other hesitate. You take advantage of their indecision and charge forward, trying to break through them. Roll two dice.",
      choices : [
  {
    option  : "Result is equal to your SKILL score or less",
    command : "page\t244",
  },
  {
    option  : "Result is higher than your SKILL score",
    command : "page\t96",
  },
      ],
    };

book['219'] = {
      text   : "You try to hack a way through the clutching Tangle weed. Attack it like any normal opponent. \n\nTANGLEWEED \nSKILL 7 \nSTAMINA 6 \n ",
      choices : [
  {
    option  : "You win, fight your way clear",
    command : "page\t248",
  },
      ],
    };

book['220'] = {
      text   : "You grope your way along the cavern walls, and finally find the entrance to the passage. You set off along the passage, not daring to light another torch until you are well clear of the cavern. After a few paces, you hear a sudden click. A shower of darts strikes you; roll one die to see how many STAMINA points you lose. You may halve this amount (rounding fractions up) if you successfully Test you Luck.",
      choices : [
  {
    option  : "You are still alive, light a torch and follow the passage onward",
    command : "page\t191",
  },
      ],
    };

book['221'] = {
      text   : "You have never seen a lock as complex as this - it must prove that you’re on the right track, but unfortunately you can’t pick the lock. You must try to take the key without getting stung by the scorpion.",
      choices : [
  {
    option  : "Use PICK POCKET skill (If you have it)",
    command : "page\t13",
  },
  {
    option  : "You do not have the skill",
    command : "page\t264",
  },
      ],
    };

book['222'] = {
      text   : "You make your way carefully across the web, but don’t notice the sticky gum glistening on one strand until it is too late. One foot is stuck fast to the web - you pull and pull, but can’t free it. What will you do now?",
      choices : [
  {
    option  : "You try to cut it free",
    command : "page\t359",
  },
  {
    option  : "Burn the web away with your torch",
    command : "page\t274",
  },
      ],
    };

book['223'] = {
      text   : "You watch the palace gate, trying to think of some way to get in. The gate is heavily guarded, with guards both on the ground and atop the battlemented parapets. It’s not going to be easy to get into the palace. What will you do?",
      choices : [
  {
    option  : "You attack the guards and hope that the element of surprise will work in your favour",
    command : "page\t36",
  },
  {
    option  : "You give up on the palace and look for the Eye of the Basilisk somewhere else (Turn back and choose again)",
    command : "page\t144",
  },
      ],
    };

book['224'] = {
      text   : "The guardsmen look surprised as you draw your sword. You are alone, dressed in the leather and armed only with a short sword,  while they are both armed with spears, helmeted and dressed in chainmail from neck to foot. You must fight both guardsmen together. Each round, choose one guardsman to attack, and fight him normally. The other will also attack you, so you must roll an Attack Strength against him. If your Attack Strength is higher, you have not wounded the other guardsmen, merely avoided his blow. If his Attack Strength is higher, you lose 2 STAMINA points, as normal. \n\nFIRST GUARDSMAN \nSKILL 8 \nSTAMINA 6 \n\nSECOND GUARDSMAN \nSKILL 7 \nSTAMINA 5 \n",
      choices : [
  {
    option  : "You win",
    command : "page\t105",
  },
  {
    option  : "You may escape during any round in which you lose no STAMINA points",
    command : "page\t188",
  },
      ],
    };

book['225'] = {
      text   : " You start to climb the drainpipe. You do not need CLIMB skill or a rope and grapnel, because the drainpipe is an easy climb. You climb to the window, but find it securely barred, so you decide to carry on to the roof. Suddenly you hear a slight grating sound above you. You look up to see that one of the decorative Gargoyles on the roof of the Merchants’ Guild has come to life! It launches itself off its perch and flies down to attack you, and you prepare to defend yourself as best you can. Deduct 3 from your Attack Strength because you are clinging to the drainpipe. \n\n GARGOYLE \N SKILL 9 \NSTAMINA 10 \N",
      choices : [
  {
    option  : "You win the first round",
    command : "page\t319",
  },
  {
    option  : "Gargoyle wins, lose 2 STAMINA points and roll two dice, if the result is equal to your SKILL score or less",
    command : "page\t365",
  },
  {
    option  : "The die result is higher than your SKILL score",
    command : "page\t389",
  },
      ],
    };

book['226'] = {
      text   : "You haul yourself carefully over the glass-studded top of the wall and on to the road of the Merchants’ Guild. Exploring the roof cautiously, you find a skylight leading down into the building. As you crouch over it, you see movement on the other side of the roof; one of the Gargoyles, which decorate the building, has come to life, and is bounding across the roof towards you. You have a fraction of a second in which to make a decision.",
      choices : [
  {
    option  : "You stand and fight the Gargoyle",
    command : "page\t395",
  },
  {
    option  : "You slap through the skylight, hoping that it isn’t trapped",
    command : "page\t354",
  },
      ],
    };

book['227'] = {
      text   : "Nursing your cut finger, you try to ask the men if they know anything about Brass. The merchant, but they resume their game among themselves, and don’t seem to be interested in anything you have to say. What will you do now?",
      choices : [
  {
    option  : "You ask Bald Morri about Brass",
    command : "page\t195",
  },
  {
    option  : "You leave the tavern and try elsewhere (Go back and choose again)",
    command : "page\t203",
  },
      ],
    };

book['228'] = {
      text   : "You cross the room towards the body of the lizard. It twitches slightly at the sound of your footsteps, and you realize that it is not quite dead. One eye flickers open a large, yellow eye - and you suddenly realize that you are looking at a Basilisk, whose gaze is deadly. Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t174",
  },
  {
    option  : "You are Unlucky",
    command : "page\t65",
  },
      ],
    };

book['229'] = {
      text   : "Before the Shapechanger can free itself from the cage, you leave the room, slamming the door behind you.",
      choices : [
  {
    option  : "Continue",
    command : "page\t155",
  },
      ],
    };

book['230'] = {
      text   : "Your attack takes the thing entirely by surprising, and it gives vent to an inhuman how of pain as your sword bites into its shoulder. As the figure turns on you, you find that you have disturbed a Ghoul from its nocturnal feast - and now it seems to have every intention of adding you to its grisly menu. You must fight the Ghoul. \n\nGHOUL \NSKILL 8 \NSTAMINA 5 \N",
      choices : [
  {
    option  : "Ghoul hits you four times",
    command : "page\t171",
  },
  {
    option  : "You win",
    command : "page\t57",
  },
      ],
    };

book['231'] = {
      text   : "You look at the symbol carefully. You think it’s one of the secret signs of the Thieves’ Guild, but you have no idea what it means. Still, you’ve fairly sure that there’s something nasty ahead, and this dead thief was trying to warn you about it. You offer a silent prayer to the God of Thieves, asking him to look after the dead thief in the next world and to look after you in this world. ",
      choices : [
  {
    option  : "Prepare to move on",
    command : "page\t302",
  },
      ],
    };

book['232'] = {
      text   : "The Gargoyle hangs in the air for an instant, struggling with its tangled wing, then it plummets to the alley below, hitting the ground with a splintering crash. You look down, and see it lying in the alley, shattered into pieces like a strong statue. You carry on to the roof, and slip through a skylight. ",
      choices : [
  {
    option  : "Continue",
    command : "page\t354",
  },
      ],
    };

book['233'] = {
      text   : "The two Skeletons come forward to meet you. You must fight them both together. Choose one Skeleton,  fight it normally, but generate an Attack Strength against the other as well. If your Attack Strength is higher, you have not wounded the second Skeleton, merely avoided its blow. If the Skeleton’s Attack Strength is higher, of course, you lose 2 STAMINA points as normal. Once the first Skeleton is destroyed, fight the second normally. \n\nFIRST SKELETON \NSKILL 6 \NSTAMINA 5 \N\NSECOND SKELETON \NSKILL 5 \NSTAMINA 4\N",
      choices : [
  {
    option  : "You win",
    command : "page\t31",
  },
      ],
    };

book['234'] = {
      text   : "The two Skeletons come forward to meet you. You must fight them both together. Choose one Skeleton,  fight it normally, but generate an Attack Strength against the other as well. If your Attack Strength is higher, you have not wounded the second Skeleton, merely avoided its blow. If the Skeleton’s Attack Strength is higher, of course, you lose 2 STAMINA points as normal. Once the first Skeleton is destroyed, fight the second normally. \n\nFIRST SKELETON \NSKILL 6 \NSTAMINA 5 \N\NSECOND SKELETON \NSKILL 5 \NSTAMINA 4\N",
      choices : [
  {
    option  : "Go to the Rat and Ferret (if you haven’t already)",
    command : "page\t309",
  },
  {
    option  : "Go to see Madame Star (if you haven’t already)",
    command : "page\t117",
  },
  {
    option  : "You can leave the Noose and try elsewhere",
    command : "page\t387",
  },

      ],
    };

book['235'] = {
      text   : "The Giant Spider’s bite is poisonous, but you resist the worst of its efforts. Lose 1 SKILL point.",
      choices : [
  {
    option  : "Go back and carry on fighting",
    command : "page\t304",
  },
      ],
    };

book['236'] = {
      text   : "The passage is roughly carved out of the bedrock and leads away to the north. You follow it for a few yards, and find that it ends in a large and strong looking door. You try the door, and find that it is not locked. You open the door quietly, and advance into a darkened room.  Your torch does nothing to dispel the darkness room, only the heat on your face tells you that it is still burning. The darkness must be magical. You hear a shuffling, slithering sound from the darkness.",
      choices : [
  {
    option  : "Advance into the room",
    command : "page\t352",
  },
  {
    option  : "Go back",
    command : "page\t161",
  },
      ],
    };

book['237'] = {
      text   : "The shadowy figure becomes insubstantial, and finally disappears. You feel strange, casting no shadow, but don’t pause to think about it as you hurry out of the cavern.",
      choices : [
  {
    option  : "Use SPOT HIDDEN skill if you have it",
    command : "page\t381",
  },
  {
    option  : "You do not have the skill",
    command : "page\t27",
  },
      ],
    };

book['238'] = {
      text   : "You climb rapidly, and reach the level of the first-floor windows in less than a minute. The first thing you notice is that all the windows are covered by stout iron grills, to prevent thieves like you breaking in. Ever though there’s  no way in, you can still get some idea of the layout of the upper floor of the house. In front of you there’s a window looking on to a landing, you can see two doors on your left and one on your right, and one more at the far end of the landing. A window on your left looks Into a small bedroom, belonging to a young girl if the dolls on the floor are anything to go by. Finally , a window on your right looks into a larger bedroom dominated by a huge four-poster bed where a middle-aged couple lie sleeping. You climb carefully back to the alley down below, and head for the front door, which is the only way into the building.",
      choices : [
  {
    option  : "Use PICK LOCK skill if you have it to open the door",
    command : "page\t276",
  },
  {
    option  : "You do not have the skill so the door can't be opened. Look for information at the Merchants' Guild, if you haven't been there before",
    command : "page\t129",
  },
  {
    option  : "Try to find the Eye of the Basilisk using only the information that you have gained so far",
    command : "page\t144",
  },
      ],
    };

book['239'] = {
      text   : "You hurl yourself towards the wall of the shaft, and climb rapidly,  trying to escape the flames. You are barely clear of the web when it comes away from the walls and Plummer’s blazing to the cavern floor below.",
      choices : [
  {
    option  : "Continue",
    command : "page\t341",
  },
      ],
    };

book['240'] = {
      text   : "A low passage leads away from the foot of the steps, ending in a huge stone slab. You have to stoop to move along the passage. You have only gone a little way when you hear scuffing and chittering noises ahead of you. You raise your torch to see what’s there, and suddenly the air is full of small, sharptoothed bats.",
      choices : [
  {
    option  : "Use a sliver whistle if you have it",
    command : "page\t363",
  },
  {
    option  : "You do not have it",
    command : "page\t280",
  },
      ],
    };

book['241'] = {
      text   : "You follow the passage for a little way before it. Opens out into a small chamber, apparently once a storeroom of some kind, as it is littered with all kinds of debris. As you move cautiously across the chamber, you are struck down from behind by a flying chair -lose 1 STAMINA point. The chair flies at you again as you pick yourself up. Test your luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t355",
  },
  {
    option  : "You are Unlucky",
    command : "page\t282",
  },
      ],
    };

book['242'] = {
      text   : "You search the study rapidly, and turn up the following items of interest; a bottle of excellent brandy, worth 1 gold piece, or you can take up to three drinks from it, catch drink restoring 2 STAMINA points; and a miniature painting in a silver frame, worth 2 gold pieces. If you pick up either of these, remember to note them on your Adventure Sheet. You have also discovered that a safe is hidden in the wall behind the portrait of Brass. What will you do now?",
      choices : [
  {
    option  : "Search the desk",
    command : "page\t143",
  },
  {
    option  : "Investigate the safe",
    command : "page\t104",
  },
  {
    option  : "Leave the room and try the other end of the landing",
    command : "page\t325",
  },
  {
    option  : "Leave the house through the study window",
    command : "page\t306",
  },
      ],
    };

book['243'] = {
      text   : "Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t354",
  },
  {
    option  : "You are Unlucky",
    command : "page\t175",
  },
      ],
    };

book['244'] = {
      text   : "You lash out as you charge, and one of the Footpads gives ground. You dive through the gap in their line, and run off before they can do anything to stop you. You twist and turn through back-streets and alleys to make sure that they aren’t following you, then double back to the Merchants’ Guild.",
      choices : [
  {
    option  : "Continue",
    command : "page\t386",
  },
      ],
    };

book['245'] = {
      text   : "You fumble with the rock, but to no avail. The slithering sound comes closer: the thing has heard you. You only hope is to break the door down before the monster, whatever it is, reaches you. You hurl yourself against the door. Roll two dice. If you do not manage to break down the door, lose 1 STAMINA point for a bruised shoulder. The monster is upon you now, and you must fight it. Subtract 2 form your Attack Strength during this combat, as you are fighting in the dark.\n\nUNSEEN MONSTER \nSKILL 5 \nSTAMINA 8\n If you win, you may continue trying to break down the door, using the same procedure as before. Keep trying until you break down the door or die in the attempt.",
      choices : [
  {
    option  : "If the die result is equal to your SKILL score or less, you manage to break down the door",
    command : "page\t186",
  },
  {
    option  : "You win against the monster, succeed in breaking down the door right after",
    command : "page\t324",
  },
      ],
    };

book['246'] = {
      text   : "You cross the square to the Merchants’ Guild. It is an imposing building , built in stone and several storeys high. Facing on to the square is the great main door, set into a deep doorway and made, so you have heard, of hardwood important from the far south, even beyond the Desert of Skulls. From the shadows, you can see that the door is closed. It is manned by a single armed guard, who does not appear to have noticed you. What will you do?",
      choices : [
  {
    option  : "Hide and watch the guard",
    command : "page\t74",
  },
  {
    option  : "Try to bribe the guard",
    command : "page\t345",
  },
  {
    option  : "Look for another way in",
    command : "page\t210",
  },
      ],
    };

book['247'] = {
      text   : "The potion restores your SKILL score to its Initial level. Change your Adventure Sheet accordingly.",
      choices : [
  {
    option  : "Go back",
    command : "page\t323",
  },
      ],
    };

book['248'] = {
      text   : "You reach the site of the house. They say that the house that once stood here was huge - almost a palace - and solidly built. No sign of it remains now. No ruins are left, just a blackened patch of melted, distorted earth and ash. You can’t see any places here where a gem might be hidden, what will you do?",
      choices : [
  {
    option  : "Search among the ashes",
    command : "page\t204",
  },
  {
    option  : "Go and look at the statue",
    command : "page\t301",
  },
      ],
    };

book['249'] = {
      text   : "You hurl your weapon at the torch, but it glances off the bracket without dislodging it. What will you do now?",
      choices : [
  {
    option  : "You fight your own shadow (subtract 3 SKILL points if you have no other weapon to fight with.)",
    command : "page\t11",
  },
  {
    option  : "You run out of the cavern as fast as you can",
    command : "page\t154",
  },
      ],
    };

book['250'] = {
      text   : "You lift your foot from the burning web, and hurriedly smother the flames: if the whole web were to go up in flames , you would be in deep trouble. Being careful to avoid any more sticky strands, you make your way cautiously to the nearest of the bodies.",
      choices : [
  {
    option  : "Continue",
    command : "page\t382",
  },
      ],
    };

book['251'] = {
      text   : "The guard looks at your money, his eyes narrowed. Then he takes it with a soft chuckle. ‘Fool’, he says as he moves to attack you. Lose 1 LUCK point for meeting a guard who is too corrupt even to stay bribed.",
      choices : [
  {
    option  : "Now you must fight the guard.",
    command : "page\t131",
  },
      ],
    };

book['252'] = {
      text   : "You follow the passage for what seems like miles as it winds onward. Finally, you see a light in the distance and, approaching cautiously, you can see that the passage opens out into a cavern, which is empty except for a lightened torch which hangs in an iron bracket on one wall. On the far side of the cavern, another passage leads off into the darkness. You cast a long shadow in the torchlight as you cross the cavern - it seems to move with a life of its own, but you tell yourself that it’s only your imagination. But you are wrong. Before you can reach the other side of cavern, your shadow dances along the wall in front of you, and suddenly climbs down off the wall, becoming a solid, shadowy being as it moves to attack you.",
      choices : [
  {
    option  : "You fight your own shadow",
    command : "page\t11",
  },
  {
    option  : "Trying to run away before it can attack you",
    command : "page\t154",
  },
  {
    option  : "Trying to douse the torch",
    command : "page\t373",
  },
  {
    option  : "You fight your own shadow",
    command : "page\t85",
  },
  {
    option  : "You fight your own shadow",
    command : "page\t113",
  },
      ],
    };

book['253'] = {
      text   : "You recognize the symbol as one of the secret signs go the Thieves Guild. Bald Morri is trying to find out whether you are a member of the Guild. You dip your finger in your ale, and sketch another secret sign on the bar. Morri looks at it for an instant, then rubs with signs out with his hand. He leans over the bar towards you. ‘Difficult, that house,’ he whispers. The lock on the safe has never been picked. It needs two keys, and Brass always keeps one with him, even in bed!  With that, he ducks back behind the bar and begins to clean some mugs very busily. You try to ask if he knows any more, but he doesn’t seem to hear you. What will you do now?",
      choices : [
  {
    option  : "You join in the game of pin-finger",
    command : "page\t278",
  },
  {
    option  : "You leave the Rat and Ferret and try elsewhere (Go back and choose again)",
    command : "page\t203",
  },
      ],
    };

book['254'] = {
      text   : "You throw yourself behind a high-backed  chair, just as the door beneath the landing opens and a bleary-eyed servant comes out with a huge dog on a chain. He sees the ruins of the suit of armour, and then looks around the hallway. The dog growls savagely, pulling him over towards you. ‘Found something, have you?’ He says to the dog. ‘Go on, then.’ ‘with that, he lets the dog off its chain, and it flies across the hallway towards you. You must fight the dog.’ \n\nDOG \nSKILL 7 \nSTAMINA 7 \n While you are fighting the dog, more servants come out of the door. If you kill the dog inside three rounds, you must fight the servants. Fight them as a single enemy: \n\nSERVANTS \nSKILL 7 \nSTAMINA 9 \n",
      choices : [
  {
    option  : "Fight three rounds of combat against the dog",
    command : "page\t194",
  },
  {
    option  : "You defeated the dog, now fight one round of combat against the servants",
    command : "page\t194",
  },
      ],
    };

book['255'] = {
      text   : "You open the door quietly, and slip through the doorway. You find yourself in a small room with a fire burning in a stone hearth at the far end. There’s a man asleep in a chair by the fire, and a large black dog sleeping on the hearthrug.",
      choices : [
  {
    option  : "You have SNEAK skill",
    command : "page\t95",
  },
  {
    option  : "You do not have the skill",
    command : "page\t176",
  },
      ],
    };

book['256'] = {
      text   : "As you creep up the sleeping Ogre, you accidentally kick a pebble, which rattles down the passage and hits the Ogre. It twitches and begins to stir. What will you do now?",
      choices : [
  {
    option  : "Attack",
    command : "page\t37",
  },
    {
    option  : "Hide only if you have HIDE skill",
    command : "page\t114",
  },
      ],
  };

book['257'] = {
      text   : "Your hand clutches at the top of the wall, and is painfully cut by the fragments of glass which are set there to deter burglars. Lose 1 SKILL point and 1 STAMINA point.",
      choices : [
   {
    option  : "Continue",
    command : "page\t226",
   }
     ],
    };

book['258'] = {
      text   : "You try to push past the men, but they catch hold of you and push you back against the wall, demanding that you pay what you owe them. You are in a desperate situation.",
      choices : [
  {
    option  : "You fight them",
    command : "page\t28",
  },
  {
    option  : "Offer them something else",
    command : "page\t283",
  },
      ],
  };

book['259'] = {
      text   : "The lock opens with a faint click, you slip through the doorway into a large, well-appointed office. Moonlight filters in through a barred window, and a huge and richly carved wooden desk stands against one wall, with a padded leather chair set in front of it. Across a deep, luxurious carpet, a large and strong-looking iron door is set into another wall.",
      choices : [
  {
    option  : "Search the desk",
    command : "page\t90",
  },
  {
    option  : "Examine the iron door",
    command : "page\t377",
  },
      ],
  };

book['260'] = {
      text   : "You have come to the end of your adventure. You reach out a trembling hand to take the Eye of the Basilisk.",
     choices : [
  {
    option  : "Continue",
    command : "page\t275",
  },
      ],
  };

book['261'] = {
      text   : "Brass wakes up abruptly, sits bolt upright and yells, ‘Help! Thief!’ At the top of his voice. You have no choice but to run out of the bedroom and get out of the house before he wakes everybody - you don’t fancy having to explain this to the City Guard. You hurry back to Market Square, planning your next move. It’s too dangerous to go back to Brass’s house, so you will have to do without any information that you could have gained from there. That leaves you two options.",
      choices : [
  {
    option  : "You go to the Merchants' Guild, if you haven’t already done so",
    command : "page\t129",
  },
  {
    option  : "You can hope that you have enough information to find the Eye of the Basilisk and set out in search of it",
    command : "page\t144",
  },
      ],
  };

book['262'] = {
      text   : "You can’t make out the sign, but you realize that it’s probably a warning about door. You decide to leave the door alone.",
      choices : [
  {
    option  : "Look for another way in",
    command : "page\t210",
  },
      ],
  };

book['263'] = {
      text   : "You fumble to undo the clash on your cloak, and throw it as the Gargoyle swoops towards you. Remember to cross it off your Adventure Sheet. Roll two dice.",
      choices : [
  {
    option  : "You hit the Gargoyle if the die result is equal to your SKILL score or less",
    command : "page\t232",
  },
    {
    option  : "You miss the Gargoyle if the die result is higher than your SKILL score",
    command : "page\t389",
  },
      ],
  };

book['264'] = {
      text   : "You put your hand carefully into the hole. Just as your fingertips brush the key, the scorpion comes to life suddenly, and its great sting sinks into your hand, just below your knuckles. Lose 2 STAMINA points, and test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t305",
  },
    {
    option  : "You are Unlucky",
    command : "page\t379",
  },
      ],
  };  

book['265'] = {
      text   : "As you climb, you realize that the cavern is really a wide vertical shaft, and soon you reach the Giant Spider’s web, strung right across the shaft from one side to the other. You shudder as you notice several silk-wrapped packages hanging in the web - each is about the right size and shape to be a human body.",
      choices : [
  {
    option  : "You investigate the bodies",
    command : "page\t290",
  },
    {
    option  : "Keep climbing",
    command : "page\t341",
  },
      ],
  };

book['266'] = {
      text   : "You move quietly to the door, and begin working on the lock. There is a click from the lock, and the guard snaps awake, attacking you before you have time to react. Roll two dice.",
      choices : [
  {
    option  : "The result is less or equal to your SKILL score, you dodge his first blow. Continue the combat.",
    command : "page\t131",
  },
    {
    option  : "The result is higher than your Skill score, the guard's attack takes you by surprise - lose 2 STAMINA points and continue the combat",
    command : "page\t131",
  },
      ],
  };

book['267'] = {
      text   : "You go cautiously downwards into the darkness, but fail to spot a loose flagstone a few steps down. As you put your weight on it, the stairs suddenly snap Into a glass-smooth slope, and you are thrown headlong down them and dumped painfully into a deep pit which opens up at the bottom- lose 2 STMINA points.",
      choices : [
  {
    option  : "You have CLIMB skill or a rope and grapnel, you can climb out",
    command : "page\t240",
  },
  {
    option  : "You do not have the skill, so roll two dice. If the result is equal to your SKILL score or less, you manage to climb out",
    command : "page\t240",
  },
  {
    option  : "You climb part of the way out, but fall back in against, losing 1 STAMINA point in the process; try again, and keep on trying until either you get out of the pit or die in the attempt.",
    command : "page\t268",
  },
      ],
  };

book['268'] = {
      text   : "’Is that all?’ Laughs one of the guardsmen. ‘You’ll have to do better than that! Besides, attempting to bribe the City Guard is a serious offence, so you’ll have to come along with us!’ Obviously your attempt at bribery has failed. What will you do now?",
      choices : [
  {
    option  : "Make a break for it",
    command : "page\t97",
  },
  {
    option  : "Try to escape through the door behind you (if you haven’t already tried)",
    command : "page\t149",
  },
  {
    option  : "Attack the patrol",
    command : "page\t224",
  },
      ],
  };

book['269'] = {
      text   : "You reach into the light to take the gem. As the light strikes your hand, a searching pain rips through your whole body. It is the last thing you ever feel. Your adventures ends here.",
      choices : [],
  };

book['270'] = {
      text   : "You dodge into the shadows and run away. The guard does not pursue you- obviously he doesn’t want to leave his post. You double back to the square, being careful to stay out of the guard’s  sight, and weigh up the situation. After a little thought, you decide to avoid the main door and look around the building for an unguarded entrance.",
      choices : [
  {
    option  : "Continue",
    command : "page\t210",
  },
      ],
  };

book['271'] = {
      text   : "You follow the alley to the corner, turn left, and continue walking round the building. As you pass a narrow alley on your right, you see four shapes appear in front of you.  They advance threateningly. You turn round, but three more have appeared behind you, blocking your retreat. Chuckling unpleasantly, the Footpads advance on you from both sides.",
      choices : [
  {
    option  : "You try to force your way through them",
    command : "page\t151",
  },
  {
    option  : "Stand and fight",
    command : "page\t78",
  },
  {
    option  : "You have CLIMB skill (there’s no time to use a rope and grapnel, even if you have one), you try to climb to safety ",
    command : "page\t72",
  },
      ],
  };

book['272'] = {
      text   : "You drag yourself into the shadow of a doorway, hoping that no one will notice you. The crash of the falling drainpipe has brought people to their windows all along the street, and some lean out with lanterns and candles, trying to see what has happened. ‘Look, down there.’ Cries a voice, ‘In the doorway!’ You realize that you have been spotted, you limp off down the street as fast as you can, with cries of, ‘Stop, thief!’ Ringing in the air behind you. Doubling back through a succession of dark and winding alleys to throw off any pursuit, you eventually find your way back to the Market Square, and pause to consider your position. It’s too dangerous to go back to Brass’s house, so you will have to do without any information that you could have gained from there. That leaves you two options.",
      choices : [
  {
    option  : "You go to the Merchants’ Guild, if you haven’t already done so",
    command : "page\t129",
  },
  {
    option  : "You hope that you have enough information to find the Eye of the Basilisk and set out in search of it",
    command : "page\t144",
  },
      ],
  };

book['273'] = {
      text   : "You put the key in the left-hand keyhole, and turn it slowly.",
      choices : [
  {
    option  : "You have PICK LOCK skill, you can pick the right-hand lock with your free hand",
    command : "page\t335",
  },
  {
    option  : "You do not have PICK LOCK skill",
    command : "page\t202",
  },
      ],
  };

book['274'] = {
      text   : "You hold the end of your torch carefully against strand of web. It catches light immediately, burning brightly with loud crackling sound, Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t250",
  },
  {
    option  : "You are Unlucky",
    command : "page\t394",
  },
      ],
  };

book['275'] = {
      text   : "You cheat! There is no way here except from 260, and there’s no way to 260 from anywhere else in the adventure. Go back and start again - this time without cheating.",
      choices : [
  {
    option  : "Cheater!",
    command : "page\t1",
  },
      ],
  };

book['276'] = {
      text   : "You work quickly on the lock, and after a few seconds there’s a satisfying click and the door swings open. You step inside, closing  the door softly behind you, and find yourself in an impressive marble-floored hallway. A stairway on your left leads up to a balustraded landing, and a suit of armour stands against the stairs. Beneath the landing is another door; if you experience and training are anything to go by, this door will lead to the servants’ quarters. What will you do?",
      choices : [
  {
    option  : "Go to the door beneath the landing",
    command : "page\t47",
  },
  {
    option  : "Examine the suit of armour",
    command : "page\t62",
  },
  {
    option  : "Go up the stairs",
    command : "page\t368",
  },
      ],
  };

book['277'] = {
      text   : "You listen carefully at the door, and hear loud snoring coming from within. You try the door and, finding that it is unlocked, slip inside.",
      choices : [
  {
    option  : "You have SNEAK skill",
    command : "page\t396",
  },
  {
    option  : "You don’t have SNEAK skill",
    command : "page\t138",
  },
      ],
  };

book['278'] = {
      text   : "You go over to the men who are playing pin-finger, and ask if you can join in their game. They agree readily, explaining that you must flick the point of the dagger between your fingertips as fast as you can for a full minute. If you can do this without stabbing yourself, they will pay you to gold pieces; if you fail, you must pay them 5 gold pieces.",
      choices : [
  {
    option  : "You change your mind about the game and go to talk to Bald Morri",
    command : "page\t195",
  },
  {
    option  : "Choose another option altogether",
    command : "page\t203",
  },
    {
    option  : "You still want to play, roll two dice. If the result is less than or equal to your SKILL score",
    command : "page\t14",
  },
    {
    option  : "You play, the die result is more than your SKILL score",
    command : "page\t376",
  },
      ],
  };

book['279'] = {
      text   : "You step lightly over the sleeping Ogre. It doesn’t so much as twitch.",
      choices : [
  {
    option  : "Carry on down the passage",
    command : "page\t342",
  },
      ],
  };

book['280'] = {
      text   : "Your torch has panicked the Bats, and some attack you as they mill about. Fight them as one creature, subtracting 2 points from your Attack Strength because of the cramped conditions. \n\nBATS \nSKILL 5 \nSTAMINA 12 \n",
      choices : [
  {
    option  : "You win",
    command : "page\t43",
  },
      ],
  };

book['281'] = {
      text   : "You leap forward and attack the white-clad figure with your sword. As you first blow strikes home, it gives a very human cry of pain. The young man’s eyes clear suddenly, and he screams as he sees you confronting him. You curse your luck and run downstairs. He must have been sleepwalking but he’s awake now, and his cries will soon rouse the whole household. You have no option but to run for it. You hurry back to the Market Square, planning your next move. It’s too dangerous to go back to Brass’s house. So you will have to do without any information that you could have gained from there. That leaves you two options.",
      choices : [
  {
    option  : "You go to the Merchants’ Guild, if you haven’t already done so",
    command : "page\t129",
  },
  {
    option  : "You hope that you have enough information to find the Eye of the Basilisk and set out in search of it",
    command : "page\t144",
  },
      ],
  };

book['282'] = {
      text   : "You try to dodge, but the chair hits you squarely between the shoulders- lose 1 STAMINA point.",
      choices : [
  {
    option  : "Continue",
    command : "page\t68",
  },
      ],
  };

book['283'] = {
      text   : "You offer to give the men something else to settle your debt, and they ask what you have to offer. They will take a magic potion or enough Provisions for five meals.",
      choices : [
  {
    option  : "You give them one of these items, cross it off your Adventure Sheet and leave the tavern (Choose another option)",
    command : "page\t203",
  },
  {
    option  : "You do not have either item, or do not want to give them up, you fight the men",
    command : "page\t28",
  },
  {
    option  : "You do not have either item, or do not want to give them up, try to run away",
    command : "page\t333",
  },
      ],
  };

book['284'] = {
      text   : "You know that the Eye of the Basilisk is hidden somewhere around Barrow Hill, but do you know how to get there? You should have three numbers written on your Adventure Sheet, representing three clues: one from the Noose, one from the Merchants’ Guild and one from Brass’s house. If you have all three numbers, take the first number of the clue from the house, then the first number from the Guild, and then the first number of the clue from the Noose, and put them together in that order yo give you a fourth number. For example, if the clue from the house is 123, the clue from the Guild is 234 and the clue from the Noose is 45, you get the number 124 by putting together the first number of each clue. When you have found the number, turn to that paragraph to continue the adventure. If you do not have all three clues, or if you have the wrong ones and end up at a paragraph which doesn’t make sense, you have failed your test, and must start again from paragraph 1.",
      choices : [],
  };

book['285'] = {
      text   : "The Giant Spider’s great fangs strike home. Lose 2 STAMINA points, roll two dice.",
      choices : [
  {
    option  : "The result is equal to your current STAMINA scores or less",
    command : "page\t235",
  },
  {
    option  : "The result is higher than your current STAMINA score",
    command : "page\t312",
  },
      ],
  };

book['286'] = {
      text   : "Pausing to examine the steps , you notice a loose flagstone. You prise it up, and find a small lever underneath, obviously the trigger for a trap. You avoid the trap",
      choices : [
  {
    option  : "Carry on down the steps",
    command : "page\t240",
  }
      ],
  };

book['287'] = {
      text   : "Ignoring the statue, you head straight for the site of the house, crossing what was once a lawn. You are about halfway across when you feel something tugging at your feet. Looking down, you see that the rank grass is winding itself round your boots and legs. As you pull one leg free, you see tiny flecks of blood - your blood - glistening on the blades of grass. You have just lost 3 STAMINA points. What will you do now?",
      choices : [
  {
    option  : "Attack the grass",
    command : "page\t219",
  },
  {
    option  : "Try to force your way free",
    command : "page\t371",
  }
      ],
  };

book['288'] = {
      text   : "At last the Skeleton Lord is destroyed. You pick up his sword cautiously - normally you would have trouble just lifting a weapon that size, but because of its enchantments you can handle it as easily as if it were a fencing foil. Make a note of its special ability on your Adventure Sheet: when you hit an opponent as well as the usual STAMINA loss if incurs, you add 1 point to your Attack Strength for the next round only. Strapping the sword-belt on, you search the chamber. You find an old bronze helmet (add 1 point to your SKILL if you put it on- it is not a backpack item), and a polished stone axe set in an antler half. There’s no trace of the Eye of the Basilisk, and no sign of a way out. Inspecting the plinth, you find a symbol scratched into one side.",
      choices : [
  {
    option  : "Use SECRET skill if you have it",
    command : "page\t102",
  },
  {
    option  : "You do not have the skill",
    command : "page\t52",
  }
      ],
  };

book['289'] = {
      text   : "Madame Star takes your money, and leads you into her front parlor. Showing you to a chair, she sits on the other side of a small table and gaze deeply into her crystal ball. She tells you that you are looking for something valuable, and that it is hidden in a dark place, a place of death. She says that before you find what you are looking for, you must look in a place of sleep and a place of work . There’s an important clue; make a note of the number of this paragraph on your Adventure Sheet. You thank Madame Star for her help, and leave her cottage. What will you do next?",
      choices : [
  {
    option  : "Go to the Rat and Ferret (if you haven’t already)",
    command : "page\t309",
  },
  {
    option  : "Look for a beggar (if you haven’t already)",
    command : "page\t26",
  },
  {
    option  : "Leave the Noose and look elsewhere",
    command : "page\t387",
  }
      ],
  };

book['290'] = {
      text   : "As you make your way across the web, you notice that some strands are sticky and some are not - the Spider obviously uses the non-sticky strands to retrieve prey that has been caught on the sticky ones. You must try to avoid the sticky strands as you investigate the bodies. Roll two dice - you may subtract 2 from the amount rolled if you have SPOT HIDDEN skill.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t382",
  },
  {
    option  : "The result is higher than your SKILL score",
    command : "page\t222",
  },
      ],
  };

book['291'] = {
      text   : "The beggar almost collapses with relief. ‘ I thought I’d had it there.’ He gasps. You are just wondering why the door was left unlocked, when he produces a set of lock-picks with a grin. ‘Here,’ he says, ‘that’s how I got in. You can put’ em to good use, I am sure Add 1 LUCK point for this fortunate meeting. If you take the Lock-picks make a note of them on your Adventure Sheet - they do not count as a backpack item. The lock-picks give you PICK LOCK skill if you don’t already have it; if you already have the skill, they have no effect. The only exit is a door at the far end of the room.’",
      choices : [
  {
    option  : "You thank the beggar for the lock-picks, wish him pleasant dreams, and leave.",
    command : "page\t350",
  },
      ],
  };

book['292'] = {
      text   : "What have you got that can be used to block the light?’",
      choices : [
  {
    option  : "An obsidian disc",
    command : "page\t87",
  },
  {
    option  : "A black cloak",
    command : "page\t308",
  },
  {
    option  : "Something else",
    command : "page\t397",
  },
      ],
  };

book['293'] = {
      text   : "You dodge into a shadow doorway and stay vey still. The light and the footsteps come closer; and you hardly dare to breathe as a two-man patrol from the City Guard approaches. You close your eyes and hope that they will go past without noticing you, but suddenly the light is shining straight into your face. ‘Well, now, what have we here?’ Says a grill voice,. ‘Come out of there, and state your business.’ What will you do now?",
      choices : [
  {
    option  : "Try to escape through the door behind you",
    command : "page\t149",
  },
  {
    option  : "Make a break for it",
    command : "page\t97",
  },
  {
    option  : "Attack the patrol",
    command : "page\t224",
  },
  {
    option  : "Try to bribe the patrol",
    command : "page\t327",
  },
      ],
  };

book['294'] = {
      text   : "You pull the statue round so that the archer’s arrow points at the barrow. You wait for a few moments, but nothing happens, so far as you can tell. Perhaps the arrow should be pointed somewhere else - but where?",
      choices : [
  {
    option  : "At the site of the house",
    command : "page\t346",
  },
  {
    option  : "At the standing stone by the barrow",
    command : "page\t383",
  },
      ],
  };

book['295'] = {
      text   : "There’s a loud click, and the great iron door swings open easily despite its obvious weight. Inside is a strongroom, packed with chests and boxes. You step inside to take a look.",
      choices : [
  {
    option  : "You have SPOT HIDDEN skill",
    command : "page\t21",
  },
  {
    option  : "You do not have the skill",
    command : "page\t120",
  },
      ],
  };

book['296'] = {
      text   : "You look desperately for some means of escape, but flames hem you in on all sides. After a few seconds the blazing web comes away from the walls of the shaft, and you plummet to the cavern floor below on a welter of flame. Your adventure and your life both end here.",
      choices : [],
  };

book['297'] = {
      text   : "You begin to climb down the shaft, but after a few feet a foothold crumbles and plunge headlong downwards - lose 3 STAMINA points. If you are still alive, you find yourself in another passage.",
      choices : [
  {
    option  : "Continue",
    command : "page\t236",
  },
      ],
  };

book['298'] = {
      text   : "You creep closer to the dark shape, and see that it’s a man in tattered clothes - probably a beggar -fast asleep. You smile to yourself. A beggar in the Merchants’ Guild, eh? Not a bad place to spend the night, at that.",
      choices : [
  {
    option  : "You wake him",
    command : "page\t385",
  },
  {
    option  : "You leave him alone and leave by the far door",
    command : "page\t350",
  },
      ],
  };

book['299'] = {
      text   : "A patrol from the City Guard quickly arrives on the scene. You are heavily outnumbered, and have no chance to escape before you knocked out by a blow to the head. When you wake up, you find yourself in a cell, in chains and minus all your equipment. You have failed your test, and your adventure ends here.",
      choices : [],
  };

book['300'] = {
      text   : "You go cautiously down the steps. There are no traps this time, but as you reach the bottom you hear regular heavy breathing coming from down the crudely cut rocky passage which leads off in front of you. Advancing cautiously, you see an Ogre, obviously supposed to be on guard, slumped asleep in the passage.",
      choices : [
  {
    option  : "You have SNEAK skill",
    command : "page\t279",
  },
  {
    option  : "You do not have the skill",
    command : "page\t256",
  },
      ],
  };

book['301'] = {
      text   : "As you push through the undergrowth that surrounds the statue, you realize that it is set on a plinth in the middle of a small walled pond. The statue, of an archer about to loose an arrow, is made of bronze, and is green with age. On the base of the statue is an inscription of some kind, obscured by dead leaves.",
      choices : [
  {
    option  : "You wade across the pond to read the inscription",
    command : "page\t2",
  },
  {
    option  : "Jump across",
    command : "page\t148",
  },
      ],
  };

book['302'] = {
      text   : "As you turn to move on, a glowing, almost transparent, bright blue something comes flying down the corridor at you. It looks a little like a severed human head, but you have no time to examine it closely as you throw yourself to one side. Roll two dice.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t12",
  },
  {
    option  : "The result is higher than your SKILL score",
    command : "page\t393",
  },
      ],
  };

book['303'] = {
      text   : "You look all around the slab, trying to find some means of shifting it. After a few seconds’ searching, you find a hand-size gap between the slab and the wall on one side, just the right size for a hidden catch.",
      choices : [
  {
    option  : "You feel for the catch with your hand",
    command : "page\t56",
  },
  {
    option  : "Use a dagger instead if you have one",
    command : "page\t164",
  },
      ],
  };

book['304'] = {
      text   : "You hurl yourself to one side, but too late. One of the Giant Spider’s great legs hits you, and you are hurled to the ground – lose 1 stamina POINT. The Spider is upon you before you can regain your feet, and you fend off its first attack clumsily.\n\nGIANT SPIDER \nSKILL 7 \nSTAMINA 8 \n",
      choices : [
  {
    option  : "You win the first round of combat, but you have not wounded the Giant Spider, merely fended off its attack. After this round, fight it normally. You kill the spider without losing any rounds",
    command : "page\t353",
  },
  {
    option  : "You lose the first round of combat against the spider",
    command : "page\t252",
  },
      ],
  };

book['305'] = {
      text   : "Cursing, you brush the scorpion away, crush it underfoot and take the key. It opens the lock, and the great iron door swings open.",
      choices : [
  {
    option  : "Continue",
    command : "page\t79",
  },
      ],
  };

book['306'] = {
      text   : "Quickly and quietly, you open first the bars and then the window itself, and let yourself down to the ground. You hurry through the darkened streets, leaving Brass’s house behind you. As you go, you consider what to do next.",
      choices : [
  {
    option  : "You try to find the Eye of the Basilisk, if you think you have enough information",
    command : "page\t144",
  },
  {
    option  : "You look for more information in the Merchants’ Guild, if you haven’t been there before",
    command : "page\t129",
  },
      ],
  };

book['307'] = {
      text   : "You draw your hand back to knock, but before you can do so the door flies open and an old man with a long white beard stands before you. ‘What do you want?’ he demands. What will you do?",
      choices : [
  {
    option  : "Run away and choose again",
    command : "page\t144",
  },
  {
    option  : "Push him out of the way and look for the gem",
    command : "page\t137",
  },
      ],
  };

book['308'] = {
      text   : "You take off your cloak and throw it over the gem. As soon as it enters the light, the cloak disintegrates with a flash. Cross it off your Adventure Sheet. What will you do now?",
      choices : [
  {
    option  : "Reach into the light and take the gem",
    command : "page\t269",
  },
  {
    option  : "Throw something to knock the gem out of the light",
    command : "page\t130",
  },
  {
    option  : "Try to block the light",
    command : "page\t292",
  },
  {
    option  : "If you want a clue, spend 2 LUCK points – don’t forget to adjust the score on your Adventure Sheet",
    command : "page\t338",
  },
      ],
  };

book['309'] = {
      text   : "You go into the Rat and Ferret. The bar is lit by smoky oil-lamps, and the pipes and cheroots of the inn’s customers add to the peculiarly rich atmosphere. The landlord, Bald Morri, looms behind the bar like an unfriendly mountain. At a table to one side, three disreputable-looking men are playing pin-finger, stabbing a knife into the table between their fingers faster and faster. You go to the bar and order a mug of ale. Cross 1 gold piece off your Adventurer Sheet to pay for it. What will you do now?",
      choices : [
  {
    option  : "Ask BALD Morri if he knows anything about Brass",
    command : "page\t195",
  },
  {
    option  : "Ask to join in the game of pin-finger",
    command : "page\t278",
  },
      ],
  };

book['310'] = {
      text   : "Your blow hits the guard, who stumbles but recovers quickly. Now you must fight him.\n\nGUARD  \nSKILL 6  \nSTAMINA 4 \n",
      choices : [
  {
    option  : "The fight lasts more than three rounds",
    command : "page\t299",
  },
  {
    option  : "You win within that time",
    command : "page\t337",
  },
      ],
  };

book['311'] = {
      text   : "You flatten yourself against the cavern wall, desperately trying to get out of the torchlight. As you do, however, your shadow flits across the wall behind you, and you lose 2 STAMINA, points as it attacks you from behind. What will you do now?",
      choices : [
  {
    option  : "You fight your own shadow",
    command : "page\t11",
  },
  {
    option  : "Run away from it",
    command : "page\t154",
  },
      ],
  };

book['312'] = {
      text   : "The Giant Spider prepares to attack again. You try to dodge its attack, but find yourself paralyzed by its venom, you can only wait helplessly for it to finish you off. Your adventure and your life both end here.",
      choices : [],
  };

book['313'] = {
      text   : "You raise one arm in an attempt to fend off the blow, but you are too slow. The creature’s blow thuds sickeningly into your shoulder – lose 2 STAMINA points. You find yourself staring into the snarling, hate-filled face of a Ghoul, you have disturbed it from its nocturnal feast, and now you must fight to keep yourself off the menu.\n\nGHOUL \nSKILL 8 \nSTAMINA 7 \n",
      choices : [
  {
    option  : "The Ghoul hits you three more times",
    command : "page\t171",
  },
  {
    option  : "You win",
    command : "page\t57",
  },
      ],
  };

book['314'] = {
      text   : "You look carefully around the plinth, and find a crack between the plinth and the floor on one side. It rolls back suddenly when you give it a shove, revealing a set of steps leading down into the darkness.",
      choices : [
  {
    option  : "You follow them down",
    command : "page\t300",
  },
      ],
  };

book['315'] = {
      text   : "Hardly daring to breathe, you back out of the room and close the door. You decide to give the sleepers a little time to get back into a deep sleep. What will you do in the meantime?",
      choices : [
  {
    option  : "Try the first door across the passage",
    command : "page\t70",
  },
  {
    option  : "Try the second door across the passage",
    command : "page\t76",
  },
  {
    option  : "Try the door at the other end of the landing",
    command : "page\t321",
  },
  {
    option  : "You have already visited all the rooms, you can wait and then re-enter the room you have just left",
    command : "page\t277",
  },
      ],
  };

book['316'] = {
      text   : "You go through the door into another rock-cut chamber – and find that you have reached the hiding-place of the Eye of the Basilisk! The huge yellow gem stands on a black stone pillar in the center of the chamber, and a column of light shines from an unseen source, engulfing the gem and the pillar in light from floor to ceiling. You are elated to have come to the end of your quest, but your elation is tempered by caution: there is bound to be a final trap of some kind. What will you do now?",
      choices : [
  {
    option  : "Take the gem",
    command : "page\t269",
  },
  {
    option  : "Throw something to knock it out of the light",
    command : "page\t130",
  },
  {
    option  : "Try to block the light",
    command : "page\t292",
  },
      ],
  };

book['317'] = {
      text   : "You throw yourself at the door, trying to burst through before another of the Poltergeist’s missiles hits you. The door doesn’t budge, but a portcullis comes crashing down behind you, trapping you in the alcove. You try the door again, but you realize that it is a dummy, nailed to the wall as part of the trap. You try frantically to lift the portcullis. Roll two dice. If you fail the roll, you wont be able to shift the portcullis – you are still trapped and the Poltergeist attacks once again.\n\nPOLTERGEIST \nSKILL 6 \nSTAMINA 0 \n Roll for Attack Strengths as normal, but if you win, the Poltergeist is not wounded, you have merely dodged its missile. If the Poltergeist wins, its missile hits you and you lose 1 STAMINA point. After the Poltergeist has attacked, you may attempt to escape again. Repeat this procedure until you escape from the trap or die in the attempt.",
      choices : [
  {
    option  : "The result is equal to your skill score or less, you lift the portcullis and escape",
    command : "page\t152",
  },
      ],
  };

book['318'] = {
      text   : "The door has a large keyhole, and you look through it before deciding what to do. The room beyond seems to be a kitchen, and is illuminated by the dying embers in a large fireplace set into the far wall. Infront of the fire, on the floor, is a large dark shape. It twitches as you watch, and when it rases its head and yawns you can see that it is a dog – a very big dog. You stand up, wondering what to do about it. As you think, your eye lights on a painting on the wall of the hallway. It is a portrait of a strong-looking bearded man, with a telescope under one arm. On the bottom of the frame is a small brass plaque, bearing the inscription: ‘To Captain Marlin, from the crew of the Far Trader.’ Now what would Brass be doing with a picture which obviously belongs to a Captain Marlin? You must be in the wrong house.",
      choices : [
  {
    option  : "You leave very quietly, hoping that the huge dog in the kitchen won’t hear you, and investigate the house across the street with the coin symbol cut into the door-post.",
    command : "page\t384",
  },
      ],
  };

book['319'] = {
      text   : "With a stony clink, your weapon bounces harmlessly off the Gargoyle’s magical hide. What will you do now?",
      choices : [
  {
    option  : "Use a magical weapon",
    command : "page\t158",
  },
  {
    option  : "Try some other means",
    command : "page\t73",
  },
  {
    option  : "Keep fending it off and hope for the best",
    command : "page\t389",
  },
      ],
  };

book['320'] = {
      text   : "You can find no way forward; the Eye of the Basilisk is beyond your reach. You have failed your test, and your adventure ends here.",
      choices : [],
  };

book['321'] = {
      text   : "You put your ear to the door, but hear nothing. Trying the handle, you find that the door is locked.",
      choices : [
  {
    option  : "You have PICK LOCK skill",
    command : "page\t134",
  },
  {
    option  : "You don’t, so you investigate the doors off the landing",
    command : "page\t45",
  },
  {
    option  : "You leave the house and visit the Merchants’ Guild, if you haven’t been there before",
    command : "page\t129",
  },
  {
    option  : "You can try to find the Eye of the Basilisk using only the information that you have gained so far",
    command : "page\t144",
  },
      ],
  };

book['322'] = {
      text   : "The three Dwarfs lie dead at your feet. Before you can inspect the bodies, someone leans out of a window and calls loudly for the guard.",
      choices : [
  {
    option  : "You hurry away before a patrol arrives on the scene. Choose again.",
    command : "page\t144",
  },
      ],
  };

book['323'] = {
      text   : "The possessor Spirit disappears in a shower of bright blue sparks. A rapid search of the body turns up 5 gold pieces, a throwing knife, a long piece of heavy wine with a hook at the end and a flask. The flask has been cracked in the fight, and a potion is leaking out of it – there is enough potion left for one drink, but only if you drink it now. You move onward along the passage, following the trail of blood left by the dying thief. The trail leads to a door in the left-hand wall of the passage. The door stands ajar, and you peer through the doorway into a room furnished only with a great iron cage. Locked in the cage is a Dwarf. ‘Let me out!’ he pleads. ‘I’m a thief like you! If you let me out we can look for the Eye of the Basilisk together!’",
      choices : [
  {
    option  : "You drink the potion. Record anything you take on your Adventure Sheet; only the wire counts as a backpack item.",
    command : "page\t247",
  },
  {
    option  : "You let the Dwarf out of the cage",
    command : "page\t6",
  },
  {
    option  : "You make sure he’s a thief first",
    command : "page\t86",
  },
  {
    option  : "You ignore him and carry on down the passage",
    command : "page\t155",
  },
      ],
  };

book['324'] = {
      text   : "You step through the doorway into a torch-lit passage. You shut the door quickly as you hear a scrabbling, slithering sound from the darkened room behind you. Just outside the door stands a small bottle, containing a liquid which glows very brightly – so brightly that it hurts your eyes. You wonder if it will penetrate the darkness of the room.",
      choices : [
  {
    option  : "You find out",
    command : "page\t92",
  },
  {
    option  : "You ignore the bottle and carry on up the passage",
    command : "page\t252",
  },
      ],
  };

book['325'] = {
      text   : "You cross the balcony to the landing. Three doors lead off the landing: one on the left and two on the right. At the end of the landing is a barred window. The bars are set into the brick of the windowsill, and cannot be moved. You decide to listen at one of the doors. Which one?",
      choices : [
  {
    option  : "The door on the left ",
    command : "page\t277",
  },
  {
    option  : "The first door on the right",
    command : "page\t70",
  },
  {
    option  : "The second door on the right",
    command : "page\t76",
  },
      ],
  };

book['326'] = {
      text   : "Hugging the shadows, you work your way around to the side of the building, then glide soundlessly up to the guard. He gives no sign of having noticed your approach. What will you do next?",
      choices : [
  {
    option  : "You try to knock out the guard",
    command : "page\t38",
  },
  {
    option  : "Try to open the door ",
    command : "page\t266",
  },
      ],
  };

book['327'] = {
      text   : "You mumble some excuse about being a carpenter’s apprentice on an errand, and reach into your purse. How much will you offer them? Decide how many gold pieces to offer, then roll one die.",
      choices : [
  {
    option  : "The number rolled is equal to or less than the number of gold pieces you offered, Don’t forget to cross the money off your Adventure sheet",
    command : "page\t44",
  },
  {
    option  : "The number rolled is higher than the number of gold pieces you offered, Don’t forget to cross the money off your Adventure sheet",
    command : "page\t268",
  },
      ],
  };

book['328'] = {
      text   : "With a bestial grunt, the Ogre attacks you. Fight it normally.\n\nOGRE \nskill \nSTAMINA 12 \n",
      choices : [
  {
    option  : "You win",
    command : "page\t342",
  },
      ],
  };

book['329'] = {
      text   : "As your each for the top of the wall, an arrow slams into your arm. You lose your grip, and fall headlong from the top of the wall. Your adventure ends here.",
      choices : [],
  };

book['330'] = {
      text   : "The beggar is sufficiently startled to believe you, and leaves hurriedly. As he leaves, he mutters that he hopes you end up as a beggar with nowhere to go. Lose 1 LUCK point for being so hard-hearted. The only exit is a door at the far end of the room; you step cautiously out.",
      choices : [
  {
    option  : "Continue",
    command : "page\t350",
  },
      ],
  };

book['331'] = {
      text   : "Feeling your way along a wall, you try to creep across the room without making a sound, hoping that whatever is in the room won’t notice you. After a few steps, your foot scuffs against a slight bump in the floor. Instantly, you hear the slithering sound getting closer, and you draw your weapon as the unseen monster attacks. Subtract 2 from your Attack Strength during this combat, because of the darkness.\n\nUNSEEN MONSTER  \nSKILL 5 \nSTAMINA 8 \n",
      choices : [
  {
    option  : "You win",
    command : "page\t157",
  },
      ],
  };

book['332'] = {
      text   : "‘ENOUGH!’ Bald Morri’s voice rings out above the sound of fighting. Together with some of the inn’s customers, he separates you from the men, and throws you out. You pick yourself up out of the gutter, dust yourself down, and decide what to do next. Will you:",
      choices : [
  {
    option  : "Look for a beggar (if you haven’t already)",
    command : "page\t26",
  },
  {
    option  : "Visit Madame Star (if you haven’t already)",
    command : "page\t117",
  },
  {
    option  : "Leave the Noose and look elsewhere",
    command : "page\t387",
  },
      ],
  };

book['333'] = {
      text   : "You try to push past the men, and head for the door of the tavern. Roll the dice.",
      choices : [
  {
    option  : "The result is less than or equal to your skill score",
    command : "page\t9",
  },
  {
    option  : "The result is more than your skill score",
    command : "page\t258",
  },
      ],
  };

book['334'] = {
      text   : "You turn to face the monster, feeling a great deal more confident now that you can see what you’re fighting. As you turn, you see that it is a large, golden-brown lizard. Then you see its large, glowing yellow eyes and realize that it is a Basilisk, whose gaze is deadly. Test your LUCK",
      choices : [
 {
    option  : "You are Lucky",
    command : "page\t175",
  },
  {
    option  : "You’re Unlucky",
    command : "page\t65",
  },
      ],
  };

book['335'] = {
      text   : "There is a click, and the safe door swings open. Inside, you find 20 gold pieces, a ledger with Brass’s accounts for the last two months, and a letter. The letter talks about ‘fitting out your property on Barrow Hill’, and is signed with a strange symbol, the type that wizards use. The ledger shows that Brass bought some land on Barrow Hill not long ago, and beside the relevant entry there is a pencilled note reading ‘E.O.B’ This is an important clue – make a note of this paragraph on our Adventurer Sheet. What will you do next?",
      choices : [
  {
    option  : "You search the desk if you haven’t already done so",
    command : "page\t143",
  },
  {
    option  : "Leave the room via the window ",
    command : "page\t306",
  },
  {
    option  : "Leave via the door and investigate the doors at the other end of the landing",
    command : "page\t325",
  },
      ],
  };

book['336'] = {
      text   : "You draw your sword and wait in the hallway for someone to arrive, trying to look as fearsome as you can. The door beneath the landing opens, and out comes a bleary-eyed servant holding a huge black dog on a chain. He lets the dog go when he sees you, and it flies at your throat, snarling horribly.\n\nDOG \nSKILL 7 \nSTAMINA 9 \n",
      choices : [
  {
    option  : "Fight one round of combat against the servants",
    command : "page\t194",
  },
      ],
  };

book['337'] = {
      text   : "The guard falls to the ground, and you turn to the door. Before you have a chance to do anything, though, you hear footsteps approaching, and see a bobbing light in the distance, approaching rapidly – almost certainly a patrol, attracted by the noise of the fight. You dodge into a darkened alley, and search for another entrance; there will be far too much activity for comfort around the main door after this.",
      choices : [
  {
    option  : "Continue",
    command : "page\t210",
  },
      ],
  };

book['338'] = {
      text   : "Something tells you that the chest in the last room is important, so you go back there. The remaining Crystal Warrior does not move as you approach the chest. The chest is securely locked.",
      choices : [
  {
    option  : "You have PICK LOCK skill",
    command : "page\t145",
  },
  {
    option  : "You do not have the skill, so you will have to try to break open the chest. Roll two dice. The result is equal to your skill score or less",
    command : "page\t118",
  },
  {
    option  : "The result is more than your skill score",
    command : "page\t29",
  },
      ],
  };

book['339'] = {
      text   : "The Poltergeist attacks you three times as you cross the room.\n\nPOLTERGEIST \nSKILL 6 \nSTAMINA 0 \n Roll for Attack Strengths as normal, but if your Attack Strength is higher you have not wounded the Poltergeist, merely evaded its missile. If the Poltergeist has a higher Attack Strength, you lose 1 STAMINA point.",
      choices : [
  {
    option  : "Fight three rounds of combat",
    command : "page\t59",
  },
      ],
  };

book['340'] = {
      text   : "As the Gargoyle swoops towards you, you hurl the chain at it, hanging on to the drainpipe with one hand. Remember to cross the chain off your Adventure Sheet. Roll two dice.",
      choices : [
  {
    option  : "The result is equal to your skill score, or less, you hit the Gargoyle",
    command : "page\t232",
  },
  {
    option  : "The result is higher than skill score, you miss the Gargoyle",
    command : "page\t389",
  },
      ],
  };

book['341'] = {
      text   : "At the top of the shaft, another passage leads away. As you follow the passage, it gets damper and damper, until moisture is running down the walls and the walls and ceiling are coated with occasional patches of mould. Finally, the passage comes to an end. The wall at the end is covered with a thick coating of bright yellow mould, which looks almost like the fur of some strange animal. There seems to be no way onward, but you are sure there must be a hidden exit – you’ve seen more than one apparent dead end already.",
      choices : [
  {
    option  : "You have spot HIDDEN skill",
    command : "page\t88",
  },
  {
    option  : "You do not have the skill",
    command : "page\t378",
  },
      ],
  };

book['342'] = {
      text   : "At the end of the short passage is a great iron door. It is as high and wide as the passage itself, and one look tells you that you would never be able to break it down. There is a keyhole in the door, but you realize that the lock on a high-security door like this will be very difficult to pick. Beside the door is a hole in the wall, containing an iron key on a hook and a small, brightly colored scorpion. The scorpion does not move, but you know that if you try to take the key, there is a good chance that it will strike at your hand.",
      choices : [
  {
    option  : "You try to take the key",
    command : "page\t58",
  },
      ],
  };

book['343'] = {
      text   : "You go down a short passage, and come to a set of steps leading downwards into the darkness. This seems to be the only way onward, so you start cautiously down the steps.",
      choices : [
  {
    option  : "You have SPOT HIDDEN skill",
    command : "page\t286",
  },
  {
    option  : "You do not have the skill",
    command : "page\t267",
  },
      ],
  };

book['344'] = {
      text   : "You can’t make out the symbol. Since there seems to be no way into the barrow itself, you conclude that the Eye of the Basilisk is hidden somewhere else.",
      choices : [
  {
    option  : "Look around the rest of the garden",
    command : "page\t77",
  },
      ],
  };

book['345'] = {
      text   : "You smile at the guard, and approach him cautiously, rummaging in your purse. How much money will you offer him? Decide how many hold pieces to offer (not forgetting to cross them off your Adventure Sheet), then roll once die.",
      choices : [
  {
    option  : "The result is equal to the amount you offered or less",
    command : "page\t251",
  },
  {
    option  : "The result higher than the amount you offered",
    command : "page\t101",
  },
      ],
  };

book['346'] = {
      text   : "You pull the statue round so that the archer’s arrow points at the site of the house. Nothing happens, as far as you can see. Perhaps the arrow should be pointed somewhere else – but where?",
      choices : [
  {
    option  : "At the barrow ",
    command : "page\t294",
  },
  {
    option  : "At the standing stone by the barrow",
    command : "page\t383",
  },
      ],
  };

book['347'] = {
      text   : "You turn the doorknob and lean hard against the door, but nothing happens. The door doesn’t move – it must be locked, or bolted from the other side. There’s no escape that way. What will you do now?",
      choices : [
  {
    option  : "Make a break for it",
    command : "page\t97",
  },
  {
    option  : "Attack the patrol",
    command : "page\t224",
  },
  {
    option  : "Try to bribe the patrol (if you haven’t already)",
    command : "page\t327",
  },
      ],
  };

book['348'] = {
      text   : "You put your shoulder to the slab, and heave with all your might. The slab stays firm, and something gives in your back – lose 1 STAMINA point for tearing a muscle.",
      choices : [
  {
    option  : "Go back and choose again",
    command : "page\t43",
  },
      ],
  };

book['349'] = {
      text   : "The symbol means nothing to you.",
      choices : [
  {
    option  : "You have SPOT HIDDEN skill",
    command : "page\t181",
  },
  {
    option  : "You do not have the skill, so there is nothing for it but to wait until someone finds you and face the music. You have failed your test, and your adventure ends here.",
    command : "page\t1",
  },
      ],
  };

book['350'] = {
      text   : "The door leads to a passage. Off the passage is a kitchen, containing nothing of interest, and a lobby, from which stairs lead up to the first floor. You creep up the stairs, and find yourself in a carpeted passage with a door on either side. The door on the left has the symbol of a coin painted on to a wooden plaque which is attached to it, and the door on the right bears the symbol of a fish. Will you:",
      choices : [
  {
    option  : "Check the passage for traps (if you have SPOT HIDDEN skill)",
    command : "page\t357",
  },
  {
    option  : "Open the door on the left",
    command : "page\t189",
  },
  {
    option  : "Open the door on the right",
    command : "page\t83",
  },
      ],
  };

book['351'] = {
      text   : "After a few yards, the passage comes to an abrupt end. The only way onward is a hole in the floor, leading down into the darkness.",
      choices : [
  {
    option  : "You go down the hole (if you have CLIMB skill)",
    command : "page\t216",
  },
  {
    option  : "You do not have the skill",
    command : "page\t297",
  },
  {
    option  : "You go back and try the other end of the passage",
    command : "page\t241",
  },
      ],
  };

book['352'] = {
      text   : "ou advance cautiously into the darkness, wondering what is in there.",
      choices : [
  {
    option  : "You use SNEAK skill if you have it",
    command : "page\t24",
  },
  {
    option  : "You do not have the skill",
    command : "page\t331",
  },
      ],
  };

book['353'] = {
      text   : "Once the Giant Spider is dead, you are able to look around you. There are no passages leading out of the cavern apart from the one you came in by, so you decide to investigate the ceiling, which is lost in darkness.",
      choices : [
  {
    option  : "You have CLIMB skill",
    command : "page\t265",
  },
  {
    option  : "You do not have the skill",
    command : "page\t399",
  },
      ],
  };

book['354'] = {
      text   : "You drop through the skylight into a short passage. Pausing to get your bearings in the half-light, you see that there are two doors, each bearing a badge or symbol of some kind. The door on the right is marked with a coin symbol, and the one on the left is marked with a fish symbol.",
      choices : [
  {
    option  : "You open the door with the fish symbol",
    command : "page\t83",
  },
  {
    option  : "You open the door with the coin symbol",
    command : "page\t189",
  },
  {
    option  : "You have SPOT HIDDEN skill, you can check the passage for traps first",
    command : "page\t357",
  },
      ],
  };

book['355'] = {
      text   : "The chair misses you by a whisker as you throw yourself to one side.",
     choices : [
  {
    option  : "Continue",
    command : "page\t68",
  },
      ],
  };

book['356'] = {
      text   : "You start to disarm the trap, but succeed only in setting it off. The panel near the lock flies open, and the six small darts shoot out. Roll one die to see how many hit you. You may halve the number (rounding fractions down) if you successfully Test your Luck. Each dart that hits you does 1 STAMINA point of damage. To make matters worse, you can hear the sound of a patrol approaching, and the guard you knocked out begins to groan, as if he is about to wake up. You decide to give up on the main door, and dodge into an alley which runs down one side of the building. Perhaps you will find some easier and less exposed way in.",
      choices : [
  {
    option  : "Continue",
    command : "page\t210",
  },
      ],
  };

book['357'] = {
      text   : "You search carefully along, the paneled walls, and find a slight bump in the floor. Rolling back the rug, you find a lever connected to a hidden panel on one side. You’re not sure precisely what it is, but it must be the trigger for a trap of some kind, so you give it a wide berth. What will you do next?",
      choices : [
  {
    option  : "Try the left-hand door (with the coin symbol)",
    command : "page\t3",
  },
  {
    option  : "Try the right-hand door (with the fish symbol)",
    command : "page\t163",
  },
      ],
  };

book['358'] = {
      text   : "You approach the trees almost silently. As you draw closer, you can see a hunched form bent over something in the darkness. There is a sickly sweet smell of rotting flesh coming from somewhere. What will you do?",
      choices : [
  {
    option  : "Hurry on across the square",
    command : "page\t246",
  },
  {
    option  : "Attack the hunched figure",
    command : "page\t230",
  },
  {
    option  : "Touch the hunched figure",
    command : "page\t19",
  },
      ],
  };

book['359'] = {
      text   : "You hack at the strand of web holding your foot, and eventually pull it free. Being careful to avoid any more sticky strands, you make your way cautiously to the nearest body.",
      choices : [
  {
    option  : "Continue",
    command : "page\t382",
  },
      ],
  };

book['360'] = {
      text   : "As you pick the lock, a jolt of electricity lashes up your arm and throws you across the room – lose 4 STAMINA points. If you are still alive, you open the chest. Inside is a disc of black obsidian, almost a foot across and so highly polished it reflects the light of your torch like a mirror. You reach in to take it.",
      choices : [
  {
    option  : "You have SPOT HIDDEN skill",
    command : "page\t182",
  },
  {
    option  : "You do not have the skill",
    command : "page\t20",
  },
      ],
  };

book['361'] = {
      text   : "This isn’t going to be easy: you have to take the key from around Brass’s neck without waking him. Roll two dice.",
      choices : [
  {
    option  : "The result is equal to or less than your SKILL score",
    command : "page\t185",
  },
  {
    option  : "Result is more than your SKILL score",
    command : "page\t261",
  },
      ],
  };

book['362'] = {
      text   : "You pull the map out of your backpack, study it for a little while, and mark out the quickest route through the maze. Following the map, you come through the maze in a matter of minutes. It’s a good job you picked it up, you could get lost in that maze forever.",
      choices : [
  {
    option  : "Continue",
    command : "page\t178",
  },
      ],
  };

book['363'] = {
      text   : "You put the whistle to your mouth and blow. You hear nothing, but the milling bats suddenly part round you like a curtain, and fly out the passage into the night.",
      choices : [
  {
    option  : "Continue",
    command : "page\t43",
  },
      ],
  };

book['364'] = {
      text   : "Bald Morri takes your money, and leans over the bar. ‘He’s a big merchant.’ he says in a low voice. ‘His symbol is a coin, and it’s on everything that’s his. That goes for his house, too – its on the corner of Short Street and Field Street, just by the Field Gate.’ He dips a finger into your ale and sketches a symbol on the bar-top.",
      choices : [
  {
    option  : "You have SECRET SIGNS skill",
    command : "page\t253",
  },
  {
    option  : "You do not have this skill",
    command : "page\t217",
  },
      ],
  };

book['365'] = {
      text   : "The force of the Gargoyle’s blow nearly knocks you off the drainpipe, but you hold on for dear life.",
      choices : [
  {
    option  : "You keep fighting (Turn back and fight another round)",
    command : "page\t225",
  },
  {
    option  : "You try some other approach",
    command : "page\t73",
  },
      ],
  };

book['366'] = {
      text   : "Because you stay in the alcove, the Skeletons can only attack you one at a time. Add 1 LUCK point for thinking of this, then fight the Skeletons one at a time.\n\nFIRST SKELETON \nSKILL 6 \nSTAMINA 5 \n\nSECOND SKELETON \nSKILL 5 \nSTAMINA 4 \n",
      choices : [
  {
    option  : "You win",
    command : "page\t31",
  },
      ],
  };

book['367'] = {
      text   : "You run for the door, but before you can reach it the Shapechanger leaps from the cage and throws itself on you from behind – lose 2 STAMINA points. You must fight it now.\n\nSHAPECHANGER \nSKILL 10 \nSTAMINA 10 \n",
      choices : [
  {
    option  : "You win, leave the room",
    command : "page\t155",
  },
      ],
  };

book['368'] = {
      text   : "You slip quietly up the stairs and on to the balcony. There is a door immediately on your left, and a short landing leads off the balcony on your right. Three doors open on to the landing.",
      choices : [
  {
    option  : "You try the door on your left",
    command : "page\t321",
  },
  {
    option  : "You investigate the doors on the landing",
    command : "page\t45",
  },
      ],
  };

book['369'] = {
      text   : "You make your way down Clock Street. Suddenly, as you pass a narrow side-alley, three small shapes launch themselves out of the darkness at you – a trio of Dwarven footpads. Fight them one at a time. \n\nFIRST DWARF \NSKILL 7 \NSTAMINA 7 \N\NSECOND DWARF 6 \NSKILL 6 \NSTAMINA 7 \N\NTHIRD DWARF \NSKILL 6 \NSTAMINA 6 \N",
      choices : [
  {
    option  : "You win",
    command : "page\t322",
  },
      ],
  };

book['370'] = {
      text   : "You set off down another passage, but after what seems like an hour’s walking you are still lost. Test your Luck. You are Unlucky, you are still lost; return to the top of this paragraph and try again, until you are successful. If you run out of LUCK altogether, you never find your way out of the maze. You have failed your test, and you have nothing to look forward to but a slow death by starvation.",
      choices : [
  {
    option  : "You are Lucky, you finally find your way out of the maze",
    command : "page\t178",
  },
      ],
  };

book['371'] = {
      text   : "You wade through the grasping, clinging Tangle-weed, not stopping until you are well clear out of it, but losing another 3 STAMINA points in the process.",
      choices : [
  {
    option  : "Continue",
    command : "page\t248",
  },
      ],
  };

book['372'] = {
      text   : "Hugging the shadows, you work your way round to the side of the building, and creep towards the guard. Your foot brushes a pebble, which clatters along the cobbles, and the guard suddenly snaps awake. He bakers a challenge and levels his spear at you.",
      choices : [
  {
    option  : "You attack the guard",
    command : "page\t131",
  },
  {
    option  : "Try to bribe him",
    command : "page\t345",
  },
  {
    option  : "Retreat",
    command : "page\t270",
  },
      ],
  };

book['373'] = {
      text   : "Your mind works quickly. There is some kind of sorcery at work here, and you don’t like the idea of fighting your own shadow at all. If you stop casting a shadow, you won’t have a shadow to fight – but how can you do this? You drop the torch you are carrying, and hurl your weapon at the torch on the wall. Don’t forget to cross it off your Adventurer Sheet. If you have nothing else to fight with, you must deduct 3 from your Attack Strength until you find another weapon. Roll two dice.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t5",
  },
  {
    option  : "The result is higher than your SKILL score",
    command : "page\t249",
  },
      ],
  };

book['374'] = {
      text   : "At last, the passage comes to an end. You had begun to think that it would go on forever, but you find yourself peering into a huge cavern with no visible exits. Is this the hiding-place of the Eye of the Basilisk? The cavern is featureless, and its roof is lost in darkness, beyond the range of torchlight. You move cautiously into the cavern, and start to check the walls for concealed doorways or hiding-places. Suddenly, your attention is caught by a rattling noise from above you. You raise your torch and look up, trying to see where the noise is coming from – and see an immense spider, fully five feet across the body, dropping like a stone towards you. Roll two dice.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t207",
  },
  {
    option  : "The result is higher than your SKILL score",
    command : "page\t304",
  },
      ],
  };

book['375'] = {
      text   : "You climb the drainpipe rapidly, but when you are about ten feet off the ground, it shudders slightly, and comes away from the wall with a groan of twisting metal. You fall to the alley below – lose 2 STAMINA points – and the drainpipe falls on top of you with a crash. You drag yourself into the shadows.",
      choices : [
  {
    option  : "You have HIDE skill",
    command : "page\t116",
  },
  {
    option  : "You do not have the skill",
    command : "page\t272",
  },
      ],
  };

book['376'] = {
      text   : "You put your hand down on the table, with your fingers spread wide, and stab the knife into the table between each pair of fingers in turn. Faster and faster the knife moves, until you accidentally stab one of your fingers. Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t71",
  },
  {
    option  : "You are Unlucky",
    command : "page\t199",
  },
      ],
  };

book['377'] = {
      text   : "The door is very solid – it appears almost impossible to open by force – and the lock on it is one of the largest and most complicated that you have ever seen. If you have PICK LOCK skill, you can try to open it, but it won’t be easy. Roll two dice, and add 2 to the score.",
      choices : [
  {
    option  : "The result is equal to your skill score or less, you have opened the door",
    command : "page\t295",
  },
  {
    option  : "You don’t have PICK LOCK skill, you cant open the door, and you will have to confine your attention to the desk",
    command : "page\t90",
  },
  {
    option  : "Leave the Merchant’s Guild stealthily and either look for clues in Brass’s house (if you haven’t been there before)",
    command : "page\t156",
  },
  {
    option  : "Set out in search of the Eye of the Basilisk without looking for any more clues",
    command : "page\t144",
  },
      ],
  };

book['378'] = {
      text   : "You search both sides of the passage, but can find no way out at all. Perhaps you missed something earlier on, and this really is a dead end. Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t88",
  },
  {
    option  : "You are Unlucky",
    command : "page\t42",
  },
      ],
  };

book['379'] = {
      text   : "Cursing, you brush the scorpion away, crush it underfoot and take the key. As you turn to put it in the lock on the great iron door, your vision blurs. Shaking your head, you try to take a step, but fall to the ground as the venom takes effect. Your adventure and your life both end here.",
      choices : [],
  };

book['380'] = {
      text   : "You cannot stop your hand wavering, and your fingertips brush the edge of the light. A searing pain lashes through your arm. Test your Luck. If you are Unlucky, the shock of the pain makes you stumble further into the light and the searing pain is the last thing you ever feel. Your adventure ends here.",
      choices : [
  {
    option  : "You are Lucky, you lose 4 STAMINA points. If you are still alive, go back and try again to take the gem",
    command : "page\t87",
  },
      ],
  };

book['381'] = {
      text   : "As you hurry out of the cavern, you notice a series of holes in the walls of the passage, three on each side, at chest height. You crawl underneath them, and as you do so a small dart shoots out of each hole. If you had been standing, they couldn’t have missed you. Gain 1 LUCK point for evading the trap.",
      choices : [
  {
    option  : "Follow the passage",
    command : "page\t191",
  },
      ],
  };

book['382'] = {
      text   : "Carefully cutting the spider-silk from around the body, you find that it is indeed human. You avoid the face – you don’t want to find out whether its anyone you know – and concentrate on looking for usable equipment. You find a backpack with enough Provisions for two meals, but that is all. You decide that you can’t face investigating the other bodies.",
      choices : [
  {
    option  : "Resume your climb",
    command : "page\t341",
  },
      ],
  };

book['383'] = {
      text   : "You pull the statue round so that the archer’s arrow points at the standing stone beside the barrow. There is a grating noise, and part of the featureless grassy mound falls inward, revealing a small stone doorway. You go cautiously inside, pausing only to light a torch, your hand-lantern isn’t bright enough for these conditions.",
      choices : [
  {
    option  : "Continue",
    command : "page\t343",
  },
      ],
  };

book['384'] = {
      text   : "You look all around the two-storey house for possible entrances. There is no back door, but you find two possible ways in: a front door, which is locked, and a drainpipe, which leads up to three windows on the upper floor.",
      choices : [
  {
    option  : "You have PICK LOCK skill, you may try to open the front door",
    command : "page\t276",
  },
  {
    option  : "You decide to climb the drainpipe",
    command : "page\t108",
  },
  {
    option  : "You don’t wish to do either, you can make your way back to the Market Square and visit the Merchants’ Guild, provided that you haven’t done so already",
    command : "page\t129",
  },
      ],
  };

book['385'] = {
      text   : "The beggar wakes with a start. ‘Don’t hurt me.’ He whines. ‘I’ve done no harm. All I wanted was somewhere to sleep out of the weather.’ He’s clearly frightened of you – he probably thinks that you are a Guild official or a night watchman.",
      choices : [
  {
    option  : "You pretend to be a watchman and order him out",
    command : "page\t330",
  },
  {
    option  : "You tell him you’re a friend",
    command : "page\t291",
  },
      ],
  };

book['386'] = {
      text   : "You resume your circuit of the building, and notice a doorway in the wall, but when you investigate it, you discover that it’s been bricked up – there’s no way here! Carrying on around the building, you turn left and find yourself in Key Street. Looking south, you see someone dodging a hail of arrows. You smile to yourself as you head north. The Guild has done well with that trick, even though there were some who said it would never work. You come back to the Market Square, having walked right round the Merchants’ Guild, and pause to think. You have found three ways in: the front door, where there is a guard to get rid of; the back door; and the drainpipe beside the back door, which leads to a window. You decide that the front door is too risky: fighting with an armed guard in the Market Square is bound to attract attention, even at night.",
      choices : [
  {
    option  : "This leaves you with the back door",
    command : "page\t159",
  },
  {
    option  : "The drainpipe",
    command : "page\t225",
  },
  {
    option  : "You have CLIMB skill or a rope and grapnel, you can ignore both options if you wish, and try climbing to the roof",
    command : "page\t4",
  },
      ],
  };

book['387'] = {
      text   : "You leave the darkened alleyways of the Noose, and head out into the rest of the town. Where will you go first?",
      choices : [
  {
    option  : "To Brass’ house",
    command : "page\t156",
  },
  {
    option  : "To the Merchant’s Guild",
    command : "page\t129",
  },
      ],
  };

book['388'] = {
      text   : "You miss the Jib-Jib, which runs screaming down the passage. You’ve heard that their voices are loud, but you still find it hard to believe that such a small beast can make so much noise! You can’t hear the armed guards running to investigate – the Jib-Jib’s howling drowns out everything else – but you can imagine them running up the stairs at this very moment. You make your way out of the Merchants’ Guild as quickly as you can, and take cover in a shadowy alley. After your nerves have settled, you begin to weigh up the situation. It’s too dangerous to return to the Guild now, so you’ll have to do without any information that you might have gained there. That leaves you two options.",
      choices : [
  {
    option  : "You can look for clues in Brass’ house (if you haven’t been there before)",
    command : "page\t156",
  },
  {
    option  : "You can set out in search of the Eye of the Basilisk now, and hope that you have enough information to find it ",
    command : "page\t144",
  },
      ],
  };

book['389'] = {
      text   : "A stony claw rips your shoulder open; you are torn from the drainpipe and plummet to the alley below. Lose 3 STAMINA points.",
      choices : [
  {
    option  : "You are still alive and have HIDE skill",
    command : "page\t48",
  },
  {
    option  : "You do not have HIDE skill",
    command : "page\t175",
  },
      ],
  };

book['390'] = {
      text   : "The door shudders as you hit it, but does not open. Lose 1 STAMINA point for a bruised shoulder. Instantly, the air is filled with a dense, mustard colored cloud of spores, but the cloth over your mouth and nose protects you a little. Try again – roll two dice.",
      choices : [
  {
    option  : "The result is equal to your SKILL score or less",
    command : "page\t190",
  },
  {
    option  : "The result is higher than your SKILL score",
    command : "page\t51",
  },
      ],
  };

  book['391'] = {
      text   : "You drop to the foot of the wall, hitting the ground hard – lose 1 STAMINA point. You stagger to your feet and try to run, but guards are converging on you from all sides. Roll two dice.",
      choices : [
  {
    option  : "The result is equal to or less than your SKILL score, you manage to evade the guards and escape. (Turn back and try somewhere else)",
    command : "page\t144",
  },
  {
    option  : "Result is more than your SKILL score",
    command : "page\t36",
  },
      ],
  };

book['392'] = {
      text   : "You leave the city by the Field Gate, slipping past the guards like a shadow. Soon, you see Barrow Hill rising out of the night ahead of you. As you climb the hill, you see the ancient barrow from which it got its name. Not far away is an overgrown garden, all that remains of a great house built here a century or more ago. They say that the family who lived there were dogged by ill-luck until they abandoned the house, and soon after they left it burnt to the ground. You wonder what Brass has done to the site, where the Eye of the Basilisk is, and how it’s protected. Where will you start looking?",
      choices : [
  {
    option  : "By the barrow",
    command : "page\t30",
  },
  {
    option  : "The result is higher than your SKILL score",
    command : "page\t77",
  },
      ],
  };

book['393'] = {
      text   : "You hurl yourself to one side, but the thing, whatever it is, grazes your shoulder. A tremendous jolt of pain lashes through your body, and for a fraction of a second you feel as if your very soul is being burnt up by the thing’s hellish energy. Lose 2 STAMINA points, 1 skill point and 1 LUCK point. The thing hovers above the dead thief’s body for a fraction of a second, then sinks down into it, soaking into the dead flesh like water soaks into a sponge. The body twitches once, and then drags itself to its feet. Your scalp tingles as the dead eyes stare sightlessly into yours, and the dead thief shambles to attack you.",
      choices : [
  {
    option  : "You fight the Animated Corpse",
    command : "page\t82",
  },
  {
    option  : "Try to run away",
    command : "page\t192",
  },
      ],
  };

book['394'] = {
      text   : "You manage to free your foot, but the fire spreads rapidly and soon the whole of the web is blazing.",
      choices : [
  {
    option  : "You have CLIMB skill (a rope and grapnel won’t do here)",
    command : "page\t239",
  },
  {
    option  : "You do not have the skill",
    command : "page\t296",
  },
      ],
  };

book['395'] = {
      text   : "You attack the Gargoyle. \n\nGARGOYLE  \nskill 9 \nSTAMINA 10 \n",
      choices : [
  {
    option  : "You win a round of combat",
    command : "page\t133",
  },
      ],
  };

book['396'] = {
      text   : "By the faint moonlight coming into the room, you see a large four-poster bed. Two people are asleep – Brass and his wife. At the foot of the bed stands a chair with clothes heaped on it, and a rapid search of the clothes turns up 10 gold pieces. As you are about to leave, you see that around Brass’ neck is a key on a silver chain. The key has the letter ‘R’ on it.",
      choices : [
  {
    option  : "You try to take the key if you have PICK POCKET skill",
    command : "page\t361",
  },
  {
    option  : "You try to take the key without PICK POCKET skill",
    command : "page\t261",
  },
  {
    option  : "You decide not to take the key, you turn and leave the room quietly. Once back on the landing, will you: Try the first door across the passage",
    command : "page\t70",
  },
  {
    option  : "Try the second door across the passage",
    command : "page\t76",
  },
  {
    option  : "You can leave the house quietly and either go to the Merchants’ Guild, if you haven’t already done so",
    command : "page\t129",
  },
  {
    option  : "Investigate the door at the other end of the landing",
    command : "page\t321",
  },
  {
    option  : "Set out in search of the Eye of the Basilisk without looking for any further information",
    command : "page\t144",
  }
      ],
  };

book['397'] = {
      text   : "You hold the object in the light, and it disintegrates with a flash. It is totally destroyed, and not even a trace of ash is left behind. Cross the object off your Adventurer Sheet, and lose 4 STAMINA points as your hand brushes the edge of the light. What will you do now?",
      choices : [
  {
    option  : "Reach into the light and take the gem",
    command : "page\t269",
  },
  {
    option  : "Throw something to knock the gem out of the light",
    command : "page\t130",
  },
  {
    option  : "Try to block the light",
    command : "page\t292",
  },
  {
    option  : "You want a clue, spend 2 LUCK points – don’t forget to adjust the score on your Adventure Sheet",
    command : "page\t338",
  },
      ],
  };

book['398'] = {
      text   : "You manage to kill the Jib-Jib before it can make a sound. Just as well – you’ve heard that their screams can be heard miles away, and the last thing you want to do is to let the whole town know that someone’s broken into the Merchants’ Guild. Wiping your sword, you turn your attention to the doors. Which one will you try first.",
      choices : [
  {
    option  : "The door with the coin symbol",
    command : "page\t3",
  },
  {
    option  : "The door with the fish symbol",
    command : "page\t163",
  },
      ],
  };

book['399'] = {
      text   : "You try to climb the cavern walls, but they are too sheer and you can find no handholds. You look again around the cavern, searching for a hidden door or some other way out, but find nothing Test your Luck.",
      choices : [
  {
    option  : "You are Lucky",
    command : "page\t213",
  },
  {
    option  : "You are Unlucky",
    command : "page\t320",
  },
      ],
  };

book['400'] = {
      text   : "As you stand looking at the fake gem, a secret door opens in the back of the chamber, and out steps Rannik, followed by several other prominent Guild members. They are all smiling. ‘Yes, I know it’s a fake.’ Grins Rannik, ‘the whole job was. But the dangers were real enough, and you used your skills and equipment well to overcome them. You’ve passed your test, and the Guild Council, whom you see here, has no hesitation in admitting you to full membership of the Thieves’ Guild of Port Blacksand.’ Your disappointment turns to a choking mixture of clation and relief as the other thieves crowd round to congratulate you.",
      choices : [],
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



