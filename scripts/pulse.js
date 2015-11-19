(function(){

  function Pulse(options) {

    this.x = options.x;
    this.y = options.y;
    this.radius = options.radius;
    this.npoints = options.npoints;
    this.alpha = options.alpha;
    this.isAlive = true;

    this.angle = TWO_PI / this.npoints;
  }

  Pulse.prototype.update = function(){
    this.radius = this.radius + 2;

    if(this.radius < 500){
    this.alpha = 1 - (this.radius / 500);
    } else {
    this.isAlive = false;
    }
  }

  Pulse.prototype.draw = function(){
    noFill();
    stroke('rgba(255,255,255,'+ this.alpha +')');
    strokeWeight(2);

    beginShape();

    for (var a = 0; a < TWO_PI; a += this.angle) {
      var sx = this.x + cos(a) * this.radius;
      var sy = this.y + sin(a) * this.radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }

  window.Pulse = Pulse;
})();
