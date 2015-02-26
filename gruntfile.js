module.exports = function(grunt) {
  grunt.initConfig({

	watch: {
      sass: {
        files: 'sass/main.scss',
        tasks: ['sass']
      }
	},

	  sass: {                              // Task
	    dist: {                            // Target
	      options: {                       // Target options
	        style: 'expanded'
	      },
	      files: {                         // Dictionary of files
	        'css/main.css': 'sass/main.scss'     // 'destination': 'source'
	        //'widgets.css': 'widgets.scss'
	      }
	    }
	  }


  });


	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['watch']);

}