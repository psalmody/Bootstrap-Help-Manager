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
                src: ['external/JSONTable.js', 'external/tmpl.js', 'src/bhm.vertebrate.js', 'src/bhm.console.js'],
                dest: 'build/bhm.console.js'
            },
            bhmclient: {
                src: ['external/tmpl.js','src/bhm.vertebrate.js','src/bhm.client.js'],
                dest: 'build/bhm.client.js'
            },
            clienttemplate: {
                src: ['src/templates/bhm.client.html'],
                dest: 'build/templates/bhm.client.html'
            },
            consoletemplate: {
                src: ['src/templates/bhm.console.html'],
                dest: 'build/templates/bhm.console.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat','uglify']);

};
