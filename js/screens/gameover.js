game.GameOverScreen = me.ScreenObject.extend({
    init: function() {
        this.savedData = null;
        this.handler = null;
    },

    onResetEvent: function() {
        //save section
        this.savedData = {
            score: game.data.score,
            steps: game.data.steps
        };
        me.save.add(this.savedData);

        if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
        if (game.data.steps > me.save.topSteps) {
            me.save.topSteps = game.data.steps;
            game.data.newHiScore = true;
        }
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", false)
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.ENTER);

        this.handler = me.event.subscribe(me.event.KEYDOWN,
            function (action, keyCode, edge) {
                if (action === "enter") {
                    me.state.change(me.state.MENU);
                }
            });

        me.game.world.addChild(new me.Sprite(
            me.game.viewport.width / 2 - 170,
            me.game.viewport.height / 2 - 100,
            { image: 'gameover' }
        ), 12);
    

        var gameOverBG = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'gameoverbg'}
        );
        me.game.world.addChild(gameOverBG, 10);

        // Load and scale the background image
        this.bgImage = me.loader.getImage('bg');
        if (!this.bgImage) {
            console.error("Background image not found");
            return;
        }
        this.bgScale = me.game.viewport.height / this.bgImage.height;


        // Scale the background image to fit the viewport
        this.bgScale = me.game.viewport.height / this.bgImage.height;
        
        
        // ground
        this.ground1 = me.pool.pull('ground', 0, me.game.viewport.height - 96);
        this.ground2 = me.pool.pull('ground', me.game.viewport.width,
            me.video.renderer.getHeight() - 96);
        me.game.world.addChild(this.ground1, 11);
        me.game.world.addChild(this.ground2, 11);

        // add the dialog with the game information
        if (game.data.newHiScore) {
            var newRect = new me.Sprite(
                gameOverBG.width/2,
                gameOverBG.height/2,
                {image: 'new'}
            );
            me.game.world.addChild(newRect, 12);
        }

        this.dialog = new (me.Renderable.extend({
            // constructor
            init: function() {
                this._super(me.Renderable, 'init',
                    [0, 0, me.game.viewport.width/2, me.game.viewport.height/2]
                );
                this.font = new me.Font('gamefont', 40, 'black', 'left');
                this.steps = 'Score: ' + game.data.steps.toString();
                this.topSteps= 'High Score: ' + me.save.topSteps.toString();
            },

            draw: function(renderer) {
                // Draw the scaled background image
                if (this.bgImage) {
                    renderer.save();
                    renderer.scale(this.bgScale, this.bgScale);
                    renderer.drawImage(this.bgImage, 0, 0);
                    renderer.restore();
                }
        
                // Draw other elements
                this._super(me.ScreenObject, 'draw', [renderer]);        
                
                var stepsText = this.font.measureText(renderer, this.steps);
                var topStepsText = this.font.measureText(renderer, this.topSteps);
                var scoreText = this.font.measureText(renderer, this.score);

                //steps
                this.font.draw(
                    renderer,
                    this.steps,
                    me.game.viewport.width/2 - stepsText.width/2 - 60,
                    me.game.viewport.height/2
                );

                //top score
                this.font.draw(
                    renderer,
                    this.topSteps,
                    me.game.viewport.width/2 - stepsText.width/2 - 60,
                    me.game.viewport.height/2 + 50
                );
            }
        }));
        me.game.world.addChild(this.dialog, 12);
    },

    onDestroyEvent: function() {
        // unregister the event
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
        this.ground1 = null;
        this.ground2 = null;
        this.font = null;
        me.audio.stop("theme");
    }
});

