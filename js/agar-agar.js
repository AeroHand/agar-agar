var canvas,
    gl,
    game,
    time;

function initialize() {
    
    canvas = document.getElementById("canvas");
    
    var cellSize = game.vectorfield.initSize(window.innerWidth, window.innerHeight);
    
    canvas.width = game.vectorfield.cols * cellSize;
    canvas.height = game.vectorfield.rows * cellSize;
    
    gl = canvas.getContext("experimental-webgl");
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    // gl.enable(gl.DEPTH_TEST);
    
    gl.translate(-1, 1);
    gl.scale(1 / (canvas.width / 2) * cellSize, -1 / (canvas.height / 2) * cellSize);
    
    gl.lineWidth(2.0);
    gl.noFill();

    gl.setupDefaultShader();    
    gl.initUtilityBuffers();
    
    game.initialize(gl);
    
    time = (new Date()).getTime();
    
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
        game.draw(gl);

    }
    
};

window.onload = function() {
    
    game = new Game();
    
    Menu.initialize();
    
    if (!window.WebGLRenderingContext) {
        
        game.state = "pause";
        
        Menu.showErrorScreen();
        return;
        
    }
    
    initialize();
    
    run();

};
