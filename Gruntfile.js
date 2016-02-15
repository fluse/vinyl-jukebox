module.exports = function (grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                files: {
                    'public/dist/app.css': 'src/sass/app.scss'
                }
            }
        },
        cssmin: {
            options: {
                sourceMap: false
            },
            appCss: {
                src: 'public/dist/app.css',
                dest: 'public/dist/app.min.css'
            }
        },
        notify: {
            js: {
              options: {
                message: 'JS files compiled', //required
              }
          },
          css: {
            options: {
              message: 'CSS files compiled', //required
            }
          }
        },
        watch: {
            css: {
                files: ['src/sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer', 'cssmin', 'notify:css'],
                options: {
                    livereload: 35551,
                    spawn: false
                }
            },
            font: {
                files: ['src/font/'],
                tasks: ['webfont', 'copy:font', 'sass'],
                options: {
                    livereload: 35551,
                    spawn: false
                }
            },
            js: {
                files: ['src/js/**/*'],
                tasks: ['shell:compileJS'],
                options: {
                    livereload: 35551,
                    spawn: false
                }
            }
        },
        shell: {
            compileJS: {
                command: 'cd scripts/ && sh browserify.sh && sh uglify.sh'
            }
        },
        webfont: {
            font: {
                src: 'src/icons/*.svg',
                dest: 'public/font',
                options: {
                    engine: 'node',
                    hashes: false,
                    ie7: false,
                    font: 'icons',
                    relativeFontPath: '../font/',
                    templateOptions: {
                        classPrefix: 'icn-',
                        mixinPrefix: 'icn-',
                        template: 'src/icons/template.css'
                    }
                }
            }
        },
        copy: {
            font: {
                expand: true,
                flatten: true,
                src: ['public/font/icons.css'],
                dest: 'src/sass/components/',
                filter: 'isFile',
                ext: '.scss'
            }
        },
        clean: {
            dist: [
                'public/dist/app.min.js.map',
                'public/font/icons.css'
            ]
        },
        usebanner: {
            copyright: {
                options: {
                    position: 'top',
                    banner: '/* <%= pkg.name %> <%= pkg.version %> - <%= pkg.website %> */',
                    linebreak: true
                },
                files: {
                    src: ['public/dist/app.min.css', 'public/dist/app.min.js']
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9']
            },
            css: {
                src: 'public/dist/app.css',
                dest: 'public/dist/app.css'
            }
        }
    });

    // Default task(s).
    grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);

    grunt.registerTask('font', [
        'webfont',
        'copy:font',
        'sass',
        'cssmin',
        'clean:dist'
    ]);

    grunt.registerTask('deploy', [
        'webfont', // create icon font
        'copy:font', // copy css template to sass
        'sass', // concat converted files and normal files
        'autoprefixer',
        'cssmin', // minify js & css
        'usebanner:copyright' // insert banner
    ]);

};
