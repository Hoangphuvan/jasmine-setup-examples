'use strict';

module.exports = function(grunt) {
	var $srcFiles = 'src/main/javascript/**/*.js';
	var $testFiles = 'src/test/javascript/*Test.js';
	var $outputDir = 'target'
	var $junitResults = $outputDir + '/junit-test-results.xml';
	var $jasmineSpecRunner = $outputDir + '/_SpecRunner.html';
	var $coverageOutputDir = $outputDir + '/coverage';
	var $coverageResults = $coverageOutputDir + '/' + phantomJSOutputDirName() + '/lcov.info';
	var $sonarSources =	makeSonarSourceDirs($srcFiles);
	
	/*
	 * Create name for phantomjs output directory, which must match the directory
	 * name that contains the coverage's lcov file.
	 *
	 * For example on Mac OS X, the output is something like:
	 *    PhantomJS 1.9.7 (Mac OS X)
	 */
	function phantomJSOutputDirName() {
		var $phantomjs = require('phantomjs');
		var $os = require('os');
		var $osName = ($os.type() == 'Darwin'? 'Mac OS X' : $os.type());
		
		return 'PhantomJS ' + $phantomjs.version + ' (' + $osName + ')';
	}
	
	/*
	 * Create sonar source object for each directory of source file pattern.
	 */
	function makeSonarSourceDirs($filesPattern) {
		var $path = require('path');
		var $dirs = [];
		
		grunt.file.expand(
			{
				filter: function($filePath) {
					$dirs.push({
						path: $path.dirname($filePath),
						prefix: '.',	// path prefix in lcov.info
						coverageReport: $coverageResults,
						testReport: $junitResults
					});
				}
			},
			$filesPattern
		);
		
		return $dirs;
	}
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// Jasmine test
		jasmine: {
			pivotal: {
				src: $srcFiles,
				options: {
					specs: $testFiles,
					outfile: $jasmineSpecRunner,
					keepRunner: 'true'	// keep SpecRunner/outfile file
				}
			}
		},
		
		// coverage using Karma
		karma: {
			continuous: {
				singleRun: 'true',
				browsers: [ 'PhantomJS' ]
			},
			
			options: {
				plugins: [
					'karma-jasmine',
					'karma-phantomjs-launcher',
					'karma-junit-reporter',
					'karma-coverage'
				],
				frameworks: [ 'jasmine' ],
				files: [ $srcFiles, $testFiles ],
				reporters: [ 'junit', 'coverage' ],
			    junitReporter: {
			      outputFile: $junitResults
			    },
				preprocessors: {
					// source files must be a literal string
					'src/main/javascript/**/*.js': [ 'coverage' ]
				},
				coverageReporter: {
					type: 'lcov',
					dir: $coverageOutputDir
				}
			}
		},
		
		// export Karma coverage to SonarQube
		karma_sonar: {
			your_target: {
				// properties for SonarQube dashboard
				project: {
					key: 'net.ahexample:ahexample-jasmine-karma-sonar',
					name: 'Jasmine with Karma and SonarQube Example',
					version: '0.0.1'
				},
				sources: $sonarSources
			}
		},
		
		clean: [ $outputDir ]
	});
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-karma-sonar');

	grunt.registerTask('test', [ 'jasmine', 'karma:continuous' ]);
	grunt.registerTask('sonar', [ 'karma_sonar' ]);
	grunt.registerTask('default', 'test');
}