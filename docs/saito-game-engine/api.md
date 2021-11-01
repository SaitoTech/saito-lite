
# Saito Game Engine -- API


| Field   | Value             |
| ------- | ----------------- |
| Author  | David Lancashire  |
| Status  | Published         |
| Type    | Protocol Standard |
| Created | August 31, 2021   |

This file contains documentation on the low-level functions supported by the Saito game engine. Games may add these instructions (with the appropriate arguments) to their game queue and the game engine will automatically execute the cryptographic functions needed on all player computers in order to execute the function requested. Please see our more general README file for instructions on how to get started coding games.

## Common Arguments

Before we get to a list of the instruction set supported by the game engine, what follows are a list of the most common arguments that must be submitted with instructions. Understanding what these terms mean is important to understanding what the various instructions listed below are actually doing.

#### deck - a deck of cards

A deck consists of a closed set of cards. Each card should be an entry in an associative array where the key is a unique string. In the event of a deck with multiple identical cards, the content of the cards can be the same but the key used to index them should be different (i.e. joker1, joker2). The Saito Game Engine supports the existence of multiple decks -- decks are assigned a specific deck_id number and interactions with them after creation work by specifying which deck is being used by reference to this deck_id number.

#### deck_json - JSON.stringify representation of a deck object, where the keys are unique strings that identify cards and the objects contain the information associated with the deck, such as the text or value of cards.

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

The Saito Game Engine supports the following instructions. In order for a game to execute them, it simply needs to add them to the queue. The Saito Game Engine will take care of the cryptographic exchanges needed to perform the requested actions automatically and return control to the game queue once this is done.

#### ACKNOWLEDGE [text/html]

Prompts all players to acknowledge the text or html message provided. The message is typically displayed in the status field of the GameHud UI element. Execution of gameplay and further processing of the game queue is halted until players acknowledge the message.

```javascript
  game_self.addMove("ACKNOWLEDGE\tThe Bene Gesserit have moved into Sector 14");
```

This instruction is useful to allow players to more easily track what is happening on the gameboard. Red Imperium uses the ACKNOWLEDGE command to ensure that players are aware of key developments in the game, such as when opponents play action cards. Using this command for notifications can also prevent information from leaking about player hands, the requirement that players manually intervene can prevent other players from guessing -- by speed of user response -- whether they in fact have the ability to do more than simply acknowledge.

#### CARDS
this is an internal function used in encrypting and shuffling decks of cards

#### DEAL [deck_id] [player_id] [number_of_cards_to_deal]

A simple function that deals the specified number of cards from the deck identified by deck_id to the player identified by player_id. Note that this is an unsafe function that performs low-level cryptographic work and does not check the availability of cards in the deck. If you are building a game that will run out of cards and require a reshuffle we recommend using SAFEDEAL instead.

```javascript
  game_self.addMove("DEAL\t1\t1\t7");
```

#### DECK [deck_id] [deck_json]
This function creates a deck at the deck_id specified using the cards specified in the second argument. This second argument is the JSON output of an associative array, where the keys to the array are the names of the cards. the shuffled cards can then be dealt out to player through SIMPLEDEAL or DEAL commands by providing the deck_id into which the cards have been inserted.

```javascript
  game_self.addMove("DECK\t1\t"+JSON.stringify(game_self.returnDeck()));
```

if you wish to deal cards into an existing deck, you should use the DECKBACK and DECKRESTORE functionality (see those entries) as this will by default simply overwrite any existing content in that deck_id.

the keys to the associative array should be unique, as it is these items which are shuffled in the deck and then dealt out to players. if you need to create a deck that has duplicate cards, you can simply have duplicate entries in the associative array with similar contents but slightly different names ("joker1", "joker2", etc.). It is conventional to have the associative arrays needed to create decks in the returnDeck() functions in games. See RED IMPERIUM for a practical example of complex card deals and deck management with multiple decks and complicated criteria for dealing cards.

#### DECKBACKUP
this is a partner function with DECKRESTORE that is used when shuffling cards into . the technique requires backing up the existing cards, shuffling the new cards into the deck (overwriting the content) and the DECKRESTORE to add the backed-up cards into the newly shuffled deck. At the end of this process SHUFFLE can be called to randomize the new cards together with the old ones.


```javascript
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
```

#### DECKRESTORE
this is a partner function with DECKBACKUP that is used when reshuffling old cards into an existing deck. the technique requires backing up the existing cards with DECKBACKUP, shuffling the new cards into the deck (overwriting the content) and then using DECKRESTORE to add the backed-up cards into the newly shuffled deck. At the end of this process SHUFFLE can be called to randomize the new cards together with the old ones.

```javascript
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
```

#### DECKENCRYPT
an internal function used in the encryption and shuffling of cards

#### DECKFLUSH
an internal function that deletes all "discards" associated with a deck.

#### DECKXOR
an internal function used in the encryption and shuffle of cards

#### FLIPRESET
this is an internal function for dealing cards into pools

#### FLIPCARD
this is an internal function for dealing cards into pools

#### GAMEOVER

ends the game

```javascript
  game_self.addMove("GAMEOVER");
```

### ISSUEKEYS
An internal function used in the course of dealing cards


### LOGDECK [deck_id]
Prints the cards in the specified deck to the log, used primarily for debugging.

```javascript
  game_self.addMove("LOGDECK\t1");
```

LOGHAND [deck_id]
Prints the cards that have been dealt to the active player from the specified deck, used primarily for debugging.

```javascript
  game_self.addMove("LOGDECK\t1");
```

#### LOGPOOL [pool_id]
Prints the cards that have been dealt into the specified pool, used primarily for debugging.

```javascript
  game_self.addMove("LOGPOOL\t1");
```
#### NOTIFY [text]
notifies the player by printing a text message to the player log

#### OBSERVER
enables observer mode, an optional mode of gameplay in which information on the content of player hands is permitted to leak into public so that third-parties can watch the game in real-time or step through it steo-by-step after the fact.

```javascript
  game_self.addMove("OBSERVER");
```

#### PLAY [player_id or array of player_ids]
this instruction takes either the player_id of the player who should move, or an array of the player_ids of the players who should move. if a single player is specified that player should prependMove("RESOLVE") to clear the PLAY command once they have finished their move. If multiple players are provided players should prepend the same RESOLVE command, but with the publickey of the current player as the second argument. valid examples of triggering player turns include:

```javascript
  game_self.addMove("PLAY\tall");
  game_self.addMove("PLAY\t[1,2]");
  game_self.addMove("PLAY\t1");
  game_self.addMove("PLAY\t2");
```

when PLAY is triggered the state of the game will halt for all non-moving players until all players who are required to move have submitted a RESOLVE instruction with their publickey. this resolve move must be submitted even if players do nothing, as follows:

```javascript
  game_self.addMove("RESOLVE\t[publickey]");
  game_self.addMove("NOTIFY\tPlayer 1 does nothing");
```

if you use PLAY to permit multiple players to move simultaneously please note that recursive simultaneous moves are not permitted. it is useful to remember that if multiple players are able to move simultaneously the order in which player moves are executed cannot be guaranteed by the underlying game engine, so do not structure gameplay that requires sequential execution of moves using this technique. instead, use an explicitly round-robin approach. this technique is primarily useful for speeding up game responses.

#### POOL [pool_id]
this createa an empty "pool" of cards into which cards can be dealt by POOLDEAL. any cards dealt into this pool will be visible to all players in the game. the index number of the pool should be a unique number known by the game.

```javascript
  game_self.addMove("POOL\t1");
```

#### POOLDEAL [number_of_cards] [deck_id] [pool_id]
this function deals the number of cards specified from the deck specified into the pool specified. it assumes that there are enough cards in the deck to deal into the pool.

```javascript
  game_self.addMove("POOLDEAL\t7\t1\t1");
```

#### READY
executing this instruction tells the game engine that the game has finished initializing and is ready for play. third-party appliations like the Saito Arcade that permit users to create and join games wait until this command is run until they permit users to click-through and join the games in process. this approach has been taken to avoid users joining games that are being initialized and getting confused. 

  game_self.game.queue.push("READY");

#### REQUESTKEYS
this is an internal function used in the course of dealing cards

#### RESETCONFIRMSNEEDED
specifies the number of RESOLVE messages that must be received from different players for the next RESOLVE instruction to clear. see the comments on the PLAY instruction for clarity on how this works. note that this is an advanced function that should only be used if you know what you are doing and know you really need to be playing around with when and how the game engine continues executing the queue.

```javascript
  game_self.addMove("RESETCONFIRMSNEEDED\tall");
  game_self.addMove("RESETCONFIRMSNEEDED\t[1,2]");
  game_self.addMove("RESETCONFIRMSNEEDED\t2");
  game_self.addMove("RESETCONFIRMSNEEDED\t1");
```

#### RESOLVE [publickey]
this instruction clears the previous entry in the queue and then clears itself, permitting the game engine to continue to execute instructions. if a publickey is submitted as the first argument this indicates that multiple players need to submit these instructions for the RESOLVE command to take effect and for gameplay to continue.

```javascript
  game_self.addMove("RESOLVE");
  game_self.addMove("RESOLVE\tnD7zNvTX9BzyPmQvVbKjP1RJhbftyiTjjFB6uxA5mfoX");
```

#### RESOLVEDEAL
this is an internal function used in the course of dealing cards to players.

#### RESOLVEFLIP
this is an internal function used in the course of dealing cards to pools.

#### SECUREROLL [player] [hash] [sig]
this provides a method for players to reset the random number generator in the game using inputs from all players so as to prevent look-ahead attacks on random number generation. please see the test suite for an example of how to implement this function.

```javascript
  game_self.addMove("SECUREROLL\t1\taaab76f16ad484b2aa02d167272bf0a51cd8c6d5e0ddc9c44ba7f77f12c9940b\t3gHZjty6oghJ8rMCPnBbhRkRhq3xi2SsdwD93zK52kT3nRK6AZ6v7bvYtskdGh9KTb69zYhVxUm6d6PZELB9jMQJ");
```

#### SECUREROLL_END
this is an internal function used in secure roll generation. please see the test suite for an example of how to implement this function.

#### SETVAR
sets a variable on the game object where it will be available to all players.

```javascript
  game_self.addMove("SETVAR\tstate\thealth\t20");

  // outcome is equivalent to all players setting

  game_self.state.health = 20;
```

#### SHUFFLE [deck_id]
shuffles the cards in the deck identified by the deck_id. See the DECK command for instructions on how to import a deck. 

```javascript
  game_self.addMove("SHUFFLE\t1");
```
#### SIMPLEDEAL [number_of_cards] [deck_id] [deck_json]
simple function that automates importing a deck to the specified deck index, and then dealing the specified number of cards to all players in the game. See DECK for requirements on how decks are formatted and converted into JSON for processing by the game engine..

```javascript
  game_self.addMove("SIMPLEDEAL\t1\t"+JSON.stringify(game_self.returnDeck()));
```

#### SIMULTANEOUS_PICK [player] [hash] [sig]
this provides a method for players to select and broadcast cards or other information securely. both players must independently send this move and then the game engine will take over and complete the action.

  game_self.addMove("SIMULTANEOUS_PICK\t1\taaab76f16ad484b2aa02d167272bf0a51cd8c6d5e0ddc9c44ba7f77f12c9940b\t3gHZjty6oghJ8rMCPnBbhRkRhq3xi2SsdwD93zK52kT3nRK6AZ6v7bvYtskdGh9KTb69zYhVxUm6d6PZELB9jMQJ");

see the Game Test Suite for sample code that shows how players should send information. This instruction needs to be the output of a process of information selection by the player, and that is UI dependent. once the instructions have been executed the cards will be available for perusal in the game state in an array which stores the results submitted by each player.

```javascript
  game_self.game.state.sp[0] // plater 1
  game_self.game.state.sp[1] // player 2
```

#### SIMULTANEOUS_PICK_END
this is an internal function used in the simultaneous pick of cards.


## Web3 and Cryptocurrency Integration

In addition to the functions above that handle deck and dice and random number production, the following instructions may be used to add web3 interactivity with games. These require players to maintain balances of a set amount at arbitrary addresses on other cryptocurrency networks, or to send or receive tokens in the specified amounts to other addresses.

#### BALANCE [amount] [address] [ticker]

check that the address provided in the cryptocurrency identified by the third argument contains at least the amount specified. the game is halted until this condition holds. the Saito Game Engine cannot enforce that funds on third-party networks do not move during the course of gameplay, but this provides a safe and useful way to ensure that funds are available when checks are required.

```javascript
  game_self.addMove("RECEIVED\t${amount}\t${address}\tDOT");
```

#### CRYPTOKEY [saito_publickey] [third_party_crypto_publickey] [sig]

 a player broadcasting this message is updating their peers on the publickey at which they can receive payments in the cryptocurrency which is set as the default for the game. the Saito publickey is used to sign the cryptographic sig that confirms the submission of the new receiving address. the game engine should enforce that any payments made after this point will use the newly-submitted publickey/address for payment receipt.

if games are initialized using a Web3 cryptocurrency, the game engine will automatically initialize the game with this command so that payments are handled transparently across the Web3 Stack. see the underlying game engine template file in /lib/templates/game.template.js for details on how this is formatted.


#### RECEIVE [sender] [receiver] [amount] [timestamp] [ticker]

```javascript
  game_self.addMove("RECEIVE\t${sender}\t${receiver}\t${amount}\t${timestamp}\tDOT");
```

the receiver will halt execution of the game until they have received payment from the sender in the AMOUNT of cryptocurrency TICKER. the payment must be authorized by the sender and then handled by a module accessible to the game engine (such as the DOT/KUSAMA/WESTEND module). the game engine will halt execution until the payment is received, but cannot enforce that payment is made in this situation.

this instruction will not clear until the payment has been made and confirmed as received according to the settlement logic of the module that supports cryptocurrency integration with Saito. it will not trigger payment from the sender, which requires a SEND instruction. most payments thus consist of a SEND instruction which is auto-cleared by all non-senders, and a RECEIVE instruction which halts execution for the recipients. 

#### SEND [sender] [receiver] [amount] [timestamp] [ticker]
triggers the sender to make a payment to the receiver of the AMOUNT in cryptocurrency TICKER. the payment must be authorized by the sender and then handled by a module accessible to the game engine (such as the DOT/KUSAMA/WESTEND module).

```javascript
  game_self.addMove("SEND\t${sender}\t${receiver}\t${amount}\t${timestamp}\tDOT");
```

this instruction will not clear until the payment has been made, but will fall through automatically once the payment has been made. note that the timestamp entry here is designed to prevent double-payment -- only payments that are recorded as being made after the timestamp provided will be acceptable and permit this instruction to clear.

