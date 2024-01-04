game.PlayScreen = me.ScreenObject.extend({
    init: function() {
        me.audio.play("theme", true);
        // lower audio volume on firefox browser
        var vol = me.device.ua.indexOf("Firefox") !== -1 ? 0.3 : 0.5;
        me.audio.setVolume(vol);
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        me.game.reset();

        // Check if the image is loaded correctly
        if (me.loader.getImage("bg")) {
            this.bgLayer = new game.ScaledBackgroundLayer("bg", 1);
            me.game.world.addChild(this.bgLayer);
        } else {
            console.error("Background image not found!");
        }

        me.audio.stop("theme");
        if (!game.data.muted){
            me.audio.play("theme", true);
        }

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        game.data.score = 0;
        game.data.steps = 0;
        game.data.start = false;
        game.data.newHiscore = false;

        ////////me.game.world.addChild(new ScaledBackgroundLayer('bg', 1));
        ////me.game.world.addChild(new BackgroundLayer('bg', 1));
        ////this.bgLayer = new game.ScaledBackgroundLayer('bg', 1);
        this.bgLayer = new game.ScaledBackgroundLayer('bg', 1);
        me.game.world.addChild(this.bgLayer);

        this.ground1 = me.pool.pull('ground', 0, me.game.viewport.height - 96);
        this.ground2 = me.pool.pull('ground', me.game.viewport.width,
            me.game.viewport.height - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 11);

        this.bird = me.pool.pull("clumsy", 60, me.game.viewport.height / 2 - 100);
        me.game.world.addChild(this.bird, 10);

        //inputs
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.SPACE);

        this.getReady = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'getready'}
        );
        me.game.world.addChild(this.getReady, 11);

        var that = this;
        var fadeOut = new me.Tween(this.getReady).to({alpha: 0}, 2000)
            .easing(me.Tween.Easing.Linear.None)
            .onComplete(function() {
                game.data.start = true;
                me.game.world.addChild(new game.PipeGenerator(), 0);
                me.game.world.removeChild(that.getReady);
            }).start();
    },

    onDestroyEvent: function() {
        me.audio.stopTrack('theme');
        // free the stored instance
        this.HUD = null;
        this.bird = null;
        this.ground1 = null;
        this.ground2 = null;
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
    }
});

game.ScaledBackgroundLayer = me.ImageLayer.extend({
    init: function(image, z) {
        var img = me.loader.getImage(image);
        if (!img) {
            console.error("Image for ScaledBackgroundLayer not found: " + image);
            return;
        }
    
        var width = me.video.renderer.getWidth();
        var height = me.video.renderer.getHeight();
        // Call the parent constructor
        this._super(me.ImageLayer, 'init', [0, 0, image, width, height, z]);
    },
    
    update: function() {
        // Custom update logic if needed
        return true;
    },
    
    draw: function(renderer) {
        var originalSize = me.loader.getImage(this.image).height;
        var scale = me.game.viewport.height / originalSize;

        // Save the current context
        renderer.save();

        // Scale and draw the background image
        renderer.scale(scale, scale);
        this._super(me.ImageLayer, 'draw', [renderer]);

        // Restore the context
        renderer.restore();
    }
});

