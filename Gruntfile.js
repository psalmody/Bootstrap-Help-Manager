module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false
            },
            build: {
                src: 'js/bhm.console.js',
                dest: 'js/bhm.console.min.js'
            },
            build: {
                src: 'js/bhm.helpers.js',
                dest: 'js/bhm.helpers.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default',['uglify']);

};
