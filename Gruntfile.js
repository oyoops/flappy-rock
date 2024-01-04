/*global module:false*/
module.exports = function(grunt) {
    var sourceFiles = [
        'js/game.js',
        'js/entities/entities.js',
        'js/entities/HUD.js',
        'js/screens/title.js',
        'js/screens/play.js',
        'js/screens/gameover.js',
    ];

    // Project configuration.
    grunt.initConfig({
        terser: {
            options: {
                compress: true,
                mangle: true,
                output: {
                    comments: false, // Use "/^!/" to preserve comments starting with "!"
                }
            },
            dist: {
                files: {
                    'build/clumsy-min.js': sourceFiles
                }
            }
        },

        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },

            beforeConcat: {
                files: {
                    src: sourceFiles
                }
            },

            afterConcat: {
                files: {
                    src: [ sourceFiles ]
                }
            }
        },

        connect : {
            root : {
                options : {
                    port : process.env.PORT || 8001,
                    keepalive : true,
                    host: '*'
                }
            }
        },

        clean: {
            dist: [
                'build/clumsy-min.js'
            ],
        },

    });

    grunt.loadNpmTasks('grunt-terser');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-connect");


    // Default task.
    grunt.registerTask('default', ['terser']);
    grunt.registerTask('lint', ['jshint:beforeConcat', 'concat', 'jshint:afterConcat']);
};
