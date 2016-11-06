/*global module,require,process*/
/*jshint camelcase:false*/
var LIVERELOAD_PORT, lrSnippet, mountFolder;

LIVERELOAD_PORT = 35728;

lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});


/* var conf = require('./conf.'+process.env.NODE_ENV); */

mountFolder = function (connect, dir)
{
    'use strict';

    return connect['static'](require('path').resolve(dir));
};

var modRewrite = require('connect-modrewrite');

module.exports = function (grunt)
{
    'use strict';

    var yeomanConfig;

    // required for Heroku
    require('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-connect-proxy');

    // required for integration tests
    grunt.loadNpmTasks('grunt-protractor-webdriver');

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    grunt.loadNpmTasks('grunt-string-replace');

    /* configurable paths */
    yeomanConfig = {
        app: 'app',
        dist: 'dist',
        docs: 'documentation'
    };
    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (_error) {
    }
    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            gruntfile: {
                files: ['Gruntfile.js']
            },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: [],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            less: {
                files: ['<%= yeoman.app %>/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: ['<%= yeoman.app %>/index.html',
                        '<%= yeoman.app %>/*.js',
                        '<%= yeoman.app %>/modules/**/*',
                        '<%= yeoman.app %>/vendor/**/*',
                        '<%= yeoman.app %>/styles/**/*',
                        '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.docs %>/jade/*.jade']
            }
        },
        connect: {
            options: {
                port: process.env.PORT || 9000,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect)
                    {
                        return [lrSnippet,
                            // in case of using html5Mode - makes accessible uris without hashbang but containing view's path
                                modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.ttf|\\.woff|(\\api.+)$ /index.html [L]']),
                                mountFolder(connect, '.tmp'),
                                mountFolder(connect, yeomanConfig.app),
                                connect().use('/bower_components', connect.static('./bower_components')),
                                require('grunt-connect-proxy/lib/utils').proxyRequest];
                    }
                }
            },
            proxies: [{
                context: '/api',
                host: process.env.host || grunt.option('backend-host') || 'backend.realskill.io',
                port: process.env.port || grunt.option('backend-port') || '',
                changeOrigin: true,
                xforward: false,
                headers: {
                    host: 'backend.realskill.io'
                }
            }],
            docs: {
                options: {
                    middleware: function (connect)
                    {
                        return [lrSnippet, mountFolder(connect, yeomanConfig.docs)];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect)
                    {
                        return [mountFolder(connect, '.tmp'),
                                mountFolder(connect, yeomanConfig.app),
                                connect().use('/bower_components', connect.static('./bower_components')),
                                require('grunt-connect-proxy/lib/utils').proxyRequest];
                    },
                    base: ['app'],
                    port: 9001
                }
            },
            dist: {
                options: {
                    middleware: function (connect)
                    {
                        return [lrSnippet,
                                modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.ttf|\\.woff|(\\api.+)$ /index.html [L]']),
                                mountFolder(connect, '.tmp'),
                                mountFolder(connect, yeomanConfig.dist),
                                connect().use('/bower_components', connect.static('./bower_components')),
                                require('grunt-connect-proxy/lib/utils').proxyRequest];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git{,*/}*'
                    ]
                }]
            },
            all: ['readme.md',
                  '.tmp',
                  '.DS_Store',
                  '.sass-cache',
                  'app/bower_components',
                  'documentation/jade',
                  'documentation/config.codekit',
                  'landing/jade',
                  'landing/config.codekit',
                  'node_modules',
                  '.git'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', '<%= yeoman.app %>/modules/**/*.js']
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
        },
        jade: {
            docs: {
                options: {
                    pretty: true
                },
                files: {
                    '<%= yeoman.docs %>/index.html': ['<%= yeoman.docs %>/jade/index.jade']
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'/*, 'uglifyjs'*/],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/index.html', '!<%= yeoman.dist %>/bower_components/**'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['*.html', 'modules/**/*.html', 'vendor/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'favicon.ico',
                            'bower_components/bootstrap/fonts/*',
                            'bower_components/zeroclipboard/dist/ZeroClipboard.swf',
                            'bower_components/jquery/jquery.min.js',
                            'bower_components/videogular-themes-default/videogular.css',
                            'fonts/**/*',
                            'i18n/**/*',
                            'images/**/*',
                            'styles/fonts/**/*',
                            'styles/*.css',
                            'styles/img/**/*',
                            'styles/ui/images/*',
                            '*.html'
                        ]
                    }, {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: ['styles/**', 'assets/**']
                    }, {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/bower_components/font-awesome/fonts',
                        dest: '<%= yeoman.dist %>/fonts',
                        src: ['*']
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/bower_components/slick-carousel/slick',
                        dest: '<%= yeoman.dist %>/styles',
                        src: ['**/*']
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/bower_components/select2',
                        dest: '<%= yeoman.dist %>/styles',
                        src: ['*.png', '*.gif']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '<%= yeoman.dist %>/styles/',
                src: '**/*.css'
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },
        protractor_webdriver: {
            driver: {
                options: {
                    path: 'node_modules/.bin/',
                    command: 'webdriver-manager start'
                }
            }
        },
        protractor: {
            options: {
                configFile: 'test/config.js',
                keepAlive: false,
                noColor: false
            },
            chrome: {
                options: {
                    args: {
                        browser: 'chrome'
                    }
                }
            },
            firefox: {
                options: {
                    args: {
                        browser: 'firefox'
                    }
                }
            },
            phantomjs: {
                options: {
                    args: {
                        browser: 'phantomjs'
                    }
                }
            },
            production: {
                options: {
                    configFile: 'test/production.config.js',
                    keepAlive: false,
                    noColor: false,
                    args: {
                        browser: 'chrome'
                    }
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= yeoman.dist %>/styles',
                    ext: '.css'
                }]
            },
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css'
                    ]
                }
            }
        },
        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                files: {
                    '.tmp/concat/scripts/app.js': ['<%= yeoman.app %>/*.js',
                                                   '<%= yeoman.app %>/*.js',
                                                   '<%= yeoman.app %>/modules/**/*.js',
                                                   '<%= yeoman.app %>/vendor/**/*.js',
                                                   '.tmp/concat/templates.js'],
                    '.tmp/concat/scripts/vendor.js': ['<%= yeoman.app %>/bower_components/**/*.js'
                    ]
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/scripts/vendor.js': [
                        '<%= yeoman.dist %>/scripts/vendor.js'
                    ]
                }
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            }
        },
        concurrent: {
            server: ['copy:styles'],
            dist: [
                'copy:styles'
            ],
            test: ['copy:styles']
        },
        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= yeoman.dist %>/styles/'
                }]
            }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html'],
                options: {
                    base: '//cdn.example.com/stuff/'
                }
            }
        },
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: ['*.js', '!oldieshim.js'],
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        cachebreaker: {
            dev: {
                options: {
                    match: ['app.js', 'vendor.js', 'templates.js', 'realskill.css', 'vendor.css'],
                    replacement: function ()
                    {
                        return new Date().getTime();
                    }

                },
                files: {
                    src: ['dist/index.html']
                }
            }
        },
        ngtemplates: {
            realSkill: {
                cwd: '<%= yeoman.app %>',
                src: ['**/*.html', '!index.html', '!bower_components/**/*'],
                dest: '<%= yeoman.dist %>/scripts/templates.js'
            }
        },
        'string-replace': {
            dist: {
                files: {
                    '<%= yeoman.dist %>/index.html': '<%= yeoman.dist %>/index.html'
                },
                options: {
                    replacements: [{
                        pattern: '<!--production-->',
                        replacement: '<itc-google-tag-manager gtm-id="GTM-MH4S4H"></itc-google-tag-manager>\n <script src="scripts/templates.js"></script>'
                    }, {
                        pattern: '<!--general-app-loader-->',
                        replacement: '<%= grunt.file.read(yeoman.app + \'/modules/common/generalAppLoader.html\') %>'
                    }]
                }
            }
        }
    });

    grunt.registerTask('server', function (target)
    {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        if (target === 'dist') {
            return grunt.task.run(['serve:dist']);
        }
        return grunt.task.run(['serve']);
    });
    grunt.registerTask('serve', function (target)
    {
        if (target === 'dist') {
            return grunt.task.run(['build', 'wiredep', 'configureProxies:server', 'connect:dist:keepalive']);
        }
        return grunt.task.run(['less', 'clean:server', 'configureProxies:server', 'connect:livereload', 'watch']);
    });


    // Heroku
    grunt.registerTask('heroku', 'Compile then start a connect web server', function (target)
    {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive', 'configureProxies:server']);
        }
        grunt.task.run(['clean:server', 'wiredep', 'concurrent:server', 'configureProxies:server', 'autoprefixer']);
    });


    grunt.registerTask('docs', function ()
    {
        return grunt.task.run(['jade:docs', 'connect:docs', 'open', 'watch']);
    });

    grunt.registerTask('build', [
        'less',
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'ngtemplates',
        'concat',
        //'ngAnnotate',
        'copy:dist',
        'cdnify',
        'cssmin',
        'uglify',
        'usemin',
        'string-replace',
        'cachebreaker:dev'
        //'htmlmin'
    ]);
    return grunt.registerTask('default', ['serve']);
};
