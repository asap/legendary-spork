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
