/*global module,require,process*/
/*jshint camelcase:false*/
var LIVERELOAD_PORT, lrSnippet, mountFolder;

LIVERELOAD_PORT = 35728;

lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});


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
                host: process.env.host || grunt.option('backend-host') || 'https://ngtests.herokuapp.com',
                port: process.env.port || grunt.option('backend-port') || '',
                changeOrigin: true,
                xforward: false,
                headers: {
                    host: 'https://ngtests.herokuapp.com'
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

    grunt.registerTask('docs', function ()
    {
        return grunt.task.run(['jade:docs', 'connect:docs', 'open', 'watch']);
    });

    grunt.registerTask('build', [
        'less'
    ]);
    return grunt.registerTask('default', ['serve']);
};


