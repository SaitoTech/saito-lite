const GameHexGridTemplate = require('./game-hexgrid.template');

class GameHexGrid {

    constructor(app, data=null) {
      this.app = app;
      if (data){
        this.height = data.height;
        this.width = data.width;
        this.hexmode = data.hexmode;
      }else{
        this.height = 5;
        this.width = 5;
        this.hexmode = [0,1,1,1,0,     1,1,1,1,   1,1,1,1,1,    1,1,1,1,    0,1,1,1,0];  
      }
      
    }

    render(app, mod) {
      if (!document.querySelector(".game-hexgrid-container")) { app.browser.addElementToDom(GameHexGridTemplate(this.height, this.width, this.hexmode)); }
    }

    attachEvents(app, game_mod) {
    }

    addToEdge(hexid, elementHtml){


    }

    addToCorner(hexid, elementHtml){

    }



}

module.exports = GameHexGrid

