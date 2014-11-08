/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function() {
  return gulp.src('app/**/*.{png,jpeg,jpg,gif,svg}')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeViewBox: false}, {removeEmptyAttrs: false},
        {removeEmptyContainers: false}, {mergePaths: false},
        {collapseGroups: false}, {moveGroupAttrsToElems: false},
        {moveElemsAttrsToGroup: false}, {convertPathData: false},
      {removeUselessStrokeAndFill: false}]
    }))
    .pipe(gulp.dest('dist'));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function() {
  return gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('copy:wsk', function() {
  return gulp.src([
    'wsk/dist/**/*'
  ], {
    dot: false
  }).pipe(gulp.dest('dist/wsk/dist/'));
});

// This is a bit of a hack
gulp.task('copy:wsk-js', function() {
  return gulp.src([
    'wsk/app/styleguide/**/*.js'
  ], {
    dot: false
  }).pipe(gulp.dest('dist/wsk/dist/styleguide/'));
});

gulp.task('copy:videos', function() {
  return gulp.src([
    'app/videos/*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist/videos/'));
});

gulp.task('copy:dependencies', function() {
  return gulp.src([
    'node_modules/shower-core/shower.min.js',
    'node_modules/shower-core/shower.js'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
  .pipe(gulp.dest('.tmp'));
});

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function() {
  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/styles/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.changed('styles', {extension: '.scss'}))
    .pipe($.sass({
      precision: 10
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('dist/styles'));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    // Minify Any HTML
    .pipe($.if('*.html', $.minifyHtml()))
    // Output Files
    .pipe(gulp.dest('dist'));
});

gulp.task('javascript', function() {
  return gulp.src('app/**/*.js')
    // Concatenate And Minify JavaScript
    .pipe($.uglify({preserveComments: 'some'}))
    // Output Files
    .pipe(gulp.dest('dist'));
});

// Clean Output Directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

// Build Production Files, the Default Task
gulp.task('build', ['clean'], function(cb) {
  runSequence('styles', 'copy:wsk', 'copy:wsk-js', 'copy:videos', ['jshint', 'html', 'javascript', 'images', 'copy'], cb);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist'
  });
});

// Watch Files For Changes & Reload
gulp.task('serve', ['build'], function() {
  runSequence(['styles', 'copy:dependencies'], function() {
    browserSync({
      notify: false,
      // Customize the BrowserSync console logging prefix
      logPrefix: 'WSK',
      // Run as an https by uncommenting 'https: true'
      // Note: this uses an unsigned certificate which on first access
      //       will present a certificate warning in the browser.
      // https: true,
      server: ['dist']
    });

    gulp.watch(['app/**/*.html'], ['html', 'copy', reload]);
    gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', 'copy', reload]);
    gulp.watch(['app/scripts/**/*.js'], ['jshint', 'javascript', reload]);
    gulp.watch(['app/images/**/*'], ['images', 'copy', reload]);
    gulp.watch([
      'node_modules/shower-core/shower.min.js'
    ], ['copy:dependencies', reload]);
  });
});

gulp.task('default', ['serve']);
