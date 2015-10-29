module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      start_socket_server: 'node socket.js',
      start_web_server: 'node web.js',
    },
    concurrent: {
      run_app: ['exec:start_socket_server', 'exec:start_web_server'],
      run_app_dev: ['exec:start_socket_server', 'exec:start_web_server', 'watch']
    },
    bowerInstall: {
      target: {
        src: [
          'index.html',
        ],
 
        // Optional: 
        // --------- 
        cwd: '',
        dependencies: true,
        devDependencies: true,
        exclude: [],
        fileTypes: {},
        ignorePath: '',
        overrides: {}
      }
    },
    watch: {
      // livereload: true,
      options: {
          livereload: true
        },
      scripts: {
        files: ['js/*.js'],
        // tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
      html: {
        files: ['index.html', 'css/*.css']
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', ['bowerInstall', 'concurrent:run_app']);

  grunt.registerTask('dev', ['bowerInstall', 'concurrent:run_app_dev']);
};