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
