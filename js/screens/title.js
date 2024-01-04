game.TitleScreen = me.ScreenObject.extend({
    init: function(){
        this._super(me.ScreenObject, 'init');
        this.font = null;
        this.ground1 = null;
        this.ground2 = null;
        this.logo = null;
        this.walletButton = null;
    },

    onResetEvent: function() {
        me.audio.stop("theme");
        game.data.newHiScore = false;

        console.log("Preloading check:", me.loader.getImage('bg'));
        this.bgLayer = new game.ScaledBackgroundLayer('bg', 1);
        me.game.world.addChild(this.bgLayer);

        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", true);
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        /* SOLANA CONNECTION */

        console.log(me.loader.getImage("walletButton")); // Should output the image object
        this.walletButton = new me.Sprite(
            me.game.viewport.width / 2 - 50, // adjusted x position
            me.game.viewport.height / 2, // adjusted y position
            { image: 'walletButton' }
        );
        me.game.world.addChild(this.walletButton, 10);

        // Enter pressed
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                me.state.change(me.state.PLAY);
            }
        });

        this.logo = new me.Sprite(
            me.game.viewport.width / 2 - 158, // adjusted x position
            me.game.viewport.height / 2 - 100, // adjusted y position
            { image: 'logo' }
        );
        me.game.world.addChild(this.logo, 10);

        var that = this;
        var logoTween = me.pool.pull("me.Tween", this.logo.pos)
            .to({y: me.game.viewport.height/2 - 100}, 1000)
            .easing(me.Tween.Easing.Exponential.InOut).start();

        this.ground1 = me.pool.pull("ground", 0, me.video.renderer.getHeight() - 96);
        this.ground2 = me.pool.pull("ground", me.video.renderer.getWidth(),
                                    me.video.renderer.getHeight() - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);

        me.game.world.addChild(new (me.Renderable.extend ({
            // constructor
            init: function() {
                // size does not matter, it's just to avoid having a zero size
                // renderable
                this._super(me.Renderable, 'init', [0, 0, 100, 100]);
                this.text = me.device.touch ? 'Tap to start' : 'TAP / SPACE TO START \n\t\t\t\t\t\t\t\t\t\t\t"M" TO MUTE SOUND';
                this.font = new me.Font('gamefont', 20, '#000');
            },
            draw: function (renderer) {
                var measure = this.font.measureText(renderer, this.text);
                var xpos = me.game.viewport.width/2 - measure.width/2;
                var ypos = me.game.viewport.height/2 + 50;
                this.font.draw(renderer, this.text, xpos, ypos);
            }
        })), 12);
    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
        this.ground1 = null;
        this.ground2 = null;
        me.game.world.removeChild(this.logo);
        this.logo = null;
    }
});

async function connectWallet() {
    try {
        // Use solana-web3.js to connect to the wallet
        const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
        const wallet = await solanaWeb3.connect();
        const balance = await getRockWifHatTokenBalance(wallet, connection);

        // Based on balance, set the game character
        setGameCharacter(balance);
    } catch (err) {
        console.error("Wallet connection failed:", err);
    }
}

async function getRockWifHatTokenBalance(wallet, connection) {
    // read RockWifHat balance from wallet
    const tokenBalance = await connection.getTokenAccountBalance(wallet.publicKey, '7T2ea9r19X8aZokV15ii5fstumyhyBuLAnrNFhMkxPj4');
    return tokenBalance.value.uiAmount;
}


function setGameCharacter(balance) {
        // set character based on tkn bal
        const DIAMOND_THRESHOLD = 10000000;
        const GOLD_THRESHOLD = 1000000;
        const STONE_THRESHOLD = 0;

    if (balance >= DIAMOND_THRESHOLD) {
        // diamond
        game.data.characterImage = 'diamondFlappyRock';
    } else if (balance >= GOLD_THRESHOLD) {
        // gold
        game.data.characterImage = 'goldFlappyRock';
    } else {
        // stone grey
        game.data.characterImage = 'stoneGreyFlappyRock';
    }
    // update in-game sprite
    updateCharacterSprite(game.data.characterImage);
}

function updateCharacterSprite(imageName) {
    // Map imageName to actual image file
    let imageMap = {
        'stoneGreyFlappyRock': 'clumsy1.png',
        'goldFlappyRock': 'clumsy2.png',
        'diamondFlappyRock': 'clumsy3.png'
    };

    let actualImage = imageMap[imageName] || 'clumsy1.png'; // Default to stone if not found

    // Remove the current bird entity from the game world
    me.game.world.removeChild(game.PlayScreen.bird);

    // Create a new bird entity with the updated sprite
    game.PlayScreen.bird = me.pool.pull("clumsy", 60, me.game.viewport.height / 2 - 100);
    game.PlayScreen.bird.image = me.loader.getImage(actualImage);

    // Add the new bird entity to the game world
    me.game.world.addChild(game.PlayScreen.bird, 10);
}

