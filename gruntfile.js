module.exports = function (grunt) {
    grunt.initConfig({
        nunjucks: {
            precompile: {
                baseDir: 'templates/shared/',
                src: 'templates/shared/*',
                dest: 'static/js/templates.js',
                options: {
//                    env: require('./nunjucks-environment'),
                    name: function (filename) {
                        return 'macros';
                    }
                }
            }
        },
        watch: {
            nunjucks: {
                files: 'templates/shared/*',
                tasks: ['nunjucks']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nunjucks');

    grunt.registerTask('compile', ['nunjucks', 'watch']);
};
