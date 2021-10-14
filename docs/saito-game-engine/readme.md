# The Saito Game Engine


## Introduction

In traditional single-player game engines there is little need for cryptographic implementations of dice rolls or deck shuffles. This changes with multiplayer games that interact with on-chain assets, or any games that require genuinely fair and trustless play between distributed parties.

The traditional approach to address trust issues in multiplayer games has been a reliance on trusted third-parties. Centralized game servers typically handle random number generation and monitor players to prevent them patching their software in ways that enable cheating. This approach has problems because it is hard to enforce honest behavior in users, and because many third parties are themselves not trustworthy.

The Saito Game Engine offers a new approach to solving this problem. Developed in part with the support of the Web3 Foundation, it provides a standard set of cryptographic instructions that permit games to roll dice, shuffle cards, and execute game moves in a peer-to-peer fashion without the need for any central servers or trusted servers. Cryptographic techniques make it impossible for players to cheat without their malfeasance being cryptographically provable.

Many games have already been built using the Saito Game Engine. If you are new to blockchain gaming and interested in playing some we encourage you to visit the Saito Arcade [https://saito.io/arcade]. What follows is a more technical introduction to the gaming library for developers who are interested in understanding how the engine works or looking to develop or modify applications running atop the library.



## The Basics -- Game State

The state of a game refers to all information about that game which persists over time. In a game of CHESS the state includes the position of the pieces on the board. In RED IMPERIUM it includes which players control which sectors and what factions they represent. Loading a game usually requires checking the state of the game and updating the display so that it reflects that state. Updating a game requires updating both the state and then the board display.

With multiplayer games there are many edge-cases around saving and reloading games that can push player records of game state into non-alignment. The Saito Game Engine is designed to prevent these problems from happening. The library is designed so that any changes games make to their state will persist regardless of how many times users reload, refresh or attempt to attack the game. The saving and reloading of game state happens automatically so that developers do not need to worry about managing it.

```
  game_self.game.state
```

Saito provides the following object for developers to store game state. You may add variables and arrays and data objects to this object, and write code that manipulates them. This game state will load automatically every time the game is loaded or reloaded and it will be automatically saved when needed for bug-free gaming. You can write code that interacts with your state by putting the data here and expecting that it will always work.

```
  game_self.game.state.player[0].health += 1;
```

PRO-TIP: it is typical for Saito games to have a returnState() function that returns an associative array that defines the starting conditions of the game. This approach makes initializing a game very easy: in the initializeGame() function we can check to see if the game we are loading is new (i.e. has no entries in the game queue described below) and assign the contents returned by the returnState() function to the game_self.game.state object if and only if we are creating a new game.



### The Basics -- Game Queue

The ability to store and reload game state allows us to create a gameboard and displayBoard(). But how do we allow players to take turns? How do we change this game state object and keep both players updated and in sync? This requires understanding how to program and broadcast game moves onto the game queue.

```
  game_self.game.queue
```

The Saito Game Engine puts moves into the queue shown above. When a game is initiatized, when you set the default values for your game state, you should also add the default instructions to your game queue. A simple game might push the following instructions onto the queue when it initializes a new game. Note that because the initialization code runs in parallel on all machines, it is safe for initialization functions to push these moves directly onto the queue:

```
  game_self.game.queue.push("newround");
  game_self.game.queue.push("PLAY\t2");
  game_self.game.queue.push("PLAY\t1");
  game_self.game.queue.push("READY");
```

Any instructions added to the queue are executed on a last-in-first-out (LIFO) basis. In the example above, our game annouces it is READY to be played (i.e. fully initialized). Player 1 is then permitted to move. Player 2 is then permitted to move. We finally hit the "newround" instruction which is executed on both machines. In the implementation of POKER running on the Saito Arcade this command pushes two new PLAY instructions back onto the queue, creating an endless loop that allows players to take turns until a win condition is met.

What happens when a player makes a move? Because players cannot "push" instructions to the queues of their peers, when a player takes their turn they have to broadcast their moves to their peers. The Saito game engine automates this process. Once a player ends their turn they will broadcast their moves to their peers, who will begin to execute their moves on receipt. All players in the game consequently receive all game moves and execute them one-by-one in last-in-first-out (LIFO) order. This keeps all players in sync. Consider the following example.

```
  game_self.addMove("RESOLVE")
  game_self.addMove("remove\t1\t2\tinfluence\taustria");
  game_self.addMove("place\t2\t3\tinfluence\titaly");
  game_self.endTurn();
```

If this is the move broadcast by Player 1 in response to their turn above, our Game Queue now looks as follows:

```
  this.game.state.queue = [
    "newround",
    "PLAY\t2",
    "PLAY\t1",
    "RESOLVE",
    "remove\t1\t2\influence\taustria",
    "place\t2\t3\influence\titaly"
  ]

```
Note the difference between UPPERCASE and lowercase instructions. UPPERCASE instructions are executed by the underlying Saito game engine. lowercase instructions are commands specific to the game itself. In the context of a game like TWILIGHT STRUGGLE, these moves might instruct that "player 2 places 3 influence in Italy" and then that "player 1 removes 2 influence from Austria". The functions "remove" and "place" need to be programmed by the developer. 

Writing a game atop the Saito Game Engine thus requires creating game-specific functions like "place" and "remove" and "newround". These must be added to the function handleGameLoop(), which will be called by the Game Engine automatically whenever it runs into an instruction it believes is specific to your game. In contrast, instructions that are in UPPERCASE will be handled automatically by the game engine with no need for any additional programming. In our API document we outline all of the commands available to programmers.

It is typical for instructions to clear themselves from the queue after they have executed but this is not hardcoded -- there are some design patterns where you will want players to make moves and bounce back to their. An example is a game that permits players to take multiple actions on their turn until they finally click PASS, at which point they broadcast a move which clears that instruction from the queue for all players. The biggest challenge with building peer-to-peer games is internalizing the implications of peer-to-peer messaging for game design itself, which requires thinking more carefully about when players move and when "turns" end.

PRO-TIP: the return value specified by individual instructions controls how they are executed by the game engine. If an instruction returns a value of 1 that game queue will continue to loop around and execute the next available instruction. Returning a value of 0 indicates that the game engine should stop executing the queue and wait to receive the next move. In the example above the PLAY instruction halts execution of the queue until the player in question broadcasts their move. Their "first" move should be to RESOLVE the PLAY instruction so all players remove it from the queue and gameplay can continue.


## The Basics - Key Functions:

To get started coding a game, we recommend downloading this Game Template. This package contains all of the "scaffold" code that you will need to start playing, and provides the basic functions that require editing to get started with a game. This package also includes some supporting functions that allow it to "just work" with the Saito Arcade.


#### initializeGame(game_id)

game_id - reference to the unique game identifier (a hash)

```javascript
initializeGame(game_id) {

  let game_self = this;

  if (game_self.game.queue.length == 0) {

    game_self.game.state = game_self.returnState();

    game_self.game.queue.push("newround");
    game_self.game.queue.push("PLAY\t2");
    game_self.game.queue.push("PLAY\t1");
    game_self.game.queue.push("READY");

  }

}
```

This function runs whenever the game is initialized. In the example above, you can see the code check to see if the game already exists (are there entries on the queue?) and initialize the queue and state objects to the state of a new game if they do not. Note that the function runs not only when you load the game in your browser, but also when you create and initialize a game while looking at other applications like the Arcade.




#### initializeHTML(app)

app - reference to the Saito app object, which exposes cryptographic functions

```javascript
initializeHTML(app) {

  let game_self = this;

  game_self.log.render(app, game_self);
  game_self.log.attachEvents(app, game_self);

  game_self.hud.render(app, game_self);
  game_self.hud.attachEvents(app, game_self);

  game_self.displayBoard();

}
```

This function runs whenever the game is loaded to the screen. You could theoretically put the content in initializeGame() instead, but putting it here ensures that attempts to manipulate the DOM will only happen if the application is active. In this short example you can see our game load the GameLog UI element onto the screen, and the GameHUD UI element as well.


#### initializeHTML(app)

app - reference to the Saito app object, which exposes cryptographic functions

```javascript
handleGameLoop() {

  let game_self = this;

  if (game_self.game.queue.length > 0) {

    let qe = game_self.game.queue.length - 1;
    let mv = game_self.game.queue[qe].split("\t");

    //
    // handle an instruction
    //
    if (mv[0] == "newround") {
      game_self.game.queue.push("remove_me\tlook at the way i remove myself from the queue!");
      game_self.game.queue.push("PLAY\t2");
      game_self.game.queue.push("PLAY\t1");
    }

    //
    // handle an instruction
    //
    if (mv[0] == "remove_me") {
      game_self.updateLog(mv[1]);
      game_self.game.queue.splice(qe, 1);
    }

  }

  return 1;

}
```

This function runs whenever the game engine runs into a command it does not know how to handle. You should manually code the instructions your game supports. They should generally remove themselves from the queue. If you wish to halt execution of the queue simply return 0 from within one of your instructions. The game will then halt until another move is received from one of the players in the game.




#### playerTurn()

```javascript
playerTurn() {

  let game_self = this;

  //
  // add moves and broadcast them
  //
  game_self.addMove(`RESOLVE`);
  game_self.addMove(`NOTIFY\tPlayer ${game_self.game.player} has moved.`);
  game_self.endTurn();

  return 0;

}
```

This function will run ONLY on the machines of the players specified by the PLAY instruction. It is a convenience -- you do not need to use the PLAY instruction to hand control to a particular player. You can also pass control using game-specific lowercase commands. Usually a game should update the interface for the player who is taking their turn and add events to the DOM elements.

If you are coding a card game there are a lot of functions in the GameHUD that will simplify displaying cards and allowing users to click on them to make moves.



