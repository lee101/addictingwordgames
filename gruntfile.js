grunt.initConfig({
    nunjucks: {
        precompile: {
            baseDir: 'templates/',
            src: 'templates/*',
            dest: 'static/js/templates.js',
            options: {
                env: require('./nunjucks-environment'),
                name: function (filename) {
                    return 'foo/' + filename;
                }
            }
        }
    }
});

grunt.loadNpmTasks('grunt-nunjucks');

grunt.registerTask('compile', ['nunjucks']);
