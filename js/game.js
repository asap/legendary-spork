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
