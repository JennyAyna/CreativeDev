(function(){

  function Sun(options) {

    this.radius = options.radius;
    this.alpha = 1;
    this.isAlive = true;

    this.angle = TWO_PI / this.npoints;
  }

  Sun.prototype.draw = function(){
    stroke('rgba(255, 217, 56, 0.25)');
    strokeWeight(15);
    fill('rgba(255, 183, 74,'+ this.alpha +')');
    ellipse(300, 100, this.radius, this.radius);

  }

  window.Sun = Sun;
})();
