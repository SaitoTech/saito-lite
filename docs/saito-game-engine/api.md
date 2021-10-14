
# Saito Game Engine -- API

This file contains information on default instructions supported by the underlying game engine. Games may add these instructions (with the appropriate arguments) to their game queue and the game engine will handle the rest of the . Developers please note that these instructions much be added to the queue in capital letters. 

## Common Arguments

#### app - the Saito application object

The Saito application object contains a reference to the runtime state of the Saito platform. It is mostly used for access to common cryptographic functions like hashing [app.crypto.hash()] or to retrieve the publickey of the current player [app.wallet.returnPublicKey()]. Access to the appliation function can provide very detailed control of the stack.

#### deck - a deck of cards

A deck consists of a closed set of cards. Each card should be an entry in an associative array where the key is a unique string. In the event of a deck with multiple identical cards, the content of the cards can be the same but the key used to index them should be different (i.e. joker1, joker2). The Saito Game Engine supports the existence of multiple decks -- decks are assigned a specific deck_id number and interactions with them after creation work by specifying which deck is being used by reference to this deck_id number.

#### deck_id - unique ID of each deck

A positive integer greater than 0 which indicates the unique id of the deck in the Saito Game Engine. When decks are imported developers must specify the deck_id into which they are being loaded. And when operations are made on that deck like dealing cards or reshuffling the deck the deck_id is specified to ensure that the correct deck is manipulated.

#### hand

A hand is a subset of cards from a specific deck that is dealt to a specific player. Hands have the unique properties that players only have access to information on the cards in their hand. The process of dealing cards from a deck into the hand of a player requires submission of the player_id receiving the cards and the deck_id of the deck from which the cards are being dealt.

#### pool

A pool is a pile of publicly-visible cards. Pools are distinct from hands in that all players get access to the cards that exist in pools, whereas cards in hands are private unless explicitly shared. Each pool is identified by a unique pool_id.

#### pool_id - unique ID of each pool

A positive integer greater than 0 which indicates the unique id of the pool of cards. Note that the pool only contains the key of the cards that have been dealt into them. It is incumbent on the developer to know from which deck the cards in any pool have come in order to be able to access detailed information on the contents of the cards themselves.

#### player_id - unique ID of each player

A unique id assigned to each player. This can be found in the game object at game_self.game.player. The player_id is related to the position that the player's publickey occupies in the array which specifies which players are participating in the game: game_self.game.players. The player with player_id of 1 is the first entry as in game_self.game.players[player_id-1].

#### text - string of TEXT

A text message is a string of text intended for human consumption.

#### html - string of HTML

An html message is a string of text intended for display and markup as in-browser HTML.


## Instructions

The Saito Game Engine supports the following 


####ACKNOWLEDGE [text/html]

Prompts all players to acknowledge the text or html message provided. The message is typically displayed in the status field of the GameHud UI element. Execution of gameplay and further processing of the game queue is halted until players acknowledge the message.

```javascript
  game_self.addMove("ACKNOWLEDGE\tThe Bene Gesserit have moved into Sector 14");
```

This instruction is useful to allow players to more easily track what is happening on the gameboard. Red Imperium uses the ACKNOWLEDGE command to ensure that players are aware of key developments in the game, such as when opponents play action cards. Using this command for notifications can also prevent information from leaking about player hands, the requirement that players manually intervene can prevent other players from guessing -- by speed of user response -- whether they in fact have the ability to do more than simply acknowledge.


####DEAL [deck_id] [player_id] [number_of_cards_to_deal]

A simple function that deals the specified number of cards from the deck identified by deck_id to the player identified by player_id. Note that this is an unsafe function that performs low-level cryptographic work and does not check the availability of cards in the deck. If you are building a game that will run out of cards and require a reshuffle we recommend using SAFEDEAL instead.

```javascript
  game_self.addMove("DEAL\t1\t1\t7");
```

####GAMEOVER

ends the game

```javascript
  game_self.addMove("GAMEOVER");
```

ISSUEKEYS
this is an internal function used in the course of dealing cards


LOGDECK [deck_id]
prints the cards in the specified deck to the log. this is primarily used for debugging. See the DECK command for instructions on how to import a deck.

  game_self.addMove("LOGDECK\t");
  game_self.endTurn();



LOGHAND [deck_id]
prints the cards that have been dealt to a player from the specified deck to the log. this is primarily used for debugging. See the DECK command for instructions on how to import a deck. See the DEAL command for instructions on how to deal cards from that deck into the player's hand.

  game_self.addMove("LOGDECK\t");
  game_self.endTurn();


LOGPOOL [pool_id]
prints the cards in the specified pool to the log. this is primarily used for debugging - confirming that a deal has successfully issued cards to a pool. See the DECK command for instructions on how to import a deck. See the POOL command for instructions on creating a POOL (i.e. publicly visible pool of cards). See the POOLDEAL command for instructions on dealing cards from a deck into a pool.

  game_self.addMove("LOGPOOL\t");
  game_self.endTurn();



OBSERVER
enables observer mode

example:

  game_self.addMove("OBSERVER");

practical use case:
Twilight Struggle supports an Observer Mode that allows third parties to monitor the game in real-time. Implementing this functionality can result in the ability for players to leak information on their hands or strategy, which should be handled by the game engine to ensure all players are aware and agree.




PLAY [
enables observer mode

example:

  game_self.addMove("PLAY\tall");
  game_self.addMove("PLAY\t[1,2]");
  game_self.addMove("PLAY\t1");
  game_self.addMove("PLAY\t2");

outcome:

  in the event a single player is being invited to move, their player number should be provided. if multiple players are being invited to move, they can . this function automatically handles simultaneous moves, and prepares the game engine.

  the state of the game will halt until players submit their moves, which should begin with a turn which clears their move with RESOLVE. such as:

  game_self.addMove("RESOLVE\t[publickey]");
  game_self.addMove("NOTIFY\tPlayer 1 does nothing");

  it should be noted that recursive simultaneous moves are not permitted. this means that if you are permitting players to make simultaneous moves the content of those moves as broadcast by players which RESOLVE their turn should not trigger the requirement for other simultaneous moves.

  for similar reasons, the order in which player moves are executed is not structured. moves may arrive in any other, so gameplay should not fork based on the order of execution. this technique is thus useful for parallelization of game responses rather than strategic moves conducted in sequence.


practical use case:
RED IMPERIUM allows players to execute the secondary of most strategy cards in parallel, as decisions to build infantry or purchase action cards is not something that matters in terms of order-or-execution, but simultaneous execution speeds up gameplay considerably and makes for a more exciting and faster game.






NOTIFY
notifies the player by printing a message to the player log

example:

  game_self.addMove("NOTIFY\tPlayer 2 wins this round!");

outcome:

  the log is updated with this text as the latest entry

practical use case:
Poker keeps a detailed log of player activities to keep a human-readable history of who has called, folded or raised. Card details are also printed on the log at the end of each turn for easy reference.


READY
updates the game to indicate that initialization is complete. this is used by some external applications like the Arcade to indicate that a game has finished loading and is ready for the player to join it. It is typical to push this instruction to the back of the stack after decks have been shuffled and dealt on initialization.

example:

  game_self.game.queue.push("READY");

outcome:

some applications like the Arcade will show an initialization page and wait to invite players to join the game until this command has been executed. it is considered good form to execute this on the queue when the game has reached a point that players should join.





RESETCONFIRMSNEEDED
specifies the number of RESOLVE messages that must be received from different players for the next RESOLVE instruction to clear. 

example:

  game_self.addMove("RESETCONFIRMSNEEDED\tall");
  game_self.addMove("RESETCONFIRMSNEEDED\t[1,2]");
  game_self.addMove("RESETCONFIRMSNEEDED\t2");
  game_self.addMove("RESETCONFIRMSNEEDED\t1");


outcome:

the RESOLVE command will wait for the appropriate number of confirmations or confirmations from the specified players before clearing and permitting the stack to continue execution.


REQUESTKEYS
this is an internal function used in the course of dealing cards


RESOLVE [publickey]
if no publickey is provided this removes the previous instruction from the game queue if possible. if the game is managing simultaneous moves the publickey of the player issuing this command must be provided in order for the instruction to have any effecft.

example:

  game_self.addMove("RESOLVE");
  game_self.addMove("RESOLVE\tnD7zNvTX9BzyPmQvVbKjP1RJhbftyiTjjFB6uxA5mfoX");

outcome:

the RESOLVE command will remove the immediately-preceding instruction from the game-stack if the conditions for removal are met (set either by PLAY or by RESETCONFIRMSNEEDED).


RESOLVEDEAL
this is an internal function used in the course of dealing cards to players.

RESOLVEFLIP
this is an internal function used in the course of dealing cards to pools.


SHUFFLE [deck_id]
shuffles the cards in the deck identified by the deck_id. See the DECK command for instructions on how to import a deck. 

example:

  game_self.addMove("SHUFFLE\t1");
  game_self.endTurn();




SIMPLEDEAL [number_of_cards] [deck_id] [deck_json]
simple function that automates importing a deck to the specified deck index, and then dealing the specified number of cards to all players in the game. See DECK for requirements on the second and third arguments.

SAFEDEAL [deck_id] [player] [cards_to_deal]
simple function that deals the specified number of cards from the specified deck to the specified player. this is intended as the "safe" alternative to the DEAL command above. if an inadequate number of undealt cards exist it will add any cards that have been added to the discard pile and reshuffle them before dealing.




SECUREROLL [player] [hash] [sig]
this provides a method for players to reset the random number generator in the game using inputs from all players so as to prevent look-ahead attacks on random number generation. please see the test suite for an example of how to implement this function.

SECUREROLL_END
this is an internal function used in secure roll generation. please see the test suite for an example of how to implement this function.

SIMULTANEOUS_PICK [player] [hash] [sig]
this provides a method for players to select and broadcast cards or other information securely. both players must independently send this move and then the game engine will take over and complete the action.

one the instructions have been executed the cards will be available for perusal in the game state in an array which stores the results submitted by each player, i.e.

  game_self.game.state.sp[0] <-- player 1
  game_self.game.state.sp[1] <-- player 2

SIMULTANEOUS_PICK_END
this is an internal function used in the simultaneous pick of cards.


DECKBACKUP
this is a partner function with DECKRESTORE that is used when shuffling cards into . the technique requires backing up the existing cards, shuffling the new cards into the deck (overwriting the content) and the DECKRESTORE to add the backed-up cards into the newly shuffled deck. At the end of this process SHUFFLE can be called to randomize the new cards together with the old ones.

example:

                  //
                  // shuffle in discarded cards
                  //
                  this.game.queue.push("SHUFFLE\t1");
                  this.game.queue.push("DECKRESTORE\t1");
                  this.game.queue.push("DECKENCRYPT\t1\t2");
                  this.game.queue.push("DECKENCRYPT\t1\t1");
                  this.game.queue.push("DECKXOR\t1\t2");
                  this.game.queue.push("DECKXOR\t1\t1");
                  this.game.queue.push("DECK\t1\t"+JSON.stringify(discarded_cards));
                  this.game.queue.push("DECKBACKUP\t1");



DECKRESTORE
this is a partner function with DECKBACKUP that is used when reshuffling old cards into an existing deck. the technique requires backing up the existing cards with DECKBACKUP, shuffling the new cards into the deck (overwriting the content) and then using DECKRESTORE to add the backed-up cards into the newly shuffled deck. At the end of this process SHUFFLE can be called to randomize the new cards together with the old ones.

example:

                  //
                  // shuffle in discarded cards
                  //
                  this.game.queue.push("SHUFFLE\t1");
                  this.game.queue.push("DECKRESTORE\t1");
                  this.game.queue.push("DECKENCRYPT\t1\t2");
                  this.game.queue.push("DECKENCRYPT\t1\t1");
                  this.game.queue.push("DECKXOR\t1\t2");
                  this.game.queue.push("DECKXOR\t1\t1");
                  this.game.queue.push("DECK\t1\t"+JSON.stringify(discarded_cards));
                  this.game.queue.push("DECKBACKUP\t1");


CARDS
this is an internal function used in encrypting and shuffling decks of cards


POOL [pool_id]
this createa an empty "pool" of cards into which cards can be dealt by POOLDEAL. any cards dealt into this pool will be visible to all players in the game. the index number of the pool should be a unique number known by the game.


POOLDEAL [number_of_cards] [deck_id] [pool_id]
this function deals the number of cards specified from the deck specified into the pool specified. it assumes that there are enough cards in the deck to deal into the pool.


FLIPRESET
this is an internal function for dealing cards into pools

FLIPCARD
this is an internal function for dealing cards into pools

OBSERVER_CHECKPOINT
if observer mode is enabled in a game, adding this command will halt execution for the observer, allowing them to step through the game move-by-move, even if that game has been completed. it is ignored by players in the game.

DECK [deck_id] [deck_json]
This function creates a deck at the deck_id specified using the cards specified in the second argument. This second argument is the JSON output of an associative array, where the keys to the array are the names of the cards. the shuffled cards can then be dealt out to player through SIMPLEDEAL or DEAL commands by providing the deck_id into which the cards have been inserted.

if you wish to deal cards into an existing deck, you should use the DECKBACK and DECKRESTORE functionality (see those entries) as this will by default simply overwrite any existing content in that deck_id.

the keys to the associative array should be unique, as it is these items which are shuffled in the deck and then dealt out to players. if you need to create a deck that has duplicate cards, you can simply have duplicate entries in the associative array with similar contents but slightly different names ("joker1", "joker2", etc.). It is conventional to have the associative arrays needed to create decks in the returnDeck() functions in games. See RED IMPERIUM for a practical example of complex card deals and deck management with multiple decks and complicated criteria for dealing cards.



DECKXOR
an internal function used in the encryption and shuffle of cards

DECKFLUSH
an internal function that deletes all "discards" associated with a deck.


DECKENCRYPT
an internal function used in the encryption and shuffling of cards

RECEIVED [sender] [receiver] [amount] [timestamp] [ticker]
the receiver will halt execution of the game until they have received payment from the sender in the AMOUNT of cryptocurrency TICKER. the payment must be authorized by the sender and then handled by a module accessible to the game engine (such as the DOT/KUSAMA/WESTEND module).

this instruction will not clear until the payment has been made. it will not trigger payment from the sender, which requires a SEND instruction. most payments thus consist of a SEND instruction which is auto-cleared by all non-senders, and a RECEIVE instruction which halts execution for the recipients. 


BALANCE [amount] [address] [ticker]
check that the address provided in the cryptocurrency identified by the third argument contains at least the amount specified. the game is halted until this condition holds. the Saito Game Engine cannot enforce that funds on third-party networks do not move during the course of gameplay, but this provides a safe and useful way to ensure that funds are available when checks are required.


SEND [sender] [receiver] [amount] [timestamp] [ticker]
triggers the sender to make a payment to the receiver of the AMOUNT in cryptocurrency TICKER. the payment must be authorized by the sender and then handled by a module accessible to the game engine (such as the DOT/KUSAMA/WESTEND module).

this instruction will not clear until the payment has been made, but will fall through automatically once the payment has been made. note that the timestamp entry here is designed to prevent double-payment -- only payments that are recorded as being made after the timestamp provided will be acceptable and permit this instruction to clear.


CRYPTOKEY [saito_publickey] [third_party_crypto_publickey] [sig]
a player broadcasting this message is updating their peers on the publickey at which they can receive payments in the cryptocurrency which is set as the default for the game. the Saito publickey is used to sign the cryptographic sig that confirms the submission of this publickey. any instructions after this point on the stack will use the newly-submitted payment publickey.

if games are initialized using a Web3 cryptocurrency, the game engine will automatically initialize the game with this command so that payments are handled transparently across the Web3 Stack.


SETVAR
sets a variable on the game object where it will be available to all players.

example:

  game_self.addMove("SETVAR\tstate\thealth\t20");

outcome:

  game_self.state.health = 20;

practical use case:
Twilight Struggle uses the SETVAR variable to allow players to specify how many cards are still in their hand at the end of their turn, so that all players can calculate the number of cards that must be dealt for the next round and determine when deck reshuffles are needed.





