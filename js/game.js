var game = {
    data: {
        score : 0,
        steps: 0,
        start: false,
        newHiScore: false,
        muted: false
    },

    resources: [
        // images
        {name: "bg", type:"image", src: "data/img/bg.png"},
        {name: "clumsy", type:"image", src: "data/img/clumsy.png"}, // default
        {name: "clumsy1", type:"image", src: "data/img/clumsy1.png"}, // stone
        {name: "clumsy2", type:"image", src: "data/img/clumsy2.png"}, // gold
        {name: "clumsy3", type:"image", src: "data/img/clumsy3.png"}, // diamond
        {name: "pipe", type:"image", src: "data/img/pipe.png"},
        {name: "logo", type:"image", src: "data/img/logo.png"},
        {name: "ground", type:"image", src: "data/img/ground.png"},
        {name: "gameover", type:"image", src: "data/img/gameover.png"},
        {name: "gameoverbg", type:"image", src: "data/img/gameoverbg.png"},
        {name: "hit", type:"image", src: "data/img/hit.png"},
        {name: "getready", type:"image", src: "data/img/getready.png"},
        {name: "new", type:"image", src: "data/img/new.png"},
        {name: "walletButton", type:"image", src: "data/img/walletButton.png"},
        {name: "share", type:"image", src: "data/img/share.png"},
        {name: "tweet", type:"image", src: "data/img/tweet.png"},
        {name: "fb", type:"image", src: "data/img/share.png"},
        
        // sounds
        {name: "theme", type: "audio", src: "data/bgm/"},
        {name: "hit", type: "audio", src: "data/sfx/"},
        {name: "lose", type: "audio", src: "data/sfx/"},
        {name: "wing", type: "audio", src: "data/sfx/"}
    ],

    "onload": function() {
        // Get the window dimensions
        //var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        //var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.resizeGame();
    
        // Initialize the audio.
        me.audio.init("mp3,ogg");
        me.loader.preload(game.resources, this.loaded.bind(this));

        // Listen to resize events and update the game size
        window.addEventListener('resize', this.resizeGame.bind(this));

    },

    "resizeGame": function() {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    
        // Initialize the video.
        if (!me.video.init(width, height, {wrapper: "screen", scale: "auto", scaleMethod: "fit"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Adjust the game viewport size
        me.game.viewport.resize(width, height);
    },

    "loaded": function() {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        me.input.bindKey(me.input.KEY.M, "mute", true);
        me.input.bindPointer(me.input.KEY.SPACE);

        me.pool.register("clumsy", game.BirdEntity);
        me.pool.register("pipe", game.PipeEntity, true);
        me.pool.register("hit", game.HitEntity, true);
        me.pool.register("ground", game.Ground, true);

        me.state.change(me.state.MENU);
    }
};

game.ScaledBackgroundLayer = me.ImageLayer.extend({
    init: function(image, z) {
        var img = me.loader.getImage(image);
        if (!img) {
            throw new Error("Image for ScaledBackgroundLayer not found: " + image);
        }

        var width = me.video.renderer.getWidth();
        var height = me.video.renderer.getHeight();
        this._super(me.ImageLayer, 'init', [0, 0, image, width, height, z]);
    },

    update: function() {
        return true;
    },

    draw: function(renderer) {
        var originalSize = me.loader.getImage(this.image).height;
        var scale = me.game.viewport.height / originalSize;
        renderer.save();
        renderer.scale(scale, scale);
        this._super(me.ImageLayer, 'draw', [renderer]);
        renderer.restore();
    }
});
