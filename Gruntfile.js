module.exports = function(grunt) {
	'use strict';
	
	grunt.initConfig({
		BUILD_PATH: 'build/',
		AT_PATH: 'tmp/asset_templates/',
		DROPIN_PATH: 'tmp/dropin/',
		ASSET_CSS_PATH: '<%= AT_PATH %>style/style.css',
		DEBUG_JS_LOCAL_PATH: 'script/ecset.js',
		DEBUG_WORKER_JS_LOCAL_PATH: 'script/worker.js',
		DEBUG_JS_PATH: '<%= AT_PATH %><%= DEBUG_JS_LOCAL_PATH %>',
		DEBUG_WORKER_JS_PATH: '<%= AT_PATH %><%= DEBUG_WORKER_JS_LOCAL_PATH %>',
		MAP_LOCAL_PATH: 'script/ecset.map',
		MAP_PATH: '<%= AT_PATH %><%= MAP_LOCAL_PATH %>',
		ASSET_JS_PATH: '<%= AT_PATH %>script/ecset.min.js',
		ASSET_WORKER_JS_PATH: '<%= AT_PATH %>script/worker.min.js',
		
		clean: {
			compile: ['build', 'tmp'],
			compile2: ['<%= DEBUG_JS_PATH %>', '<%= DEBUG_WORKER_JS_PATH %>', '<%= MAP_PATH %>']
		},
		copy: {
			compile: {
				files: [{
					dot: true,
					expand: true,
					cwd: '<%= AT_PATH %>',
					src: ['<%= DEBUG_JS_LOCAL_PATH %>', '<%= DEBUG_WORKER_JS_LOCAL_PATH %>', '<%= MAP_LOCAL_PATH %>'],
					dest: '<%= DROPIN_PATH %>'
				}]
			},
			compile2: {
				files:[{
					expand: true,
					cwd: 'src/dropin',
					dot: true,
					src: ['**'],
					dest: '<%= BUILD_PATH %>'
				}, {
					expand: true,
					cwd: 'tmp/dropin',
					dot: true,
					src: ['**'],
					dest: '<%= BUILD_PATH %>'
				}]
			},
			debug: {
				files: {
					'<%= ASSET_JS_PATH %>': '<%= DEBUG_JS_PATH %>',
					'<%= ASSET_WORKER_JS_PATH %>': '<%= DEBUG_WORKER_JS_PATH %>'
				}
			},
			emcc: {
				options: {
					process: function(content, path) {
						return content.replace(/(renderer\.min\.js\.mem)/g, '{{$1}}');
					}
				},
				files: {
					'tmp/asset_templates/script/renderer.min.js': 'tmp/renderer.min.js',
					'tmp/asset_templates/script/renderer.min.js.mem': 'tmp/renderer.min.js.mem'
				}
			}
		},
		kapocs: {
			compile: {
				assets: [{
					expand: true,
					cwd: 'src/assets',
					dot: true,
					src: ['**'],
					dest: '<%= BUILD_PATH %>'
				}],
				assetTemplates: [{
					expand: true,
					cwd: 'src/asset_templates',
					dot: true,
					src: ['**'],
					dest: '<%= BUILD_PATH %>'
				}, {
					expand: true,
					cwd: 'tmp/asset_templates',
					dot: true,
					src: ['**'],
					dest: '<%= BUILD_PATH %>'
				}],
				templates: [{
					expand: true,
					cwd: 'src/templates',
					dot: true,
					src: ['**'],
					dest: '<%= BUILD_PATH %>'
				}]
			}
		},
		less: {
			compile: {
				files: {
					'<%= ASSET_CSS_PATH %>': 'src/style.less'
				}
			}
		},
		sas: {
			update: {}
		},
		shell: {
			emcc: {
				command: 'emcc -O2 src/emcc/renderer.cpp -o tmp/renderer.min.js -s EXPORTED_FUNCTIONS="[\'_path_render\']"'
			},
			update: {
				command: ['bower update', 'bower prune', 'bower install'].join('&&')
			}
		},
		typescript: {
			compile: {
				files: {
					'<%= DEBUG_JS_PATH %>': 'src/ecset/Main.ts',
					'<%= DEBUG_WORKER_JS_PATH %>': 'src/ecset/WorkerMain.ts'
				}
			}
		},
		uglify: {
			compile: {
				options: {
					sourceMap: true,
					sourceMapName: '<%= MAP_PATH %>'
				},
				files: {
					'<%= ASSET_JS_PATH %>': ['<%= DEBUG_JS_PATH %>'],
					'<%= ASSET_WORKER_JS_PATH %>': ['<%= DEBUG_WORKER_JS_PATH %>']
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-kapocs');
	grunt.loadNpmTasks('grunt-sas');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-typescript');
	
	grunt.registerTask('compile', ['clean:compile', 'typescript:compile', 'shell:emcc', 'copy:emcc', 'uglify:compile', 'copy:compile', 'clean:compile2', 'less:compile', 'copy:compile2', 'kapocs:compile']);
	grunt.registerTask('debug', ['clean:compile', 'typescript:compile', 'copy:debug', 'copy:compile', 'clean:compile2', 'less:compile', 'copy:compile2', 'kapocs:compile']);
	grunt.registerTask('update', ['shell:update', 'sas:update']);
	grunt.registerTask('default', ['compile']);
};