(function(){

  function Magnet(options) {
      this.position = options.position;
      this.target = options.target;
      this.diameter = random(8, 22);
      this.direction = random(8, 22);
      this.size = options.size;
      this.alpha = options.alpha * 200;
      this.lifespan = 200;
  }

  Magnet.prototype.update = function() {
      /*fonction p5.js calculant la distance entre la position current et le
      target coordinate Pour 1 => la distance est nulle, les points s'affichent
      comme s'ils apparaissent.*/
      this.position = p5.Vector.lerp(
          this.position, //Commence à la position current
          this.target, //S'arrête à la position target coordinate
          0.8 //interpolation
      );


        this.lifespan -= 1;
  };

  Magnet.prototype.draw = function(size) {
    	var time = millis() % 30000;
      var hue = random(10, 255);

      var sizeFinal = (Math.random()*1)-5 + size - 10;
      fill(hue, 30, this.alpha);
      noStroke();

      ellipse(
          this.position.x, this.position.y,
          sizeFinal, sizeFinal //Size des ellipses
      );
      // rect(this.position.x, this.position.y, size, size);
  };

  window.Magnet = Magnet;
})();
