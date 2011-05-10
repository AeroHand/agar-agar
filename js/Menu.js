var Menu = {
    
    menuOpen : false,
    musicOn : true,
    
    hideInfo : function(){        
        $("#newgame").hide();
        $("#instructions").hide();
        $("#versions").hide();
        $("#about").hide();
        $("#donate").hide();
        $("#loser").hide();
    },

    toggle : function(){

        $("#menu").slideToggle("fast");

        if(this.menuOpen){
            document.getElementById("playpause").style.backgroundImage = "url(images/pause.png)";
            document.getElementById("playpause").style.removeProperty("opacity");

            $("#overlay").fadeTo("slow", 0.0, function() {
                $("#overlay").hide();
            });

            game.isPaused = false;
            this.hideInfo();
        }
        else{
            document.getElementById("playpause").style.backgroundImage = "url(images/play.png)";
            document.getElementById("playpause").style.opacity = "0.2";

            $("#overlay").show();
            $("#overlay").fadeTo("slow", 0.7);

            game.isPaused = true;
        }

        this.menuOpen = !this.menuOpen;

    }, 
    
    initialize : function() {

        document.getElementById("playpause").onselectstart = function() {return false;};
        document.getElementById("stopmusic").onselectstart = function() {return false;};
        document.getElementById("points").onselectstart = function() {return false;};

        if (navigator.appVersion.indexOf("Mac")!=-1){
            document.getElementById("playpause").style.paddingTop = "5px";
            document.getElementById("stopmusic").style.paddingTop = "5px";
        }

        $("#playpause").click(function () {
            Menu.toggle();
        });

        $("#stopmusic").click(function () {

            if(Menu.musicOn){
                document.getElementById("stopmusic").style.backgroundImage = "url(images/sound_off.png)";
            }
            else{
                document.getElementById("stopmusic").style.backgroundImage = "url(images/sound_on.png)";
            }

            Menu.musicOn = !Menu.musicOn;
        });  

        $("#newg").click(function() { 
            Menu.hideInfo();
            $("#newgame").show();
        });

        $("#inst").click(function() { 
            Menu.hideInfo();
            $("#instructions").show();
        });

        $("#vers").click(function() { 
            Menu.hideInfo();
            $("#versions").show();
        });

        $("#abou").click(function() { 
            Menu.hideInfo();
            $("#about").show();
        });

        $("#dona").click(function() { 
            Menu.hideInfo();
            $("#donate").show();
        });

        $("#startnewgame").click(function() {
            game.isPaused = false;
            game.resetLevel();

            Menu.toggle();
            Menu.hideInfo();

            setTimeout(function() {
                game.initLevel();
            }, 1000);
        });
    }
};