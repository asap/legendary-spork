// http://blog.sklambert.com/html5-canvas-game-panning-a-background

/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var imageRepository = new function() {
  // Define images
  this.background = new Image();
  this.tardis = new Image();

  // TODO: Refactor?
  var numImages = 3;
  var numLoaded = 0;
  function imageLoaded () {
    numLoaded++;
    if (numLoaded === numImages) {
      window.init();
    }
  }

  this.background.onload = function () {
    imageLoaded();
  }
  this.tardis.onload = function () {
    imageLoaded();
  }

  this.background.src = "images/london.jpg";
  this.tardis.src = "images/tardis.gif";
}

/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up default variables
 * that all child objects will inherit, as well as the default
 * functions.
 */
function Drawable() {
  this.init = function(x, y, width, height) {
    // Default variables
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  this.speed = 0;
  this.canvasWidth = 0;
  this.canvasHeight = 0;

  this.draw = function () {}
  this.move = function () {}
}

/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
function Background() {
  this.speed = 1; // Redefine speed of the background for panning
  // Implement abstract function
  this.draw = function() {
    // Pan background
    this.x -= this.speed;
    this.context.drawImage(imageRepository.background, this.x, this.y);
    // Draw another image at the top edge of the first image
    this.context.drawImage(imageRepository.background, this.x - this.canvasWidth, this.y);
    // If the image scrolled off the screen, reset
    if (this.x >= this.canvasWidth) {
      this.x = 0;
    }
  };
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();

/**
 * Tardis
 *
 */

function Tardis () {
  this.speed = 3;
  this.draw = function () {
    this.context.drawImage(imageRepository.tardis, this.x, this.y);
  };
  this.move = function () {
    if (KEY_STATUS.up || KEY_STATUS.down || KEY_STATUS.left || KEY_STATUS.right) {
      this.context.clearRect(this.x, this.y, this.width, this.height);
      if (KEY_STATUS.up) {
        this.y -= this.speed;
        if (this.y <= 0) {
          this.y = 0;
        }
      } else if (KEY_STATUS.right) {
        this.x += this.speed;
        if (this.x >= this.canvasWidth/4*3)
          this.x = this.canvasWidth/4*3;
      } else if (KEY_STATUS.down) {
        this.y += this.speed;
        if (this.y >= this.canvasHeight - this.height) {
          this.y = this.canvasHeight - this.height;
        }
      } else if (KEY_STATUS.left) {
        this.x -= this.speed;
        if (this.x <= 0) {
          this.x = 0;
        }
      }
    }
    this.draw();
  };
}
Tardis.prototype = new Drawable();

/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
  /*
   * Gets canvas information and context and sets up all game
   * objects.
   * Returns true if the canvas is supported and false if it
   * is not. This is to stop the animation script from constantly
   * running on older browsers.
   */
  this.init = function() {
    // Get the canvas element
    this.bgCanvas = document.getElementById('background');
    this.tardisCanvas = document.getElementById('tardis');

    // Test to see if canvas is supported
    if (this.bgCanvas.getContext) {
      this.bgContext = this.bgCanvas.getContext('2d');
      this.tardisContext = this.tardisCanvas.getContext('2d');

      // Initialize objects to contain their context and canvas
      // information
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;

      Tardis.prototype.context = this.tardisContext;
      Tardis.prototype.canvasWidth = this.tardisCanvas.width;
      Tardis.prototype.canvasHeight = this.tardisCanvas.height;

      // Initialize the background object
      this.background = new Background();
      this.background.init(0,0); // Set draw point to 0,0

      this.tardis = new Tardis();
      // var tardisStartX = this.tardisCanvas.width/2 - imageRepository.tardis.width;
      // var tardisStartY = this.tardisCanvas.height/4*3 - imageRepository.tardis.height*2;
      var tardisStartX = 0;
      var tardisStartY = 0;
      this.tardis.init(tardisStartX, tardisStartY, imageRepository.tardis.width, imageRepository.tardis.height);

      return true;
    } else {
      return false;
    }
  };
  // Start the animation loop
  this.start = function() {
    animate();
  };
}

KEY_CODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
  e.preventDefault();
  KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}


/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
  requestAnimFrame( animate );
  game.background.draw();
  game.tardis.move();
}
/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

/**
 * Initialize the Game and starts it.
 */
var game = new Game();
function init() {
  if (game.init()) {
    game.start();
  }
}
