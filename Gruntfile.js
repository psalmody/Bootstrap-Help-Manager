module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**\n*  Bootstrap-Help-Manager v <%= pkg.version %>\n*  <%= pkg.homepage %>\n*/\n',
                mangle: false
            },
            build: {
                files: [{
                    src: 'build/bhm.console.js',
                    dest: 'build/bhm.console.min.js'
                }, {
                    src: 'build/bhm.client.js',
                    dest: 'build/bhm.client.min.js'
                }]
            }
        },
        concat: {
            options: {
                separator: ';',
                banner: '/**\n*  Bootstrap-Help-Manager v <%= pkg.version %>\n*  <%= pkg.homepage %>\n*/\n',
            },
            bhmconsole: {
                src: ['src/JSONTable.js', 'src/tmpl.js', 'src/bhm.vertebrate.js', 'src/bhm.console.js'],
                dest: 'build/bhm.console.js'
            },
            bhmclient: {
                src: ['src/bhm.vertebrate.js','src/tmpl.js','src/bhm.client.render.js','src/bhm.BHMclient.js'],
                dest: 'build/bhm.client.js'
            }
        },
        watch: {
            files: 'src/*',
            tasks: ['concat','uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat','uglify']);

};
