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
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-bower-install');
  
  // Default task(s).
  grunt.registerTask('default', ['bowerInstall', 'concurrent:run_app']);
};