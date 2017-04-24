module.exports = function (grunt) {
	'use strict'

	grunt.initConfig({
		clean: {
			compile: [
				'build',
				'tmp',
				'kapocs/tmp'
			],
		},
		copy: {
			compile: {
				files: [
					{
						expand: true,
						cwd: 'kapocs/dropin',
						dot: true,
						src: ['**'],
						dest: 'build'
					}
				]
			},
			wpw: {
				options: {
					process: function(content, srcpath) {
						return content.replace(/\{\{([^\{\}]+)\}\}/g, '$1')
					}
				},
				files: [
					{
						expand: true,
						cwd: 'kapocs/assets',
						dot: true,
						src: ['**'],
						dest: 'build'
					},
					{
						expand: true,
						cwd: 'kapocs/asset-templates',
						dot: true,
						src: ['**'],
						dest: 'build'
					},
					{
						expand: true,
						cwd: 'kapocs/tmp/asset-templates',
						dot: true,
						src: ['**'],
						dest: 'build'
					},
					{
						expand: true,
						cwd: 'kapocs/templates',
						dot: true,
						src: ['**'],
						dest: 'build'
					},
				]
			}
		},
		kapocs: {
			compile: {
				assets: [
					{
						expand: true,
						cwd: 'kapocs/assets',
						dot: true,
						src: ['**'],
						dest: 'build'
					}
				],
				assetTemplates: [
					{
						expand: true,
						cwd: 'kapocs/asset-templates',
						dot: true,
						src: ['**'],
						dest: 'build'
					},
					{
						expand: true,
						cwd: 'kapocs/tmp/asset-templates',
						dot: true,
						src: ['**'],
						dest: 'build'
					}
				],
				templates: [
					{
						expand: true,
						cwd: 'kapocs/templates',
						dot: true,
						src: ['**'],
						dest: 'build'
					}
				]
			}
		},
		shell: {
			compileCss: {
				command: 'cd js2css && node .'
			},
			webpack: {
				command: [
					'webpack --config webpack.index.config.js',// --display-chunks --display-reasons',
					'webpack --config webpack.worker.config.js',// --display-chunks --display-reasons',
				].join('&&')
			},
			wpw: {
				command: [
					'"node_modules/.bin/concurrently" --kill-others --names index,worker --prefix name',
					'"webpack --progress --colors --watch --config webpack.index.wpw.config.js"',// --display-chunks --display-reasons',
					'"webpack --progress --colors --watch --config webpack.worker.wpw.config.js"',// --display-chunks --display-reasons',
				].join(' ')
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-clean')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-kapocs')
	grunt.loadNpmTasks('grunt-shell')

	grunt.registerTask('compile', [
		'clean:compile',
		'shell:webpack',
		'shell:compileCss',
		'copy:compile',
		'kapocs:compile'
	])
	grunt.registerTask('wpw', [
		'clean:compile',
		'shell:compileCss',
		'copy:compile',
		'copy:wpw',
		'shell:wpw',
	])
	grunt.registerTask('compileCss', [
		'shell:compileCss',
		'copy:wpw',
	])
	grunt.registerTask('default', [
		'compile'
	])
}
