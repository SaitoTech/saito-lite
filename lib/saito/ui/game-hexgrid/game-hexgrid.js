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
        this.hexes = ['1_1','1_2','1_3','2_1','2_2','2_3','2_4','3_1','3_2','3_3','3_4','3_5','4_2','4_3','4_4','4_5','5_3','5_4','5_5'];

      }
        /*
          Index as follows:
                  (1,1) (1,2) (1,3)
                (2,1) (2,2) (2,3) (2,4)
            (3,1) (3,2) (3,3) (3,4) (3,5)
                (4,2) (4,3) (4,4) (4,5)
                  (5,3) (5,4) (5,5)
            This way neighboring hexes differ by +/- r, +/-c, or +/- r&c

            Vertices:        Edges:
                 1           6    1
              6    2        5      2   
              5    3         4    3
                 4

          Vertices and edges are not duplicated. 
          3_1_1 and 6_2_2 are the same edge, but we only reference 3_1_1
          4_1_1, 2_2_1, and 6_2_2 are the same vertex, but 6_2_2 is the top reference
          Assigning vertices and edges moves left to right, top down. 
          Every hexagon has visible vertices 6 and 1 and visible edges 5, 6, 1
          
          Vertex: 6 > 2 > 4
                  1 > 5 > 3

        */

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

    /*
      hexid is a string of the pattern X_Y_Z
      X is the verteX number, Y row, Z column
    */

    //Returns a list of edge ids adjacent to the vertex id
    edgesFromVertex(hexid){
      let coord = hexid.split("_");
      let vid = parseInt(coord[0]);
      let rid = parseInt(coord[1]);
      let cid = parseInt(coord[2]);
      let edges = [];
      switch(vid){
        case 1: edges.push(this.verifyEdge(1,rid,cid), this.verifyEdge(6,rid,cid), this.verifyEdge(2,rid-1,cid-1));
                break;
        case 2: edges.push(this.verifyEdge(1,rid,cid), this.verifyEdge(2,rid,cid), this.verifyEdge(3,rid-1,cid));
                break;
        case 3: edges.push(this.verifyEdge(2,rid,cid), this.verifyEdge(3,rid,cid), this.verifyEdge(4,rid,cid+1));
                break;
        case 4: edges.push(this.verifyEdge(3,rid,cid), this.verifyEdge(4,rid,cid), this.verifyEdge(2,rid+1,cid));
                break;
        case 5: edges.push(this.verifyEdge(4,rid,cid), this.verifyEdge(5,rid,cid), this.verifyEdge(3,rid,cid-1));
                break;
        case 6: edges.push(this.verifyEdge(5,rid,cid), this.verifyEdge(6,rid,cid), this.verifyEdge(4,rid-1,cid-1));
                break;
      }

      return edges.filter(edge => edge);
    }

    verifyEdge(eid, r, c){
      //Check if there is a neighboring hexagon that would be the right name
      switch (eid){
        case 2: 
                if (this.exists(r,c+1)) 
                  return `5_${r}_${c+1}`;
                break;
        case 3:  
                if (this.exists(r+1,c+1)) 
                  return `6_${r+1}_${c+1}`;
                break;
        case 4:
               if (this.exists(r+1,c)) 
                  return `1_${r+1}_${c}`;
                break; 
        default: /*edges 5,6,1 are the default acceptable nomenclature*/ 
      }
      if (!this.exists(r,c)) return false;
      return eid+"_"+r+"_"+c;
    }


    verticesFromEdge(hexid){
      let coord = hexid.split("_");
      let eid = parseInt(coord[0]);
      let rid = parseInt(coord[1]);
      let cid = parseInt(coord[2]);
      let vertices = [];
      vertices.push(this.verifyVertex(eid,rid,cid));
      vertices.push(this.verifyVertex(eid+1,rid,cid));
      
      return vertices.filter(vertex => vertex); //Does it need a filter?
    }

    verifyVertex(vid, r,c){
      if (vid>6){
        vid -= 6;
      }
      switch (vid){
        case 2: if (this.exists(r,c+1)) return `6_${r}_${c+1}`;
            break;
        case 4: if (this.exists(r+1,c+1)) return `6_${r+1}_${c+1}`;
                if (this.exists(r+1,c)) return `2_${r}_${c+1}`;
            break;
        case 5: if (this.exists(r+1,c)) return `1_${r+1}_${c}`;
            break;
        case 3: if (this.exists(r+1,c+1)) return `1_${r+1}_${c+1}`;
                if (this.exists(r,c+1)) return `5_${r}_${c+1}`;
            break;        
      }
      return vid+"_"+r+"_"+c;
    }


    adjacentEdges(eid){
      let edges = [];
      for (let vertex of this.verticesFromEdge(eid))
        for (let edge of this.edgesFromVertex(vertex))
          if (edge != eid)
            edges.push(edge);
        
      return edges;
    }

    adjacentVertices(vid){
      let vertices = [];
      for (let edge of this.edgesFromVertex(vid))
        for (let vertex of this.verticesFromEdge(edge))
          if (vertex != vid)
            vertices.push(vertex);
      
      return vertices;
    }

    exists(r,c){
      return this.hexes.includes(r+"_"+c);
    }

    hexesFromVertex(hexid){
      let coord = hexid.split("_");
      let vid = parseInt(coord[0]);
      let r = parseInt(coord[1]);
      let c = parseInt(coord[2]);
      let hexes = [r+"_"+c];
      switch (vid){
        case 1: if (this.exists(r-1,c-1)) hexes.push(`${r-1}_${c-1}`);
                if (this.exists(r-1,c)) hexes.push(`${r-1}_${c}`);
                break;
        case 2: if (this.exists(r-1,c)) hexes.push(`${r-1}_${c}`);
                if (this.exists(r,c+1)) hexes.push(`${r}_${c+1}`);
                break;
        case 3: if (this.exists(r,c+1)) hexes.push(`${r}_${c+1}`);
                if (this.exists(r+1,c+1)) hexes.push(`${r+1}_${c+1}`);
                break;
        case 4: if (this.exists(r+1,c+1)) hexes.push(`${r+1}_${c+1}`);
                if (this.exists(r+1,c)) hexes.push(`${r+1}_${c}`);
                break;
        case 5: if (this.exists(r+1,c)) hexes.push(`${r+1}_${c}`);
                if (this.exists(r,c-1)) hexes.push(`${r}_${c-1}`);
                break;
        case 6: if (this.exists(r,c-1)) hexes.push(`${r}_${c-1}`);
                if (this.exists(r-1,c-1)) hexes.push(`${r-1}_${c-1}`);
                break;
      }
      return hexes;
    }

}

module.exports = GameHexGrid

