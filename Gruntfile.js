module.exports = function (grunt)
{
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-protractor-webdriver');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    var config = {
        app: 'app'
    };

    grunt.initConfig({
                config: config,
                watch: {
                    livereload: {
                        options: {
                            livereload: '<%= connect.options.livereload %>'
                        },
                        files: ['<%= config.app %>/**/*.html', '<%= config.app %>/**/*.js']
                    }, less: {
                        files: ['<%= yeoman.app %>/**/*.less'],
                        tasks: ['less'],
                        options: {
                            spawn: false
                        }
                    }
                },

                connect: {
                    options: {
                        port: 9000,
                        livereload: 35729,
                        hostname: '127.0.0.1'
                    },
                    test: {
                        options: {
                            base: ['app'],
                            port: 9001
                        }
                    },
                    livereload: {
                        options: {
                            open: true,
                            middleware: function (connect)
                            {
                                return [connect().use('/bower_components', connect.static('./bower_components')), connect.static(config.app)

                                ];
                            }
                        }
                    }
                },
                protractor_webdriver: {
                    driver: {
                        options: {
                            path: 'node_modules/.bin/',
                            command: 'webdriver-manager start',
                            keepAlive: true
                        }
                    }
                },
                jshint: {
                    default: {
                        options: {
                            jshintrc: true
                        },
                        files: {
                            src: ['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*.js']
                        }
                    },
                    verify: {
                        options: {
                            jshintrc: true
                        },
                        files: {src: ['app/**/*.js', 'test/**/*.js', '!app/bower_components/**/*.js']},
                        reporter: 'checkstyle',
                        reporterOutput: 'target/jshint.xml'
                    }
                },
                less: {
                    compile: {
                        options: {
                            paths: ['app', 'app/bower_components/bootstrap/less'],
                            rootPath: 'app',
                            relativeUrls: true
                        },
                        files: {
                            'app/css/style.css': 'app/app.less'
                        }
                    }
                }
            }
    );

    grunt.registerTask('serve', ['connect:livereload', 'watch']);

    grunt.registerTask('default', ['serve']);
};
