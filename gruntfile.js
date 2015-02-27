module.exports = function(grunt) {
  grunt.initConfig({

	watch: {
      sass: {
        files: 'sass/*.scss',
        tasks: ['sass']
      }
	},

	sass: {
	    dist: {
	    	options: {
	        	style: 'expanded'
	    	},
	    	files: {
	        	'css/main.css': 'sass/main.scss'
	      }
	    }
	}/*,

	assemble: {
	  options: {
	    //assets: 'assets',
	    //plugins: ['permalinks'],
	    partials: ['assemble/partials/*.hbs'],
	    layout: ['assemble/layouts/*.hbs'],
	    data: ['assemble/data/*.json']
	  },
	  site: {
	    src: ['docs/*.hbs'],
	    dest: './'
	  }
	}*/


  });


	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('assemble');

	grunt.registerTask('default', ['watch']);

}