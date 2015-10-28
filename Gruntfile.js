module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      start_socket_server : 'node socket.js',
      start_web_server : 'node web.js',
    },
    concurrent: {
        run_app: ['exec:start_socket_server', 'exec:start_web_server'],
    }
  });
  
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-concurrent');
  
  // Default task(s).
  grunt.registerTask('default', ['concurrent:run_app']);
};