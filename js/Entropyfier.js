var Entropyfier = function(position, chargeTime, entityRadius) {

    this.position = position;
    this.entityRadius = entityRadius || 0;
    this.forceRadius = this.entityRadius * 2.0;
    
    var self = this;
    
    this.timeout = Timer.setTimeout(function() {
        
        game.burstEntropyfier(self);
        
    }, chargeTime);
    
    this.burst = false;

};

Entropyfier.initialize = function(gl) {
    
    this.shader = gl.loadShader("entropyfier-vertex-shader", "entropyfier-fragment-shader");

    gl.bindShader(this.shader);

    this.shader.positionAttribLocation = gl.getAttribLocation(this.shader, "position");

    this.shader.matrixUniformLocation = gl.getUniformLocation(this.shader, "matrix");
    this.shader.lifeTimeUniformLocation = gl.getUniformLocation(this.shader, "lifeTime");
    
};

Entropyfier.prototype = {
    
    entropyTime : 8000,
    entropyRadius : 7,
    forceTime : 1000,
    force : 25,

    draw : function(gl) {

        // if (this.timer <= this.chargeTime) {
        //     gl.fill();
        // 
        //     gl.setColor(.9, .9, .9, Math.sqrt(this.timer / this.chargeTime));
        //     gl.drawCircle(this.position.x, this.position.y, Math.sqrt(this.timer / this.chargeTime) * this.entityRadius);
        // 
        //     gl.noFill();
        // 
        //     gl.setColor(.7, .7, .7, Math.sqrt(this.timer / this.chargeTime));
        //     gl.drawCircle(this.position.x, this.position.y, Math.sqrt(this.timer / this.chargeTime) * this.entityRadius);
        //     
        // }
        
        gl.fill();
        
        gl.bindShader(Entropyfier.shader);
        
        var elapsedPercent = this.timeout.elapsed / this.timeout.duration;
        
        gl.uniform1f(
            Entropyfier.shader.lifeTimeUniformLocation, 
            elapsedPercent
        );
        
        gl.drawCircle(this.position.x, this.position.y, (Math.sqrt(elapsedPercent) + 1) * this.entityRadius * 0.5);
    
    }

};
