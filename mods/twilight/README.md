
This is an implementation of Twilight Struggle written for the open source Saito Game Engine Module. It is intended as a demonstration of running complicated, rules-based games on a blockchain, letting the underlying game engire provide provably-fair dice rolls and deck management. You can try it out on the Saito Arcade (https://apps.saito.network/arcade).

As a fan of GMT Games and Twilight Struggle, our hope is that this module helps introduce new players to the company and the game, supports the Twilight Struggle community, and encourages the emergence of improved ecosystems for online gaming which will give games publishers like GMT Games more freedom to license their games for direct play on a game-by-game basis if they wish. We strive to make this game as standards-compliant as possible.

Please see the /licence directory for details on legalese. The short version is that the code that implements the game rules is released under the MIT license for all uses atop the Saito Game Engine. All GMT-developed materials (board design, cards, gameplay text) remain owned by GMT Games and are distributed under their own license, which provides for gameplay and distribution under the following conditions:

	1. The game files may only be used by open source, non-commercial game engines

	2. At least ONE player in every game should have purchased a commercial copy of the game.

If you are a player or developer who enjoys playing around with this implementation, please respect the goodwill shown by GMT Games and purchase a copy of the game. Likewise, if you make this demo available for play on a public server, please make sure that any players you support can fulfill these conditions by making it easy for them to purchase commercial copies of the game. As of January 2019, Twilight Struggle can be easily purchased online from these links below:

GMT GAMES:
https://www.gmtgames.com/p-588-twilight-struggle-deluxe-edition-2016-reprint.aspx

AMAZON:
https://www.amazon.com/GMT-Games-Twilight-Struggle-Deluxe/dp/B0060L6EE4/

STEAM:
https://store.steampowered.com/app/406290/Twilight_Struggle




CARDS ERRATA AND IMPLEMENTATION DETAILS:

1. Wargames:
  Significant misinformation about this card resulting from the unstandard Playdek implementation. If the eventing of this card results in VP being at the 0 mark, then the game is ended on a tie (the eventing player does not lose).

2. Red Purge:
  It is possible to event this card multiple times. The card does not stay out of the discard pile untilshould be possible to event this card multipletime

3. Latin American Death Squads:
  Coup bonus and penalities are applied only to coups in Central and South America, not across-the-board as in the original card text. The card text has been updated to reflect the proper implementation.

4. Flower Power & Camp David
  Camp David cancels the event Arab Israeli War, but playing the card will still cost the US 2 VP under Flower Power. The VP are issued if the card is played for OPs regardless of whether the event triggers (similar to Defectors).


