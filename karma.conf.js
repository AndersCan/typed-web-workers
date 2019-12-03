// Karma configuration
// Generated on Fri Apr 28 2017 20:17:45 GMT+0200 (Romance Daylight Time)

module.exports = function(config) {
  config.set({
    frameworks: [
      'jasmine',
      'karma-typescript'
    ],
    files: [
      'src/**/*.ts' // *.tsx for React Jsx
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        module: 'commonjs',
        target: 'es6'
      },
      exclude: ['node_modules']
    },

    reporters: [
      'spec',
      'karma-typescript',
      'coverage'
    ],

    // coverageReporter: {
    //   type: 'lcov',
    //   dir: 'coverage/',
    //   subdir: '.'
    // }
    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    browsers: ['Chrome', 'Firefox'],
    // // Continuous Integration mode
    // // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
