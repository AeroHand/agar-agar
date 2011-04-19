var log = function() {
    console.log.apply(console, arguments);
};

var canvas,
    gl,
    game,
    time;

function initialize() {
    
    time = (new Date()).getTime();
    
    canvas = document.getElementById("canvas");
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    game = new Game(width, height);
    
    
    var cellSize = game.vectorfield.cellSize;
    
    canvas.width = width = game.vectorfield.cols * cellSize;
    canvas.height = height = game.vectorfield.rows * cellSize;
    
    
    gl = canvas.getContext("experimental-webgl");
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.viewport(0, 0, width, height);
    // gl.enable(gl.DEPTH_TEST);
    
    gl.translate(-1, 1);
    gl.scale(1 / (width / 2) * cellSize, -1 / (height / 2) * cellSize);
    
    gl.initBuffers();
    gl.setupDefaultShader();
    
};

function run() {

    requestAnimationFrame(run, canvas);
    
    var t = (new Date()).getTime();
    var dt = t-time;
    time = t;
    
    if (!game.isPaused) {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        
        gl.setColor(1, 0, 0, 1);
        gl.drawRect(0, 0, 1, 1);
        
        game.update(dt);
        game.draw(gl);
        
    }
    
};

window.onload = function() {   
     
    initialize();
    run();

};

/* agar-agar inheritance test */

var Particle = function(size) {
    this.size = size;
};

Particle.prototype.draw = function() {
    log("particle");
};

Particle.prototype.muh = function() {
    log(this.size);
};

var Obstacle = function(size, speed) {
    
    Particle.call(this, size);
    
    this.speed = speed;

};

Obstacle.prototype = new Particle;

Obstacle.prototype.draw = function() {
    
    Particle.prototype.draw.call(this);
    
    log("obstacle");
};

var particle = new Particle(5);
var obstacle = new Obstacle(3, 7);
var obstacle2 = new Obstacle(4, 8);

