const ArcadeGameCreate			= require('./../arcade-main/arcade-game-create/arcade-game-create');

module.exports = ArcadeStartGameList = {

    render(app, data) {

        let start_games_list = document.querySelector(".start-game-list");
        let gamemods = data.arcade.mods;

        var wrapper = document.createElement('div');
        wrapper.id = 'game-list-wrapper';
        var html = `<div class="start-game">
                        <h1>Start A Game</h1>
                        <div class="start-game-list">
                        <div class="return-to-arcade" id="return-to-arcade">
                            <i class="icon-large fas fa-times-circle"></i>
                        </div>
                        `;
            for (let i = 0; i < gamemods.length; i++) {
            if (gamemods[i].respondTo("arcade-games")) {
                let gamemod_url = "/" + gamemods[i].name.toLowerCase() + "/img/arcade.jpg";
                var players = "Players: ";
                var minPlayers = gamemods[i].minPlayers;
                var maxPlayers = gamemods[i].maxPlayers;
                if (minPlayers == maxPlayers) {
                    players += minPlayers;
                } else {
                    players += minPlayers + "-" + maxPlayers;
                }
                html +=
                    `<div class="arcade-game-list-item" data-game="${gamemods[i].name}"> \
              <div class="arcade-game-list-image" style="background-image: url(${gamemod_url});"></div>
              <div class="arcade-gema-list-details">
                <div class="arcade-game-list-title"><h4>${gamemods[i].name}</h4></div>
                <div class="arcade-game-list-type">${gamemods[i].type}</h4></div>
                <div class="arcade-game-list-players">${players}</h4></div>
              </div>
            </div>`;
            }
        }
        html += "</div></div>";
        wrapper.innerHTML = html;
        document.querySelector('.arcade-main').appendChild(wrapper);

        setTimeout(() => {
            document.querySelector('.start-game').style.opacity = 1;
        }, 100);
        document.querySelector('#game-list-wrapper').addEventListener("click", function () {
            wrapper.remove();
        }, false);
        document.querySelector('#return-to-arcade').addEventListener("click", function () {
            wrapper.remove();
        }, false);
    },

    attachEvents(app, data) {

        Array.from(document.getElementsByClassName('arcade-game-list-item')).forEach(game => {
            game.addEventListener('click', (e) => {

                data.active_game = e.currentTarget.dataset.game;

                ArcadeGameCreate.render(app, data);
                ArcadeGameCreate.attachEvents(app, data);

            });
        });


    }
}