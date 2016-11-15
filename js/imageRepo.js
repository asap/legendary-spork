/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
var imageRepository = new function() {
  // Define images
  this.background = new Image();
  this.tardis = new Image();

  // TODO: Refactor so it can take any number of images?
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
