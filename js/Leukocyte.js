var Leukocyte = function(position) {

    Entity.call(this, position);
    
    this.isActive = true;
    this.activeTimer = 0;
    this.age = 0;
    
};

Leukocyte.prototype = new Entity();
Leukocyte.prototype.constructor = Entity;

Leukocyte.prototype.mass = 300000;
Leukocyte.prototype.moveSpeed = .3;

Leukocyte.prototype.entityRadius = .7;
Leukocyte.prototype.circleResolution = 16;

Leukocyte.prototype.eatTime = 300;

Leukocyte.prototype.glowRadius = .7;

Leukocyte.prototype.absolutMaxCount = 30;
Leukocyte.prototype.textureSizeFactor = 2.0;

Leukocyte.initialize = function(gl) {
    
    this.vertexBuffer = gl.createBuffer();
    this.vertexBuffer.itemSize = 2;
    
    this.vertexArray = new Float32Array(Leukocyte.prototype.absolutMaxCount * this.vertexBuffer.itemSize);
    
    this.paramsBuffer = gl.createBuffer();
    this.paramsBuffer.itemSize = 3;
    
    this.paramsArray = new Float32Array(Leukocyte.prototype.absolutMaxCount * this.paramsBuffer.itemSize);
    
    this.indexBuffer = gl.createBuffer();
    this.indexBuffer.itemSize = 1;
    
    var length = Leukocyte.prototype.absolutMaxCount * this.indexBuffer.itemSize,
        indexArray = new Float32Array(length);
    
    for (var i = 0; i < length; i++) {
        
        indexArray[i] = i;
        
    }
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);

    this.shader = gl.loadShader("leukocyte-vertex-shader", "leukocyte-fragment-shader");
    
    gl.bindShader(this.shader);
    
    gl.uniform1f(
        gl.getUniformLocation(this.shader, "radius"),
        Leukocyte.prototype.entityRadius
    );
    
    this.shader.matrixUniformLocation = gl.getUniformLocation(this.shader, "matrix");
    gl.passMatrix();
    
    var self = this;
    
    this.texture = gl.loadTexture("textures/leukocyte.png", function(gl) {
        
        gl.bindShader(self.shader);
        gl.passTexture(self.texture, gl.getUniformLocation( self.shader, "texture" ));
        
    });
    
    gl.uniform1f(
        gl.getUniformLocation(this.shader, "size"), 
        game.vectorfield.cellSize * 2 * Leukocyte.prototype.textureSizeFactor * Leukocyte.prototype.entityRadius
    );
    
};

Leukocyte.draw = function(gl, leukocytes) {
    
    for (var i = 0; i < leukocytes.length; i++) {
        
        this.vertexArray[i * 2] = leukocytes[i].position.x;
        this.vertexArray[i * 2 + 1] = leukocytes[i].position.y;
        
        this.paramsArray[i * 3] = leukocytes[i].orientation.norm();
        this.paramsArray[i * 3 + 1] = leukocytes[i].orientation.angle();
        this.paramsArray[i * 3 + 2] = leukocytes[i].age * 0.001;
        
        if (!leukocytes[i].isActive) {
        
            leukocytes[i].deadParticle.position = leukocytes[i].position.add(leukocytes[i].orientation);
            Particle.drawEnqueue([leukocytes[i].deadParticle]);
        
        }
        
    }
    
    gl.bindShader(this.shader);
    gl.enableAlpha();
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexArray, gl.STATIC_DRAW);
    
    var positionAttribLocation = 0;
    gl.vertexAttribPointer(positionAttribLocation, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.paramsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.paramsArray, gl.STATIC_DRAW);
    
    var textureCoordAttribLocation = 1;
    gl.vertexAttribPointer(textureCoordAttribLocation, this.paramsBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.POINTS, leukocytes.length, gl.UNSIGNED_SHORT, 0);
    
    gl.disableAlpha();
    gl.bindShader(gl.defaultShader);

};

Leukocyte.prototype.update = function(dt) {
    
    Entity.prototype.update.call(this, dt);
    
    this.age += dt;
    
};

Leukocyte.prototype.eatParticle = function(particlePosition) {
    
    this.isActive = false;
    
    this.orientation = particlePosition.sub(this.position);
    this.deadParticle = new Particle(this.orientation);
    
    var self = this;
    
    Animator.animate({
        object: this.orientation, 
        values: {"x" : 0, "y" : 0}, 
        duration: Leukocyte.prototype.eatTime * 0.5,
        
        callback: function() {
            self.orientation.set(0, 0, 0);
            
            Animator.animate({
                object: self.deadParticle, 
                values: {"alpha" : 0.7}, 
                duration: Leukocyte.prototype.eatTime * 0.5,
                callback: function() {
                    self.isActive = true;
                }
            });
            
        }
        
    });
    
};
