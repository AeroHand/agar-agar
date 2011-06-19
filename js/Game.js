var Game = function() {
    
    this.vectorfield = new Vectorfield();    
    this.inputHandler = new InputHandler(this.vectorfield);
    this.controller = new Controller(this.vectorfield);
    
    this.stardust = new Stardust(this.vectorfield);
    
    this.state = "init";
    
    this.drawVectorfield = true;
    this.drawStardust = true;
    
    this.leukoTime = 0;
    this.particleTime = 0;
    this.devourerTime = 0;
    this.entropyTime = 0;
    
    this.entropyfiers = [];
    
};

Game.prototype = {
    
    particleCount : 20,
    
    leukoRate : 5000,
    leukoAmount : 1,
    leukoCap : Leukocyte.prototype.absolutMaxCount,
    
    particleRate : 1500,
    
    entropyRate : 15000,
    entropyAmount : 1,
    
    devourerRate : 20000,

    initialize : function(gl) {
        
        Particle.initialize(gl);
        Leukocyte.initialize(gl);
        
        Devourer.initialize(gl);
        Cytoplast.initialize(gl);
        
        Entropyfier.initialize(gl);
        Glow.initialize(gl);
        
        this.initLevel();
        
        this.vectorfield.initialize(gl);
        this.inputHandler.initialize();
        this.stardust.initialize(gl);
        
        gl.bindShader(gl.defaultShader);
    
    },
    
    update : function(dt) {
        
        Timer.update(dt);
        Animator.update(dt);
        
        this.vectorfield.update(dt);
        this.controller.applyDevourerVortices(dt);
        this.inputHandler.update(dt);
        
        if (this.drawStardust) {
            
            this.stardust.update(dt);
            
        }
        
        if (this.state === "run") {
            
            this.controller.update(dt);
            this.updateLevel(dt);
            
        }
        
    },
    
    draw : function(gl) {
        
        this.drawEntropyfiers(gl);
        
        if (this.drawStardust) {
            
            this.stardust.draw(gl);
            
        }
        
        Glow.draw(gl, this.controller.devourers, Devourer.prototype.glowRadius);
        // Glow.draw(gl, this.controller.leukocytes, Leukocyte.prototype.glowRadius);
        
        if (this.drawVectorfield) {
            
            this.vectorfield.draw(gl);
            
        }
        
        this.controller.draw(gl);
        
        // this.inputHandler.draw(gl);
        
    },
    
    initLevel : function() {
        
        this.resetLevel();
        
        this.controller.addInitialParticles(this.particleCount);
        
        var midPoint = new Vector(this.vectorfield.cols / 2, this.vectorfield.rows / 2, 0),
            randomPosition = this.controller.getRandomOutsidePosition().subSelf(midPoint).mulSelf(.5);
        
        this.controller.devourers.push(new Devourer(midPoint.add(randomPosition)));
        this.controller.cytoplasts.push(new Cytoplast(midPoint.add(randomPosition.mulSelf(-1))));
        
        this.state = "run";
        
    },
    
    resetLevel : function() {
        
        Timer.reset();
        Animator.reset();
        
        this.leukoTime = 0;
        this.particleTime = 0;
        this.devourerTime = 0;
        this.entropyTime = 0;
        
        this.entropyfiers = [];
    
        this.controller.reset();
        this.vectorfield.reset();
        
        this.state = "init";
        
    },
    
    updateLevel : function(dt) {
        
        this.leukoTime += dt;
        this.entropyTime += dt;
        this.devourerTime += dt;
        this.particleTime += dt;
    
        if( this.leukoTime > this.leukoRate &&
            this.controller.leukocytes.length < this.leukoCap) {

            this.controller.addLeukocytes(this.leukoAmount);
            
            this.leukoTime -= this.leukoRate;
        
        }
        
        
        // FIXME: count particles in Cytoplast
        if( this.particleTime > this.particleRate &&
            this.controller.particles.length < Particle.prototype.maxCount) {
            
            this.controller.addParticle();
            
            this.particleTime -= this.particleRate;
        
        }
        
        if( this.entropyTime > this.entropyRate) {
        
            this.addEntropyfiers(this.entropyAmount);
            
            this.entropyTime -= this.entropyRate;
        
        }
        
        if( this.devourerTime > this.devourerRate) {
        
            this.controller.addDevourers(1);
            
            this.devourerTime -= this.devourerRate;
        
        }
        
    },
    
    lose : function() {
        
        this.controller.resetMultiplier();
        Menu.showLoserScreen(this.controller.points);
        
        game.state = "over";
        
    },
    
    drawEntropyfiers : function(gl) {
        
        for (var i = 0; i < this.entropyfiers.length; i++) {
            
            if (this.entropyfiers[i].burst) {
                
                this.entropyfiers.splice(i, 1);
                i--;
                
            } else {
                
                this.entropyfiers[i].draw(gl);
                
            }
            
        }
        
    },
    
    addEntropyfiers : function(amount) {

        for (var i = 0; i < amount; i++) {

            var center = new Vector(Math.random() * this.vectorfield.cols,
                                    Math.random() * this.vectorfield.rows);

            var radius = Entropyfier.prototype.entropyRadius * (Math.random() * .3 + .7);
            var time = Entropyfier.prototype.entropyTime * (Math.random() * .3 + .7);

            this.entropyfiers.push(new Entropyfier(center.getCopy(), time, radius));

            center.addSelf(new Vector(radius, 0).rotate2DSelf(Math.random() * Math.PI * 2));

            this.entropyfiers.push(new Entropyfier(center.getCopy(), time * 1.07, radius / 2));


            if (Math.random() > .5) {

                center.addSelf(new Vector(radius * 0.5, 0).rotate2DSelf(Math.random() * Math.PI * 2));

                this.entropyfiers.push(new Entropyfier(center.getCopy(), time * 1.11, radius / 3));

            }

        }

    },
    
    burstEntropyfier: function(entropyfier) {
        
        this.vectorfield.addForcefield(new Forcefield(
            entropyfier.position,
            entropyfier.forceRadius,
            Entropyfier.prototype.force,
            false,
            Math.PI,
            null,
            Entropyfier.prototype.forceTime
        ));
        
        entropyfier.burst = true;
        
    }

};