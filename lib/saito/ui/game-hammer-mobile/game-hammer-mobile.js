const GameHammerMobileTemplate = require('./game-hammer-mobile.template');
const hammer = require('./hammer');

module.exports = GameHammerMobile = {

  fixHammerjsDeltaIssue : null, 
  lastEvent : null,
  pinchZoomOrigin : null,
  element : null,

  pinchStart : { x: undefined, y: undefined }, 

  originalSize : {
    width: 2550,
    height: 1650
  },

  current : {
    x: 0,
    y: 0,
    z: 1,
    zooming: false,
    width: 2550,
    height: 1650,
  },

  last : {
    x: 0,
    y: 0,
    z: 1,
  },

  render : function(app, game_mod, attachTo ="body") {},

  attachEvents : function(app, game_mod, target = ".gameboard") {

    try {

    let hammer_self = this;

    //hammer_self.element = document.querySelector(target);
    hammer_self.element = document.getElementById('gameboard');

    var hammertime = new Hammer(hammer_self.element, {});

    hammertime.get('pinch').set({ enable: true });
    hammertime.get('pan').set({ threshold: 0 });

    hammertime.on('pan', function(e) {
      
      if (hammer_self.lastEvent !== 'pan') {
        hammer_self.fixHammerjsDeltaIssue = {
          x: e.deltaX,
          y: e.deltaY
        }
      }

      hammer_self.current.x = hammer_self.last.x + e.deltaX - hammer_self.fixHammerjsDeltaIssue.x;
      hammer_self.current.y = hammer_self.last.y + e.deltaY - hammer_self.fixHammerjsDeltaIssue.y;
      hammer_self.lastEvent = 'pan';
      hammer_self.update();
    });

    hammertime.on('pinch', function(e) {
      var d = hammer_self.scaleFrom(hammer_self.pinchZoomOrigin, hammer_self.last.z, hammer_self.last.z * e.scale)
      hammer_self.current.x = d.x + hammer_self.last.x + e.deltaX;
      hammer_self.current.y = d.y + hammer_self.last.y + e.deltaY;
      hammer_self.current.z = d.z + hammer_self.last.z;
      hammer_self.lastEvent = 'pinch';
      hammer_self.update();
    });


    hammertime.on('pinchstart', function(e) {
      hammer_self.pinchStart.x = e.center.x;
      hammer_self.pinchStart.y = e.center.y;
      hammer_self.pinchZoomOrigin = hammer_self.getRelativePosition(hammer_self.element, { x: hammer_self.pinchStart.x, y: hammer_self.pinchStart.y }, hammer_self.originalSize, hammer_self.current.z);
      hammer_self.lastEvent = 'pinchstart';
    });

    hammertime.on('panend', function(e) {
      hammer_self.last.x = hammer_self.current.x;
      hammer_self.last.y = hammer_self.current.y;
      hammer_self.lastEvent = 'panend';
    });

    hammertime.on('pinchend', function(e) {
      hammer_self.last.x = hammer_self.current.x;
      hammer_self.last.y = hammer_self.current.y;
      hammer_self.last.z = hammer_self.current.z;
      hammer_self.lastEvent = 'pinchend';
    });

    game_mod.hammertime = hammertime;

    } catch (err) {

alert("Error: " + err);

    }

  },

  update : function() {
    let hammer_self = this;
    hammer_self.current.height = hammer_self.originalSize.height * hammer_self.current.z;
    hammer_self.current.width = hammer_self.originalSize.width * hammer_self.current.z;
    hammer_self.element.style.transform = "translate3d(" + hammer_self.current.x + "px, " + hammer_self.current.y + "px, 0) scale(" + hammer_self.current.z + ")";
  },

  getRelativePosition : function(element, point, originalSize, scale) {
    let hammer_self = this;
    var domCoords = hammer_self.getCoords(element);

    var elementX = point.x - domCoords.x;
    var elementY = point.y - domCoords.y;

    var relativeX = elementX / (originalSize.width * scale / 2) - 1;
    var relativeY = elementY / (originalSize.height * scale / 2) - 1;
    return { x: relativeX, y: relativeY }
  },

  getCoords : function(elem) {

    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { x: Math.round(left), y: Math.round(top) };
  },

  scaleFrom : function(zoomOrigin, currentScale, newScale) {
    let hammer_self = this;
    var currentShift = hammer_self.getCoordinateShiftDueToScale(hammer_self.originalSize, currentScale);
    var newShift = hammer_self.getCoordinateShiftDueToScale(hammer_self.originalSize, newScale)

    var zoomDistance = newScale - currentScale

    var shift = {
            x: currentShift.x - newShift.x,
            y: currentShift.y - newShift.y,
    }

    var output = {
        x: zoomOrigin.x * shift.x,
        y: zoomOrigin.y * shift.y,
        z: zoomDistance
    }
    return output

  },

  getCoordinateShiftDueToScale : function(size, scale){
    var newWidth = scale * size.width;
    var newHeight = scale * size.height;
    var dx = (newWidth - size.width) / 2
    var dy = (newHeight - size.height) / 2
    return {
      x: dx,
      y: dy
    }
  }

}


