export const ArcadeAddTemplate = () => {
    return `
      <div class="arcade-content">
        <h2 style="margin-bottom: 0.5em">Choose a Game</h2>
        <div class="gamelist">
          <div class="game" id="Twilight">
            <img class="gameimage" id="Twilight" src="/img/arcade/twilight.jpg" />
            <div class="gametitle" id="Twilight">Twilight Struggle</div>
          </div>

          <div class="game" id="Chess">
            <img class="gameimage" id="Chess" src="/img/arcade/chess.jpg" />
            <div class="gametitle" id="Chess">Chess</div>
          </div>

          <div class="game" id="Wordblocks">
            <img class="gameimage" id="Wordblocks" src="/img/arcade/wordblocks.jpg" />
            <div class="gametitle" id="Wordblocks">Wordblocks</div>
          </div>

          <div class="game" id="Pandemic">
            <img class="gameimage" id="Pandemic" src="/img/arcade/pandemic.jpg" />
            <div class="gametitle" id="Pandemic">Pandemic</div>
          </div>

          <div class="game" id="Poker">
            <img class="gameimage" id="Poker" src="/img/arcade/poker.jpg" />
            <div class="gametitle" id="Poker">Poker</div>
          </div>

          <div class="game" id="Solitrio">
            <img class="gameimage" id="Solitrio" src="/img/arcade/solitrio.jpg" />
            <div class="gametitle" id="Solitrio">Solitrio</div>
          </div>

        </div>
        <div class="arcade-start-game" style="display: none">
          <h2 id="game-title"></h2>
          <p id="game-description"></p>
          <div id="game-options"></div>
          <button id="submit-game">FIND OPPONENT</button>
        </div>
      </div>
    `;
}