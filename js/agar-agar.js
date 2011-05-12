var canvas,
    gl,
    game,
    time,
    missingResourceCount = 0;

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
    
    gl.lineWidth(2.0);
    gl.noFill();

    gl.setupDefaultShader();    
    gl.initUtilityBuffers();
    
    game.initialize(gl);
    
};

function start() {
    
    if (missingResourceCount === 0) {
        
        run();
        
    }
    
};

function run() {

    requestAnimationFrame(run, canvas);
    
    var t = (new Date()).getTime(),
        dt = t - time;
        
    dt = dt > 30 ? 30 : dt;
    time = t;
    
    if (game.state === "init" || game.state === "run") {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        
        gl.setColor(1, 0, 0, 1);
        gl.drawRect(0, 0, 1, 1);
        
        game.update(dt);
        Animator.update(dt);
        
        game.draw(gl);

    }
    
};

window.onload = function() {
    
    Menu.initialize();
    
    missingResourceCount++;
    
    initialize();
    
    missingResourceCount--;
    
    start();

};
